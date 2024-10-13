/** @type {import('ts-jest').JestConfigWithTsJest} **/

export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
  },
  preset: 'jest-puppeteer',
  testPathIgnorePatterns: ['.d.ts', '.ts'],
}
