# 🚀 TanStack Start × oRPC API Starter

An example demonstrating integration with oRPC for type-safe APIs.

[![Bun](https://img.shields.io/badge/bun-%23000000.svg?style=flat&logo=bun&logoColor=white)](https://bun.sh)
[![TanStack Start](https://img.shields.io/badge/TanStack%20Start-latest-blue)](https://github.com/TanStack/start)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-latest-blue)](https://www.postgresql.org/)

## 📋 Overview

**api-start** is a production-ready starter template combining **TanStack Start** and **oRPC**. It demonstrates best practices for:

- ✅ **Full-stack TypeScript** — End-to-end type safety with TanStack Start
- ✅ **Type-Safe APIs** — oRPC for zero-distance RPC + automatic OpenAPI documentation
- ✅ **Authentication** — Better Auth integration with OpenAPI reference docs
- ✅ **Database** — Drizzle ORM with PostgreSQL for rapid iteration
- ✅ **Modern DX** — Vite hot reloading, Tailwind CSS, Biome linting
- ✅ **Live API Docs** — Self-documenting OpenAPI endpoints

Perfect for:
- 🏗️ Building type-safe full-stack applications
- 📚 Learning RPC-first API design patterns
- 🔬 Prototyping and verifying database schemas rapidly
- 🚀 Creating self-documenting APIs with OpenAPI
- 🎯 Exploring TanStack + oRPC integration patterns

## 🎯 Quick Start

### Prerequisites
- [Bun](https://bun.sh) (recommended) or Node.js 18+
- PostgreSQL 12+

### Installation

```bash
# Clone and install
git clone https://github.com/Nahida-aa/api-start.git
cd api-start
bun install

# Start development server
bun dev
```

Your app is now running at **http://localhost:3210**

### 📖 Explore APIs

Once running, visit these endpoints:

- **[http://localhost:3210/api](http://localhost:3210/api)** — oRPC OpenAPI documentation (JSON schema)
- **[http://localhost:3210/api/auth/reference](http://localhost:3210/api/auth/reference)** — Better Auth API reference

Use these to understand available endpoints and test requests directly in your browser or API client.

### Setup PostgreSQL

```bash
# macOS (Homebrew)
brew install postgresql
brew services start postgresql

# Linux (Arch)
sudo pacman -S postgresql
sudo -u postgres initdb -D /var/lib/postgres/data
sudo systemctl enable --now postgresql

# All platforms: Create database and user
sudo -u postgres psql
CREATE DATABASE api_start_dev;
ALTER USER postgres WITH PASSWORD 'your_password';
\q
```

### Environment Variables

Create `.env.local`:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/api_start_dev
BETTER_AUTH_SECRET=$(bunx @better-auth/cli secret)
VITE_API_URL=http://localhost:3210
```

### Generate Better Auth Secret

```bash
bunx @better-auth/cli secret
```

## 🏗️ Project Structure

```
src/
├── routes/                 # TanStack Router file-based routing
│   ├── api.$.ts           # API gateway route
│   ├── api.rpc.$.ts       # oRPC endpoints
│   └── demo/              # Demo pages and patterns
├── lib/
│   ├── auth.ts            # Better Auth configuration
│   └── utils.ts           # Shared utilities
├── features/
│   └── demo/              # Feature module
├── components/
│   ├── app/               # App-specific components
│   └── ui/                # Reusable UI components
├── db.ts                  # Database client
├── db.schema.ts           # Drizzle ORM schema definitions
└── env.ts                 # Environment variables (validated with T3 env)
```

## 🔧 Available Scripts

```bash
# Development
bun dev              # Start dev server with hot reload

# Building
bun build            # Production build

# Database
bun db:generate      # Generate migrations
bun db:migrate       # Run migrations
bun db:push          # Push schema to database
bun db:studio        # Open Drizzle Studio (visual DB explorer)

# Code Quality
bun lint             # Biome linting
bun format           # Format with Biome
bun check            # Full Biome check

# Testing
bun test             # Run Vitest tests

# Skills & Documentation
bun intent:list      # List available skills for this project
bun intent:validate  # Validate agent configuration
```

## 🔑 Key Features

### 1. **Type-Safe APIs with oRPC**
- Zero-distance RPC (client and server share types)
- Automatic OpenAPI/Swagger documentation
- Built-in query and mutation routers
- Zod validation for all inputs/outputs
- Request/response caching strategies

### 2. **Authentication (Better Auth)**
- Email/password auth with session management
- OpenAPI-documented auth endpoints
- Easy integration with middleware
- User context available throughout the app

### 3. **Database (Drizzle ORM + PostgreSQL)**
- Type-safe schema definitions
- Built-in migrations with drizzle-kit
- Visual database explorer (Drizzle Studio)
- Ready for rapid schema iteration

### 4. **Developer Experience**
- **Vite 7** with hot module reloading
- **TypeScript 6.0** with strict mode
- **Biome** for blazing-fast linting/formatting
- **Tailwind CSS 4** with JIT compilation
- **Vitest** for unit testing

## 📚 Demo Pages & Documentation

### Live Demos
Explore working examples at http://localhost:3210/demo/:

- **/demo/orpc-todo** — Full oRPC example with queries and mutations
- **/demo/drizzle** — Database operations and schema patterns
- **/demo/better-auth** — Authentication flows and session management

### API Documentation
- **[/api](http://localhost:3210/api)** — oRPC OpenAPI schema (machine-readable)
- **[/api/auth/reference](http://localhost:3210/api/auth/reference)** — Better Auth endpoints

> Use [Swagger UI](https://swagger.io/tools/swagger-ui/), [Postman](https://www.postman.com/), or [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) with these endpoints to explore and test APIs

## 📝 RPC Definition & Usage

### Defining RPC Procedures

```typescript
// src/features/demo/demo.api.ts
import { eq } from 'drizzle-orm';
import z from 'zod';
import { todo } from '#/db.schema';
import { db } from '#/db.server';
import { authFn, Fn } from '#/orpc.base';

export const listTodo = Fn.route({ method: 'GET' }).handler(async () => {
	const ret = await db.select().from(todo);
	return ret;
});

export const addTodo = Fn.input(z.object({ title: z.string() })).handler(
	async ({ input }) => {
		const newTodo = { title: input.title };
		const [ret] = await db.insert(todo).values(newTodo).returning();
		return { success: true, id: ret.id };
	},
);
```

### Direct RPC Usage (Client)

```typescript
// Direct call without React Query
import { client } from '@/lib/orpc.client';

const result = await client.listTodo.call() 
```

### RPC with TanStack Query Integration

```typescript
// Using @orpc/tanstack-query adapter for automatic caching, refetching, etc.
import { useQuery, useMutation } from '@tanstack/react-query';
import { orpc } from '@/lib/orpc.client';


export function TodoListWithQuery({ userId }: { userId: string }) {
  // Query: Automatic caching, refetching, stale-while-revalidate
  const { data: todos, isLoading } = useQuery(orpc.demo.listTodo.queryOptions()));

  // Mutation: With optimistic updates and invalidation
  const { mutate: createTodo } = useMutation(orpc.demo.addTodo.mutationOptions({
    onSuccess: () => {
      // Automatically refetch todos after creation
      queryClient.invalidateQueries({ queryKey: orpc.demo.listTodo.queryKey() });
    },
  }));

  return (
    <div>
      {isLoading ? (
        <Skeleton />
      ) : (
        <>
          <ul>
            {todos?.map(t => (
              <li key={t.id}>{t.title}</li>
            ))}
          </ul>
          <button onClick={() => createTodo('New todo')}>
            Add Todo
          </button>
        </>
      )}
    </div>
  );
}
``` 

## 🚀 Deployment

See [TanStack Start deployment docs](https://tanstack.com/start/latest/docs/deployment) for setup details.

## 🛠️ API Architecture

**oRPC**: Type-safe RPC queries and mutations with automatic OpenAPI documentation
- 📍 Endpoint: `/api` (OpenAPI schema)
- 🔗 Client: `@orpc/client` with React Query integration
- 📚 Routes: Modular router composition with Zod validation

**Better Auth**: User authentication and session management
- 📍 Endpoint: `/api/auth/*` with reference docs at `/api/auth/reference`
- 🔑 Features: Email/password, sessions, middleware integration

**Server Functions**: Direct server invocation from client
- 🔄 Seamless client-server communication
- 📦 Optional Zod validation

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TanStack Router, TanStack Query |
| **Full-Stack** | TanStack Start, TypeScript 6 |
| **RPC & APIs** | **oRPC** with OpenAPI, h3, Server Functions |
| **Auth** | **Better Auth** with reference docs |
| **Database** | PostgreSQL, Drizzle ORM, Drizzle Kit |
| **Styling** | Tailwind CSS 4, Shadcn/UI |
| **Tooling** | Vite 7, Biome, Vitest |
| **Runtime** | Bun (or Node.js) |

## 📖 Learning Resources

### Primary Documentation
- **[oRPC Docs](https://orpc.io)** — Main RPC framework (queries, mutations, OpenAPI)
- **[TanStack Start Docs](https://tanstack.com/start/latest)** — Full-stack framework
- **[Better Auth Docs](https://www.better-auth.com)** — Authentication system

### Supporting Libraries
- [TanStack Router Guide](https://tanstack.com/router/latest) — Routing and data loading
- [Drizzle ORM Docs](https://orm.drizzle.team) — Database schema and migrations
- [TanStack Query Docs](https://tanstack.com/query/latest) — Client-side state management

## 🤝 Contributing

This template is designed for rapid experimentation. Since the project has no production users yet:

- ✨ **Free to modify**: Change database schemas liberally
- 🔄 **Iterate quickly**: Test new patterns and architectures
- 📝 **Document learnings**: Share findings in the AGENTS.md file

## 🎓 Agent Skills

This project is configured with AI coding agent skills for:

- TanStack Router setup and routing patterns
- Server function and API endpoint development
- Route protection and authentication
- Code splitting and lazy loading
- Environment variable management

See [AGENTS.md](./AGENTS.md) for skill-to-task mappings.

## 📄 License

MIT — Feel free to use this template for personal and commercial projects.

## 🙋 Support

- **Issues**: [Create an issue](https://github.com/yourusername/api-start/issues)
- **Discussions**: Start a discussion for questions and ideas
- **Templates**: Use this as a base for your own projects

---

**Built with ❤️ for TanStack + oRPC developers**

# Demo files

Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).

For TanStack Start specific documentation, visit [TanStack Start](https://tanstack.com/start).
