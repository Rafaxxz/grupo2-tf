# PlayControl — Panel Familiar

Plataforma de **control parental y gamificación del tiempo de juego** para familias.
Permite a padres y administradores gestionar usuarios, establecer límites de tiempo,
asignar retos y recompensas, agendar citas con especialistas y consultar contenido
educativo, todo con un panel web moderno.

El proyecto se divide en dos aplicaciones:

| Carpeta | Descripción | Tecnología |
|---|---|---|
| [`TP_grupo2/`](TP_grupo2) | API REST (backend) | Spring Boot 3 + Java + JPA + JWT |
| [`playcontrol-frontend/`](playcontrol-frontend) | Panel web (frontend) | Angular 21 + Angular Material |

---

## Tabla de contenidos

- [Arquitectura](#arquitectura)
- [Requisitos](#requisitos)
- [Puesta en marcha](#puesta-en-marcha)
- [Roles y permisos](#roles-y-permisos)
- [Módulos del sistema](#módulos-del-sistema)
- [Endpoints principales](#endpoints-principales)
- [Internacionalización (ES / EN)](#internacionalización-es--en)
- [Estructura del frontend](#estructura-del-frontend)
- [Estructura del backend](#estructura-del-backend)

---

## Arquitectura

```
┌─────────────────────────┐        HTTP / JSON         ┌──────────────────────────┐
│   playcontrol-frontend  │  ───────────────────────▶  │        TP_grupo2         │
│   (Angular + Material)   │   Authorization: Bearer    │   (Spring Boot REST API) │
│   http://localhost:4200  │  ◀───────────────────────  │   http://localhost:8080  │
└─────────────────────────┘          JWT                └────────────┬─────────────┘
                                                                      │ JPA / Hibernate
                                                                      ▼
                                                              ┌──────────────┐
                                                              │   Base de    │
                                                              │    datos     │
                                                              └──────────────┘
```

- **Autenticación por JWT.** El usuario inicia sesión (`/login`) y recibe un token que
  el frontend guarda y envía en cada petición mediante un *HTTP interceptor*.
- **Login social** opcional con Google y Facebook (`/login/google`, `/login/facebook`).
- **Autorización por roles** en el backend con `@PreAuthorize` (ADMIN, PADRE, HIJO).

---

## Requisitos

| Herramienta | Versión recomendada |
|---|---|
| Java (JDK) | 17 o superior |
| Maven | 3.9+ (o el wrapper `./mvnw` incluido) |
| Node.js | 20+ |
| Angular CLI | 21 (`npm i -g @angular/cli`) |
| Base de datos | La configurada en `application.properties` |

---

## Puesta en marcha

### 1) Backend (Spring Boot)

```bash
cd TP_grupo2
# Configura la conexión a la BD en:
#   src/main/resources/application.properties
./mvnw spring-boot:run        # Linux / macOS / Git Bash
# .\mvnw.cmd spring-boot:run   # Windows PowerShell
```

La API queda disponible en **http://localhost:8080**.
Documentación Swagger (OpenAPI): **http://localhost:8080/swagger-ui.html**

### 2) Frontend (Angular)

```bash
cd playcontrol-frontend
npm install
npm start            # equivale a 'ng serve'
```

El panel queda disponible en **http://localhost:4200**.

> La URL del backend se define en
> [`src/environments/environment.development.ts`](playcontrol-frontend/src/environments/environment.development.ts)
> (`base: 'http://localhost:8080'`).

---

## Roles y permisos

| Rol | Capacidades |
|---|---|
| **ADMIN** | Acceso total: gestiona usuarios, roles, catálogo de juegos, contenido educativo, especialistas, alertas y estadísticas. |
| **PADRE** | Control parental (límites/bloqueos), citas, mensajes, especialistas y seguimiento de logros/retos por usuario. |
| **HIJO** | Ve logros, recompensas y retos; canjea recompensas; registra sesiones de juego; envía mensajes. |

El frontend adapta el menú lateral y los temas (oscuro para ADMIN/HIJO, claro para PADRE)
según el rol del token.

---

## Módulos del sistema

- **Gamificación:** Logros, Recompensas, Retos y sus asignaciones por usuario
  (Logros por usuario, Retos por usuario, Canjes de recompensa).
- **Control parental:** Límites de tiempo, bloqueos y Alertas del sistema.
- **Catálogo de juego:** Categorías, Juegos y Sesiones de juego.
- **Bienestar:** Especialistas, Citas, Guías y Contenido educativo.
- **Familia:** Mensajería interna entre miembros.
- **Administración:** Usuarios y Roles.

---

## Endpoints principales

> Todos requieren el header `Authorization: Bearer <token>` salvo el login.

| Recurso | Ruta base | Operaciones destacadas |
|---|---|---|
| Autenticación | `/login` | `POST` login; `POST /login/google`, `POST /login/facebook` |
| Usuarios | `/api/usuarios` | CRUD, `GET /userByRol`, `GET /userLastDays` |
| Roles | `/api/roles` | CRUD |
| Logros | `/api/logros` | `GET`, `POST /nuevo`, `PUT /actualiza`, `DELETE /{id}`, consultas por criterio |
| Recompensas | `/api/recompensas` | `GET`, `POST /nuevo`, `PUT /actualiza`, `por-tipo`, `disponibles-por-puntos` |
| Retos | `/api/retos` | `GET`, `POST /nuevo`, `PUT /actualiza`, `por-tipo`, `proximos-a-vencer` |
| Logros por usuario | `/api/logros-usuario` | CRUD + `por-usuario`, `dashboard`, `timeline` |
| Retos por usuario | `/api/retos-usuario` | CRUD + `por-usuario`, `por-completado`, `dashboard` |
| Canjes | `/api/canjes` | CRUD + `por-usuario`, `balance`, `puntos-gastados` |
| Mensajes | `/api/mensajes` | `GET`, `POST /nuevo`, `conversacion`, `no-leidos/{id}` |
| Alertas | `/alertas` | `GET`, `POST`, `usuario/{id}`, `no-leidas` |
| Límites de tiempo | `/limites` | CRUD + `usuario/{id}`, `bloqueados` |
| Especialistas | `/api/especialistas` | CRUD + `verificados` |
| Citas | `/api/citas-especialista` | CRUD + `usuario/{id}` |
| Contenido educativo | `/api/contenidos-educativos` | CRUD |
| Categorías de juego | `/categorias-juego` | `GET`, `POST`, `buscar`, `existe` |
| Juegos | `/juegos` | `GET`, `POST`, `plataforma`, `categoria/{id}` |
| Sesiones de juego | `/sesiones` | `GET`, `POST`, `historial/{id}`, `usuario/{id}`, `fecha` |

---

## Internacionalización (ES / EN)

El frontend incluye un sistema de idiomas propio (sin librerías externas) en
[`src/app/i18n/`](playcontrol-frontend/src/app/i18n):

| Archivo | Función |
|---|---|
| `translate.service.ts` | Servicio con *signal* del idioma activo; persiste la elección en `localStorage`. |
| `translate.pipe.ts` | Pipe `\| t` para traducir claves en las plantillas. |
| `es.ts` / `en.ts` | Diccionarios Español / Inglés. |

**Uso en plantillas:**

```html
<h1>{{ 'dash.welcome' | t }}</h1>
```

El conmutador **ES / EN** está en la barra lateral y cambia toda la interfaz en caliente.

---

## Estructura del frontend

```
playcontrol-frontend/src/app/
├── components/        Pantallas (listar / form por entidad)
├── services/          Acceso HTTP a cada recurso del backend
├── models/            Interfaces TypeScript (DTOs)
├── guards/            authGuard (JWT) y bloqueoGuard (control parental)
├── interceptors/      auth.interceptor (añade el token a cada request)
├── i18n/              Sistema de traducción ES / EN
├── app.routes.ts      Rutas de la aplicación
└── app.config.ts      Providers (router, http, interceptores)
```

Convenciones de estilo:
- **Angular Material** para iconografía (`mat-icon`) y componentes.
- Hojas de estilo compartidas: `components/shared.css`, `components/table.css`,
  `components/form-shared.css`.
- Tema oscuro por defecto y tema claro (`body.padre-theme`) para el rol PADRE.

---

## Estructura del backend

```
TP_grupo2/src/main/java/pe/edu/upc/playcontrol/
├── controllers/           Endpoints REST
├── dtos/                  Objetos de transferencia
├── entities/              Entidades JPA
├── repositories/          Repositorios Spring Data
├── servicesinterfaces/    Contratos de servicio
├── servicesimplements/    Lógica de negocio
├── securities/            JWT (filtro, util, config de seguridad)
└── config/                CORS, OpenAPI, manejo global de excepciones
```

---

## Notas

- CORS está habilitado para el frontend en `config/CorsConfig.java`.
- Los errores de la API se devuelven en un formato uniforme
  (`status`, `error`, `message`) gracias a `GlobalExceptionHandler`.

---

_Proyecto académico — Arquitecturas Web (UPC), Grupo 2._
