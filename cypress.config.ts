import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    excludeSpecPattern: 'cypress/e2e/**/helpers/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:4173',
    specPattern: [
      'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
      'cypress/e2e/auth/**/*.{cy,spec}.{js,jsx,ts,tsx}',
      'cypress/e2e/chatroom/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    ],
  }
})
