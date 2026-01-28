import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.bench.{ts,tsx}'],
    benchmark: {
      include: ['src/**/*.bench.{ts,tsx}'],
    },
  },
});
