const bcrypt = require('bcryptjs');
const prisma = require('./prisma');

async function main() {
  // Users
  const senhaHash = await bcrypt.hash('senha123', 10);
  const missionario = await prisma.user.upsert({
    where: { email: 'missionario@example.com' },
    update: {},
    create: {
      nome: 'Missionário Demo',
      email: 'missionario@example.com',
      senha_hash: senhaHash,
      tipo_usuario: 'MISSIONARIO',
      status: 'ATIVO',
    },
  });

  const investidor = await prisma.user.upsert({
    where: { email: 'investidor@example.com' },
    update: {},
    create: {
      nome: 'Investidor Demo',
      email: 'investidor@example.com',
      senha_hash: senhaHash,
      tipo_usuario: 'INVESTIDOR',
      status: 'ATIVO',
    },
  });

  // Project
  const project = await prisma.project.upsert({
    where: { nome: 'Projeto Vila Nova' },
    update: {},
    create: {
      nome: 'Projeto Vila Nova',
      descricao: 'Assistência a famílias em vulnerabilidade',
      regiao: 'Vila Nova',
      missionary_owner_id: missionario.user_id,
    },
  });

  // Persons
  const maria = await prisma.person.upsert({
    where: { id_interno: 'PES001' },
    update: {},
    create: {
      id_interno: 'PES001',
      nome: 'Maria Silva',
      genero: 'Feminino',
      contato: { telefone: '11999999999' },
      origem: 'Vila Nova',
    },
  });

  const joao = await prisma.person.upsert({
    where: { id_interno: 'PES002' },
    update: {},
    create: {
      id_interno: 'PES002',
      nome: 'João Santos',
      genero: 'Masculino',
      contato: { telefone: '11888888888' },
      origem: 'Vila Nova',
    },
  });

  const pp1 = await prisma.projectPerson.findFirst({ where: { project_id: project.project_id, person_id: maria.person_id } });
  if (!pp1) {
    await prisma.projectPerson.create({ data: { project_id: project.project_id, person_id: maria.person_id } });
  }
  const pp2 = await prisma.projectPerson.findFirst({ where: { project_id: project.project_id, person_id: joao.person_id } });
  if (!pp2) {
    await prisma.projectPerson.create({ data: { project_id: project.project_id, person_id: joao.person_id } });
  }

  // Checkpoints
  async function ensureCheckpoint(nome, peso) {
    const existing = await prisma.checkpoint.findFirst({ where: { project_id: project.project_id, nome } });
    if (existing) return existing;
    return prisma.checkpoint.create({ data: { project_id: project.project_id, nome, peso } });
  }
  const c1 = await ensureCheckpoint('Primeiro Contato', 10);
  const c2 = await ensureCheckpoint('Triagem', 15);
  const c3 = await ensureCheckpoint('Encaminhamento', 20);

  // Metadata
  await prisma.dynamicMetadata.create({
    data: {
      person_id: maria.person_id,
      tipo_metadado: 'EXPERIENCIA',
      categoria: 'Social',
      descricao: 'Atendimento inicial realizado',
      detalhes_json: { canal: 'presencial' },
    },
  });

  // Progress
  await prisma.checkpointProgress.create({
    data: { person_id: maria.person_id, checkpoint_id: c1.checkpoint_id, status: 'EM_PROGRESSO', observacoes: 'Em acompanhamento' },
  });

  console.log('Seed completed:', { missionario: missionario.email, investidor: investidor.email, project: project.nome });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


