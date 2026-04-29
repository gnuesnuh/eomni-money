import {
  HttpException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { SpeakerType } from "@eomni/shared";

const TTS_URL = "https://naveropenapi.apigw.ntruss.com/tts-premium/v1/tts";

// 화자별 Clova Voice 화자 매핑 (사용자 지정)
//   son             → 'vdaeun'  (남성, 젊은 톤)
//   daughter        → 'vara'    (여성, 밝은 톤)
//   daughter_in_law → 'nara'    (여성, 차분한 톤)
//   son_in_law      → 'vdaeun'  (남성, 정중)  *son 과 동일 화자 공유*
const VOICE_MAP: Record<SpeakerType, string> = {
  son: "vdaeun",
  daughter: "vara",
  daughter_in_law: "nara",
  son_in_law: "vdaeun",
};

export interface SynthesizeOptions {
  text: string;
  speakerType: SpeakerType;
  speed?: number; // -5 ~ 5, 음수=느리게. 시니어용 기본 -2
  volume?: number; // -5 ~ 5
  pitch?: number; // -5 ~ 5
}

export interface SynthesizeResult {
  audio: Buffer;
  voice: string;
  bytes: number;
}

@Injectable()
export class ClovaService {
  private readonly logger = new Logger(ClovaService.name);

  constructor(private readonly config: ConfigService) {}

  voiceFor(speakerType: SpeakerType): string {
    return VOICE_MAP[speakerType];
  }

  async synthesize(opts: SynthesizeOptions): Promise<SynthesizeResult> {
    const keyId = this.config.get<string>("CLOVA_KEY_ID");
    const keySecret = this.config.get<string>("CLOVA_KEY");
    if (!keyId || !keySecret) {
      throw new ServiceUnavailableException(
        "CLOVA_KEY_ID / CLOVA_KEY not configured. Register Clova Voice Premium at https://console.ncloud.com/",
      );
    }

    const voice = VOICE_MAP[opts.speakerType];
    const params = new URLSearchParams({
      speaker: voice,
      text: opts.text.slice(0, 2000), // Clova 단일 호출 한도 안전장치
      speed: String(opts.speed ?? -2),
      volume: String(opts.volume ?? 0),
      pitch: String(opts.pitch ?? 0),
      format: "mp3",
      "sampling-rate": "24000",
    });

    const res = await fetch(TTS_URL, {
      method: "POST",
      headers: {
        "X-NCP-APIGW-API-KEY-ID": keyId,
        "X-NCP-APIGW-API-KEY": keySecret,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      this.logger.error(
        `Clova TTS ${res.status}: ${body.slice(0, 200)}`,
      );
      throw new HttpException(
        `Clova upstream error: ${res.status}`,
        res.status === 429 ? 429 : 502,
      );
    }

    const audio = Buffer.from(await res.arrayBuffer());
    return { audio, voice, bytes: audio.byteLength };
  }
}
