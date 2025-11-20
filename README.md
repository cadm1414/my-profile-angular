# My Profile - Plataforma de Perfiles Profesionales

## 📋 Descripción del Proyecto

**My Profile** es una aplicación web moderna desarrollada con Angular 19 que permite a los usuarios crear, gestionar y compartir sus perfiles profesionales de manera sencilla y eficiente. La plataforma está diseñada para facilitar la presentación de información profesional mediante URLs personalizadas y la generación de CVs en formato PDF, ideal para procesos de búsqueda de empleo y networking profesional.

### 🎯 Funcionalidades Principales

- **Autenticación de Usuarios**: Sistema seguro de registro y login con gestión de tokens JWT
- **Gestión de Perfil**: Edición completa de información personal (nombre, apellido, correo electrónico)
- **Cambio de Contraseña**: Sistema seguro para actualizar credenciales con confirmación
- **Perfiles Profesionales**: Capacidad para crear y administrar perfiles profesionales
- **URLs Personalizadas**: Generación de enlaces únicos para compartir perfiles
- **Exportación a PDF**: Descarga de perfiles en formato PDF optimizado para CVs
- **Dashboard Interactivo**: Panel principal con acceso rápido a todas las funcionalidades

---

## 🏗️ Arquitectura y Buenas Prácticas

### Domain-Driven Design (DDD)

La aplicación implementa **Domain-Driven Design** con una separación clara de responsabilidades en contextos delimitados:

#### Contextos Implementados

1. **Auth Context** (Autenticación)
   - `domain/`: Interfaces y modelos de dominio (LoginRequest, LoginResponse, AuthState)
   - `infrastructure/`: Servicios de infraestructura (AuthApiService, LocalStorageService)
   - `application/`: Lógica de aplicación (Use Cases: LoginUseCase, LogoutUseCase, SaveTokenUseCase)
   - `presentation/`: Componentes UI y guards (LoginComponent, AuthGuard, PublicGuard)

2. **Identity Context** (Identidad y Perfil)
   - `domain/`: Interfaces (UserProfile, RegisterRequest, ChangePasswordRequest)
   - `infrastructure/`: API Services (IdentityApiService)
   - `application/`: Use Cases (RegisterUseCase, GetMeUseCase, UpdateProfileUseCase, ChangePasswordUseCase)
   - `presentation/`: Componentes (ProfileComponent, EditProfileComponent, ChangePasswordComponent)

3. **Shell Context** (Estructura de la Aplicación)
   - `presentation/layout/`: MainLayoutComponent con header, sidebar y footer
   - `presentation/components/`: Componentes reutilizables (HeaderComponent, SidebarComponent, FooterComponent)
   - `presentation/pages/`: DashboardComponent

### Ventajas de DDD en el Proyecto

- **Separación de Responsabilidades**: Cada capa tiene una responsabilidad clara y definida
- **Testabilidad**: Las capas están desacopladas, facilitando pruebas unitarias
- **Mantenibilidad**: Cambios en una capa no afectan directamente a otras
- **Escalabilidad**: Fácil agregar nuevos contextos sin impactar existentes
- **Claridad**: El código refleja el lenguaje del negocio

---

## 🎨 Patrón Facade

### Implementación de Facades

Los **Facades** actúan como orquestadores de estado, proporcionando una interfaz simplificada para interactuar con la lógica de negocio:

#### AuthFacade
```typescript
- Orquesta los Use Cases de autenticación
- Gestiona el estado reactivo con Signals (isAuthenticated, loading, error, token)
- NO maneja navegación (responsabilidad de la capa de presentación)
- NO llama directamente a servicios de infraestructura
```

#### IdentityFacade
```typescript
- Coordina operaciones de perfil y contraseña
- Mantiene estados separados (profileSuccess, passwordSuccess)
- Gestiona userProfile en memoria para evitar llamadas innecesarias a la API
- Expone computed signals para consumo reactivo
```

### Beneficios del Patrón Facade

- **Simplificación**: Los componentes no necesitan conocer la complejidad interna
- **Desacoplamiento**: Componentes solo dependen del facade, no de múltiples servicios
- **Reutilización**: Lógica común centralizada en un solo lugar
- **Estado Centralizado**: Single source of truth para cada contexto

---

## ⚡ Patrón Use Case

### Separación de Lógica de Negocio

Cada operación de negocio está encapsulada en un **Use Case** dedicado:

#### Ejemplos Implementados

- **LoginUseCase**: Ejecuta el login y retorna Observable\<LoginResponse\>
- **GetMeUseCase**: Obtiene datos del usuario autenticado
- **UpdateProfileUseCase**: Actualiza información del perfil
- **ChangePasswordUseCase**: Cambia la contraseña del usuario

### Ventajas de Use Cases

- **Single Responsibility Principle (SOLID)**: Cada use case tiene una única responsabilidad
- **Testabilidad**: Fácil de mockear y probar de forma aislada
- **Reutilización**: Use cases pueden ser consumidos por múltiples facades
- **Claridad**: Cada archivo representa una acción de negocio específica
- **Evolución**: Fácil agregar nueva lógica sin modificar existente

---

## 🚀 Angular Signals

### Gestión de Estado Reactivo

La aplicación utiliza **Angular Signals** como sistema de gestión de estado reactivo, reemplazando patrones tradicionales como RxJS BehaviorSubject para estado local:

#### Implementación

```typescript
// Estado privado mutable
private readonly authState = signal<AuthState>({
  isAuthenticated: false,
  loading: false,
  error: null,
  token: null
});

// Exposición pública con computed (readonly)
readonly isAuthenticated = computed(() => this.authState().isAuthenticated);
readonly loading = computed(() => this.authState().loading);
readonly error = computed(() => this.authState().error);
```

#### Estados Separados

```typescript
// Evita colisiones entre operaciones
private readonly profileUpdateSuccess = signal<boolean>(false);
private readonly passwordChangeSuccess = signal<boolean>(false);

readonly profileSuccess = computed(() => this.profileUpdateSuccess());
readonly passwordSuccess = computed(() => this.passwordChangeSuccess());
```

### Beneficios de Signals

- **Rendimiento**: Actualización granular, solo lo que cambia se re-renderiza
- **Simplicidad**: Sintaxis más clara que RxJS para estado local
- **Detección de Cambios Optimizada**: Compatible con OnPush Change Detection
- **Composición**: Computed signals derivan estado automáticamente
- **Debugging**: Más fácil rastrear cambios de estado

---

## 🔒 Principios SOLID Aplicados

### 1. Single Responsibility Principle (SRP)
- Cada Use Case tiene una única responsabilidad
- Facades solo orquestan, no ejecutan lógica de negocio
- Componentes solo manejan presentación y efectos de UI

### 2. Open/Closed Principle (OCP)
- Fácil extender funcionalidad agregando nuevos Use Cases sin modificar existentes
- Guards funcionales reutilizables

### 3. Liskov Substitution Principle (LSP)
- Interfaces bien definidas en la capa de dominio
- Servicios intercambiables que cumplen contratos

### 4. Interface Segregation Principle (ISP)
- Interfaces específicas por operación (LoginRequest, UpdateProfileRequest, ChangePasswordRequest)
- No hay interfaces "gordas" con métodos innecesarios

### 5. Dependency Inversion Principle (DIP)
- Facades dependen de abstracciones (Use Cases), no de implementaciones concretas
- Use Cases dependen de interfaces de dominio
- Inyección de dependencias con `inject()`

---

## 🎯 Optimizaciones Implementadas

### 1. Lazy Loading
```typescript
// Todas las rutas cargan componentes dinámicamente
loadComponent: () => import('./path').then(m => m.Component)
```
- **Beneficio**: Reducción del bundle inicial, carga bajo demanda

### 2. Standalone Components
```typescript
// Sin NgModules, imports directos en componentes
@Component({
  selector: 'app-profile',
  imports: [NzCardModule, EditProfileComponent, ChangePasswordComponent]
})
```
- **Beneficio**: Tree-shaking más efectivo, bundles más pequeños

### 3. OnPush Change Detection
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```
- **Beneficio**: Detección de cambios solo cuando signals/inputs cambian

### 4. Signals en lugar de Observables para Estado Local
- **Beneficio**: Menor overhead, sintaxis más simple, mejor rendimiento

### 5. Caché de Perfil en Memoria
```typescript
ngOnInit(): void {
  if (!this.identityFacade.userProfile()) {
    this.identityFacade.getMe();
  }
}
```
- **Beneficio**: Evita llamadas redundantes a la API

### 6. Effects para Side Effects
```typescript
effect(() => {
  if (this.authFacade.isAuthenticated()) {
    this.router.navigate(['/dashboard']);
  }
});
```
- **Beneficio**: Separación clara entre estado y efectos secundarios (navegación)

---

## 🛠️ Stack Tecnológico

- **Framework**: Angular 19
- **Lenguaje**: TypeScript (Strict Mode)
- **UI Library**: NG-ZORRO (Ant Design)
- **Estado**: Angular Signals
- **HTTP**: HttpClient con interceptores
- **Autenticación**: JWT Tokens en LocalStorage
- **Formularios**: Reactive Forms
- **Routing**: Angular Router con Guards funcionales
- **Iconos**: Ant Design Icons (importación estática)

---

## 📂 Estructura del Proyecto

```
src/
├── app/
│   ├── app.config.ts          # Configuración de providers
│   ├── app.routes.ts          # Definición de rutas
│   └── app.ts                 # Componente raíz
├── context/
│   ├── auth/
│   │   ├── domain/
│   │   │   └── interfaces/
│   │   ├── infrastructure/
│   │   │   └── services/
│   │   ├── application/
│   │   │   ├── use-cases/
│   │   │   └── facades/
│   │   └── presentation/
│   │       ├── pages/
│   │       └── guards/
│   ├── identity/
│   │   ├── domain/
│   │   ├── infrastructure/
│   │   ├── application/
│   │   │   ├── use-cases/
│   │   │   └── facades/
│   │   └── presentation/
│   │       └── pages/
│   └── shell/
│       └── presentation/
│           ├── layout/
│           ├── components/
│           └── pages/
└── environments/
```

---

## 🔐 Seguridad

- **Autenticación JWT**: Tokens Bearer en headers
- **Guards de Ruta**: `authGuard` y `publicGuard` protegen rutas
- **Validación de Formularios**: Validadores de Angular Forms
- **Confirmación de Acciones Críticas**: Modal de confirmación para cambio de contraseña
- **Gestión de Tokens**: LocalStorage con limpieza completa en logout

---

## 🚦 Flujo de Autenticación

1. Usuario ingresa credenciales en `/login`
2. `LoginComponent` llama a `AuthFacade.login()`
3. `AuthFacade` ejecuta `LoginUseCase`
4. `LoginUseCase` llama a `AuthApiService.login()`
5. Al éxito, `SaveTokenUseCase` guarda token en LocalStorage
6. `Effect` en `LoginComponent` detecta `isAuthenticated()` y navega a `/dashboard`
7. `AuthGuard` valida token en rutas protegidas
8. Al cerrar sesión, `LogoutUseCase` limpia LocalStorage
9. `Effect` en `HeaderComponent` detecta logout y redirige a `/login`

---

## 📱 Responsive Design

- Layout flexible con sidebar colapsable
- Header y footer fijos
- Contenido adaptable con NG-ZORRO Grid System
- Formularios responsive con `[nzSpan]="24"`

---

## 🔄 Próximas Funcionalidades

1. **Gestión de Perfiles Profesionales**: CRUD completo
2. **Generación de URLs**: Sistema de slugs únicos
3. **Exportación a PDF**: Plantillas profesionales
4. **Vista Pública**: Páginas sin autenticación para mostrar perfiles
5. **Sección de Eliminación de Cuenta**: Dar de baja usuario
6. **Subida de Imágenes**: Avatar y portada de perfil
7. **Temas**: Personalización visual del perfil

---

## 🚀 Comandos de Desarrollo

### Development server

Para iniciar el servidor de desarrollo local:

```bash
ng serve
```

Navega a `http://localhost:4200/`. La aplicación se recargará automáticamente cuando modifiques los archivos fuente.

### Building

Para construir el proyecto:

```bash
ng build
```

Los artefactos de construcción se almacenarán en el directorio `dist/`. Por defecto, la construcción de producción optimiza la aplicación para rendimiento y velocidad.

### Running tests

Para ejecutar las pruebas unitarias:

```bash
ng test
```

---

## 🎓 Aprendizajes y Conclusiones

Este proyecto demuestra la implementación exitosa de:

- **Arquitectura escalable** con DDD y separación de contextos
- **Patrones de diseño modernos** (Facade, Use Case, Repository)
- **Estado reactivo optimizado** con Angular Signals
- **Código limpio** siguiendo principios SOLID
- **Performance** mediante lazy loading y OnPush
- **Mantenibilidad** con estructura clara y predecible

La combinación de estas prácticas resulta en una aplicación robusta, fácil de mantener, testear y escalar, preparada para crecer con nuevas funcionalidades sin comprometer la calidad del código existente.

---

**Desarrollado con ❤️ usando Angular 19 y las mejores prácticas de desarrollo**
