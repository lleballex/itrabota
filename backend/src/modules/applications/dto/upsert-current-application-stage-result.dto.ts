import { Transform } from "class-transformer"
import { IsEnum, IsOptional, IsString } from "class-validator"

import {
  ApplicationStageRecommendation,
  type ApplicationStageRecommendation as TApplicationStageRecommendation,
} from "../entities/application-stage-result.entity"

const trimNullableText = ({ value }: { value: unknown }) => {
  if (typeof value !== "string") {
    return value
  }

  const trimmedValue = value.trim()

  return trimmedValue.length ? trimmedValue : null
}

export class UpsertCurrentApplicationStageResultDto {
  @IsOptional()
  @IsString()
  @Transform(trimNullableText)
  summary?: string | null

  @IsOptional()
  @IsString()
  @Transform(trimNullableText)
  pros?: string | null

  @IsOptional()
  @IsString()
  @Transform(trimNullableText)
  cons?: string | null

  @IsOptional()
  @IsString()
  @Transform(trimNullableText)
  notes?: string | null

  @IsOptional()
  @IsEnum(ApplicationStageRecommendation)
  recommendation?: TApplicationStageRecommendation | null
}
