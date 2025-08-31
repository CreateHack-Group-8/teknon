/*
  Warnings:

  - A unique constraint covering the columns `[project_id,user_id]` on the table `project_users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."ProjectUserRole" AS ENUM ('proprietario', 'missionario', 'investidor', 'participante');

-- AlterTable
ALTER TABLE "public"."project_users" ADD COLUMN     "role" "public"."ProjectUserRole" NOT NULL DEFAULT 'participante';

-- CreateIndex
CREATE UNIQUE INDEX "project_users_project_id_user_id_key" ON "public"."project_users"("project_id", "user_id");
