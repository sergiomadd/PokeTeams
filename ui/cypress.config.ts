import { defineConfig } from 'cypress'

export default defineConfig({
  
  e2e: {
    baseUrl: 'http://localhost:4200',
    retries: {
      runMode: 0,
      openMode: 0,
    },
  },
  
  
})