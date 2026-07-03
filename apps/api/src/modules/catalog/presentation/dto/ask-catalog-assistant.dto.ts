import { IsString, MinLength } from "class-validator";

export class AskCatalogAgentDto {
  @IsString()
  @MinLength(3)
  question!: string;
}
