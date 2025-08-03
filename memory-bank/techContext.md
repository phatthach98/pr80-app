# Technical Context

## Entity Model

### Core Entities
- **User**: Has a role with permissions; represents chefs, waiters, and managers
- **Role**: Contains a list of permissions
- **Permission**: Defines allowed actions

### Order Flow Entities
- **Dish**: 
  - Represents a menu item that can be ordered
  - Contains name, description, base price, category, image, etc.
  - Has a list of associated DishOptions
  - May have status (available/unavailable)

- **DishOption**: 
  - Represents a customization category for a dish (e.g., "Size", "Toppings", "Cooking Preference")
  - Associated with a specific dish
  - Contains a list of SelectOptions
  - May be required or optional for a dish

- **SelectOption**:
  - Represents a specific choice within a DishOption (e.g., "Small", "Medium", "Large" for Size)
  - May have additional price implications (e.g., extra cost for Large size)
  - May have a description or image

- **Order**: 
  - Contains metadata (order time, table number, status)
  - Created by a waiter (User entity)
  - Has a status workflow (new → in-preparation → ready → delivered → completed)
  - Can be observed by chefs in real-time
  - Contains multiple OrderItems

- **OrderItem**: 
  - Links an Order to a specific Dish
  - Contains quantity and calculated price
  - Stores selected DishOptions for this specific dish in the order
  - May include special instructions or notes

## Project Structure

### Backend (API) Structure
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

### Frontend (Web) Structure
```
src/
├── domain/                    # 🏛️ Business Logic (Models & Domain Services)
├── application/              # 🎯 Use Cases & Application Logic  
├── presentation/             # 🌐 UI Components & React Logic
├── infrastructure/           # ⚙️ External Services & Store Implementations
└── shared/                   # 🔧 Shared Utilities & UI Components
```

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (inferred from schema usage)
- **Authentication**: JWT (JSON Web Tokens)
- **API Style**: RESTful
- **Real-time**: WebSocket or Socket.io (for order notifications)

### Frontend
- **Framework**: React
- **Language**: TypeScript
- **Styling**: CSS with custom themes
- **Build Tool**: RSBuild
- **Real-time Client**: WebSocket or Socket.io client

### Development Environment
- **Package Manager**: pnpm with workspace support
- **Containerization**: Docker and docker-compose
- **Project Structure**: Monorepo with apps and packages

## Project Structure
```
pr80-app/
  - apps/
    - api/        # Backend Express API
    - web/        # Frontend React application
  - packages/     # Shared packages/libraries
  - docker/       # Docker configuration
```

## Dependencies

### Backend Dependencies (inferred)
- Express for HTTP server
- MongoDB for database
- TypeDI or similar for dependency injection
- JWT for authentication
- WebSocket/Socket.io for real-time communication
- Validation libraries (likely Joi or similar)

### Frontend Dependencies (inferred)
- React for UI
- WebSocket/Socket.io client for real-time updates
- CSS utilities
- Component libraries
- Role-based view management

## Development Setup
- Docker Compose for local development environment
- TypeScript configuration for both frontend and backend
- pnpm workspaces for monorepo management

## Technical Constraints
- Type safety with TypeScript
- Clean architecture with separation of concerns
- Dependency injection for testability
- Error handling standardization
- Authentication and authorization requirements
- Real-time communication requirements
- Role-specific user interfaces

## Testing Strategy

### Backend Testing
- **Domain Entities**: Test business rules and validation in isolation
- **Use Cases**: Test with mocked dependencies (repositories/services)
- **Controllers**: Test HTTP request/response handling
- **Infrastructure**: Integration tests with real databases/services

### Frontend Testing
- **Domain Models**: Test business rules and validation in isolation
- **Use Cases**: Test with mocked dependencies (stores/repositories/services)
- **Hooks**: Test UI logic with mocked use cases
- **Components**: Test rendering and user interactions
- **Infrastructure**: Integration tests with real external systems

## Development Workflow

### Adding New Features in Backend
1. **Start with Domain Entity**
   - Create the core business entity with validation rules
   - Add business methods that define entity behavior
   - Keep it pure with no external dependencies
   
2. **Define Application Interfaces**
   - Create repository interface defining data access contract
   - Add any external service interfaces needed
   - Put all interfaces in `application/interface/`

3. **Create Use Case**
   - Implement the business workflow
   - Define simple input/output interfaces
   - Orchestrate domain entities and external services

4. **Create DTOs**
   - Create HTTP-specific request/response DTOs
   - Handle API formatting, validation, and metadata

5. **Create Controller**
   - Handle HTTP request/response
   - Convert DTOs to use case interfaces
   - Format API responses

6. **Implement Infrastructure**
   - Implement repository interfaces with actual database code
   - Implement service interfaces with external API integrations

7. **Wire Dependencies**
   - Set up dependency injection
   - Connect all layers through interfaces
   - Add API routes

### Adding New Features in Frontend
1. **Start with Domain Model**
   - Create the core business entity with validation rules
   - Add business methods that define entity behavior

2. **Define Application Interfaces**
   - Create contracts for external dependencies
   - Define store/repository interfaces

3. **Create Use Case**
   - Implement the business workflow with dependency injection
   - Orchestrate domain models and external services

4. **Create React Hook**
   - Connect the use case to React components
   - Handle UI concerns (validation, formatting, error handling)

5. **Create React Component**
   - Build the UI component that uses the hook
   - Handle presentation and user interaction

6. **Implement Infrastructure**
   - Create concrete implementations for stores and repositories
   - Implement external service interactions

7. **Wire Dependencies**
   - Add dependencies to the DI container