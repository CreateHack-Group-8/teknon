class User {
  constructor({
    user_id,
    nome,
    email,
    password_hash,
    data_criacao,
    data_atualizacao
  }) {
    this.user_id = user_id;
    this.nome = nome;
    this.email = email;
    this.password_hash = password_hash;
    this.data_criacao = data_criacao;
    this.data_atualizacao = data_atualizacao;
  }

  static create({ nome, email, password_hash }) {
    if (!nome || !email || !password_hash) {
      throw new Error('nome, email e password são obrigatórios');
    }
    
    return new User({
      nome,
      email,
      password_hash
    });
  }

  update({ nome, email, password_hash }) {
    if (nome) this.nome = nome;
    if (email) this.email = email;
    if (password_hash) this.password_hash = password_hash;
    this.data_atualizacao = new Date();
  }
}

module.exports = User;
