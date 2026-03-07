import type { Config } from "jest";

const config: Config = 
{
  preset: 'jest-preset-angular', //Adapt jest to use angular templating and testbed
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'], //Pass my custom made setup file
  moduleDirectories: ['node_modules', '<rootDir>'], //Tell jest to search on these modules
  testMatch: ['**/+(*.)+(spec).+(ts)'], //Tell jest which files to execute as unit tests
  testEnvironment: "jest-environment-jsdom",
}

export default config;