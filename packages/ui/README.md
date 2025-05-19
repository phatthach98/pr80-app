# PR80 UI Library

A themeable UI library built with Tailwind CSS and design tokens.

## Features

- Design token-based architecture
- Themeable components (light/dark/custom themes)
- Built on top of Tailwind CSS
- Fully typed with TypeScript
- Storybook documentation

## Setup

Install the dependencies:

```bash
pnpm install
```

## Development

Build the library:

```bash
pnpm build
```

Build the library in watch mode:

```bash
pnpm dev
```

Start Storybook:

```bash
pnpm storybook
```

## Usage

### Setting up the ThemeProvider

Wrap your application with the `ThemeProvider` to enable theming capabilities:

```tsx
import { ThemeProvider } from '@pr80-app/ui';

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <YourApp />
    </ThemeProvider>
  );
}
```

### Using Components

```tsx
import { Button } from '@pr80-app/ui';

function MyComponent() {
  return (
    <div>
      <Button variant="primary" size="md">Click Me</Button>
      <Button variant="outline" size="sm">Cancel</Button>
    </div>
  );
}
```

### Switching Themes

```tsx
import { useTheme, Button } from '@pr80-app/ui';

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <Button 
        variant="outline" 
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Toggle Theme
      </Button>
    </div>
  );
}
```

## Design Tokens

The library is built on a comprehensive design token system that includes:

- Colors
- Typography
- Spacing
- Borders
- Shadows
- Animation

Tokens are implemented as CSS variables, making them easy to override in your application for complete design customization.

### Custom Theming

You can create a custom theme by overriding the CSS variables:

```css
/* Your custom theme */
[data-theme="custom"] {
  --color-primary-500: #8a2be2;
  --color-primary-600: #7a1dd1;
  --color-primary-700: #6a0bc0;
  
  /* Override other token variables as needed */
}
```

Then use it in your application:

```tsx
<ThemeProvider defaultTheme="custom">
  <App />
</ThemeProvider>
```
