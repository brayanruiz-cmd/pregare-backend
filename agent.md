# Agent Context - Pregare Backend

## 🎯 Objetivo del Proyecto
Backend para Pregare APP — app de fe diaria. Proveer lógica de negocio,
manejo de usuarios, contenido bíblico (proxy a bible-api.com),
declaraciones de fe, devocionales, temas vinculados a videos YouTube,
rachas diarias y notificaciones para alimentar el frontend Flutter.

## 🛠️ Stack Tecnológico
- **Entorno:** Node.js, NestJS 11, TypeScript
- **Datos:** MySQL (TypeORM), Redis (cache + BullMQ)
- **Auth:** JWT + Google OAuth
- **Integraciones:** Firebase (FCM), AWS S3 (imágenes declaraciones), Resend (emails)
- **API Bíblica:** bible-api.com (con cache Redis)
- **Dev:** `npm run start:dev`

## 📂 Arquitectura por Capas
- `domain/` → entidades, ports (interfaces)
- `application/` → use-cases
- `infrastructure/` → adapters (TypeORM, S3, Firebase, bible-api)
- `presentation/` → controllers, DTOs, guards

## 📦 Módulos
| Módulo | Función |
|--------|---------|
| Auth | Registro email, login, JWT, Google OAuth |
| Bible | Versiones, libros, capítulos, versículos (proxy + cache Redis) |
| Declarations | CRUD declaraciones de fe, filtro por género/tema, seed data |
| Devotionals | Devocionales diarios |
| Topics | Temas con links a YouTube |
| Streaks | Racha de días, check-in diario |
| Users | Perfil, preferencias, favoritos |

## 🔀 Git (Gitflow)
- Ramas: `feature/PR-<ticket>-<desc>`, `bugfix/PR-<ticket>-<desc>`, `hotfix/PR-<ticket>-<desc>`
- Feature/bugfix desde `dev`; hotfix desde `main`
- Push solo a `dev` vía PR
- Commits: `feat(PR-<ticket>): desc` / `fix(PR-<ticket>): desc`

## ✅ Verificación
1. `npm run lint`
2. `npm run build`
3. `npm run test -- <archivo>`

## 🚫 Prohibiciones
- No exponer secrets del .env (API keys, tokens, credenciales)
- No instalar dependencias sin preguntar
- No usar DB_SYNC=true en producción
- No hacer push a main/stage/release
- No loguear datos sensibles

## 📝 Migraciones
Al cambiar entidades TypeORM, crear migración en `src/migrations` y ejecutarla.
No depender solo de `DB_SYNC=true`.

## 📄 Documentación
Leer specs en `docs/` antes de tocar integraciones.
Revisar `.github/workflows/` antes de modificar Dockerfile o scripts de deploy.
