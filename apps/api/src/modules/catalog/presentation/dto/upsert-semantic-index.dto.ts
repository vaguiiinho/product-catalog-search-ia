import { Type } from "class-transformer";
import {
  IsArray,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from "class-validator";

export class SemanticDocumentDto {
  @IsString()
  id!: string;

  @IsString()
  productId!: string;

  @IsString()
  title!: string;

  @IsString()
  semanticText!: string;

  @IsObject()
  facets!: Record<string, string[]>;

  @IsArray()
  @IsNumber({}, { each: true })
  embedding!: number[];
}

export class UpsertSemanticIndexDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SemanticDocumentDto)
  documents!: SemanticDocumentDto[];
}

export type SemanticDocumentInput = SemanticDocumentDto;
export type UpsertSemanticIndexInput = UpsertSemanticIndexDto;
