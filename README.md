# codingin-starterpack

Scaffold a fullstack **React Vite + NestJS** monorepo project in seconds.

## Usage

```bash
npx codingin-starterpack@latest
```

Or with a project name:

```bash
npx codingin-starterpack@latest my-awesome-app
```

## What You Get

### Frontend

- ⚡ **React 19** + **Vite** for blazing-fast development
- 🧭 **TanStack Router v1** for type-safe file-based routing
- 🎨 **Tailwind CSS v4** + **shadcn/ui** for beautiful UI
- 🛡️ **Zod** for schema validation
- 📡 **Axios** pre-configured API client with `/api` proxy

### Backend

- 🏗️ **NestJS** for scalable server architecture
- 🗄️ **Prisma ORM** with SQLite (easily switch to PostgreSQL/MySQL)
- 🔌 **ServeStaticModule** for single-port production deployment
- ⚙️ **ConfigModule** for environment variable management
- 🏥 Health check endpoint at `GET /api/health`

### Monorepo

- 📦 **npm workspaces** — one repo, multiple packages
- 🔗 **Shared types** package between frontend & backend
- 🚀 **Single-port production** — NestJS serves both API & frontend
- 🔄 **Concurrent dev servers** with auto-proxy

## Development

```bash
cd my-awesome-app
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000/api
- **Health Check:** http://localhost:3000/api/health

## Production

```bash
npm run build
npm run start
# Everything runs on http://localhost:3000
```

## Project Structure

```
my-awesome-app/
├── apps/
│   ├── frontend/          # React + Vite + Tailwind + shadcn
│   └── backend/           # NestJS + Prisma
├── packages/
│   └── shared/            # Shared TypeScript types
└── package.json           # Root monorepo config
```

## License

MIT
