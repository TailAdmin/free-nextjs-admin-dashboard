# Rule Directory

Quick reference guide for cursor rules organized by development area. Use this to identify relevant rules when planning features or implementing solutions.

## 🏗️ Project Setup & Configuration

| Rule                           | Governs                                                                                    |
| ------------------------------ | ------------------------------------------------------------------------------------------ |
| `initial-project-setup`        | Complete NextJS 15 project creation with TypeScript, Tailwind, Docker, and quality tools   |
| `config-environment-variables` | Type-safe environment variable management with Zod validation and client/server separation |
| `windows-development-commands` | PowerShell commands and Windows-specific development patterns                              |
| `docker-standards`             | General Docker containerization best practices and configuration                           |

## ⚛️ NextJS Development

| Rule                           | Governs                                                                            |
| ------------------------------ | ---------------------------------------------------------------------------------- |
| `nextjs-structure-standards`   | App Router directory structure, file organization, and NextJS 15 conventions       |
| `nextjs-performance-standards` | Image optimization, lazy loading, bundle analysis, and Core Web Vitals             |
| `nextjs-docker-standards`      | NextJS-specific Docker builds, multi-stage containers, and deployment optimization |
| `typescript-nextjs-standards`  | TypeScript configuration, component typing, and API route patterns for NextJS      |

## 🗄️ Database Management

| Rule                       | Governs                                                                        |
| -------------------------- | ------------------------------------------------------------------------------ |
| `db-schema-standards`      | Prisma schema design, relationships, indexes, and data modeling best practices |
| `db-client-standards`      | Prisma client configuration, connection management, and query patterns         |
| `db-migration-standards`   | Database migrations, version control, and schema evolution strategies          |
| `db-performance-standards` | Query optimization, indexing strategies, and database performance monitoring   |
| `db-security-standards`    | Database security, access controls, data protection, and audit logging         |
| `db-testing-standards`     | Database testing strategies, test data management, and integration testing     |

## 🔐 Authentication & Security

| Rule                    | Governs                                                                      |
| ----------------------- | ---------------------------------------------------------------------------- |
| `auth-nextauth-simple`  | NextAuth.js/Auth.js implementation with email/password and social providers  |
| `bp-security-standards` | Web security practices, CSP headers, input validation, and threat prevention |

## 📊 Best Practices & Quality

| Rule                            | Governs                                                                              |
| ------------------------------- | ------------------------------------------------------------------------------------ |
| `bp-code-quality-standards`     | Code quality metrics, linting rules, formatting standards, and maintainability       |
| `bp-engineering-best-practices` | Software engineering principles, architecture patterns, and development methodology  |
| `bp-testing-standards`          | Testing strategy with Vitest, React Testing Library, and comprehensive test coverage |
| `logging-standards`             | Error handling, logging patterns, and monitoring integration for frontend/backend    |

## 🛠️ Development Tools & Workflow

| Rule                            | Governs                                                                      |
| ------------------------------- | ---------------------------------------------------------------------------- |
| `dev-eslint-prettier-standards` | ESLint and Prettier configuration for consistent code formatting and quality |
| `dev-husky-precommit-hooks`     | Git hooks, pre-commit validation, and automated quality enforcement          |
| `git-standards`                 | Git workflow, branch naming, commit conventions, and repository management   |
| `create-rules`                  | Guidelines for creating new cursor rules following standardized patterns     |

## 🎨 UI & Styling

| Rule                        | Governs                                                                     |
| --------------------------- | --------------------------------------------------------------------------- |
| `ui-tailwind-css-standards` | Tailwind CSS configuration, utility patterns, and responsive design systems |
| `dashboard-ui-patterns`     | Dashboard component patterns, layout structures, and data visualization     |

## 📦 State Management

| Rule                       | Governs                                                                 |
| -------------------------- | ----------------------------------------------------------------------- |
| `state-zustand-management` | Zustand store configuration, state patterns, and persistence strategies |

---

## Usage Guidelines

### Feature Development Workflow

1. **Planning Phase**: Identify applicable rules based on feature requirements
2. **Design Phase**: Reference architecture and pattern rules
3. **Implementation Phase**: Follow specific technology rules (NextJS, database, etc.)
4. **Quality Phase**: Apply testing, security, and code quality rules

### Rule Categories by Development Phase

- **Setup**: `initial-project-setup`, `config-environment-variables`
- **Architecture**: `nextjs-structure-standards`, `bp-engineering-best-practices`
- **Implementation**: Technology-specific rules (nextjs, db, auth, ui)
- **Quality**: Testing, security, and code quality rules
- **Deployment**: Docker and performance optimization rules

### Quick Reference by Technology Stack

- **NextJS**: `nextjs-*`, `typescript-nextjs-standards`
- **Database**: `db-*`
- **Authentication**: `auth-*`, `bp-security-standards`
- **UI/Styling**: `ui-*`, `dashboard-ui-patterns`
- **Testing**: `bp-testing-standards`, `db-testing-standards`
- **DevOps**: `docker-standards`, `nextjs-docker-standards`, `git-standards`
