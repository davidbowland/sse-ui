const nextJest = require('next/jest')

const createJestConfig = nextJest({ dir: './' })

const config = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['.*\\.d\\.ts', 'config/*', 'types.ts', '_app.tsx', '_document.tsx'],
  coverageThreshold: {
    global: { branches: 90, functions: 90, lines: 80 },
  },
  moduleNameMapper: {
    '@heroui/react': '<rootDir>/__mocks__/@heroui/react.js',
    'react-aria-components': '<rootDir>/__mocks__/react-aria-components.js',
    '@mui/icons-material/(.*)': '<rootDir>/__mocks__/mui-component-mock.js',
    '@mui/material/Select': '<rootDir>/__mocks__/mui-select-mock.js',
    '@mui/material/MenuItem': '<rootDir>/__mocks__/mui-menuitem-mock.js',
    '@mui/material/Button': '<rootDir>/__mocks__/mui-button-mock.js',
    '@mui/material/TextField': '<rootDir>/__mocks__/mui-textfield-mock.js',
    '@mui/material/ListItemText': '<rootDir>/__mocks__/mui-listitemtext-mock.js',
    '@mui/material/ListItemButton': '<rootDir>/__mocks__/mui-listitembutton-mock.js',
    '@mui/material/Switch': '<rootDir>/__mocks__/mui-switch-mock.js',
    '@mui/material/(.*)': '<rootDir>/__mocks__/mui-component-mock.js',
    '.+\\.(css|styl|less|sass|scss)$': 'identity-obj-proxy',
    '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|pdf|yaml)$':
      '<rootDir>/__mocks__/file-mock.js',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@test/(.*)$': '<rootDir>/test/$1',
    '^@types$': '<rootDir>/src/types',
    '@fontsource/(.*)$': '<rootDir>/__mocks__/file-mock.js',
  },
  setupFiles: ['<rootDir>/jest.setup-test-env.js'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['node_modules', '\\.cache', '<rootDir>.*/out'],
}

module.exports = createJestConfig(config)
