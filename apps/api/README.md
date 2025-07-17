# PR80 API - Clean Architecture

A Node.js REST API built with **Clean Architecture** principles, providing clear separation of concerns and maintainable code structure.

## 🏗️ Architecture Overview

This API follows **Clean Architecture** with 4 distinct layers:

```
src/
├── domain/                    # 🏛️ Core Business Logic (Innermost)
│   ├── entity/               # Business entities and core rules
│   └── services/             # Domain services (complex cross business logic)
│
├── application/              # 🎯 Application Logic
│   ├── interface/            # ALL interfaces (contracts)
│   │   ├── repository/       # Repository interfaces
│   │   └── service/          # Infrastructure service interfaces
│   └── usecase/              # Use cases (user workflows with input/output interfaces)
│
├── presentation/             # 🌐 External Interface (Controllers)
│   ├── dto/                  # Data Transfer Objects for HTTP/API
│   │   ├── requests/         # API request DTOs
│   │   └── responses/        # API response DTOs
│   └── *.controller.ts       # HTTP controllers and route handlers
│
├── infras/                   # ⚙️ Infrastructure (Outermost)
│   ├── repositories/         # Database implementations
│   ├── services/             # External service implementations
│   └── database/             # Database configuration
│
└── index.ts                  # Application entry point
```

## 🔄 Dependency Flow

```
Presentation → Application → Domain
     ↓              ↓
Infrastructure → Application
```

**Key Rules:**
- Inner layers NEVER depend on outer layers
- Outer layers depend on inner layers through **interfaces**
- All external dependencies injected via **interfaces**

## 📁 Detailed Structure Guide

### 🏛️ Domain Layer (`/domain`)
**Pure business logic with zero external dependencies**

**What belongs here:**
- **Entities**: Core business objects with validation and business rules
- **Domain Services**: Complex business logic that spans multiple entities
- **Value Objects**: Immutable objects representing business concepts

**Key characteristics:**
- No imports from outer layers
- Contains core business rules and validation
- Independent of databases, frameworks, or external services
- Changes least frequently

### 🎯 Application Layer (`/application`)
**Orchestrates business workflows and defines external contracts**

**What belongs here:**
- **Interfaces**: All contracts for repositories and external services
- **Use Cases**: Application-specific business workflows with simple input/output interfaces
- **Business Rules**: Application-specific validation and orchestration logic

**Key characteristics:**
- Defines what the application needs from external world
- Orchestrates domain entities and services
- Contains application-specific business rules
- Depends only on domain layer
- Use cases define their own input/output interfaces internally

### 🌐 Presentation Layer (`/presentation`)
**HTTP controllers handling requests/responses**

**What belongs here:**
- **Controllers**: HTTP request/response handling
- **DTOs**: Data Transfer Objects for HTTP/API formatting
- **Route handlers**: API endpoint definitions
- **Input validation**: Request data validation
- **Response formatting**: API response structure

**Key characteristics:**
- Handles HTTP concerns (status codes, headers, API formatting)
- Converts HTTP requests to use case calls
- Formats responses for API consumers
- DTOs handle API-specific concerns (snake_case, metadata, validation)
- No business logic, only presentation logic

### ⚙️ Infrastructure Layer (`/infras`)
**External system implementations**

**What belongs here:**
- **Repository implementations**: Database access implementations
- **External service implementations**: Third-party service integrations
- **Database configuration**: Connection setup and migrations
- **File storage**: File upload/download implementations

**Key characteristics:**
- Implements interfaces defined in application layer
- Contains all external system integrations
- Framework-specific code (Express, database drivers)
- Most likely to change when switching technologies

## 🚀 Development Guide

### Adding a New Feature

**Follow this step-by-step workflow to maintain Clean Architecture principles:**

#### 1. **Start with Domain Entity** 🏛️
- Create the core business entity with validation rules
- Add business methods that define entity behavior
- Keep it pure with no external dependencies

```bash
touch src/domain/entity/YourEntity.ts
```

#### 2. **Define Application Interfaces** 🎯
- Create repository interface defining data access contract
- Add any external service interfaces needed
- Put all interfaces in `application/interface/`

```bash
touch src/application/interface/repository/YourRepository.ts
touch src/application/interface/service/YourService.ts
```

#### 3. **Create Use Case** 🎯
- Implement the business workflow
- Define simple input/output interfaces within the use case file
- Orchestrate domain entities and external services

```bash
touch src/application/usecase/YourUseCase.ts
```

#### 4. **Create DTOs** 🌐
- Create HTTP-specific request/response DTOs
- Handle API formatting, validation, and metadata
- Keep separate from business logic interfaces

```bash
touch src/presentation/dto/requests/YourApiRequest.ts
touch src/presentation/dto/responses/YourApiResponse.ts
```

#### 5. **Create Controller** 🌐
- Handle HTTP request/response
- Convert DTOs to use case interfaces
- Call appropriate use case
- Format API responses

```bash
touch src/presentation/your.controller.ts
```

#### 6. **Implement Infrastructure** ⚙️
- Implement repository interfaces with actual database code
- Implement service interfaces with external API integrations
- Add database migrations if needed

```bash
touch src/infras/repositories/DatabaseYourRepository.ts
touch src/infras/services/YourExternalService.ts
```

#### 7. **Wire Dependencies** 🔧
- Set up dependency injection in `index.ts`
- Connect all layers through interfaces
- Add API routes

## 🧪 Testing Strategy

### Testing Each Layer
- **Domain Entities**: Test business rules and validation in isolation
- **Use Cases**: Test with mocked dependencies (repositories/services)
- **Controllers**: Test HTTP request/response handling
- **Infrastructure**: Integration tests with real databases/services

### Test Structure
- Unit tests for business logic
- Integration tests for external systems
- End-to-end tests for complete workflows
- Mock external dependencies in unit tests

## 🎯 Best Practices

### ✅ DO
- Keep entities pure (no external dependencies)
- Define interfaces in application layer
- Use dependency injection for loose coupling
- Put business logic in appropriate layer
- Write tests for each layer independently

### ❌ DON'T
- Import infrastructure in domain/application layers
- Put business logic in controllers
- Create "God" classes with too many responsibilities
- Skip input validation in controllers
- Tightly couple layers

## 💡 Key Principles

1. **Dependency Rule**: Inner layers never depend on outer layers
2. **Interface Segregation**: Define contracts in application layer
3. **Single Responsibility**: Each layer has one clear purpose
4. **Testability**: Mock external dependencies for unit tests
5. **Flexibility**: Easy to swap implementations without changing business logic

### **Benefits of This Approach**
- **Simplified Structure**: Fewer files to maintain
- **Clear Separation**: Business contracts vs HTTP contracts
- **Less Boilerplate**: Interfaces live with their use cases
- **Easier Development**: One place for business logic contracts

Remember: **Start simple, follow the dependency rule, and let the architecture emerge naturally as your application grows!** 