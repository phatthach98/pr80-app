# Theming Guide

This guide explains how to use and customize themes in the PR80 UI library.

## Basic Usage

To use the default theme, simply import the UI library's components and global styles:

```jsx
// Import the UI library's styles (includes default theme)
import '@pr80-app/ui/style';
// OR use the longer form
// import '@pr80-app/ui/src/style/global.scss';

// Import components
import { Button, ThemeProvider } from '@pr80-app/ui';

function App() {
  return (
    <ThemeProvider>
      <Button variant="primary">Click me</Button>
    </ThemeProvider>
  );
}
```

## Customizing Themes

### Option 1: Override with a custom CSS file

Create a custom theme CSS file that overrides the default CSS variables:

```css
/* my-custom-theme.css */
:root {
  /* Override light theme variables */
  --color-primary-500: #ff0000; /* Red */
  --color-primary-600: #cc0000;
  --color-primary-700: #990000;
}

[data-theme="dark"] {
  /* Override dark theme variables */
  --color-primary-500: #ff3333;
  --color-primary-600: #ff6666;
  --color-primary-700: #ff9999;
}
```

Then import this file after the UI library styles:

```jsx
// Import the UI library's styles first
import '@pr80-app/ui/style';
// Then import your custom theme
import './my-custom-theme.css';

// Rest of your application
```

### Option 2: Extend with CSS-in-JS

You can also create dynamic themes using CSS-in-JS libraries:

```jsx
import { createGlobalStyle } from 'styled-components';
import { ThemeProvider } from '@pr80-app/ui';

const CustomThemeStyles = createGlobalStyle`
  :root {
    --color-primary-500: #8a2be2;
  }
  
  [data-theme="dark"] {
    --color-primary-500: #9370db;
  }
`;

function App() {
  return (
    <>
      <CustomThemeStyles />
      <ThemeProvider>
        {/* Your app */}
      </ThemeProvider>
    </>
  );
}
```

## Available Theme Variables

For a complete list of theme variables that you can override, see:
- [Base Theme CSS](/src/theme/theme.css)
- [Design Tokens](/src/tokens/)

## Multiple Themes

The library supports three built-in themes:
- `light` (default)
- `dark` 
- `brand`

You can switch between them using the `ThemeProvider`:

```jsx
const { theme, setTheme } = useTheme();

// Switch to dark theme
<button onClick={() => setTheme('dark')}>Dark Theme</button>
```

You can also create additional themes by adding new selectors to your custom theme CSS:

```css
[data-theme="custom-theme-name"] {
  /* Custom theme variables */
}
```
