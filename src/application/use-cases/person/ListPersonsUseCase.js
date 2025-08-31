class ListPersonsUseCase {
  constructor(personRepository) {
    this.personRepository = personRepository;
  }

  async execute({ nome, genero }) {
    try {
      const filters = {};
      if (nome) filters.nome = nome;
      if (genero) filters.genero = genero;
      
      const persons = await this.personRepository.findMany(filters);
      return { success: true, data: persons, count: persons.length };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Erro interno', status: 500 };
    }
  }
}

module.exports = ListPersonsUseCase;
