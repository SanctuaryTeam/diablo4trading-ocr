import type { Config } from 'jest';

const config: Config = {
    rootDir: './',
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['<rootDir>/test/unit/**/*.test.ts'],
    'collectCoverage': false,
    'coverageDirectory': '<rootDir>/coverage/unit/',
    'collectCoverageFrom': [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/index.ts',
        '!src/config.ts',
        '!**/node_modules/**',
        '!**/vendor/**',
    ],
    'coverageReporters': ['text', 'html'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    "modulePaths": ["<rootDir>"]
};

// eslint-disable-next-line import/no-default-export
export default config;
