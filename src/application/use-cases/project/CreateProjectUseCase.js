const Project = require('../../../domain/entities/Project');

class CreateProjectUseCase {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute({ nome, descricao, regiao, missionary_owner_id }) {
    try {
      const project = Project.create({ nome, descricao, regiao, missionary_owner_id });
      const createdProject = await this.projectRepository.create(project);
      return { success: true, data: createdProject };
    } catch (error) {
      if (error.code === 'P2002') {
        return { success: false, message: 'Nome de projeto já utilizado', status: 400 };
      }
      console.error(error);
      return { success: false, message: 'Erro interno', status: 500 };
    }
  }
}

module.exports = CreateProjectUseCase;
