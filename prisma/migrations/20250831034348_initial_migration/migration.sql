-- CreateEnum
CREATE TYPE "public"."TipoUsuario" AS ENUM ('missionario', 'investidor');

-- CreateEnum
CREATE TYPE "public"."StatusUsuario" AS ENUM ('ativo', 'inativo', 'pendente');

-- CreateEnum
CREATE TYPE "public"."TipoMetadado" AS ENUM ('experiencia', 'acontecimento');

-- CreateEnum
CREATE TYPE "public"."StatusProgress" AS ENUM ('pendente', 'em_progresso', 'concluido');

-- CreateTable
CREATE TABLE "public"."users" (
    "user_id" UUID NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "senha_hash" VARCHAR(255) NOT NULL,
    "tipo_usuario" "public"."TipoUsuario" NOT NULL,
    "status" "public"."StatusUsuario" NOT NULL DEFAULT 'pendente',
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultimo_login" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "public"."projects" (
    "project_id" UUID NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "descricao" TEXT,
    "regiao" VARCHAR(255) NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "missionary_owner_id" UUID NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("project_id")
);

-- CreateTable
CREATE TABLE "public"."persons" (
    "person_id" UUID NOT NULL,
    "id_interno" VARCHAR(50) NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "idade" INTEGER NOT NULL,
    "data_nascimento" DATE,
    "genero" VARCHAR(50),
    "endereco" TEXT,
    "contato" JSONB,
    "dados_sensivel" JSONB,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "origem" VARCHAR(255),

    CONSTRAINT "persons_pkey" PRIMARY KEY ("person_id")
);

-- CreateTable
CREATE TABLE "public"."person_missionary_assignments" (
    "assignment_id" UUID NOT NULL,
    "person_id" UUID NOT NULL,
    "missionary_id" UUID NOT NULL,
    "data_inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_fim" TIMESTAMP(3),

    CONSTRAINT "person_missionary_assignments_pkey" PRIMARY KEY ("assignment_id")
);

-- CreateTable
CREATE TABLE "public"."dynamic_metadata" (
    "metadata_id" UUID NOT NULL,
    "person_id" UUID NOT NULL,
    "tipo_metadado" "public"."TipoMetadado" NOT NULL,
    "categoria" VARCHAR(255) NOT NULL,
    "sub_categoria" VARCHAR(255),
    "descricao" TEXT NOT NULL,
    "data_ocorrencia" TIMESTAMP(3),
    "detalhes_json" JSONB,
    "data_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dynamic_metadata_pkey" PRIMARY KEY ("metadata_id")
);

-- CreateTable
CREATE TABLE "public"."project_persons" (
    "project_person_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "person_id" UUID NOT NULL,
    "data_associacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_persons_pkey" PRIMARY KEY ("project_person_id")
);

-- CreateTable
CREATE TABLE "public"."project_users" (
    "project_user_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "data_associacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_users_pkey" PRIMARY KEY ("project_user_id")
);

-- CreateTable
CREATE TABLE "public"."checkpoints" (
    "checkpoint_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "peso" INTEGER NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "checkpoints_pkey" PRIMARY KEY ("checkpoint_id")
);

-- CreateTable
CREATE TABLE "public"."checkpoint_progress" (
    "progress_id" UUID NOT NULL,
    "person_id" UUID NOT NULL,
    "checkpoint_id" UUID NOT NULL,
    "status" "public"."StatusProgress" NOT NULL DEFAULT 'pendente',
    "data_atualizacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacoes" TEXT,

    CONSTRAINT "checkpoint_progress_pkey" PRIMARY KEY ("progress_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "projects_nome_key" ON "public"."projects"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "persons_id_interno_key" ON "public"."persons"("id_interno");

-- CreateIndex
CREATE UNIQUE INDEX "checkpoint_progress_person_id_checkpoint_id_key" ON "public"."checkpoint_progress"("person_id", "checkpoint_id");

-- AddForeignKey
ALTER TABLE "public"."projects" ADD CONSTRAINT "projects_missionary_owner_id_fkey" FOREIGN KEY ("missionary_owner_id") REFERENCES "public"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."person_missionary_assignments" ADD CONSTRAINT "person_missionary_assignments_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "public"."persons"("person_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."person_missionary_assignments" ADD CONSTRAINT "person_missionary_assignments_missionary_id_fkey" FOREIGN KEY ("missionary_id") REFERENCES "public"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."dynamic_metadata" ADD CONSTRAINT "dynamic_metadata_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "public"."persons"("person_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_persons" ADD CONSTRAINT "project_persons_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_persons" ADD CONSTRAINT "project_persons_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "public"."persons"("person_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_users" ADD CONSTRAINT "project_users_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_users" ADD CONSTRAINT "project_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checkpoints" ADD CONSTRAINT "checkpoints_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checkpoint_progress" ADD CONSTRAINT "checkpoint_progress_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "public"."persons"("person_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checkpoint_progress" ADD CONSTRAINT "checkpoint_progress_checkpoint_id_fkey" FOREIGN KEY ("checkpoint_id") REFERENCES "public"."checkpoints"("checkpoint_id") ON DELETE RESTRICT ON UPDATE CASCADE;
