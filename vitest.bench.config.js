import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.bench.{js,jsx}'],
    benchmark: {
      include: ['src/**/*.bench.{js,jsx}'],
    },
  },
});
