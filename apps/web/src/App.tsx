import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { AuthContext, AuthProvider, useAuth } from './providers';

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  context: {
    auth: undefined! as AuthContext,
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }

  interface RouterContext {
    auth: AuthContext;
  }
}

const AppRouter = () => {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />;
};

const App = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};

export default App;
