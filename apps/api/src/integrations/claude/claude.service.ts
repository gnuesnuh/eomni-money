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

// 말풍선 생성은 페르소나/수준에 맞춘 짧은 한국어 글쓰기 — 복잡한 추론 불필요.
// Sonnet 4.6은 Opus 4.7 대비 input 40%/output 40% 저렴, 동일 작업 품질 거의 동등.
// 기획서 비용 추정도 Sonnet 기준이었음.
// 환경변수로 오버라이드 가능 (실험/벤치마크용).
const DEFAULT_MODEL = "claude-sonnet-4-6";

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
    const model =
      this.config.get<string>("ANTHROPIC_MODEL") ?? DEFAULT_MODEL;

    // 시스템 프롬프트는 (speakerType, level) 조합당 동일 → 캐시 hit으로 비용 절감
    const stream = client.messages.stream({
      model,
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
