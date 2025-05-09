import { defineConfig } from 'cypress'
import { execSync } from 'child_process'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3001',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        resetDatabase() {
          console.log('Resetting database for testing...')
          try {
            execSync('cd ../backend && npm run test:db:setup', { stdio: 'inherit' })
            return null
          } catch (error) {
            console.error('Error resetting database:', error)
            return null
          }
        }
      })
    },
  },
  env: {
    apiUrl: 'http://localhost:3011'
  }
})
