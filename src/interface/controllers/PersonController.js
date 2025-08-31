class PersonController {
  constructor({
    createPersonUseCase,
    listPersonsUseCase,
    getPersonUseCase,
    updatePersonUseCase,
    deletePersonUseCase
  }) {
    this.createPersonUseCase = createPersonUseCase;
    this.listPersonsUseCase = listPersonsUseCase;
    this.getPersonUseCase = getPersonUseCase;
    this.updatePersonUseCase = updatePersonUseCase;
    this.deletePersonUseCase = deletePersonUseCase;
  }

  async create(req, res) {
    const { nome, data_nascimento, genero, endereco, contato, dados_sensivel, origem } = req.body;
    if (!nome) {
      return res.status(400).json({ success: false, message: 'id_interno e nome são obrigatórios' });
    }
    
    const result = await this.createPersonUseCase.execute({ 
      nome, 
      data_nascimento, 
      genero, 
      endereco, 
      contato, 
      dados_sensivel, 
      origem 
    });
    
    const status = result.status || (result.success ? 201 : 500);
    return res.status(status).json(result);
  }

  async list(req, res) {
    const { nome, genero } = req.query;
    const result = await this.listPersonsUseCase.execute({ nome, genero });
    
    const status = result.status || (result.success ? 200 : 500);
    return res.status(status).json(result);
  }

  async getById(req, res) {
    const result = await this.getPersonUseCase.execute(req.params.id);
    
    const status = result.status || (result.success ? 200 : 500);
    return res.status(status).json(result);
  }

  async update(req, res) {
    const { id_interno, nome, data_nascimento, genero, endereco, contato, dados_sensivel, origem } = req.body;
    const data = {};
    if (id_interno) data.id_interno = id_interno;
    if (nome) data.nome = nome;
    if (data_nascimento) data.data_nascimento = data_nascimento;
    if (genero) data.genero = genero;
    if (endereco) data.endereco = endereco;
    if (contato) data.contato = contato;
    if (dados_sensivel) data.dados_sensivel = dados_sensivel;
    if (origem) data.origem = origem;
    
    const result = await this.updatePersonUseCase.execute(req.params.id, data);
    
    const status = result.status || (result.success ? 200 : 500);
    return res.status(status).json(result);
  }

  async delete(req, res) {
    const result = await this.deletePersonUseCase.execute(req.params.id);
    
    const status = result.status || (result.success ? 200 : 500);
    return res.status(status).json(result);
  }
}

module.exports = PersonController;
