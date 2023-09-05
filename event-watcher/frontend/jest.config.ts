import { pathsToModuleNameMapper } from 'ts-jest'
import type { JestConfigWithTsJest } from 'ts-jest'

import { compilerOptions } from './tsconfig.json'

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>'],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: {
    '^test-utils$': '<rootDir>/src/app/core/tests/utils/index.tsx',
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
    ...pathsToModuleNameMapper(compilerOptions.paths),
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleDirectories: ['node_modules', 'src'],
  coverageProvider: 'v8',
  collectCoverageFrom: [
    'src/index.tsx',
    'src/app/core/**/*.tsx',
    'src/app/core/**/**/*.tsx',
    'src/components/**/**/index.tsx',
  ],
  coverageReporters: ['json', 'text'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.svg$': '<rootDir>/.jest/transformers/svg.cjs',
  },
}

export default config
