interface Env {
  (variable: string, defaultValue?: string): string;
  int(variable: string, defaultValue?: number): number;
  bool(variable: string, defaultValue?: boolean): boolean;
  array(variable: string, defaultValue?: string[]): string[];
}

interface Config {
  env: Env;
}

export default ({ env }: Config) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
