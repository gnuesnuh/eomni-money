-- CreateEnum
CREATE TYPE "ExplainMode" AS ENUM ('initial', 'simpler', 'deeper');

-- DropIndex
DROP INDEX "news_bubbles_speaker_type_level_idx";

-- AlterTable
ALTER TABLE "news_bubbles" ADD COLUMN     "mode" "ExplainMode" NOT NULL DEFAULT 'initial';

-- CreateIndex
CREATE INDEX "news_bubbles_speaker_type_level_mode_idx" ON "news_bubbles"("speaker_type", "level", "mode");
