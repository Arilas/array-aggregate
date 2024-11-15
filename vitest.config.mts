import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    outputFile: 'junit.xml',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'clover', 'json', 'lcov'],
    },
  },
})
