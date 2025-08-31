const PersonRepository = require('../../domain/repositories/PersonRepository');
const Person = require('../../domain/entities/Person');
const prisma = require('../database/prisma');

class PrismaPersonRepository extends PersonRepository {
  async create(person) {
    const data = {
      nome: person.nome,
      data_nascimento: person.data_nascimento ? new Date(person.data_nascimento) : null,
      genero: person.genero,
      endereco: person.endereco,
      contato: person.contato,
      dados_sensivel: person.dados_sensivel,
      origem: person.origem
    };
    
    const createdPerson = await prisma.person.create({ data });
    return new Person(createdPerson);
  }

  async findMany(filters) {
    const where = {};
    if (filters.nome) {
      where.nome = { contains: String(filters.nome), mode: 'insensitive' };
    }
    if (filters.genero) {
      where.genero = { equals: String(filters.genero), mode: 'insensitive' };
    }
    
    const persons = await prisma.person.findMany({ 
      where, 
      orderBy: { data_cadastro: 'desc' } 
    });
    
    return persons.map(person => new Person(person));
  }

  async findById(id) {
    const person = await prisma.person.findUnique({ 
      where: { person_id: id } 
    });
    
    return person ? new Person(person) : null;
  }

  async findByProject(projectId) {
    // Implementar quando necessário - por enquanto retorna array vazio
    // Isso seria através de uma tabela de relacionamento person_project
    return [];
  }

  async update(id, data) {
    if (data.data_nascimento) {
      data.data_nascimento = new Date(data.data_nascimento);
    }
    
    const updatedPerson = await prisma.person.update({ 
      where: { person_id: id }, 
      data 
    });
    
    return new Person(updatedPerson);
  }

  async delete(id) {
    await prisma.person.delete({ where: { person_id: id } });
  }
}

module.exports = PrismaPersonRepository;
