class ListProjectsUseCase {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute({ regiao, missionary_id }) {
    try {
      const filters = {};
      if (regiao) filters.regiao = regiao;
      if (missionary_id) filters.missionary_owner_id = missionary_id;
      
      const projects = await this.projectRepository.findMany(filters);
      return { success: true, data: projects, count: projects.length };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Erro interno', status: 500 };
    }
  }
}

module.exports = ListProjectsUseCase;
