# External Integrations

## AI Services

### Google Gemini AI
- **Package**: `@google/genai` (^1.29.0)
- **Purpose**: AI-powered features via Gemini API
- **Configuration**: `GEMINI_API_KEY` environment variable
- **Injected**: AI Studio automatically injects at runtime from user secrets
- **Vite config**: Defined as `process.env.GEMINI_API_KEY` for client access

## Environment Configuration

### `.env.example` Variables
| Variable | Description | Runtime Injection |
|----------|-------------|-------------------|
| `GEMINI_API_KEY` | Google Gemini API key | AI Studio Secrets panel |
| `APP_URL` | Application hosted URL | AI Studio Cloud Run service URL |
| `DISABLE_HMR` | Disable Hot Module Replacement | Manual configuration |

## Deployment Platform

### Google AI Studio
- **Type**: Cloud Run deployment
- **Auto-injection**: `GEMINI_API_KEY` and `APP_URL` injected at runtime
- **HMR**: Controlled via `DISABLE_HMR` env var (disabled in AI Studio to prevent flickering during agent edits)

## Frontend Framework
- **React 19** with TypeScript
- **Vite 6** for bundling and dev server

## Styling
- **Tailwind CSS 4** via Vite plugin
- **Motion** for animations

## Data Management
- **React Context** (`StoreContext`) - Global state management
- **LocalStorage** - Data persistence via `DataService`
- **Custom Hooks** (`useStore`) - State access pattern

## Icons
- **Lucide React** - Open source icon library

## Utilities
- **clsx** - Conditional class names
- **tailwind-merge** - Tailwind class merging

## CI/CD
- No explicit CI/CD configuration found (GitHub Actions, etc.)
- Deployment via Google AI Studio platform
