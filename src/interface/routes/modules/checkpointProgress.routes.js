const router = require('express').Router();
const prisma = require('../../../infrastructure/database/prisma');

// Percentage completion for a person across associated projects
router.get('/percentage', async (req, res) => {
  try {
    const { person_id } = req.query;
    if (!person_id) {
      return res.status(400).json({ success: false, message: 'person_id é obrigatório' });
    }

    // Find all projects this person is associated with
    const links = await prisma.projectPerson.findMany({
      where: { person_id: String(person_id) },
      select: { project_id: true },
    });
    const projectIds = links.map((l) => l.project_id);

    if (projectIds.length === 0) {
      return res.json(0);
    }

    // All checkpoints across those projects
    const checkpoints = await prisma.checkpoint.findMany({
      where: { project_id: { in: projectIds } },
      select: { checkpoint_id: true, peso: true },
    });

    if (checkpoints.length === 0) {
      return res.json(0);
    }

    const totalWeight = checkpoints.reduce((acc, c) => acc + (c.peso || 0), 0);

    // Concluded checkpoints for the person within those projects
    const concluded = await prisma.checkpointProgress.findMany({
      where: {
        person_id: String(person_id),
        status: 'CONCLUIDO',
        checkpoint: { project_id: { in: projectIds } },
      },
      select: { checkpoint_id: true },
    });

    const concludedSet = new Set(concluded.map((i) => i.checkpoint_id));
    const completedWeight = checkpoints.reduce((acc, c) => acc + (concludedSet.has(c.checkpoint_id) ? (c.peso || 0) : 0), 0);

    const percentage = totalWeight === 0 ? 0 : Number(((completedWeight / totalWeight) * 100).toFixed(2));

    // Return only the percentage per request
    return res.json(percentage);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { person_id, checkpoint_id, status, observacoes } = req.body;
    if (!person_id || !checkpoint_id) return res.status(400).json({ success: false, message: 'person_id e checkpoint_id são obrigatórios' });
    const item = await prisma.checkpointProgress.upsert({
      where: { person_id_checkpoint_id: { person_id, checkpoint_id } },
      update: { status: status ? status.toUpperCase() : undefined, observacoes, data_atualizacao: new Date() },
      create: {
        person_id,
        checkpoint_id,
        status: status ? status.toUpperCase() : undefined,
        observacoes,
      },
    });
    return res.status(201).json({ success: true, data: item });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { person_id, checkpoint_id, status } = req.query;
    const where = {};
    if (person_id) where.person_id = String(person_id);
    if (checkpoint_id) where.checkpoint_id = String(checkpoint_id);
    if (status) where.status = status.toUpperCase();
    const items = await prisma.checkpointProgress.findMany({ where, orderBy: { data_atualizacao: 'desc' } });
    return res.json({ success: true, data: items, count: items.length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await prisma.checkpointProgress.findUnique({ where: { progress_id: req.params.id } });
    if (!item) return res.status(404).json({ success: false, message: 'Progresso não encontrado' });
    return res.json({ success: true, data: item });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { status, observacoes } = req.body;
    const data = {};
    if (status) data.status = status.toUpperCase();
    if (observacoes) data.observacoes = observacoes;
    data.data_atualizacao = new Date();
    const item = await prisma.checkpointProgress.update({ where: { progress_id: req.params.id }, data });
    return res.json({ success: true, data: item });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Progresso não encontrado' });
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.checkpointProgress.delete({ where: { progress_id: req.params.id } });
    return res.json({ success: true, message: 'Progresso deletado' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Progresso não encontrado' });
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

module.exports = router;


