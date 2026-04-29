import { IsIn, IsOptional, IsString } from "class-validator";

export class ExplainDto {
  @IsIn(["simpler", "deeper"])
  mode!: "simpler" | "deeper";

  @IsOptional()
  @IsString()
  userId?: string;
}
