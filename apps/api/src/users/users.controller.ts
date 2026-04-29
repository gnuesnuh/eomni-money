import { Body, Controller, Get, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { OnboardingDto } from "./dto/onboarding.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get("me")
  me() {
    // TODO: Supabase JWT에서 user 추출
    return this.users.findCurrent();
  }

  @Post("onboarding")
  completeOnboarding(@Body() dto: OnboardingDto) {
    return this.users.saveOnboarding(dto);
  }
}
