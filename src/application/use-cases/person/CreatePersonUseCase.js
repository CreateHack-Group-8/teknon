const Person = require('../../../domain/entities/Person');

class CreatePersonUseCase {
  constructor(personRepository) {
    this.personRepository = personRepository;
  }

  async execute({ nome, data_nascimento, genero, endereco, contato, dados_sensivel, origem }) {
    try {
      const person = Person.create({ nome, data_nascimento, genero, contato });
      // Adiciona campos específicos do sistema atual
      if (endereco) person.endereco = endereco;
      if (dados_sensivel) person.dados_sensivel = dados_sensivel;
      if (origem) person.origem = origem;
      
      const createdPerson = await this.personRepository.create(person);
      return { success: true, data: createdPerson };
    } catch (error) {
      if (error.code === 'P2002') {
        return { success: false, message: 'id_interno já usado', status: 400 };
      }
      console.error(error);
      return { success: false, message: 'Erro interno', status: 500 };
    }
  }
}

module.exports = CreatePersonUseCase;
