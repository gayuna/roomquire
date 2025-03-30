/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\.tsx?$": ["ts-jest", {}],
  },
  moduleNameMapper: {
    '^config/(.*)$': '<rootDir>/src/config/$1',
    '^commands/(.*)$': '<rootDir>/src/commands/$1'
  }
};