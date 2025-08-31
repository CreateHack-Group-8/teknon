class Project {
  constructor({
    project_id,
    nome,
    descricao,
    regiao,
    missionary_owner_id,
    data_criacao,
    data_atualizacao
  }) {
    this.project_id = project_id;
    this.nome = nome;
    this.descricao = descricao;
    this.regiao = regiao;
    this.missionary_owner_id = missionary_owner_id;
    this.data_criacao = data_criacao;
    this.data_atualizacao = data_atualizacao;
  }

  static create({ nome, descricao, regiao, missionary_owner_id }) {
    if (!nome || !regiao) {
      throw new Error('nome e regiao são obrigatórios');
    }
    
    return new Project({
      nome,
      descricao,
      regiao,
      missionary_owner_id
    });
  }

  update({ nome, descricao, regiao }) {
    if (nome) this.nome = nome;
    if (descricao) this.descricao = descricao;
    if (regiao) this.regiao = regiao;
    this.data_atualizacao = new Date();
  }
}

module.exports = Project;
