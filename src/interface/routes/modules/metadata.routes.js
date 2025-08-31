const router = require('express').Router();
const prisma = require('../../../infrastructure/database/prisma');

router.post('/', async (req, res) => {
  try {
    const { person_id, tipo_metadado, categoria, sub_categoria, descricao, data_ocorrencia, detalhes_json } = req.body;
    if (!person_id || !tipo_metadado || !categoria || !descricao) {
      return res.status(400).json({ success: false, message: 'Campos obrigatórios ausentes' });
    }
    const metadata = await prisma.dynamicMetadata.create({
      data: {
        person_id,
        tipo_metadado: tipo_metadado.toLowerCase() === 'acontecimento' ? 'ACONTECIMENTO' : 'EXPERIENCIA',
        categoria,
        sub_categoria,
        descricao,
        data_ocorrencia: data_ocorrencia ? new Date(data_ocorrencia) : null,
        detalhes_json,
      },
    });
    return res.status(201).json({ success: true, data: metadata });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { person_id, tipo_metadado, categoria } = req.query;
    const where = {};
    if (person_id) where.person_id = String(person_id);
    if (tipo_metadado) where.tipo_metadado = tipo_metadado.toLowerCase() === 'acontecimento' ? 'ACONTECIMENTO' : 'EXPERIENCIA';
    if (categoria) where.categoria = { contains: String(categoria), mode: 'insensitive' };
    const items = await prisma.dynamicMetadata.findMany({ where, orderBy: { data_registro: 'desc' } });
    return res.json({ success: true, data: items, count: items.length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await prisma.dynamicMetadata.findUnique({ where: { metadata_id: req.params.id } });
    if (!item) return res.status(404).json({ success: false, message: 'Metadado não encontrado' });
    return res.json({ success: true, data: item });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { tipo_metadado, categoria, sub_categoria, descricao, data_ocorrencia, detalhes_json } = req.body;
    const data = {};
    if (tipo_metadado) data.tipo_metadado = tipo_metadado.toLowerCase() === 'acontecimento' ? 'ACONTECIMENTO' : 'EXPERIENCIA';
    if (categoria) data.categoria = categoria;
    if (sub_categoria) data.sub_categoria = sub_categoria;
    if (descricao) data.descricao = descricao;
    if (data_ocorrencia) data.data_ocorrencia = new Date(data_ocorrencia);
    if (detalhes_json) data.detalhes_json = detalhes_json;
    const item = await prisma.dynamicMetadata.update({ where: { metadata_id: req.params.id }, data });
    return res.json({ success: true, data: item });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Metadado não encontrado' });
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.dynamicMetadata.delete({ where: { metadata_id: req.params.id } });
    return res.json({ success: true, message: 'Metadado deletado' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Metadado não encontrado' });
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

module.exports = router;


