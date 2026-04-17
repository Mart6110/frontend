# Testing, Linting, and CI/CD Setup

This document describes the testing, linting, and CI/CD infrastructure for the frontend project.

## 🧪 Vitest

### Installation
The following packages have been installed for testing:
- `vitest` - Fast unit test framework powered by Vite
- `@vitest/ui` - Beautiful UI for viewing test results
- `jsdom` - JavaScript implementation of web standards for testing
- `@testing-library/react` - React testing utilities
- `@testing-library/jest-dom` - Custom matchers for DOM assertions
- `@testing-library/user-event` - User interaction simulation

### Configuration
- **Config File**: `vitest.config.ts`
- **Setup File**: `src/test/setup.ts`
- **Test Utilities**: `src/test/test-utils.tsx` - Custom render function with ChakraProvider

### Running Tests
```bash
# Run tests in watch mode
npm test

# Run tests once
npm test -- --run

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Writing Tests
Create test files with `.test.tsx` or `.spec.tsx` extensions. Use the custom render function from test-utils:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '../test/test-utils'
import { MyComponent } from '../components/MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

## 🔍 ESLint

### Configuration
- **Config File**: `eslint.config.js` (Flat config format)
- **Plugins**: 
  - `@typescript-eslint` - TypeScript linting
  - `eslint-plugin-react-hooks` - React Hooks rules
  - `eslint-plugin-react-refresh` - Fast Refresh validation

### Running Linting
```bash
# Check for linting errors
npm run lint

# Fix auto-fixable issues (add to package.json if needed)
npm run lint -- --fix
```

### Key Rules
- `@typescript-eslint/no-unused-vars` - Error for unused variables (allows `_` prefix)
- `@typescript-eslint/no-explicit-any` - Warning for explicit `any` types
- `react-refresh/only-export-components` - Warning for non-component exports

## 🚀 GitHub Actions CI/CD

### Workflow File
`.github/workflows/ci.yml`

### Jobs
1. **Lint** - Runs ESLint to check code quality
2. **Test** - Runs Vitest tests and generates coverage
3. **Build** - Builds the production bundle (runs after lint and test pass)

### Triggers
- Push to `main` or `master` branches
- Pull requests to `main` or `master` branches

### Artifacts
- **Coverage Reports**: Uploaded to Codecov (requires `CODECOV_TOKEN` secret)
- **Build Output**: Uploaded as artifacts (retained for 7 days)

### Setting up Codecov (Optional)
1. Sign up at [codecov.io](https://codecov.io)
2. Add your repository
3. Add `CODECOV_TOKEN` to your GitHub repository secrets

## 📁 Project Structure
```
frontend/
├── .github/
│   └── workflows/
│       └── ci.yml              # CI/CD workflow
├── src/
│   └── test/
│       ├── setup.ts            # Test setup and configuration
│       ├── test-utils.tsx      # Custom render utilities
│       └── *.test.tsx          # Test files
├── coverage/                   # Test coverage reports (gitignored)
├── eslint.config.js            # ESLint configuration
├── vitest.config.ts            # Vitest configuration
└── package.json                # Scripts and dependencies
```

## 🔧 Configuration Files

### vitest.config.ts
- Uses jsdom environment for DOM testing
- Enables global test utilities (describe, it, expect)
- Configures coverage with v8 provider
- Excludes test files and configs from coverage

### eslint.config.js
- Modern flat config format
- TypeScript support with type-aware linting
- React Hooks linting
- Special configuration for test files

## 📝 Tips

### Testing Best Practices
- Use `screen.getByRole()` for accessibility-first queries
- Mock external dependencies and API calls
- Test user interactions, not implementation details
- Aim for high test coverage on critical paths

### Linting Best Practices
- Fix linting errors before committing
- Use `_` prefix for intentionally unused variables
- Avoid `any` types when possible - use proper TypeScript types
- Keep components in separate files from utilities/constants

### CI/CD Best Practices
- Ensure tests pass locally before pushing
- Keep CI jobs fast by using caching
- Review coverage reports regularly
- Fix failing CI builds immediately

## 🐛 Troubleshooting

### Tests Not Running
- Ensure test files match the pattern `**/*.{test,spec}.{ts,tsx}`
- Check that imports in test files are correct
- Verify test setup file is properly configured

### Linting Errors in IDE
- Install the ESLint extension for your editor
- Restart your editor after installing dependencies
- Check that `eslint.config.js` is in the workspace root

### CI/CD Failures
- Check the GitHub Actions logs for specific errors
- Ensure all dependencies are listed in `package.json`
- Verify Node.js version matches CI configuration (v20)

## 📚 Resources
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
