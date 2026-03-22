import { PostgresStore } from '@mastra/pg';

let _pStore: PostgresStore | null = null;

export function getPStore(): PostgresStore {
  if (!_pStore) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set — cannot initialize PostgresStore');
    }
    _pStore = new PostgresStore({
      connectionString: process.env.DATABASE_URL,
    });
  }
  return _pStore;
}

// Keep backward compat — but lazy
export const pStore = new Proxy({} as PostgresStore, {
  get(_, prop) {
    return (getPStore() as any)[prop];
  },
});
