import { Injectable } from "@nestjs/common";
import { OnboardingDto } from "./dto/onboarding.dto";

@Injectable()
export class UsersService {
  async findCurrent() {
    // TODO: 현재 인증된 사용자 조회
    return { stub: true };
  }

  async saveOnboarding(dto: OnboardingDto) {
    // TODO: users upsert
    return { saved: true, profile: dto };
  }
}
