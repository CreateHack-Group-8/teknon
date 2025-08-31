class GetProjectUseCase {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(id) {
    try {
      const project = await this.projectRepository.findById(id);
      if (!project) {
        return { success: false, message: 'Projeto não encontrado', status: 404 };
      }
      return { success: true, data: project };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Erro interno', status: 500 };
    }
  }
}

module.exports = GetProjectUseCase;
