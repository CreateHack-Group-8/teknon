const router = require('express').Router();
const prisma = require('../../../infrastructure/database/prisma');

router.post('/', async (req, res) => {
  try {
    const { project_id, nome, peso } = req.body;
    if (!project_id || !nome || typeof peso !== 'number') {
      return res.status(400).json({ success: false, message: 'project_id, nome e peso são obrigatórios' });
    }
    const checkpoint = await prisma.checkpoint.create({ data: { project_id, nome, peso } });
    return res.status(201).json({ success: true, data: checkpoint });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { project_id } = req.query;
    const where = {};
    if (project_id) where.project_id = String(project_id);
    const items = await prisma.checkpoint.findMany({ where, orderBy: { data_criacao: 'desc' } });
    return res.json({ success: true, data: items, count: items.length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await prisma.checkpoint.findUnique({ where: { checkpoint_id: req.params.id } });
    if (!item) return res.status(404).json({ success: false, message: 'Checkpoint não encontrado' });
    return res.json({ success: true, data: item });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { nome, peso } = req.body;
    const data = {};
    if (nome) data.nome = nome;
    if (typeof peso === 'number') data.peso = peso;
    const item = await prisma.checkpoint.update({ where: { checkpoint_id: req.params.id }, data });
    return res.json({ success: true, data: item });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Checkpoint não encontrado' });
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.checkpoint.delete({ where: { checkpoint_id: req.params.id } });
    return res.json({ success: true, message: 'Checkpoint deletado' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Checkpoint não encontrado' });
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

module.exports = router;


