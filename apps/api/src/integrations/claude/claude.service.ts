import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Anthropic from "@anthropic-ai/sdk";
import type { LearningLevel, SpeakerType } from "@eomni/shared";
import {
  buildBubbleSystemPrompt,
  buildBubbleUserPrompt,
  type BubbleUserInput,
} from "./claude.prompts";

const MODEL = "claude-opus-4-7";

export interface BubbleRequest extends BubbleUserInput {
  speakerType: SpeakerType;
  level: LearningLevel;
}

export interface BubbleResponse {
  bubble: string;
  model: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    cacheReadInputTokens: number;
    cacheCreationInputTokens: number;
  };
}

@Injectable()
export class ClaudeService {
  private readonly logger = new Logger(ClaudeService.name);
  private client: Anthropic | null = null;

  constructor(private readonly config: ConfigService) {}

  private getClient(): Anthropic {
    if (this.client) return this.client;
    const apiKey = this.config.get<string>("ANTHROPIC_API_KEY");
    if (!apiKey) {
      throw new ServiceUnavailableException(
        "ANTHROPIC_API_KEY is not configured.",
      );
    }
    this.client = new Anthropic({ apiKey });
    return this.client;
  }

  async generateBubble(req: BubbleRequest): Promise<BubbleResponse> {
    const client = this.getClient();
    const system = buildBubbleSystemPrompt(req.speakerType, req.level);
    const user = buildBubbleUserPrompt(req);

    // 시스템 프롬프트는 (speakerType, level) 조합당 동일 → 캐시 hit으로 비용 절감
    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: system,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: user }],
      thinking: { type: "disabled" },
    });

    const message = await stream.finalMessage();

    const bubble = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    if (!bubble) {
      this.logger.error(
        `Empty bubble. stop_reason=${message.stop_reason} content=${JSON.stringify(message.content).slice(0, 300)}`,
      );
      throw new Error("Claude returned empty bubble");
    }

    return {
      bubble,
      model: message.model,
      usage: {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
        cacheReadInputTokens: message.usage.cache_read_input_tokens ?? 0,
        cacheCreationInputTokens: message.usage.cache_creation_input_tokens ?? 0,
      },
    };
  }
}
