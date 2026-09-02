# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

PokeTeams (poketeams.com) lets players save, share and study Pokemon teams (pokepastes). Stack: Angular frontend (`ui/`), ASP.NET Core 9 API (`api/`), PostgreSQL.

## Commands

### Frontend (`ui/`)

```
npm install                    # install deps
npm start                      # ng serve, dev server on :4200
npm run build:dev              # development build
npm run build:prod             # production build
npm test                       # run all Jest unit tests
npm run test:watch             # watch mode
npm run test:coverage          # with coverage
npx jest path/to/file.spec.ts  # run a single spec file
npm run cypress:open           # open Cypress for e2e authoring
npm run cypress:run             # run e2e headless
```

Jest uses `jest-preset-angular` (config in `ui/jest.config.ts`); spec files are colocated with source as `*.spec.ts`.

### Backend (`api/`, run from repo root)

```
dotnet restore
dotnet build --configuration Release
dotnet test ./api.Test/api.Test.csproj              # unit + integration tests (xUnit, Moq/FakeItEasy)
dotnet test ./api.PokedexTest/api.PokedexTest.csproj # pokedex-data service tests
dotnet test ./api.Test/api.Test.csproj --filter "FullyQualifiedName~TeamControllerTest"  # single test class
dotnet run --project api                              # run the API locally
```

The `api.Test` integration tests run against a real Postgres instance (`ASPNETCORE_ENVIRONMENT=Test`, connection string `ConnectionStrings__PostgrePoketeamTest`) — see `.github/workflows/dev-build-test.yaml` for the CI setup (spins up a `postgres:15` service container).

EF Core migrations (target the app DB context, `PokeTeamContext`) are managed via the `dotnet-ef` local tool declared in `api/.config/dotnet-tools.json`:

```
dotnet tool restore
dotnet ef migrations add <Name> --project api --context PokeTeamContext
dotnet ef database update --project api --context PokeTeamContext
```

Migrations auto-apply on API startup (`context.Database.Migrate()` in `api/Program.cs`) — no manual `database update` needed for local dev once the container/DB is reachable.

## Architecture

### Two separate databases / DbContexts

The API talks to **two independent Postgres databases** via two EF Core contexts, wired up separately in `api/Program.cs`:

- **`PokedexContext`** (`ConnectionStrings:PostgrePokedex`) — static, reference Pokemon data (abilities, items, moves, natures, types, stats) sourced from PokeAPI. Its controllers live under `api/Controllers/PokedexControllers/`, services under `api/Services/PokedexServices/`, models under `api/Models/DBPokedexModels/`. Tested by the separate `api.PokedexTest` project.
- **`PokeTeamContext`** (`ConnectionStrings:PostgrePoketeam`) — the app's own data: users, teams, tournaments, regulations, tags. Also backs ASP.NET Identity (`AddEntityFrameworkStores<PokeTeamContext>()`). Controllers/services live at the top level of `api/Controllers/` and `api/Services/`, models under `api/Models/DBPoketeamModels/`. This is the only context that auto-migrates and the only one with EF migrations checked in (`api/Migrations/`).

When adding a feature, decide up front which DB it belongs to — reference/pokemon data vs. user-owned app data — since it determines which context, controller folder, and service folder it goes in.

### Auth

JWT bearer auth, but tokens are read from **httpOnly cookies** (`accessToken` / `refreshToken`), not the `Authorization` header — see the custom `OnMessageReceived` handler in `api/Program.cs`. Google OAuth is also wired up (`AddGoogle`). The custom `OnChallenge` handler distinguishes three 401 cases by response body text (`NoTokensProvided`, `NoRefreshTokenProvided`, `NoAccessTokenProvided`) so the frontend's `auth-interceptor.service.ts` can decide whether to attempt a silent refresh or force logout — keep both sides in sync if this contract changes.

### Frontend structure (`ui/src/app/`)

- **`core/`** — app-wide singletons: NgRx store (`store/` — currently only `auth`, `config`, and a `hydration` effect for rehydrating state; most features do *not* use NgRx), HTTP interceptors (`interceptors/`), route guards (`guards/`), and core services/models. Wired up in `core.providers.ts` via `provideCore()`.
- **`features/`** — routed top-level pages (`search-page`, `team-edit-page`, `team-view-page`, `upload-page`, `compare-page`, `user`). Each owns its own page-specific components/services.
- **`shared/`** — components, pipes, directives, and services reused across multiple features (e.g. `shared/components/team/`, `shared/components/pokemon/`, `shared/services/*.service.ts`).

### State management convention: signals over RxJS subjects

Most feature/shared services hold state in **Angular signals**, not `BehaviorSubject`s — e.g. `shared/services/team-editor.service.ts`, `team-compare.service.ts`, `search.service.ts` expose plain `signal<T>()` properties (mutated via `.set()`/`.update()`) rather than `private $subject` + `public $observable` pairs. When updating or extending a service, follow this pattern rather than reintroducing RxJS subjects; only use RxJS where the source is genuinely async/event-based (HTTP calls, route params, form `valueChanges`), and bridge those into signals with `toSignal()` at the point of use rather than manually subscribing in `ngOnInit` — `effect()` requires an Angular injection context, so side effects that need to react to signal changes belong in the constructor, not lifecycle hooks like `ngOnInit`.

NgRx (`core/store/`) is intentionally reserved for cross-cutting, hydrated app state (auth session, config/theme/lang) — don't add new feature state to it; use a signal-based service instead.

### i18n

UI text is translated via `@ngx-translate/core`; translation files live in `ui/src/assets/i18n/*.json`, one file per language.
