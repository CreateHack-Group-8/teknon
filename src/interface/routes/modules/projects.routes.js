const router = require('express').Router();
const prisma = require('../../../infrastructure/database/prisma');
const auth = require('../../middlewares/auth');

// Create project (requires auth)
router.post('/', auth(true), async (req, res) => {
  try {
    const { nome, descricao, regiao } = req.body;
    if (!nome || !regiao) return res.status(400).json({ success: false, message: 'nome e regiao são obrigatórios' });
    const missionary_owner_id = req.user?.sub;
    const project = await prisma.project.create({
      data: { nome, descricao, regiao, missionary_owner_id },
    });
    return res.status(201).json({ success: true, data: project });
  } catch (err) {
    if (err.code === 'P2002') return res.status(400).json({ success: false, message: 'Nome de projeto já utilizado' });
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

// List projects (no auth required for frontend)
router.get('/', async (req, res) => {
  try {
    const { regiao, missionary_id } = req.query;
    const where = {};
    if (regiao) where.regiao = { contains: String(regiao), mode: 'insensitive' };
    // missionary_id filter has priority when provided
    if (missionary_id) where.missionary_owner_id = String(missionary_id);
    const projects = await prisma.project.findMany({ where, orderBy: { data_criacao: 'desc' } });
    return res.json({ success: true, data: projects, count: projects.length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const project = await prisma.project.findUnique({ where: { project_id: req.params.id } });
    if (!project) return res.status(404).json({ success: false, message: 'Projeto não encontrado' });
    return res.json({ success: true, data: project });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

router.put('/:id', auth(true), async (req, res) => {
  try {
    const { nome, descricao, regiao } = req.body;
    const data = {};
    if (nome) data.nome = nome;
    if (descricao) data.descricao = descricao;
    if (regiao) data.regiao = regiao;
    const project = await prisma.project.update({ where: { project_id: req.params.id }, data });
    return res.json({ success: true, data: project });
  } catch (err) {
    if (err.code === 'P2002') return res.status(400).json({ success: false, message: 'Nome de projeto já utilizado' });
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Projeto não encontrado' });
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

router.delete('/:id', auth(true), async (req, res) => {
  try {
    await prisma.project.delete({ where: { project_id: req.params.id } });
    return res.json({ success: true, message: 'Projeto deletado' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Projeto não encontrado' });
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

module.exports = router;


