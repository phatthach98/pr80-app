export type Token = string;
type Class<T> = new (...args: any[]) => T;
type Registration<T> = {
  useClass: Class<T>;
  dependencies: Token[];
  singleton: boolean;
};

export class DIContainer {
  private registry = new Map<Token, Registration<any>>();
  private instances = new Map<Token, any>();

  public register<T>(
    token: Token,
    useClass: Class<T>,
    dependencies: Token[] = [],
    singleton = true
  ): void {
    if (this.registry.has(token)) {
      console.warn(`Token ${token} is already registered. Overwriting.`);
    }
    this.registry.set(token, { useClass, dependencies, singleton });
  }

  public resolve<T>(token: Token): T {
    const registration = this.registry.get(token);
    if (!registration) {
      throw new Error(`No provider registered for token: ${token}`);
    }

    if (registration.singleton && this.instances.has(token)) {
      return this.instances.get(token) as T;
    }

    const resolvedDependencies = registration.dependencies.map((depToken) =>
      this.resolve(depToken)
    );

    const newInstance = new registration.useClass(...resolvedDependencies);

    if (registration.singleton) {
      this.instances.set(token, newInstance);
    }

    return newInstance;
  }
} 