class DeleteProjectUseCase {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(id) {
    try {
      await this.projectRepository.delete(id);
      return { success: true, message: 'Projeto deletado' };
    } catch (error) {
      if (error.code === 'P2025') {
        return { success: false, message: 'Projeto não encontrado', status: 404 };
      }
      console.error(error);
      return { success: false, message: 'Erro interno', status: 500 };
    }
  }
}

module.exports = DeleteProjectUseCase;
