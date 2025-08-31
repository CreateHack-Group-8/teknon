class Person {
  constructor({
    person_id,
    nome,
    data_nascimento,
    genero,
    contato,
    data_criacao,
    data_atualizacao
  }) {
    this.person_id = person_id;
    this.nome = nome;
    this.data_nascimento = data_nascimento;
    this.genero = genero;
    this.contato = contato;
    this.data_criacao = data_criacao;
    this.data_atualizacao = data_atualizacao;
  }

  static create({ nome, data_nascimento, genero, contato }) {
    if (!nome) {
      throw new Error('nome é obrigatório');
    }
    
    return new Person({
      nome,
      data_nascimento,
      genero,
      contato
    });
  }

  update({ nome, data_nascimento, genero, contato }) {
    if (nome) this.nome = nome;
    if (data_nascimento) this.data_nascimento = data_nascimento;
    if (genero) this.genero = genero;
    if (contato) this.contato = contato;
    this.data_atualizacao = new Date();
  }
}

module.exports = Person;
