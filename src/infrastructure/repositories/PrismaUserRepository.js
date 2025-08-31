const UserRepository = require('../../domain/repositories/UserRepository');
const User = require('../../domain/entities/User');
const prisma = require('../database/prisma');

class PrismaUserRepository extends UserRepository {
  async create(user) {
    const data = {
      nome: user.nome,
      email: user.email,
      senha_hash: user.password_hash,
      tipo_usuario: user.tipo_usuario || 'MISSIONARIO',
      status: user.status || 'PENDENTE'
    };
    
    const createdUser = await prisma.user.create({ data });
    return new User({
      user_id: createdUser.user_id,
      nome: createdUser.nome,
      email: createdUser.email,
      password_hash: createdUser.senha_hash,
      data_criacao: createdUser.data_cadastro,
      data_atualizacao: createdUser.data_cadastro
    });
  }

  async findMany(filters) {
    const where = {};
    if (filters.tipo_usuario) {
      where.tipo_usuario = filters.tipo_usuario.toLowerCase() === 'investidor' ? 'INVESTIDOR' : 'MISSIONARIO';
    }
    if (filters.status) {
      where.status = filters.status.toUpperCase();
    }
    
    const users = await prisma.user.findMany({ 
      where, 
      orderBy: { data_cadastro: 'desc' } 
    });
    
    return users.map(user => new User({
      user_id: user.user_id,
      nome: user.nome,
      email: user.email,
      password_hash: user.senha_hash,
      data_criacao: user.data_cadastro,
      data_atualizacao: user.data_cadastro
    }));
  }

  async findById(id) {
    const user = await prisma.user.findUnique({ 
      where: { user_id: id } 
    });
    
    if (!user) return null;
    
    return new User({
      user_id: user.user_id,
      nome: user.nome,
      email: user.email,
      password_hash: user.senha_hash,
      data_criacao: user.data_cadastro,
      data_atualizacao: user.data_cadastro
    });
  }

  async findByEmail(email) {
    const user = await prisma.user.findUnique({ 
      where: { email } 
    });
    
    if (!user) return null;
    
    return new User({
      user_id: user.user_id,
      nome: user.nome,
      email: user.email,
      password_hash: user.senha_hash,
      data_criacao: user.data_cadastro,
      data_atualizacao: user.data_cadastro
    });
  }

  async update(id, data) {
    if (data.password_hash) {
      data.senha_hash = data.password_hash;
      delete data.password_hash;
    }
    
    const updatedUser = await prisma.user.update({ 
      where: { user_id: id }, 
      data 
    });
    
    return new User({
      user_id: updatedUser.user_id,
      nome: updatedUser.nome,
      email: updatedUser.email,
      password_hash: updatedUser.senha_hash,
      data_criacao: updatedUser.data_cadastro,
      data_atualizacao: updatedUser.data_cadastro
    });
  }

  async delete(id) {
    await prisma.user.delete({ where: { user_id: id } });
  }
}

module.exports = PrismaUserRepository;
