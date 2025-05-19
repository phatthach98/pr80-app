import "./App.css";
import { Button, ThemeProvider, ThemeSwitcher } from "@pr80-app/ui";
import "./theme/custom-theme.css";

const App = () => {
  return (
    <ThemeProvider defaultTheme="light">
      <div className="content">
        <h1>Rsbuild with React</h1>
        <p>Start building amazing things with Rsbuild.</p>

        <div className="flex flex-col items-start gap-4">
          <ThemeSwitcher />

          <div className="flex gap-2">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
