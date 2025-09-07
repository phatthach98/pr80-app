# System Patterns

## Architecture Overview
PR80 follows a clean architecture pattern with clear separation of concerns across both backend and frontend:

```mermaid
flowchart TD
    Domain[Domain Layer] --> Application[Application Layer]
    Application --> Presentation[Presentation Layer]
    Application --> Infrastructure[Infrastructure Layer]
    Infrastructure --> External[External Systems]
    External --> RealTime[Real-time Communication]
```

## Backend Architecture
The API follows a strict clean architecture with 4 distinct layers:

```mermaid
flowchart TB
    subgraph "PR80 API Architecture"
        direction TB
        D[Domain Layer] --> A[Application Layer]
        A --> P[Presentation Layer]
        A --> I[Infrastructure Layer]
        I -.-> A
        P -.-> A
    end
```

1. **Domain Layer** (`/domain`) - Core business entities and logic
   - Contains entity definitions (User, Role, DishOption, Order, etc.)
   - Pure business logic with zero external dependencies
   - Role-based access definitions (Chef, Waiter, Manager)
   - Value objects representing business concepts
   - Changes least frequently

2. **Application Layer** (`/application`) - Application use cases
   - Use case implementations with simple input/output interfaces
   - Interface definitions for repositories and services
   - Error handling definitions
   - Order management operations
   - Orchestrates domain entities and services
   - Defines what the application needs from external world

3. **Infrastructure Layer** (`/infras`) - Technical implementations
   - Database connections and repository implementations
   - Service implementations (JWT, real-time updates, etc.)
   - Dependency injection container
   - External system integrations
   - Framework-specific code (Express, database drivers)
   - Most likely to change when switching technologies

4. **Presentation Layer** (`/presentation`) - API endpoints and controllers
   - Controllers handling HTTP requests and responses
   - Data transfer objects (DTOs) for API formatting
   - Routers defining API paths
   - Middleware for request processing
   - Role-based request authentication
   - Input validation and response formatting

## Frontend Architecture
The web application follows a **Feature-Based Clean Architecture** adapted for frontend development:

```mermaid
flowchart TB
    subgraph "PR80 Web Architecture"
        direction TB
        F[Features Layer] --> D[Domain Layer]
        F --> C[Shared Components]
        F --> H[Shared Hooks]
        F --> U[Shared Utils]
        R[Routes Layer] --> F
        A[API Layer] --> F
    end
```

1. **Features Layer** (`/features`) - Feature-based organization
   - Self-contained feature modules (auth, orders, dishes)
   - Each feature has: components, hooks, pages, services, types
   - Feature-specific business logic and UI components
   - Clean boundaries between different features
   - Easy to develop, test, and maintain independently

2. **Domain Layer** (`/domain`) - Business logic and models
   - Business entities with validation and business rules
   - Domain services for complex cross-entity logic
   - Pure TypeScript/JavaScript with no framework dependencies
   - No imports from outer layers

3. **Shared Components** (`/components`) - Reusable UI components
   - UI component library (design system)
   - Navigation components (sidebar, header, navigation)
   - Layout components used across features
   - Base UI components (buttons, inputs, cards, etc.)

4. **Shared Hooks** (`/hooks`) - Reusable React hooks
   - Cross-feature React hooks
   - Utility hooks (mobile detection, etc.)
   - Hooks that don't belong to specific features

5. **Shared Utils** (`/utils`) - Utility functions
   - Pure utility functions
   - Storage utilities
   - Authentication utilities
   - Helper functions used across features

6. **API Layer** (`/api`) - External communication
   - API client configuration
   - Error handling and mapping
   - HTTP communication layer

7. **Routes Layer** (`/routes`) - Application routing
   - TanStack Router configuration
   - Route definitions and navigation
   - Protected and public route handling

## Design Patterns
- **Repository Pattern** - Data access abstraction
- **Dependency Injection** - Service locator for dependencies
- **DTO Pattern** - Data transfer objects for API communication
- **Middleware Pattern** - Request processing pipeline
- **Observer Pattern** - For real-time updates and notifications
- **Error Handling** - Centralized error management
- **Role-based Access Control** - Permission management by user role

## Key Development Principles

### Core Architecture Principles
1. **Dependency Rule**: Inner layers never depend on outer layers
2. **Interface Segregation**: Define contracts in application layer
3. **Single Responsibility**: Each layer has one clear purpose
4. **Testability**: Mock external dependencies for unit tests
5. **Flexibility**: Easy to swap implementations without changing business logic

### Backend Development Guidelines
- Keep entities pure with no external dependencies
- Define interfaces in application layer
- Put business logic in appropriate layer (not in controllers)
- Use dependency injection for loose coupling
- Avoid creating "God" classes with too many responsibilities
- Never import infrastructure in domain/application layers
- Skip input validation in controllers

### Frontend Development Guidelines
- Keep domain entities pure (no React or external dependencies)
- Organize code by feature, with each feature being self-contained
- Put business logic in feature-specific hooks, not in React components
- Use shared components, hooks, and utils for cross-feature functionality
- Keep features independent - avoid cross-feature imports
- Use TypeScript for better type safety
- Import order: Domain → Features → Shared (Components/Hooks/Utils) → External
- Export all feature functionality through feature index files

## Domain Entity Relationships
```mermaid
flowchart LR
    subgraph User Management
        User --> Role
        Role --> Permission["Permission (list)"]
    end
    
    subgraph Menu Management
        Dish --> |contains| DishOption["DishOption (list)"]
        DishOption --> |has| SelectOption["SelectOption (list)"]
        Dish --> |has| BasePrice
        Dish --> |has| Category
        SelectOption --> |may have| AdditionalPrice
    end
    
    subgraph Order Management
        Order --> User["Created by User (Waiter)"]
        Order --> |observed by| ChefUser["User (Chef)"]
        Order --> OrderItem["OrderItem (list)"]
        Order --> |has| Status["Order Status"]
        OrderItem --> Dish
        OrderItem --> SelectedOptions["Selected DishOptions"]
        OrderItem --> |has| Quantity
        OrderItem --> |has| CalculatedPrice
        OrderItem --> |may have| SpecialInstructions
    end
```

## Component Relationships
- Controllers use use cases to perform business operations
- Use cases interact with repositories and services
- Repositories implement data access logic
- Infrastructure provides implementations for interfaces
- Real-time services provide chef-waiter communication