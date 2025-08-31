class UpdateProjectUseCase {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(id, { nome, descricao, regiao }) {
    try {
      const data = {};
      if (nome) data.nome = nome;
      if (descricao) data.descricao = descricao;
      if (regiao) data.regiao = regiao;
      
      const project = await this.projectRepository.update(id, data);
      return { success: true, data: project };
    } catch (error) {
      if (error.code === 'P2002') {
        return { success: false, message: 'Nome de projeto já utilizado', status: 400 };
      }
      if (error.code === 'P2025') {
        return { success: false, message: 'Projeto não encontrado', status: 404 };
      }
      console.error(error);
      return { success: false, message: 'Erro interno', status: 500 };
    }
  }
}

module.exports = UpdateProjectUseCase;
