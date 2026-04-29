import { Controller, Get, Param } from "@nestjs/common";
import { StudyService } from "./study.service";

@Controller("study")
export class StudyController {
  constructor(private readonly study: StudyService) {}

  @Get()
  steps() {
    return this.study.listSteps();
  }

  @Get(":step")
  detail(@Param("step") step: string) {
    return this.study.getStep(Number(step));
  }
}
