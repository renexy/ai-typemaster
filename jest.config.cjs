module.exports = {
    preset: 'ts-jest', // Use ts-jest preset for handling TypeScript
    testEnvironment: 'node', // Use Node.js environment for testing
    transform: {
      '^.+\\.tsx?$': 'ts-jest', // Transform .ts and .tsx files with ts-jest
    },
    moduleFileExtensions: ['ts', 'tsx', 'js'], // Handle ts, tsx, and js file extensions
    transformIgnorePatterns: [
      '/node_modules/(?!your-es6-module|other-dependencies).*/', // If needed, adjust for specific dependencies
    ],
  };
  