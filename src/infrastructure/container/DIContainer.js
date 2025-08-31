// Repositories
const PrismaProjectRepository = require('../repositories/PrismaProjectRepository');
const PrismaPersonRepository = require('../repositories/PrismaPersonRepository');
const PrismaUserRepository = require('../repositories/PrismaUserRepository');

// Use Cases - Project
const CreateProjectUseCase = require('../../application/use-cases/project/CreateProjectUseCase');
const ListProjectsUseCase = require('../../application/use-cases/project/ListProjectsUseCase');
const GetProjectUseCase = require('../../application/use-cases/project/GetProjectUseCase');
const UpdateProjectUseCase = require('../../application/use-cases/project/UpdateProjectUseCase');
const DeleteProjectUseCase = require('../../application/use-cases/project/DeleteProjectUseCase');

// Use Cases - Person
const CreatePersonUseCase = require('../../application/use-cases/person/CreatePersonUseCase');
const ListPersonsUseCase = require('../../application/use-cases/person/ListPersonsUseCase');
const GetPersonUseCase = require('../../application/use-cases/person/GetPersonUseCase');
const UpdatePersonUseCase = require('../../application/use-cases/person/UpdatePersonUseCase');
const DeletePersonUseCase = require('../../application/use-cases/person/DeletePersonUseCase');

// Controllers
const ProjectController = require('../../interface/controllers/ProjectController');
const PersonController = require('../../interface/controllers/PersonController');

class DIContainer {
  constructor() {
    this.dependencies = {};
    this.setupDependencies();
  }

  setupDependencies() {
    // Repositories
    this.dependencies.projectRepository = new PrismaProjectRepository();
    this.dependencies.personRepository = new PrismaPersonRepository();
    this.dependencies.userRepository = new PrismaUserRepository();

    // Use Cases - Project
    this.dependencies.createProjectUseCase = new CreateProjectUseCase(
      this.dependencies.projectRepository
    );
    this.dependencies.listProjectsUseCase = new ListProjectsUseCase(
      this.dependencies.projectRepository
    );
    this.dependencies.getProjectUseCase = new GetProjectUseCase(
      this.dependencies.projectRepository
    );
    this.dependencies.updateProjectUseCase = new UpdateProjectUseCase(
      this.dependencies.projectRepository
    );
    this.dependencies.deleteProjectUseCase = new DeleteProjectUseCase(
      this.dependencies.projectRepository
    );

    // Use Cases - Person
    this.dependencies.createPersonUseCase = new CreatePersonUseCase(
      this.dependencies.personRepository
    );
    this.dependencies.listPersonsUseCase = new ListPersonsUseCase(
      this.dependencies.personRepository
    );
    this.dependencies.getPersonUseCase = new GetPersonUseCase(
      this.dependencies.personRepository
    );
    this.dependencies.updatePersonUseCase = new UpdatePersonUseCase(
      this.dependencies.personRepository
    );
    this.dependencies.deletePersonUseCase = new DeletePersonUseCase(
      this.dependencies.personRepository
    );

    // Controllers
    this.dependencies.projectController = new ProjectController({
      createProjectUseCase: this.dependencies.createProjectUseCase,
      listProjectsUseCase: this.dependencies.listProjectsUseCase,
      getProjectUseCase: this.dependencies.getProjectUseCase,
      updateProjectUseCase: this.dependencies.updateProjectUseCase,
      deleteProjectUseCase: this.dependencies.deleteProjectUseCase
    });

    this.dependencies.personController = new PersonController({
      createPersonUseCase: this.dependencies.createPersonUseCase,
      listPersonsUseCase: this.dependencies.listPersonsUseCase,
      getPersonUseCase: this.dependencies.getPersonUseCase,
      updatePersonUseCase: this.dependencies.updatePersonUseCase,
      deletePersonUseCase: this.dependencies.deletePersonUseCase
    });
  }

  get(name) {
    if (!this.dependencies[name]) {
      throw new Error(`Dependency '${name}' not found`);
    }
    return this.dependencies[name];
  }
}

module.exports = new DIContainer();
