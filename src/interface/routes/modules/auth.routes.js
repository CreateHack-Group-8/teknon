const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../../../infrastructure/database/prisma');
const { JWT_SECRET } = require('../../../config/env');

router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ success: false, message: 'Credenciais inválidas' });

    const ok = await bcrypt.compare(senha, user.senha_hash);
    if (!ok) return res.status(401).json({ success: false, message: 'Credenciais inválidas' });

    if (user.status !== 'ATIVO' && user.status !== 'ativo') {
      return res.status(401).json({ success: false, message: 'Usuário não está ativo' });
    }

    const token = jwt.sign({ sub: user.user_id, tipo: user.tipo_usuario }, JWT_SECRET, { expiresIn: '5d' });
    await prisma.user.update({ where: { user_id: user.user_id }, data: { ultimo_login: new Date() } });

    return res.json({ success: true, data: { token, user }, message: 'Login realizado com sucesso' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

router.get('/validate', (req, res) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ success: false, message: 'Token ausente' });
    const payload = jwt.verify(token, JWT_SECRET);
    return res.json({ success: true, data: { payload }, message: 'Token válido' });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token inválido ou expirado' });
  }
});

module.exports = router;


