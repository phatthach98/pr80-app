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

### Frontend (Web) Structure - Feature-Based Architecture
```
src/
├── features/                 # 🎯 Feature-Based Organization
│   ├── auth/                # Authentication feature
│   │   ├── components/      # Auth-specific components (login-form, auth.layout)
│   │   ├── hooks/           # Auth-specific hooks (use-auth)
│   │   ├── pages/           # Auth pages (login.page)
│   │   └── index.ts         # Feature exports
│   ├── orders/              # Order management feature
│   │   ├── components/      # Order-specific components (ready for expansion)
│   │   ├── hooks/           # Order-specific hooks (use-order-config)
│   │   ├── pages/           # Order pages (orders.page)
│   │   └── index.ts         # Feature exports
│   └── dishes/              # Dish management feature (prepared structure)
│       ├── components/      # Dish-specific components
│       ├── hooks/           # Dish-specific hooks
│       ├── pages/           # Dish pages
│       └── index.ts         # Feature exports
├── domain/                  # 🏛️ Business Logic (Models & Domain Services)
│   ├── entity/              # Business entities (user, user-role)
│   └── services/            # Domain services
├── components/              # 🔧 Shared UI Components
│   ├── ui/                  # Base UI component library (button, input, card, etc.)
│   ├── app-sidebar.tsx      # Application sidebar
│   ├── nav-*.tsx            # Navigation components
│   └── site-header.tsx      # Site header
├── hooks/                   # 🔗 Shared React Hooks (use-mobile)
├── utils/                   # 🛠️ Shared Utilities (auth-local-storage, etc.)
├── api/                     # 🌐 API Client & Communication
├── routes/                  # 🛣️ Application Routing (TanStack Router)
└── tailwind/                # 🎨 Styling Configuration
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
- **Framework**: React 18
- **Language**: TypeScript
- **Routing**: TanStack Router
- **Styling**: Tailwind CSS
- **Build Tool**: Rsbuild
- **State Management**: TanStack Store (in feature hooks)
- **Real-time Client**: WebSocket or Socket.io client (planned)
- **Architecture**: Feature-Based Clean Architecture

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

### Frontend Dependencies
- **React 18** for UI framework
- **TanStack Router** for routing and navigation
- **TanStack Store** for state management
- **Tailwind CSS** for styling and design system
- **Rsbuild** for build tooling and development server
- **TypeScript** for type safety
- **WebSocket/Socket.io client** for real-time updates (planned)
- **Lucide React** for icons
- **React Hook Form** for form handling
- **Shared Contracts** package for type definitions

## Development Setup
- Docker Compose for local development environment
- TypeScript configuration for both frontend and backend
- pnpm workspaces for monorepo management

## Technical Constraints
- Type safety with TypeScript
- Feature-based clean architecture with separation of concerns
- Feature independence and self-containment
- Error handling standardization
- Authentication and authorization requirements
- Real-time communication requirements
- Role-specific user interfaces
- Consistent feature structure across the application

## Current Implementation Status

### ✅ Completed Features
- **Authentication Feature** (`/features/auth/`)
  - Login form component with phone number and passcode
  - Authentication layout with sidebar and header integration
  - User authentication state management with TanStack Store
  - Protected route handling and navigation

- **Orders Feature** (`/features/orders/`)
  - Orders listing page component
  - Order configuration hook (ready for expansion)
  - Feature structure prepared for order management components

### 🚧 Prepared Features
- **Dishes Feature** (`/features/dishes/`)
  - Complete directory structure ready for implementation
  - Prepared for menu management functionality

### 🔧 Shared Infrastructure
- **Shared Components**: Navigation, sidebar, header, UI component library
- **Shared Hooks**: Mobile detection and other cross-feature utilities
- **Shared Utils**: Authentication storage, local storage utilities
- **API Layer**: HTTP client and error handling
- **Routes**: TanStack Router with protected and public route handling

## Testing Strategy

### Backend Testing
- **Domain Entities**: Test business rules and validation in isolation
- **Use Cases**: Test with mocked dependencies (repositories/services)
- **Controllers**: Test HTTP request/response handling
- **Infrastructure**: Integration tests with real databases/services

### Frontend Testing
- **Domain Entities**: Test business rules and validation in isolation
- **Feature Hooks**: Test business logic with mocked dependencies
- **Feature Components**: Test rendering and user interactions within features
- **Shared Components**: Test reusable UI components
- **API Layer**: Integration tests with mocked API responses
- **Routes**: Test navigation and route protection

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

### Adding New Features in Frontend (Feature-Based Approach)
1. **Create Feature Directory**
   - Create feature structure: `mkdir -p src/features/your-feature/{components,hooks,pages}`
   - Set up feature index.ts for exports

2. **Start with Domain Model** (if needed)
   - Create the core business entity with validation rules in `/domain/entity/`
   - Add business methods that define entity behavior

3. **Create Feature Hook**
   - Implement feature-specific business logic in `features/your-feature/hooks/`
   - Handle state management, API calls, and business workflows
   - Use domain entities for business rule validation

4. **Create Feature Components**
   - Build UI components specific to your feature in `features/your-feature/components/`
   - Use feature hooks for business logic
   - Import shared components from `/components/` as needed

5. **Create Feature Pages**
   - Create page components in `features/your-feature/pages/`
   - Compose feature components into complete page views

6. **Export Feature**
   - Export all feature functionality through `features/your-feature/index.ts`
   - Follow consistent export patterns

7. **Add Routes**
   - Create route files in `/routes/` that import from your feature
   - Set up navigation and route protection as needed

8. **Update Shared Components** (if needed)
   - Add reusable components to `/components/` if they'll be used across features
   - Add shared hooks to `/hooks/` if they're cross-feature utilities

## Feature-Based Architecture Benefits

### 🎯 Development Benefits
- **Feature Independence**: Each feature is self-contained and can be developed independently
- **Team Collaboration**: Multiple developers can work on different features simultaneously
- **Code Organization**: Easy to locate feature-specific code and logic
- **Scalability**: Easy to add new features without affecting existing ones
- **Maintainability**: Clear boundaries make debugging and maintenance easier

### 🔄 Import Patterns
- **Feature Imports**: `import { LoginForm } from '@/features/auth/components'`
- **Shared Components**: `import { Button } from '@/components/ui'`
- **Shared Hooks**: `import { useMobile } from '@/hooks'`
- **Shared Utils**: `import { authLocalStorageUtil } from '@/utils'`
- **Domain Entities**: `import { User } from '@/domain/entity'`
- **API Layer**: `import { apiClient } from '@/api'`

### 🚫 Anti-Patterns to Avoid
- **Cross-Feature Imports**: Never import directly between features
- **Business Logic in Components**: Keep business logic in feature hooks
- **Shared Logic in Features**: Move reusable logic to shared layers
- **Tight Coupling**: Features should not depend on each other's internal structure