import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { OnboardingDto } from "./dto/onboarding.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findCurrent() {
    // TODO: Supabase JWT에서 user 추출 후 prisma.user.findUnique
    return { stub: true };
  }

  async saveOnboarding(dto: OnboardingDto) {
    // TODO: 인증 붙이고 kakaoId 기반 upsert
    //   const user = await this.prisma.user.upsert({
    //     where: { kakaoId },
    //     create: { kakaoId, speakerType, speakerName, targetType, targetName, level },
    //     update: { speakerType, speakerName, targetType, targetName, level },
    //   });
    return { saved: true, profile: dto };
  }
}
