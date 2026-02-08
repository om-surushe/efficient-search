# Contributing to Efficient Search

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, constructive, and professional. We're building tools to help people, not to argue.

## Getting Started

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/efficient-ticktick.git
   cd efficient-ticktick
   ```
3. **Install dependencies**:
   ```bash
   bun install
   ```
4. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running Locally
```bash
# Watch mode with hot reload
bun run dev

# Type checking
bun run typecheck

# Run tests
bun test
```

### Before Committing

1. **Run tests**: `bun test`
2. **Type check**: `bun run typecheck`
3. **Format code**: `bun run format`
4. **Lint**: `bun run lint`

All checks should pass before submitting a PR.

## Commit Messages

Follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `chore:` Tooling, dependencies
- `test:` Test additions or fixes
- `refactor:` Code refactoring

**Examples:**
```
feat: add support for recurring tasks
fix: timezone conversion for all-day tasks
docs: update installation instructions
```

## Pull Requests

1. **Keep PRs focused** - One feature or fix per PR
2. **Write clear descriptions** - Explain what and why
3. **Add tests** for new features
4. **Update docs** if behavior changes
5. **Ensure CI passes** before requesting review

## Testing

- Write tests for new functionality
- Ensure existing tests still pass
- Aim for high coverage on critical paths

```bash
# Run all tests
bun test

# Watch mode
bun run test:watch
```

## Project Structure

```
src/
├── index.ts           # MCP server entry point
├── lib/               # Core libraries
│   ├── ticktick-client.ts   # API client
│   └── task-enrichment.ts   # LLM enrichment layer
├── tools/             # MCP tool implementations
│   └── index.ts
├── types/             # TypeScript types
│   └── index.ts
└── utils/             # Utilities
    └── time.ts        # Time handling

tests/                 # Test files
```

## Design Principles

1. **LLM-first** - Design APIs for AI consumption, not humans
2. **Rich context** - Include all relevant information in one response
3. **Flexible input** - Accept natural language dates, partial matches
4. **Clear errors** - Helpful error messages
5. **Type safety** - Leverage TypeScript fully

## Questions?

Open an issue or discussion on GitHub. We're here to help!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
