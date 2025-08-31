class UpdatePersonUseCase {
  constructor(personRepository) {
    this.personRepository = personRepository;
  }

  async execute(id, data) {
    try {
      const person = await this.personRepository.update(id, data);
      return { success: true, data: person };
    } catch (error) {
      if (error.code === 'P2002') {
        return { success: false, message: 'id_interno já usado', status: 400 };
      }
      if (error.code === 'P2025') {
        return { success: false, message: 'Pessoa não encontrada', status: 404 };
      }
      console.error(error);
      return { success: false, message: 'Erro interno', status: 500 };
    }
  }
}

module.exports = UpdatePersonUseCase;
