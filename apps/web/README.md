# PR80 Web App - Clean Architecture

A React application built with **Clean Architecture** principles, providing clear separation of concerns and maintainable code structure.

## 🏗️ Architecture Overview

This web application follows **Clean Architecture** with **Domain-Driven Design** concepts, adapted specifically for frontend development. The architecture consists of 4 distinct layers:

```
src/
├── domain/                    # 🏛️ Business Logic (Models & Domain Services)
├── application/              # 🎯 Use Cases & Application Logic
├── presentation/             # 🌐 UI Components & React Logic
├── infrastructure/           # ⚙️ External Services & Store Implementations
└── shared/                   # 🔧 Shared Utilities & UI Components
```

### 🔄 Dependency Flow

```
Presentation → Application → Domain
     ↓              ↓
Infrastructure → Application
```

**Key Rules:**

- Inner layers NEVER depend on outer layers
- **Domain** has no external dependencies (pure business logic)
- **Application** defines interfaces; **Infrastructure** implements them
- **Presentation** only imports from **Application** and **Shared**

## 📁 Detailed Structure Guide

### 🏛️ Domain Layer (`/domain`)

**Pure business logic with zero external dependencies**

```
domain/
├── models/                   # Data models with business logic
│   ├── User.ts              # User entity with validation & methods
│   ├── Order.ts             # Order entity with business rules
│   ├── Product.ts           # Product entity with calculations
│   └── Payment.ts           # Payment entity with validation
├── services/                # Cross-model business logic
│   ├── OrderCalculationService.ts
│   ├── PricingService.ts
│   └── ValidationService.ts
└── types/                   # Domain types and enums
    ├── OrderStatus.ts
    ├── PaymentMethod.ts
    └── UserRole.ts
```

**What belongs here:**

- **Models**: Business entities with validation and business rules
- **Domain Services**: Complex business logic spanning multiple models
- **Business Rules**: Core validation and calculations
- **Domain Types**: Enums and types specific to business logic

**Key characteristics:**

- No imports from outer layers
- No framework dependencies (React, API calls, etc.)
- Pure TypeScript/JavaScript business logic
- Contains core business rules and validation

### 🎯 Application Layer (`/application`)

**Orchestrates business workflows and defines external contracts**

```
application/
├── interfaces/              # Contracts for external dependencies
│   ├── stores/             # Store contracts
│   │   ├── IOrderStore.ts
│   │   ├── IUserStore.ts
│   │   └── IProductStore.ts
│   ├── repositories/       # Repository contracts
│   │   ├── IOrderRepository.ts
│   │   ├── IUserRepository.ts
│   │   └── IProductRepository.ts
│   └── services/           # External service contracts
│       ├── IApiClient.ts
│       ├── INotificationService.ts
│       └── IStorageService.ts
└── use-cases/              # Business workflows
    ├── auth/
    │   ├── loginUser.ts
    │   ├── registerUser.ts
    │   └── updateProfile.ts
    ├── orders/
    │   ├── createOrder.ts
    │   ├── updateOrder.ts
    │   └── cancelOrder.ts
    └── products/
        ├── searchProducts.ts
        └── getProductDetails.ts
```

**What belongs here:**

- **Interfaces**: All contracts for repositories and external services
- **Use Cases**: Application-specific business workflows
- **Business Workflows**: User stories and application operations
- **Dependency Contracts**: What the application needs from external world

**Key characteristics:**

- Defines what the application needs from external systems
- Orchestrates domain models and services
- Contains application-specific business rules
- Depends only on domain layer
- Use cases receive dependencies via dependency injection

### 🌐 Presentation Layer (`/presentation`)

**React components and UI logic**

```
presentation/
├── hooks/                  # Connect use cases to components
│   ├── useAuth.ts         # Authentication logic & state
│   ├── useOrders.ts       # Order management logic
│   ├── useProducts.ts     # Product listing & search logic
│   └── useFormValidation.ts # Form handling utilities
├── components/            # Feature-specific components
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── UserProfile.tsx
│   ├── orders/
│   │   ├── OrderList.tsx
│   │   ├── OrderForm.tsx
│   │   └── OrderSummary.tsx
│   └── products/
│       ├── ProductList.tsx
│       ├── ProductCard.tsx
│       └── ProductDetail.tsx
├── pages/                 # Top-level page components
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── OrdersPage.tsx
│   └── ProductsPage.tsx
├── layouts/               # Layout components
│   ├── MainLayout.tsx
│   └── AuthLayout.tsx
└── providers/             # React context providers
    ├── AuthProvider.tsx
    ├── ThemeProvider.tsx
    └── NotificationProvider.tsx
```

**What belongs here:**

- **Hooks**: Connect use cases to React components
- **Components**: Feature-specific React components
- **Pages**: Top-level page components that compose features
- **UI Logic**: Form handling, data formatting, event handling
- **React Providers**: Context providers for cross-cutting concerns

**Key characteristics:**

- Handles React-specific concerns (state, effects, rendering)
- Formats data for display and handles user interactions
- Calls use cases through dependency injection
- No direct business logic - delegates to application layer

### ⚙️ Infrastructure Layer (`/infrastructure`)

**External system implementations and concrete services**

```
infrastructure/
├── stores/                # State management implementations
│   ├── OrderStore.ts     # Order state management (Zustand/Redux)
│   ├── UserStore.ts      # User state management
│   └── ProductStore.ts   # Product state management
├── repositories/          # API repository implementations
│   ├── OrderRepository.ts # Order API calls
│   ├── UserRepository.ts  # User API calls
│   └── ProductRepository.ts # Product API calls
├── api/                  # API client implementations
│   ├── apiClient.ts      # HTTP client configuration
│   ├── auth-api.ts       # Authentication endpoints
│   ├── orders-api.ts     # Order endpoints
│   └── products-api.ts   # Product endpoints
├── services/             # External service implementations
│   ├── NotificationService.ts # Toast notifications
│   ├── StorageService.ts     # Local/session storage
│   └── AnalyticsService.ts   # Analytics tracking
└── config/               # Configuration
    ├── api-config.ts     # API configuration
    └── app-config.ts     # App-wide configuration
```

**What belongs here:**

- **Store Implementations**: Concrete state management (Zustand, Redux, etc.)
- **Repository Implementations**: Actual API communication
- **External Services**: Third-party integrations
- **Configuration**: App configuration and setup

**Key characteristics:**

- Implements interfaces defined in application layer
- Contains all external system integrations
- Framework-specific code (HTTP clients, state libraries)
- Most likely to change when switching technologies

### 🔧 Shared Layer (`/shared`)

**Reusable utilities and UI components**

```
shared/
├── ui/                   # Reusable UI components (Design System)
│   ├── Button/
│   ├── Input/
│   ├── Table/
│   └── Modal/
├── utils/                # Pure utility functions
│   ├── validation.ts
│   ├── formatting.ts
│   └── helpers.ts
├── types/                # Shared TypeScript types
├── constants/            # Application constants
└── validators/           # Validation schemas (Zod, Yup, etc.)
```

## 🚀 Getting Started

### Setup

Install dependencies:

```bash
pnpm install
```

### Development

Start the dev server:

```bash
pnpm dev
```

### Build

Build for production:

```bash
pnpm build
```

Preview production build:

```bash
pnpm preview
```

## 🛠️ Development Guide

### Adding a New Feature

Follow this step-by-step workflow to maintain Clean Architecture principles:

#### 1. **Start with Domain Model** 🏛️

Create the core business entity with validation rules and business methods.

```bash
touch src/domain/models/YourEntity.ts
```

```typescript
// src/domain/models/Product.ts
export class Product {
  constructor(
    public readonly id: string,
    public name: string,
    public price: number,
    public stockQuantity: number = 0,
  ) {
    this.validateProduct();
  }

  public updatePrice(newPrice: number): void {
    if (newPrice < 0) throw new Error('Price cannot be negative');
    this.price = newPrice;
  }

  public isAvailable(quantity: number = 1): boolean {
    return this.stockQuantity >= quantity;
  }

  private validateProduct(): void {
    if (!this.name?.trim()) throw new Error('Product name is required');
    if (this.price < 0) throw new Error('Price cannot be negative');
  }
}
```

#### 2. **Define Application Interfaces** 🎯

Create contracts for external dependencies.

```bash
touch src/application/interfaces/stores/IProductStore.ts
touch src/application/interfaces/repositories/IProductRepository.ts
```

#### 3. **Create Use Case** 🎯

Implement the business workflow with dependency injection.

```bash
touch src/application/use-cases/products/createProduct.ts
```

```typescript
// src/application/use-cases/products/createProduct.ts
interface CreateProductDependencies {
  productStore: IProductStore;
  productRepository: IProductRepository;
  notificationService: INotificationService;
}

export class CreateProductUseCase {
  constructor(private deps: CreateProductDependencies) {}

  async execute(data: CreateProductData): Promise<Product> {
    // Business logic using domain models
    const product = new Product(generateId(), data.name, data.price);

    // Orchestrate external services
    this.deps.productStore.setLoading(true);
    try {
      const savedProduct = await this.deps.productRepository.create(product);
      this.deps.productStore.addProduct(savedProduct);
      this.deps.notificationService.showSuccess('Product created!');
      return savedProduct;
    } finally {
      this.deps.productStore.setLoading(false);
    }
  }
}
```

#### 4. **Create React Hook** 🌐

Connect the use case to React components.

```bash
touch src/presentation/hooks/useProducts.ts
```

```typescript
// src/presentation/hooks/useProducts.ts
export const useProducts = () => {
  const { createProductUseCase, productStore } = useContainer();

  const createProduct = useCallback(
    async (data: ProductFormData) => {
      // Handle UI concerns: validation, formatting, error handling
      const errors = validateProductForm(data);
      if (errors.length > 0) return { errors };

      const product = await createProductUseCase.execute(data);
      return { product };
    },
    [createProductUseCase],
  );

  return {
    products: productStore.getProducts(),
    loading: productStore.isLoading(),
    createProduct,
  };
};
```

#### 5. **Create React Component** 🌐

Build the UI component that uses the hook.

```bash
touch src/presentation/components/products/ProductForm.tsx
```

#### 6. **Implement Infrastructure** ⚙️

Create concrete implementations for stores and repositories.

```bash
touch src/infrastructure/stores/ProductStore.ts
touch src/infrastructure/repositories/ProductRepository.ts
```

#### 7. **Wire Dependencies** 🔧

Add dependencies to the DI container.

```typescript
// app/container.ts
export const container = {
  // ... existing dependencies
  createProductUseCase: new CreateProductUseCase({
    productStore,
    productRepository,
    notificationService,
  }),
};
```

## 🧪 Testing Strategy

### Testing Each Layer

- **Domain Models**: Test business rules and validation in isolation
- **Use Cases**: Test with mocked dependencies (stores/repositories/services)
- **Hooks**: Test UI logic with mocked use cases
- **Components**: Test rendering and user interactions
- **Infrastructure**: Integration tests with real external systems

### Test Structure

```bash
src/
├── domain/models/__tests__/
├── application/use-cases/__tests__/
├── presentation/hooks/__tests__/
├── presentation/components/__tests__/
└── infrastructure/__tests__/
```

## 🎯 Best Practices

### ✅ DO

- Keep domain models pure (no external dependencies)
- Inject dependencies through interfaces
- Use dependency injection for loose coupling
- Put business logic in appropriate layers
- Write tests for each layer independently
- Use TypeScript for better type safety

### ❌ DON'T

- Import infrastructure in domain/application layers
- Put business logic in React components or hooks
- Create "God" classes with too many responsibilities
- Skip dependency injection in use cases
- Tightly couple layers

## 🎨 Code Style & Conventions

- **File Naming**: Use PascalCase for components, camelCase for utilities
- **Directory Structure**: Keep flat structure within each layer
- **Import Order**: Domain → Application → Infrastructure → Shared
- **Component Size**: Keep components small and focused
- **Hook Responsibility**: Handle only UI concerns in hooks

## 🔧 Technology Stack

- **Frontend Framework**: React 18
- **Build Tool**: Rsbuild
- **Styling**: Tailwind CSS
- **State Management**: Zustand (in Infrastructure layer)
- **HTTP Client**: Fetch API / Axios
- **Type Safety**: TypeScript
- **Testing**: Jest + React Testing Library

## 📚 Architecture Benefits

1. **Enhanced Maintainability**: Easy to locate and fix issues in specific layers
2. **Increased Modularity**: Reusable code and easier feature development
3. **Enhanced Readability**: Clear separation makes code easier to understand
4. **Improved Scalability**: Easy to add features without affecting other parts
5. **Better Testability**: Each layer can be tested independently
6. **Technology Flexibility**: Easy to swap implementations (store, API client, etc.)

## 🤝 Contributing

When contributing to this project:

1. Follow the clean architecture principles
2. Ensure proper layer separation
3. Write tests for new features
4. Update documentation as needed
5. Use dependency injection for external dependencies

## 📖 Further Reading

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Modularizing React Applications](https://martinfowler.com/articles/modularizing-react-apps.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
