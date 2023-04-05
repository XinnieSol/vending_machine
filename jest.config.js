
export default {
    roots: ['<rootDir>/src/'],
    testMatch: ['./tests/specs/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest'
    },
    "testEnvironment": "node"
}