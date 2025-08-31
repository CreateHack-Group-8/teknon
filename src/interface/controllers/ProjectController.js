class ProjectController {
  constructor({
    createProjectUseCase,
    listProjectsUseCase,
    getProjectUseCase,
    updateProjectUseCase,
    deleteProjectUseCase
  }) {
    this.createProjectUseCase = createProjectUseCase;
    this.listProjectsUseCase = listProjectsUseCase;
    this.getProjectUseCase = getProjectUseCase;
    this.updateProjectUseCase = updateProjectUseCase;
    this.deleteProjectUseCase = deleteProjectUseCase;
  }

  async create(req, res) {
    const { nome, descricao, regiao } = req.body;
    if (!nome || !regiao) {
      return res.status(400).json({ success: false, message: 'nome e regiao são obrigatórios' });
    }
    
    const missionary_owner_id = req.user?.sub;
    const result = await this.createProjectUseCase.execute({ 
      nome, 
      descricao, 
      regiao, 
      missionary_owner_id 
    });
    
    const status = result.status || (result.success ? 201 : 500);
    return res.status(status).json(result);
  }

  async list(req, res) {
    const { regiao, missionary_id } = req.query;
    const result = await this.listProjectsUseCase.execute({ regiao, missionary_id });
    
    const status = result.status || (result.success ? 200 : 500);
    return res.status(status).json(result);
  }

  async getById(req, res) {
    const result = await this.getProjectUseCase.execute(req.params.id);
    
    const status = result.status || (result.success ? 200 : 500);
    return res.status(status).json(result);
  }

  async update(req, res) {
    const { nome, descricao, regiao } = req.body;
    const result = await this.updateProjectUseCase.execute(req.params.id, { 
      nome, 
      descricao, 
      regiao 
    });
    
    const status = result.status || (result.success ? 200 : 500);
    return res.status(status).json(result);
  }

  async delete(req, res) {
    const result = await this.deleteProjectUseCase.execute(req.params.id);
    
    const status = result.status || (result.success ? 200 : 500);
    return res.status(status).json(result);
  }
}

module.exports = ProjectController;
