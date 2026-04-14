# Technology Stack

## Languages & Runtime
- **TypeScript** (^5.8.2) - Primary language
- **JavaScript** (ES2022 target) - Compiled output
- **React** (^19.0.0) - UI framework

## Core Frameworks
- **Vite** (^6.2.0) - Build tool and dev server
- **React** (^19.0.0) - Frontend framework
- **Tailwind CSS** (^4.1.14) - Styling via `@tailwindcss/vite` plugin
- **Motion** (^12.23.24) - Animations (`motion/react`)
- **Express** (^4.21.2) - Backend server

## Key Dependencies

### UI Components & Icons
- `lucide-react` (^0.546.0) - Icon library
- `clsx` (^2.1.1) - Class name utility
- `tailwind-merge` (^3.5.0) - Tailwind merge utility

### AI Integration
- `@google/genai` (^1.29.0) - Gemini AI API client

### Build & Dev Tools
- `@vitejs/plugin-react` (^5.0.4) - React plugin for Vite
- `@tailwindcss/vite` (^4.1.14) - Tailwind plugin for Vite
- `autoprefixer` (^10.4.21) - CSS prefixer
- `tsx` (^4.21.0) - TypeScript executor
- `dotenv` (^17.2.3) - Environment variables

### Type Definitions
- `@types/express` (^4.17.21)
- `@types/node` (^22.14.0)

## Configuration Files

### `vite.config.ts`
- React plugin for JSX
- Tailwind CSS plugin
- Path alias `@/*` → project root
- Environment variable loading via `loadEnv()`
- HMR control via `DISABLE_HMR` env var

### `tsconfig.json`
- Target: ES2022
- Module: ESNext
- JSX: `react-jsx`
- Path alias: `@/*` → `./`

## Project Structure
```
src/
  main.tsx          - React entry point
  App.tsx           - Root component
  components/       - React components
  contexts/         - React contexts (StoreContext)
  hooks/            - Custom hooks (useStore)
  lib/              - Utilities (utils.ts)
  pages/            - Page components
  services/         - Data services
  constants.ts      - App constants
  types.ts          - TypeScript types
  index.css         - Global styles
```

## Build Scripts
- `dev` - Start Vite dev server on port 3000
- `build` - Production build
- `preview` - Preview production build
- `lint` - TypeScript type checking
- `clean` - Remove dist folder
