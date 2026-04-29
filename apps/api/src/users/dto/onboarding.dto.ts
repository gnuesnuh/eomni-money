import { IsIn, IsString, MinLength } from "class-validator";

export class OnboardingDto {
  @IsIn(["son", "daughter", "daughter_in_law", "son_in_law"])
  speakerType!: "son" | "daughter" | "daughter_in_law" | "son_in_law";

  @IsIn(["mother", "father"])
  targetType!: "mother" | "father";

  @IsString()
  @MinLength(1)
  targetName!: string;

  @IsIn(["beginner", "intermediate", "advanced"])
  level!: "beginner" | "intermediate" | "advanced";
}
