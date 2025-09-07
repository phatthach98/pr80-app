# PR80 Web App - Feature-Based Clean Architecture

A React application built with **Clean Architecture** principles and **Feature-Based Organization**, providing clear separation of concerns and maintainable code structure.

## 🏗️ Architecture Overview

This web application follows **Clean Architecture** with **Feature-Based Organization**, adapted specifically for frontend development. The architecture combines clean architecture layers with feature-based modularity:

```
src/
├── features/                 # 🎯 Feature-Based Organization
│   ├── auth/                # Authentication feature
│   ├── orders/              # Order management feature
│   └── dishes/              # Dish management feature (prepared)
├── domain/                  # 🏛️ Business Logic (Models & Domain Services)
├── components/              # 🔧 Shared UI Components
├── hooks/                   # 🔗 Shared React Hooks
├── utils/                   # 🛠️ Shared Utilities
├── api/                     # 🌐 API Client & Communication
└── routes/                  # 🛣️ Application Routing
```

### 🔄 Dependency Flow

```
Features → Domain → Shared Components/Hooks/Utils
   ↓
Routes → Features
```

**Key Rules:**

- **Features** are self-contained with their own components, hooks, pages and utils
- **Domain** contains pure business logic with zero external dependencies
- **Shared** components, hooks, and utils are reusable across features
- **Routes** import from features to compose pages
- Features can import from domain and shared layers

## 📁 Detailed Structure Guide

### 🎯 Features Layer (`/features`)

**Feature-based organization with self-contained modules**

```
features/
├── auth/                    # Authentication feature
│   ├── components/         # Auth-specific components
│   │   ├── login-form.tsx  # Login form component
│   │   └── auth.layout.tsx # Authentication layout
│   ├── hooks/              # Auth-specific hooks
│   │   └── use-auth.ts     # Authentication logic & state
│   ├── pages/              # Auth pages
│   │   └── login.page.tsx  # Login page component
│   └── index.ts            # Feature exports
├── orders/                  # Order management feature
│   ├── components/         # Order-specific components (ready for expansion)
│   ├── hooks/              # Order-specific hooks
│   │   └── use-order-config.ts # Order configuration hook
│   ├── pages/              # Order pages
│   │   └── orders.page.tsx # Orders listing page
│   └── index.ts            # Feature exports
└── dishes/                  # Dish management feature (prepared)
    ├── components/         # Dish-specific components
    ├── hooks/              # Dish-specific hooks
    ├── pages/              # Dish pages
    └── index.ts            # Feature exports
```

### 🏛️ Domain Layer (`/domain`)

**Pure business logic with zero external dependencies**

```
domain/
├── entity/                  # Business entities
│   ├── user.ts             # User entity with validation & methods
│   └── user-role.ts        # User role entity
└── services/               # Cross-entity business logic
    └── index.ts            # Domain services exports
```

**What belongs here:**

- **Entities**: Business entities with validation and business rules
- **Domain Services**: Complex business logic spanning multiple entities
- **Business Rules**: Core validation and calculations
- **Domain Types**: Enums and types specific to business logic

**Key characteristics:**

- No imports from outer layers
- No framework dependencies (React, API calls, etc.)
- Pure TypeScript/JavaScript business logic
- Contains core business rules and validation

### 🔧 Shared Components (`/components`)

**Reusable UI components across features**

```
components/
├── ui/                     # Base UI component library
│   ├── button.tsx         # Button component
│   ├── input.tsx          # Input component
│   ├── card.tsx           # Card component
│   ├── sidebar.tsx        # Sidebar component
│   └── ...                # Other UI components
├── app-sidebar.tsx        # Application sidebar
├── nav-main.tsx           # Main navigation
├── nav-user.tsx           # User navigation
├── site-header.tsx        # Site header
└── index.ts               # Component exports
```

### 🔗 Shared Hooks (`/hooks`)

**Reusable React hooks across features**

```
hooks/
├── use-mobile.ts          # Mobile device detection hook
└── index.ts               # Hook exports
```

### 🛠️ Shared Utilities (`/utils`)

**Reusable utility functions across features**

```
utils/
├── auth-local-storage.util.ts  # Authentication storage utilities
├── local-storage.util.ts       # General local storage utilities
└── index.ts                    # Utility exports
```

### 🌐 API Layer (`/api`)

**API client and communication layer**

```
api/
├── api-client.ts          # HTTP client configuration
└── error-message-mapper.ts # Error message mapping
```

### 🛣️ Routes Layer (`/routes`)

**Application routing and navigation**

```
routes/
├── __root.tsx             # Root route component
├── _auth.tsx              # Authenticated routes layout
├── _public.tsx            # Public routes layout
├── _auth/                 # Authenticated route pages
│   ├── orders.index.tsx   # Orders listing route
│   └── orders.$orderId.tsx # Order detail route
├── _public/               # Public route pages
│   └── login.tsx          # Login route
└── index.tsx              # Home route
```

## 🎯 Current Features

### ✅ Implemented Features

- **Authentication Feature** (`/features/auth/`)
  - Login form with phone number and passcode
  - Authentication layout with sidebar and header
  - User authentication state management
  - Protected route handling

- **Orders Feature** (`/features/orders/`)
  - Orders listing page
  - Order configuration hook (ready for expansion)
  - Prepared structure for order management components

### 🚧 Prepared Features

- **Dishes Feature** (`/features/dishes/`)
  - Complete directory structure ready for dish management
  - Prepared for menu management functionality

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

Follow this step-by-step workflow to maintain Feature-Based Clean Architecture principles:

#### 1. **Create Feature Directory** 🎯

Create the feature structure with all necessary subdirectories.

```bash
mkdir -p src/features/your-feature/{components,hooks,pages,services,types}
```

#### 2. **Start with Domain Model** 🏛️

Create the core business entity with validation rules and business methods.

```bash
touch src/domain/entity/YourEntity.ts
```

```typescript
// src/domain/entity/Product.ts
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

#### 3. **Create Feature Hook** 🔗

Create the feature-specific hook that handles business logic.

```bash
touch src/features/your-feature/hooks/use-your-feature.ts
```

```typescript
// src/features/products/hooks/use-products.ts
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const createProduct = useCallback(async (data: ProductFormData) => {
    setLoading(true);
    try {
      // Business logic using domain models
      const product = new Product(generateId(), data.name, data.price);
      
      // API call
      const savedProduct = await apiClient.post('/products', product);
      setProducts(prev => [...prev, savedProduct]);
      
      return { product: savedProduct };
    } catch (error) {
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    loading,
    createProduct,
  };
};
```

#### 4. **Create Feature Components** 🌐

Build the UI components specific to your feature.

```bash
touch src/features/your-feature/components/YourComponent.tsx
```

```typescript
// src/features/products/components/ProductForm.tsx
import { useProducts } from '../hooks/use-products';

export const ProductForm = () => {
  const { createProduct, loading } = useProducts();
  
  const handleSubmit = async (data: ProductFormData) => {
    const result = await createProduct(data);
    if (result.error) {
      // Handle error
    } else {
      // Handle success
    }
  };

  return (
    // Your form JSX
  );
};
```

#### 5. **Create Feature Pages** 📄

Create page components that compose your feature components.

```bash
touch src/features/your-feature/pages/YourPage.tsx
```

#### 6. **Export Feature** 📦

Create feature exports for easy importing.

```typescript
// src/features/your-feature/index.ts
export * from './components';
export * from './hooks';
export * from './pages';
```

#### 7. **Add Routes** 🛣️

Create routes that use your feature pages.

```bash
touch src/routes/_auth/your-feature.tsx
```

```typescript
// src/routes/_auth/products.tsx
import { ProductsPage } from '@/features/products/pages';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/products')({
  component: ProductsPage,
});
```

## 🧪 Testing Strategy

### Testing Each Layer

- **Domain Entities**: Test business rules and validation in isolation
- **Feature Hooks**: Test business logic with mocked dependencies
- **Feature Components**: Test rendering and user interactions
- **Shared Components**: Test reusable UI components
- **API Layer**: Integration tests with mocked API responses

### Test Structure

```bash
src/
├── features/
│   ├── auth/
│   │   ├── hooks/__tests__/
│   │   ├── components/__tests__/
│   │   └── pages/__tests__/
│   └── orders/
│       ├── hooks/__tests__/
│       ├── components/__tests__/
│       └── pages/__tests__/
├── domain/entity/__tests__/
├── components/__tests__/
├── hooks/__tests__/
└── api/__tests__/
```

## 🎯 Best Practices

### ✅ DO

- Keep features self-contained and focused on single responsibility
- Keep domain entities pure (no external dependencies)
- Use feature-specific hooks for business logic
- Import shared components, hooks, and utils across features
- Write tests for each feature independently
- Use TypeScript for better type safety
- Follow consistent naming conventions across features

### ❌ DON'T

- Cross-import between features (use shared layer instead)
- Put business logic directly in React components
- Create "God" components with too many responsibilities
- Mix feature-specific logic in shared components
- Tightly couple features together

## 🎨 Code Style & Conventions

- **File Naming**: Use PascalCase for components, camelCase for utilities
- **Feature Structure**: Keep consistent structure across all features
- **Import Order**: Domain → Features → Shared (Components/Hooks/Utils) → External
- **Component Size**: Keep components small and focused
- **Hook Responsibility**: Handle feature-specific business logic in feature hooks
- **Feature Exports**: Always export through feature index files

## 🔧 Technology Stack

- **Frontend Framework**: React 18
- **Build Tool**: Rsbuild
- **Routing**: TanStack Router
- **Styling**: Tailwind CSS
- **State Management**: TanStack Store (in feature hooks)
- **HTTP Client**: Fetch API / Axios
- **Type Safety**: TypeScript
- **Testing**: Jest + React Testing Library

## 📚 Architecture Benefits

1. **Enhanced Maintainability**: Easy to locate and fix issues within specific features
2. **Increased Modularity**: Self-contained features with clear boundaries
3. **Enhanced Readability**: Feature-based organization makes code easier to understand
4. **Improved Scalability**: Easy to add new features without affecting existing ones
5. **Better Testability**: Each feature can be tested independently
6. **Team Collaboration**: Multiple developers can work on different features simultaneously
7. **Code Reusability**: Shared components, hooks, and utils across features
8. **Technology Flexibility**: Easy to refactor individual features without affecting others

## 🤝 Contributing

When contributing to this project:

1. Follow the feature-based clean architecture principles
2. Keep features self-contained and focused
3. Use shared components, hooks, and utils for reusable code
4. Write tests for new features within their respective feature directories
5. Update documentation as needed
6. Follow consistent naming conventions across features
7. Export all feature functionality through feature index files

## 📖 Further Reading

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Modularizing React Applications](https://martinfowler.com/articles/modularizing-react-apps.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
