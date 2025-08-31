class DeletePersonUseCase {
  constructor(personRepository) {
    this.personRepository = personRepository;
  }

  async execute(id) {
    try {
      await this.personRepository.delete(id);
      return { success: true, message: 'Pessoa deletada' };
    } catch (error) {
      if (error.code === 'P2025') {
        return { success: false, message: 'Pessoa não encontrada', status: 404 };
      }
      console.error(error);
      return { success: false, message: 'Erro interno', status: 500 };
    }
  }
}

module.exports = DeletePersonUseCase;
