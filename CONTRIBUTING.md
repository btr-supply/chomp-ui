# Contributing to Chomp Frontend

## Tech Stack

- **Frontend**: React 19 + Next.js 15 with App Router + TypeScript
- **Runtime**: Bun/Next.js
- **UI**: Material-UI v7 + Emotion + Chart.js
- **State**: Context API + Zustand/Immer + TanStack Query
- **Math**: AsciiMath for formula rendering (asciimath2ml)
- **Web3**: Wagmi + Viem
- **Linting**: Oxlint + Next.js ESLint, Prettier formatting

## Prerequisites

```bash
# Install Bun (required)
curl -fsSL https://bun.sh/install | bash

# Verify installation
bun --version
```

## Setup

```bash
# 1. Fork and clone
git clone https://github.com/<your-username>/chomp-frontend.git
cd chomp-frontend

# 2. Install dependencies
bun install

# 3. Start development
bun run dev
```

## Development Workflow

### Available Scripts

- `bun run dev` - Development server with hot reload
- `bun run lint` - Code quality check
- `bun run format` - Format with Prettier
- `bun run build` - Production build
- `bun run serve` - Serve production build
- `bun run type-check` - TypeScript type checking

### Pre-Commit Requirements ⚠️

**MANDATORY**: Before any commit, you MUST run these commands to ensure code quality:

```bash
# Required before every commit
bun run format      # Format code with Prettier
bun run lint        # Check code quality (ESLint + Oxlint)
bun run type-check  # Verify TypeScript compilation
```

**All checks must pass** before committing. No exceptions.

```bash
# Quick pre-commit check (all must pass)
bun run format && bun run lint && bun run type-check
```

If any check fails:

- **Format issues**: Run `bun run format` to auto-fix
- **Lint errors**: Fix manually or use auto-fix where available
- **Type errors**: Resolve TypeScript issues before proceeding

### Branch Structure

- `main` - Production (auto-deployed)
- `dev` - Development branch
- `feat/feature-name` - Feature branches
- `fix/bug-name` - Bug fix branches
- `refac/refactoring-name` - Refactoring (performance/style...)
- `docs/documentation-name` - Documentation/comments
- `ops/chore-name` - CI/CD, chores, scripts, configuration

### Commit Format

| Type      | Description          | Example                           |
| --------- | -------------------- | --------------------------------- |
| **feat**  | New features         | `[feat] Add dashboard component`  |
| **fix**   | Bug fixes            | `[fix] Resolve chart rendering`   |
| **refac** | Code refactoring     | `[refac] Restructure components`  |
| **docs**  | Documentation        | `[docs] Update API documentation` |
| **ops**   | Config, dependencies | `[ops] Update React to v19`       |

### Development Flow

```bash
# 1. Make your changes
# ... code implementation ...

# 2. MANDATORY: Run quality checks before commit
bun run format && bun run lint && bun run type-check

# 3. Only commit if all checks pass
git add .
git commit -m "[feat] Your descriptive commit message"

# 4. Push to your feature branch
git push origin feat/your-feature-name
```

**Remember**: Never commit code that fails linting or type checking!

### Path Aliases

Use configured aliases for cleaner imports (cf. next.config.js):

```typescript
// ✅ Good - Using aliases
import { useSystemQueries } from '@hooks/queries';
import { Dashboard } from '@pages/Dashboard';
import { formatPercent } from '@utils/format';
import { BaseCard } from '@components/BaseCard';
import type { SystemMetrics } from '@types/api';

// ❌ Avoid - Relative paths
import { useSystemQueries } from '../../hooks/queries';
import { Dashboard } from '../components/pages/Dashboard';
```

| Alias          | Path                      | Description           |
| -------------- | ------------------------- | --------------------- |
| `@/`           | `./src/`                  | Root source directory |
| `@components/` | `./src/components/`       | React components      |
| `@hooks/`      | `./src/hooks/`            | Custom hooks          |
| `@store/`      | `./src/stores/`           | State management      |
| `@utils/`      | `./src/utils/`            | Utilities             |
| `@constants/`  | `./src/constants/`        | Constants/themes      |
| `@pages/`      | `./src/components/pages/` | Page components       |
| `@config/`     | `./src/config/`           | Configuration         |
| `@services/`   | `./src/services/`         | API services          |
| `@types/`      | `./src/types/`            | TypeScript types      |

## Code Guidelines

### TypeScript Best Practices

- Always define prop interfaces for components
- Use strict typing, avoid `any`
- Export types alongside components
- Use generic types for reusable components
- Prefer `interface` over `type` for object shapes

```typescript
// ✅ Good - Using theme variants instead of custom styling
interface MetricCardProps {
  title: string;
  value: number;
  trend?: 'up' | 'down' | 'neutral';
  formatter?: (value: number) => string;
}

export const MetricCard = memo<MetricCardProps>(({
  title,
  value,
  trend = 'neutral',
  formatter = (v) => v.toString()
}) => {
  const formattedValue = useMemo(() => formatter(value), [value, formatter]);
  return (
    <StyledCard variant="default"> {/* Uses theme overrides */}
      <StyledButton variant="brand">Action</StyledButton> {/* Uses theme variants */}
      {formattedValue}
    </StyledCard>
  );
});

// ✅ Good - Reusing theme component variants
<StyledButton variant="brand">Primary</StyledButton>
<StyledButton variant="outlined">Secondary</StyledButton>
<StyledButton variant="success">Success</StyledButton>

// ❌ Bad - Custom styling when theme variants exist
<Button sx={{ bgcolor: 'yellow', color: 'black' }}>Custom</Button>
```

### Performance Best Practices

- Use `React.memo()` for stable/constant props
- Use `useMemo()` for expensive calculations
- Use `useCallback()` for event handlers
- Implement `React.lazy()` for route splitting
- Debounce rapid updates `useDebounce`, `useStateDebounce` (sliders, inputs...)

### Import Organization

```typescript
// 1. React and core libraries
import React, { memo, useMemo, useCallback } from 'react';

// 2. Third-party libraries (selective imports)
import { Box, Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';

// 3. Internal utilities (using aliases)
import { useThemeColors } from '@constants';
import { useSystemQueries } from '@hooks/queries';
import { formatPercent } from '@utils/format';

// 4. Components (using aliases)
import { BaseCard } from '@components/BaseCard';
import { Dashboard } from '@pages/Dashboard';

// 5. Types (using aliases)
import type { SystemMetrics } from '@types/api';
```

### Component Structure

- Keep components under 200 lines
- Extract complex logic to custom hooks
- Use composition over large components
- Wrap charts with `React.memo`
- Always type component props
- **PRIORITY: Use existing theme overrides and component variants**
- **Avoid custom styling when theme variants exist**
- **Minimize inline `sx` props - prefer theme-based solutions**

## Pull Request Process

1. **Quality Check**:

   ```bash
   bun run format    # Format code
   bun run lint      # Check quality
   bun run type-check # TypeScript check
   bun run build     # Verify build
   ```

2. **Create PR**:

   - Title: `[feat] Add feature description`
   - Target: `dev` branch
   - Include screenshots for UI changes

3. **Logical Commits**: Break work into atomic commits

   ```bash
   # Good - separate logical commits
   git add src/components/NewComponent.tsx
   git commit -m "[feat] Add NewComponent with proper types"

   git add src/pages/Dashboard.tsx
   git commit -m "[refac] Integrate NewComponent in Dashboard"

   # Bad - everything at once
   git add .
   git commit -m "[feat] Add dashboard and component"
   ```

## Performance & Bundle Rules

- **Tree-shake**: `import { Box } from '@mui/material'` ✅
- **Avoid**: `import * as MUI from '@mui/material'` ❌
- **Theme First**: Use existing theme overrides and component variants
- **Avoid Custom Styling**: When theme variants exist, use them instead
- **Memoize**: Chart data and expensive calculations
- **Lazy Load**: Route components with `React.lazy()`
- **Fonts**: Preload custom fonts in `layout.tsx`, use fallbacks
- **Loading**: Use loading states for App Router transitions

## Deployment

- `main` branch auto-deploys to `chomp.btr.supply` via Cloudflare Pages
- Uses `bun install && bun run build`
- Static export to `dist/` directory
- **Headers/Caching**: `_headers` configures security headers, CSP, and caching rules
- **SPA Routing**: `_redirects` handles client-side routing for static export
- Build process automatically copies these files from root to `dist/` directory
