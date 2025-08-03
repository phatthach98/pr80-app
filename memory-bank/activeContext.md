# Active Context

## Current Focus
The project is currently focused on backend development, specifically implementing APIs and setting up the socket server. Frontend development will be addressed later. The current focus areas are:

- Completing dish option functionality implementation
- Preparing for dish entity development
- Developing order management system
- Setting up socket connections for real-time order updates

## Recent Changes
The following functionality has been completed:
- User authentication (login) without role-based authorization
- APIs for user management
- APIs for role and permission management
- Settings management functionality including selection options
- Basic dish option entity structure (interface, controller, router stubs)

Current work in progress:
- Dish option repository implementation
- Dish option API endpoints
- Preparation for dish entity development
- Planning for order management system

## Active Decisions
- How to structure dish options and their selections
- Integration patterns for the new dish option feature
- API design for dish option management
- Frontend components required for dish option display and management
- How to implement role-specific views for chefs, waiters, and managers
- Real-time communication architecture for order updates between waiters and kitchen
- Order status workflow and state management

## Next Steps

### Immediate Backend Tasks
1. Complete the dish option repository implementation following Clean Architecture principles
   - Implement infrastructure repository for dish options
   - Define proper database schema/model for customization options
   - Support option groups and selection constraints
   - Wire up dependency injection

2. Implement Dish entity that includes dish options
   - Create domain entity with proper validation (name, description, base price, etc.)
   - Define relationship with DishOption entities (one-to-many)
   - Add category and availability status fields
   - Implement repository interface and repository implementation
   - Create use cases (CRUD operations) and controllers
   - Add business methods for calculating final prices with selected options

3. Create OrderItem and Order entities
   - Define Order entity with validation (status, timestamps, table number)
   - Define OrderItem entity with relationships to Dish and selected SelectOptions
   - Implement quantity and price calculation logic based on dish price and selected options
   - Add special instructions field to OrderItem
   - Create order status workflow logic (new → in-preparation → ready → delivered → completed)
   - Implement repository interfaces and implementations
   - Add business methods for order management

4. Implement order management API endpoints
   - Create DTOs for request/response
   - Implement controller methods for order CRUD operations
   - Add status transition endpoints (update order status)
   - Add validation middleware
   - Define routes for order operations
   - Implement filtering (orders by status, user, date range, etc.)

### Near-term Backend Tasks
5. Implement role-based API authorization
   - Create authorization middleware
   - Add permission checks to existing endpoints
   - Update JWT service to include roles and permissions

6. Set up WebSocket/Socket.io server for real-time communication
   - Add necessary dependencies
   - Create service interfaces for socket communication
   - Implement service in infrastructure layer
   - Set up connection handling and events

7. Connect socket events to order operations
   - Emit updates when orders change
   - Handle real-time notifications
   - Set up chef/waiter communication

8. Add comprehensive testing
   - Write unit tests for domain entities
   - Create tests for use cases with mocked dependencies
   - Add integration tests for API endpoints
   - Test socket communication

### Frontend Tasks (After Backend Completion)
9. Create role-specific views for chefs, waiters, and managers
   - Implement domain models and use cases
   - Create React hooks for UI logic
   - Build role-specific components

10. Implement real-time order management interface
    - Create components for order display/management
    - Implement socket client connections
    - Build real-time notification system

## Current Challenges
- Implementing proper role and permission-based authorization for API endpoints
- Setting up and configuring WebSocket server for real-time order updates
- Finalizing dish option entity and repository implementation
- Creating and integrating the dish entity with dish options
- Designing an efficient order management system with real-time capabilities
- Maintaining clean architecture principles across rapidly expanding functionality
- Planning the order workflow from creation to completion
- Ensuring comprehensive test coverage for backend functionality