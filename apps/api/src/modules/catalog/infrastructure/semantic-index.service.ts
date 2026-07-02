import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { SemanticDocumentInput } from "../presentation/dto/upsert-semantic-index.dto";

type SemanticDocumentRecord = SemanticDocumentInput & {
  embedding: number[];
};

@Injectable()
export class SemanticIndexService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS vector`;
    await this.prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS semantic_documents (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        semantic_text TEXT NOT NULL,
        facets JSONB NOT NULL DEFAULT '{}'::jsonb,
        embedding vector(8) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
  }

  async upsertDocuments(documents: SemanticDocumentRecord[]) {
    for (const document of documents) {
      await this.prisma.$executeRaw`
        INSERT INTO semantic_documents (
          id,
          product_id,
          title,
          semantic_text,
          facets,
          embedding,
          created_at,
          updated_at
        )
        VALUES (
          ${document.id},
          ${document.productId},
          ${document.title},
          ${document.semanticText},
          ${JSON.stringify(document.facets)}::jsonb,
          ${this.toVectorLiteral(document.embedding)}::vector(8),
          NOW(),
          NOW()
        )
        ON CONFLICT (product_id)
        DO UPDATE SET
          title = EXCLUDED.title,
          semantic_text = EXCLUDED.semantic_text,
          facets = EXCLUDED.facets,
          embedding = EXCLUDED.embedding,
          updated_at = NOW()
      `;
    }

    return {
      storedCount: documents.length,
    };
  }

  private toVectorLiteral(values: number[]) {
    return `[${values.map((value) => Number(value.toFixed(6))).join(",")}]`;
  }
}
