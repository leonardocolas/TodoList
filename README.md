# TodoList - Full Stack Application

Aplicación de gestión de tareas (TodoList) desarrollada como proyecto de aprendizaje con **Angular 22** (Frontend) y **Spring Boot 4** (Backend).

## Descripción

Esta aplicación permite a los usuarios registrarse, iniciar sesión y gestionar sus propias tareas de forma completa (CRUD). Cuenta con un panel de administración donde un usuario con rol ADMIN puede gestionar todos los usuarios y tareas del sistema.

## Funcionalidades

### Usuario Regular
- Registrar e iniciar sesión
- Crear, editar, eliminar y marcar tareas como completadas
- Visualizar solo sus propias tareas

### Administrador
- Panel de estadísticas (total usuarios, total tareas, completadas, pendientes)
- Gestionar usuarios (crear, editar, eliminar, cambiar roles)
- Gestionar todas las tareas de cualquier usuario
- Filtrar tareas por usuario

## Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | Angular 22, TypeScript 6, Tailwind CSS 3, Angular Material |
| Backend | Spring Boot 4, Java 21, Spring Security, JWT |
| Base de datos | PostgreSQL |
| Build | Maven, npm |

## Estructura del Proyecto

```
TodoList/
├── backend/                    # API REST con Spring Boot
│   └── src/main/java/com/todolist/backend/
│       ├── config/            # Configuración de seguridad y datos
│       ├── controller/        # Endpoints REST (Auth, Todo, Admin)
│       ├── dto/               # Data Transfer Objects
│       ├── entity/            # Entidades JPA (User, Todo, Role)
│       ├── repository/        # Repositorios JPA
│       ├── security/          # JWT y filtros de seguridad
│       └── service/           # Lógica de negocio
│
├── frontend/                   # SPA con Angular
│   └── src/app/
│       ├── auth/              # Componentes de login y register
│       ├── components/        # Componentes principales
│       │   ├── navbar/        # Barra de navegación
│       │   ├── todo-list/     # Lista de tareas del usuario
│       │   └── admin/         # Panel de administración
│       │       ├── admin-dashboard/
│       │       ├── admin-users/
│       │       └── admin-todos/
│       ├── guards/            # Guards de autenticación
│       ├── interceptors/      # Interceptor JWT
│       ├── models/            # Modelos de datos
│       └── services/          # Servicios HTTP
│
└── README.md
```

## Usuarios por Defecto

Al iniciar el backend, se crean automáticamente dos usuarios administradores:

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| `admin` | `admin123` | ADMIN |
| `super` | `super123` | ADMIN |

## Comandos Principales

### Backend

```bash
# Navegar al directorio del backend
cd backend

# Ejecutar la aplicación (requiere PostgreSQL corriendo)
./mvnw spring-boot:run

# Compilar el proyecto
./mvnw clean compile

# Ejecutar tests
./mvnw test

# Empaquetar la aplicación
./mvnw clean package
```

En Windows sin Maven Wrapper:
```bash
mvnw.cmd spring-boot:run
mvnw.cmd clean compile
mvnw.cmd test
mvnw.cmd clean package
```

### Frontend

```bash
# Navegar al directorio del frontend
cd frontend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo (http://localhost:4200)
npm start

# Compilar para producción
npm run build

# Ejecutar tests
npm test

# Compilar en modo watch (desarrollo)
npm run watch
```

## Configuración

### Backend (application.properties)

```properties
# Puerto del servidor
server.port=8081

# Base de datos PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/todolist_db
spring.datasource.username=postgres
spring.datasource.password=tu_password

# JWT
jwt.secret=tu_clave_secreta
jwt.expiration=86400000

# CORS
spring.web.cors.allowed-origins=http://localhost:4200
```

### Frontend

El frontend se conecta al backend en `http://localhost:8081`. Para cambiar el puerto, modifica la variable `apiUrl` en los servicios:
- `src/app/services/auth.service.ts`
- `src/app/services/todo.service.ts`
- `src/app/services/admin.service.ts`

## API Endpoints

### Autenticación (público)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |

### Tareas (autenticado)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/todos` | Obtener mis tareas |
| POST | `/api/todos` | Crear tarea |
| PUT | `/api/todos/{id}` | Actualizar tarea |
| DELETE | `/api/todos/{id}` | Eliminar tarea |

### Admin (solo ADMIN)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/admin/users` | Listar todos los usuarios |
| GET | `/api/admin/users/{id}` | Obtener usuario por ID |
| POST | `/api/admin/users` | Crear usuario |
| PUT | `/api/admin/users/{id}` | Actualizar usuario |
| DELETE | `/api/admin/users/{id}` | Eliminar usuario |
| PATCH | `/api/admin/users/{id}/role` | Cambiar rol de usuario |
| GET | `/api/admin/todos` | Listar todas las tareas |
| GET | `/api/admin/todos/user/{userId}` | Tareas de un usuario |
| DELETE | `/api/admin/todos/{id}` | Eliminar cualquier tarea |

## Requisitos Previos

- Java 21 o superior
- Node.js 18 o superior
- npm 9 o superior
- PostgreSQL 14 o superior
- Maven 3.8 o superior (opcional, se usa Maven Wrapper)

## Base de Datos

1. Crear la base de datos en PostgreSQL:
```sql
CREATE DATABASE todolist_db;
```

2. El backend creará las tablas automáticamente al iniciar (usando `spring.jpa.hibernate.ddl-auto=update`).

## Autor

Leonardo Colas

## Licencia

Proyecto de aprendizaje - Uso educativo
