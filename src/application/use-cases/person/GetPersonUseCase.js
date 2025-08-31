class GetPersonUseCase {
  constructor(personRepository) {
    this.personRepository = personRepository;
  }

  async execute(id) {
    try {
      const person = await this.personRepository.findById(id);
      if (!person) {
        return { success: false, message: 'Pessoa não encontrada', status: 404 };
      }
      return { success: true, data: person };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Erro interno', status: 500 };
    }
  }
}

module.exports = GetPersonUseCase;
