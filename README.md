# Vulnerability Assistance Platform

A comprehensive CRUD platform for tracking people in urban vulnerability assistance projects, built with Clean Architecture principles.

## 🎯 Overview

This platform manages:
- **Missionaries**: Project managers who create and manage assistance projects
- **Persons**: Vulnerable individuals receiving assistance
- **Projects**: Urban assistance initiatives with regional focus
- **Checkpoints**: Progress tracking milestones within projects
- **Dynamic Metadata**: Flexible data recording for experiences and events
- **Investors**: Platform users who view project dashboards

## 🏗️ Architecture

Built following **Clean Architecture** principles:

```
src/
├── domain/                 # Business logic and entities
│   ├── entities/          # Core business entities
│   └── repositories/      # Repository interfaces
├── application/           # Use cases and business rules
│   └── use-cases/        # CRUD operations for each entity
├── infrastructure/        # External concerns
│   └── database/         # In-memory repositories for testing
└── interface/            # Controllers and routes
    ├── controllers/      # HTTP request handlers
    └── routes/          # API route definitions
```

## 🚀 Features

### Core Entities
- **Users** (Missionaries & Investors)
- **Projects** (Regional assistance programs)
- **Persons** (Vulnerable individuals)
- **Dynamic Metadata** (Flexible event tracking)
- **Checkpoints** (Progress milestones)
- **Checkpoint Progress** (Individual progress tracking)

### CRUD Operations
Complete Create, Read, Update, Delete operations for all entities with:
- Input validation
- Business rule enforcement
- Error handling
- Filtering and search capabilities

## 📋 API Endpoints

### Users
- `POST /api/users` - Create user
- `GET /api/users` - List users (filters: tipo_usuario, status)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - List projects (filters: missionary_id, regiao)
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Persons
- `POST /api/persons` - Create person
- `GET /api/persons` - List persons (filters: origem, nome, minIdade, maxIdade)
- `GET /api/persons/:id` - Get person by ID
- `PUT /api/persons/:id` - Update person
- `DELETE /api/persons/:id` - Delete person

### Dynamic Metadata
- `POST /api/dynamic-metadata` - Create metadata
- `GET /api/dynamic-metadata` - List metadata (filters: person_id, tipo_metadado, categoria)
- `GET /api/dynamic-metadata/:id` - Get metadata by ID
- `PUT /api/dynamic-metadata/:id` - Update metadata
- `DELETE /api/dynamic-metadata/:id` - Delete metadata

### Checkpoints
- `POST /api/checkpoints` - Create checkpoint
- `GET /api/checkpoints` - List checkpoints (filters: project_id, nome)
- `GET /api/checkpoints/:id` - Get checkpoint by ID
- `PUT /api/checkpoints/:id` - Update checkpoint
- `DELETE /api/checkpoints/:id` - Delete checkpoint

### Checkpoint Progress
- `POST /api/checkpoint-progress` - Create progress
- `GET /api/checkpoint-progress` - List progress (filters: person_id, checkpoint_id, status)
- `GET /api/checkpoint-progress/:id` - Get progress by ID
- `PUT /api/checkpoint-progress/:id` - Update progress
- `DELETE /api/checkpoint-progress/:id` - Delete progress

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)

### 1. Install dependencies
```bash
npm install
```

### 2. Database Setup

#### Option A: Local PostgreSQL
1. Install PostgreSQL locally
2. Create a database:
   ```sql
   CREATE DATABASE vulnerability_platform;
   ```

#### Option B: Docker PostgreSQL
```bash
docker run --name postgres-vulnerability \
  -e POSTGRES_DB=vulnerability_platform \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15
```

### 3. Environment Configuration
1. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your database connection:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/vulnerability_platform?schema=public"
   PORT=3002
   JWT_SECRET="your-secure-jwt-secret"
   ```

### 4. Database Migration & Seeding
```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed with sample data
npm run db:seed
```

### 5. Start the server
```bash
npm start
# or for development with auto-reload
npm run dev
```

### 6. Verify installation
```bash
curl http://localhost:3002/health
```

## 📊 Usage Examples

### Create a Missionary User
```bash
curl -X POST http://localhost:3002/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@example.com",
    "senha": "securepassword",
    "tipo_usuario": "missionario"
  }'
```

### Create a Project
```bash
curl -X POST http://localhost:3002/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Projeto Vila Nova",
    "descricao": "Assistência a famílias em vulnerabilidade",
    "regiao": "Vila Nova",
    "missionary_owner_id": "USER_ID_HERE"
  }'
```

### Register a Person
```bash
curl -X POST http://localhost:3002/api/persons \
  -H "Content-Type: application/json" \
  -d '{
    "id_interno": "P001",
    "nome": "Maria Santos",
    "idade": 35,
    "genero": "feminino",
    "endereco": "Rua das Flores, 123",
    "contato": {"telefone": "11999999999"},
    "origem": "Vila Nova"
  }'
```

### Add Dynamic Metadata
```bash
curl -X POST http://localhost:3002/api/dynamic-metadata \
  -H "Content-Type: application/json" \
  -d '{
    "person_id": "PERSON_ID_HERE",
    "tipo_metadado": "experiencia",
    "categoria": "social",
    "descricao": "Primeira consulta realizada com sucesso"
  }'
```

## 🔒 Security Features

- **Helmet.js** for security headers
- **Rate limiting** (100 requests per 15 minutes)
- **CORS** enabled
- **Password hashing** with bcryptjs
- **Input validation** at entity level

## 🧪 Testing

The platform uses in-memory repositories for testing and development. All CRUD operations are fully functional and tested.

## 🏃‍♂️ Development

### Project Structure
- **Domain Layer**: Pure business logic, no external dependencies
- **Application Layer**: Use cases orchestrating business operations
- **Infrastructure Layer**: External concerns (databases, APIs)
- **Interface Layer**: HTTP controllers and routing

### Key Design Patterns
- **Repository Pattern**: Abstracted data access
- **Dependency Injection**: Loose coupling between layers
- **Clean Architecture**: Separation of concerns
- **SOLID Principles**: Maintainable and extensible code

## 📈 Future Enhancements

- MongoDB integration for production
- JWT authentication system
- Real-time dashboard for investors
- File upload for person documents
- Advanced reporting and analytics
- Mobile app integration

## 🤝 Contributing

This platform follows Clean Architecture principles. When adding new features:

1. Start with domain entities
2. Define repository interfaces
3. Implement use cases
4. Create controllers
5. Set up routes
6. Add tests

## 📄 License

MIT License - see LICENSE file for details.
# teknon
