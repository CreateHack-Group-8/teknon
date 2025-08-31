const router = require('express').Router();
const prisma = require('../../../infrastructure/database/prisma');

router.post('/', async (req, res) => {
  try {
    const { nome, data_nascimento, genero, endereco, contato, dados_sensivel, origem } = req.body;
    if (!nome) return res.status(400).json({ success: false, message: 'id_interno e nome são obrigatórios' });
    const id_interno = `PES${Math.floor(10000 + Math.random() * 90000)}`;
    const person = await prisma.person.create({
      data: { nome, data_nascimento: data_nascimento ? new Date(data_nascimento) : null, genero, endereco, contato, dados_sensivel, origem },
    });
    return res.status(201).json({ success: true, data: person });
  } catch (err) {
    if (err.code === 'P2002') return res.status(400).json({ success: false, message: 'id_interno já usado' });
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { nome, genero } = req.query;
    const where = {};
    if (nome) where.nome = { contains: String(nome), mode: 'insensitive' };
    if (genero) where.genero = { equals: String(genero), mode: 'insensitive' };
    const persons = await prisma.person.findMany({ where, orderBy: { data_cadastro: 'desc' } });
    return res.json({ success: true, data: persons, count: persons.length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const person = await prisma.person.findUnique({ where: { person_id: req.params.id } });
    if (!person) return res.status(404).json({ success: false, message: 'Pessoa não encontrada' });
    return res.json({ success: true, data: person });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id_interno, nome, data_nascimento, genero, endereco, contato, dados_sensivel, origem } = req.body;
    const data = {};
    if (id_interno) data.id_interno = id_interno;
    if (nome) data.nome = nome;
    if (data_nascimento) data.data_nascimento = new Date(data_nascimento);
    if (genero) data.genero = genero;
    if (endereco) data.endereco = endereco;
    if (contato) data.contato = contato;
    if (dados_sensivel) data.dados_sensivel = dados_sensivel;
    if (origem) data.origem = origem;
    const person = await prisma.person.update({ where: { person_id: req.params.id }, data });
    return res.json({ success: true, data: person });
  } catch (err) {
    if (err.code === 'P2002') return res.status(400).json({ success: false, message: 'id_interno já usado' });
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Pessoa não encontrada' });
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.person.delete({ where: { person_id: req.params.id } });
    return res.json({ success: true, message: 'Pessoa deletada' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Pessoa não encontrada' });
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

module.exports = router;


