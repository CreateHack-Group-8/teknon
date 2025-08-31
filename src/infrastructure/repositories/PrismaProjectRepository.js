const ProjectRepository = require('../../domain/repositories/ProjectRepository');
const Project = require('../../domain/entities/Project');
const prisma = require('../database/prisma');

class PrismaProjectRepository extends ProjectRepository {
  async create(project) {
    const data = {
      nome: project.nome,
      descricao: project.descricao,
      regiao: project.regiao,
      missionary_owner_id: project.missionary_owner_id
    };
    
    const createdProject = await prisma.project.create({ data });
    return new Project(createdProject);
  }

  async findMany(filters) {
    const where = {};
    if (filters.regiao) {
      where.regiao = { contains: String(filters.regiao), mode: 'insensitive' };
    }
    if (filters.missionary_owner_id) {
      where.missionary_owner_id = String(filters.missionary_owner_id);
    }
    
    const projects = await prisma.project.findMany({ 
      where, 
      orderBy: { data_criacao: 'desc' } 
    });
    
    return projects.map(project => new Project(project));
  }

  async findById(id) {
    const project = await prisma.project.findUnique({ 
      where: { project_id: id } 
    });
    
    return project ? new Project(project) : null;
  }

  async update(id, data) {
    const updatedProject = await prisma.project.update({ 
      where: { project_id: id }, 
      data 
    });
    
    return new Project(updatedProject);
  }

  async delete(id) {
    await prisma.project.delete({ where: { project_id: id } });
  }
}

module.exports = PrismaProjectRepository;
