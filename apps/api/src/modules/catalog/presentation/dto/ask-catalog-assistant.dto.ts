import { IsString, MinLength } from "class-validator";

export class AskCatalogAssistantDto {
  @IsString()
  @MinLength(3)
  question!: string;
}

