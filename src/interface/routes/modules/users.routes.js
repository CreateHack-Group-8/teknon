const router = require('express').Router();
const bcrypt = require('bcryptjs');
const prisma = require('../../../infrastructure/database/prisma');

router.post('/', async (req, res) => {
  try {
    const { nome, email, senha, tipo_usuario, status } = req.body;
    if (!nome || !email || !senha || !tipo_usuario) {
      return res.status(400).json({ success: false, message: 'Campos obrigatórios ausentes' });
    }
    const senha_hash = await bcrypt.hash(senha, 10);
    const user = await prisma.user.create({
      data: {
        nome,
        email,
        senha_hash,
        tipo_usuario: tipo_usuario.toLowerCase() === 'investidor' ? 'INVESTIDOR' : 'MISSIONARIO',
        status: status ? status.toUpperCase() : 'PENDENTE',
      },
    });
    return res.status(201).json({ success: true, data: user });
  } catch (err) {
    if (err.code === 'P2002') return res.status(400).json({ success: false, message: 'Email já cadastrado' });
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { tipo_usuario, status } = req.query;
    const where = {};
    if (tipo_usuario) where.tipo_usuario = tipo_usuario.toLowerCase() === 'investidor' ? 'INVESTIDOR' : 'MISSIONARIO';
    if (status) where.status = status.toUpperCase();
    const users = await prisma.user.findMany({ where, orderBy: { data_cadastro: 'desc' } });
    return res.json({ success: true, data: users, count: users.length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { user_id: req.params.id } });
    if (!user) return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    return res.json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { nome, email, senha, tipo_usuario, status } = req.body;
    const data = {};
    if (nome) data.nome = nome;
    if (email) data.email = email;
    if (senha) data.senha_hash = await bcrypt.hash(senha, 10);
    if (tipo_usuario) data.tipo_usuario = tipo_usuario.toLowerCase() === 'investidor' ? 'INVESTIDOR' : 'MISSIONARIO';
    if (status) data.status = status.toUpperCase();
    const user = await prisma.user.update({ where: { user_id: req.params.id }, data });
    return res.json({ success: true, data: user });
  } catch (err) {
    if (err.code === 'P2002') return res.status(400).json({ success: false, message: 'Email já cadastrado' });
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.user.delete({ where: { user_id: req.params.id } });
    return res.json({ success: true, message: 'Usuário deletado' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

module.exports = router;


