# 🗺️ TuristeAR — Frontend Mobile

Aplicación móvil de turismo para Argentina desarrollada con **React Native + Expo**. Permite a los usuarios explorar itinerarios turísticos por provincia, guardar favoritos, personalizar actividades y llevar un seguimiento de su viaje activo.

---

## 📋 Tabla de Contenidos

- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Ejecución](#-instalación-y-ejecución)
- [Scripts Disponibles](#-scripts-disponibles)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Arquitectura](#-arquitectura)
- [Navegación y Rutas](#-navegación-y-rutas)
- [Servicios y API](#-servicios-y-api)
- [Estado Global y Hooks](#-estado-global-y-hooks)
- [Sistema de Diseño](#-sistema-de-diseño)
- [Testing](#-testing)
- [Variables de Entorno y Configuración](#-variables-de-entorno-y-configuración)
- [Convenciones del Código](#-convenciones-del-código)
- [Troubleshooting](#-troubleshooting)

---

## 🛠 Tecnologías

| Categoría           | Tecnología                                                                 |
| ------------------- | -------------------------------------------------------------------------- |
| **Framework**       | [Expo SDK 54](https://expo.dev/) + [React Native 0.81](https://reactnative.dev/) |
| **Lenguaje**        | TypeScript (strict mode)                                                   |
| **Navegación**      | [Expo Router v6](https://docs.expo.dev/router/introduction/) (file-based routing) |
| **Estado servidor** | [TanStack React Query v5](https://tanstack.com/query/latest)               |
| **HTTP Client**     | [Axios](https://axios-http.com/)                                           |
| **Storage local**   | [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) |
| **UI / Iconos**     | [Material Icons](https://fonts.google.com/icons) vía `@expo/vector-icons`  |
| **Tipografías**     | Inter (Regular, SemiBold, Bold) · Plus Jakarta Sans (Medium, Bold)         |
| **Animaciones**     | [React Native Reanimated v4](https://docs.swmansion.com/react-native-reanimated/) |
| **Imágenes**        | [expo-image](https://docs.expo.dev/versions/latest/sdk/image/)             |
| **Notificaciones**  | [react-native-toast-message](https://github.com/calintamas/react-native-toast-message) |
| **Testing**         | [Jest](https://jestjs.io/) + [React Native Testing Library](https://callstack.github.io/react-native-testing-library/) |

---

## ✅ Requisitos Previos

- **Node.js** ≥ 18.x  
- **npm** ≥ 9.x (viene con Node)
- **Expo CLI** (instalado automáticamente con `npx`)
- **Expo Go** en tu dispositivo móvil ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779)), o un emulador configurado:
  - [Android Studio Emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
  - [iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/) (solo macOS)

---

## 🚀 Instalación y Ejecución

```bash
# 1. Clonar el repositorio
git clone https://github.com/valen-dasilva/FrontEnd_Grupo3_DesarrolloApps1.git
cd FrontEnd_Grupo3_DesarrolloApps1

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npx expo start
```

En la terminal verás un **código QR**. Escaneálo con:
- **Android**: Expo Go → Escanear QR
- **iOS**: Cámara del iPhone → abre automáticamente en Expo Go

### Opciones de ejecución alternativas

```bash
# Abrir directamente en emulador Android
npm run android

# Abrir directamente en simulador iOS (solo macOS)
npm run ios

# Abrir en navegador web
npm run web
```

---

## 📜 Scripts Disponibles

| Script               | Comando            | Descripción                                         |
| -------------------- | ------------------ | --------------------------------------------------- |
| `npm start`          | `expo start`       | Inicia el dev server de Expo                        |
| `npm run android`    | `expo start --android` | Lanza en emulador/dispositivo Android           |
| `npm run ios`        | `expo start --ios` | Lanza en simulador/dispositivo iOS                  |
| `npm run web`        | `expo start --web` | Abre la app en el navegador                         |
| `npm run lint`       | `expo lint`        | Ejecuta ESLint sobre el proyecto                    |
| `npm test`           | `jest`             | Corre los tests unitarios                           |
| `npm run reset-project` | `node ./scripts/reset-project.js` | Limpia el directorio `app/` para empezar de cero |

---

## 📁 Estructura del Proyecto

```
FrontEnd_Grupo3_DesarrolloApps1/
├── app/                          # 📱 Rutas (Expo Router - file-based routing)
│   ├── _layout.tsx               #   Layout raíz: providers, fuentes, rutas protegidas
│   ├── index.tsx                  #   Splash screen (redirige según sesión)
│   ├── login.tsx                  #   Pantalla de login
│   ├── register.tsx               #   Pantalla de registro
│   └── (tabs)/                   #   Grupo con barra inferior de navegación
│       ├── _layout.tsx            #     Config de tabs + BottomNavBar custom
│       ├── index.tsx              #     Tab Inicio
│       ├── explorar.tsx           #     Tab Explorar
│       ├── favoritos.tsx          #     Tab Favoritos
│       ├── perfil.tsx             #     Tab Perfil
│       ├── (favorite)/            #     Stack anidado de favoritos
│       │   ├── _layout.tsx
│       │   ├── itinerarioInfoFav.tsx
│       │   ├── edicionItinerario.tsx
│       │   └── editActivityFormulary.tsx
│       ├── explorarApp/           #     Stack anidado de explorar
│       │   └── itinerarioInfo.tsx
│       ├── inicioApp/             #     Stack anidado de inicio
│       │   ├── preferencias.tsx
│       │   └── recomendaciones.tsx
│       └── perfilApp/             #     Stack anidado de perfil
│           ├── editarUsuario.tsx
│           └── cambiarContrasena.tsx
│
├── src/                          # 🧩 Código fuente de la aplicación
│   ├── components/               #   Componentes reutilizables
│   │   ├── AuthLayout.tsx         #     Layout para pantallas de auth
│   │   ├── CustomButton.tsx       #     Botón con variantes (primary, outline, etc.)
│   │   ├── CustomInput.tsx        #     Input con label, iconos y modo contraseña
│   │   ├── HeaderLogo.tsx         #     Header con logo de la app
│   │   ├── FiltrosBusqueda.tsx    #     Filtros de búsqueda por provincia/nombre
│   │   ├── SplashScreen.tsx       #     Pantalla de splash animada
│   │   ├── BottomSheet.tsx        #     Hoja inferior deslizable
│   │   ├── SheetHeader.tsx        #     Header de BottomSheet
│   │   ├── common/                #     Componentes comunes compartidos
│   │   │   ├── ActiveItineraryCard/   # Tarjeta del itinerario activo
│   │   │   ├── ActivityCard/          # Tarjeta de actividad individual
│   │   │   ├── BottomNavBar/          # Barra de navegación inferior custom
│   │   │   ├── CategoryBadge/         # Badge de categoría con icono y color
│   │   │   ├── ConfirmAlert/          # Diálogo de confirmación
│   │   │   ├── FavoriteButton/        # Botón de favorito (corazón)
│   │   │   ├── Header/               # Header genérico con back button
│   │   │   ├── OfflineBadge/          # Indicador de modo offline
│   │   │   └── UserAvatar/            # Avatar del usuario con fallback
│   │   ├── Explorar/             #     Componentes específicos de Explorar
│   │   │   ├── CardItinerarioExplorar.tsx   # Card de itinerario en explorar
│   │   │   ├── CardItinerarioInfo.tsx       # Card detalle de itinerario
│   │   │   └── FiltroCategoriasCarrusel.tsx # Carrusel de filtros por categoría
│   │   ├── favorites/            #     Componentes específicos de Favoritos
│   │   │   ├── CardItinerarioInfoFav.tsx
│   │   │   ├── editActivityFormulary/   # Formulario de edición de actividad
│   │   │   ├── favorite_principal/      # Lista principal de favoritos
│   │   │   └── itinerary_edit/          # Edición de itinerario
│   │   ├── Preferencias/         #     Componentes de selección de preferencias
│   │   └── Recomendaciones/      #     Componentes de recomendaciones
│   │
│   ├── screens/                  #   Pantallas (lógica de cada vista)
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── home/
│   │   │   ├── HomeScreen.tsx           # Inicio con itinerario activo
│   │   │   ├── PreferencesScreen.tsx    # Selección de preferencias turísticas
│   │   │   └── RecommendationsScreen.tsx # Itinerarios recomendados
│   │   ├── explore/
│   │   │   ├── ExploreScreen.tsx        # Explorar itinerarios públicos
│   │   │   └── ExploreItineraryDetailScreen.tsx # Detalle de itinerario
│   │   ├── favorites/
│   │   │   ├── FavoritesScreen.tsx      # Lista de favoritos guardados
│   │   │   ├── ItineraryInfoScreen.tsx  # Info detallada de itinerario favorito
│   │   │   ├── ItineraryEditScreen.tsx  # Edición de itinerario favorito
│   │   │   └── EditActivityScreen.tsx   # Edición de actividad
│   │   └── profile/
│   │       ├── ProfileScreen.tsx        # Perfil del usuario
│   │       ├── EditProfileScreen.tsx    # Edición de datos personales
│   │       ├── ChangePasswordScreen.tsx # Cambio de contraseña
│   │       └── passwordValidation.ts    # Validación de reglas de contraseña
│   │
│   ├── services/                 #   Capa de servicios (comunicación con backend)
│   │   ├── api.ts                 #     Instancia Axios, interceptores, ApiError
│   │   ├── authService.ts         #     Login y registro
│   │   ├── userService.ts         #     Perfil, foto, cambio de contraseña
│   │   ├── itinerarioService.ts   #     Itinerarios del sistema (explorar)
│   │   ├── favoritosService.ts    #     CRUD de favoritos del usuario
│   │   ├── itineraryStorage.ts    #     Almacenamiento offline de itinerarios
│   │   ├── storage.ts             #     AsyncStorage: token y sesión
│   │   └── queryClient.ts         #     Configuración de React Query
│   │
│   ├── hooks/                    #   Custom hooks
│   │   ├── useFavoritos.ts        #     Hook principal de favoritos + itinerario activo
│   │   ├── useFavoriteToggle.ts   #     Toggle de favorito con React Query
│   │   ├── useItinerarioDetalle.ts #    Detalle de itinerario con React Query
│   │   ├── useColorScheme.ts      #     Esquema de colores del dispositivo
│   │   └── useColorScheme.web.ts  #     Variante para web
│   │
│   ├── context/                  #   Contextos globales de React
│   │   ├── AuthContext.tsx        #     Sesión: login, logout, registro, usuario
│   │   └── ThemeContext.tsx        #     Tema claro/oscuro con toggle manual
│   │
│   ├── constants/                #   Constantes del diseño
│   │   ├── colors.ts              #     Paleta de colores (light + dark)
│   │   ├── fonts.ts               #     Familias, tamaños y pesos tipográficos
│   │   ├── icons.ts               #     Mapa de nombres de iconos Material Icons
│   │   ├── categories.ts          #     Mapas de iconos y colores por categoría
│   │   └── paddings.ts            #     Espaciados estándar
│   │
│   ├── types/                    #   Definiciones de tipos TypeScript
│   │   └── itinerario.ts          #     DTOs, enums (Categoría, Provincia), interfaces
│   │
│   └── utils/                    #   Utilidades
│       └── dateUtils.ts           #     Formateo y cálculos de fechas
│
├── assets/                       # 🎨 Assets estáticos
│   ├── icono.png                  #     Ícono de la app y splash screen
│   └── images/                    #     Imágenes estáticas
│
├── app.json                      # Configuración de Expo
├── babel.config.js               # Configuración de Babel
├── metro.config.js               # Configuración de Metro bundler (SVG support)
├── tsconfig.json                 # Configuración de TypeScript
├── eslint.config.js              # Configuración de ESLint
├── jest.setup.js                 # Setup global para tests
├── package.json                  # Dependencias y scripts
└── svg.d.ts                      # Declaración de tipos para importar SVGs
```

---

## 🏗 Arquitectura

La app sigue una arquitectura de **capas separadas** con flujo unidireccional de datos:

```
┌─────────────────────────────────────────────────┐
│                   app/ (Rutas)                  │
│         Expo Router · File-based Routing        │
└───────────────────────┬─────────────────────────┘
                        │ renderiza
┌───────────────────────▼─────────────────────────┐
│              src/screens/ (Pantallas)            │
│          Lógica de vista · Composición UI        │
└───────────────────────┬─────────────────────────┘
                        │ usa
┌───────────────────────▼─────────────────────────┐
│           src/components/ (Componentes)          │
│       UI reutilizable · Presentación pura        │
└───────────────────────┬─────────────────────────┘
                        │ consume
┌───────────────────────▼─────────────────────────┐
│    src/hooks/      │    src/context/             │
│  Custom Hooks      │  Auth · Theme (Providers)   │
│  React Query       │  Estado global              │
└───────────────────────┬─────────────────────────┘
                        │ llama
┌───────────────────────▼─────────────────────────┐
│             src/services/ (Servicios)            │
│   API calls · Storage · Query Client config      │
└───────────────────────┬─────────────────────────┘
                        │
               ┌────────▼────────┐
               │  Backend REST   │
               │  (Render.com)   │
               └─────────────────┘
```

### Principios Clave

1. **File-based Routing**: Las rutas se definen con la estructura de archivos en `app/`. Cada archivo `.tsx` es una ruta automática.
2. **Separación Screen/Component**: Las pantallas (`screens/`) orquestan la lógica; los componentes (`components/`) son presentacionales.
3. **Server State con React Query**: Todo estado que viene del backend se maneja con `useQuery`/`useMutation` de TanStack Query. Invalidación de cache automática con `queryClient.invalidateQueries`.
4. **Client State con Context**: Solo `AuthContext` (sesión) y `ThemeContext` (tema) usan Context API — el mínimo indispensable.
5. **Capa de servicios delgada**: Los archivos de `services/` son funciones puras que llaman a la API y devuelven datos tipados. No manejan estado.

---

## 🧭 Navegación y Rutas

La app usa **Expo Router** con file-based routing. La estructura de navegación es:

```
Raíz (_layout.tsx)
├── index          → Splash (redirige según sesión)
├── login          → Pantalla de login
├── register       → Pantalla de registro
└── (tabs)         → Grupo con Bottom Tab Navigation
    ├── index           → 🏠 Inicio (itinerario activo + acciones)
    ├── explorar        → 🔍 Explorar itinerarios públicos
    ├── favoritos       → ❤️ Mis itinerarios guardados
    ├── perfil          → 👤 Mi perfil
    ├── inicioApp/      → Stack: Preferencias, Recomendaciones
    ├── explorarApp/    → Stack: Detalle de itinerario
    ├── (favorite)/     → Stack: Info, Edición, Actividades
    └── perfilApp/      → Stack: Editar perfil, Cambiar contraseña
```

### Rutas Protegidas

El hook `useProtectedRoute()` en `app/_layout.tsx` redirige automáticamente:
- **Con sesión** en login/register → redirige a `/(tabs)`
- **Sin sesión** fuera de auth → redirige a `/login`

---

## 🌐 Servicios y API

### Base URL

```
https://turistear-back.onrender.com
```

### Interceptores (api.ts)

- **Request**: Adjunta automáticamente el JWT como `Authorization: Bearer <token>`
- **Response**: 
  - 401/403 → Ejecuta logout automático
  - Errores de red → Mensaje amigable en español
  - Todos los errores → Se convierten a `ApiError(status, message)`

### Endpoints Consumidos

| Servicio              | Método | Endpoint                              | Descripción                           |
| --------------------- | ------ | ------------------------------------- | ------------------------------------- |
| **Auth**              | POST   | `/auth/login`                         | Iniciar sesión                        |
|                       | POST   | `/auth/register`                      | Crear cuenta                          |
| **Usuarios**          | GET    | `/users/:id`                          | Obtener perfil                        |
|                       | PUT    | `/users/:id`                          | Actualizar perfil                     |
|                       | PUT    | `/users/:id/password`                 | Cambiar contraseña                    |
| **Itinerarios**       | GET    | `/itinerarios`                        | Listar itinerarios del sistema        |
|                       | GET    | `/itinerarios/:id`                    | Detalle de un itinerario              |
|                       | GET    | `/itinerarios/buscar?query=...`       | Buscar por texto                      |
| **Favoritos**         | GET    | `/favoritos`                          | Listar favoritos del usuario          |
|                       | POST   | `/favoritos`                          | Guardar en favoritos                  |
|                       | DELETE | `/favoritos/:id`                      | Quitar de favoritos                   |
|                       | GET    | `/favoritos/activo`                   | Itinerario activo actual              |
|                       | PUT    | `/favoritos/:id/anclar`               | Anclar/desanclar itinerario           |
|                       | PUT    | `/favoritos/:id/items`                | Actualizar actividades                |
|                       | PUT    | `/favoritos/:id/fechas`               | Actualizar fechas                     |

### Almacenamiento de Imágenes

Las fotos de perfil se suben a **Supabase Storage** (bucket `fotos-usuarios`) directamente desde el cliente.

---

## 🪝 Estado Global y Hooks

### Context Providers

| Provider           | Archivo                 | Qué maneja                                    |
| ------------------ | ----------------------- | --------------------------------------------- |
| `QueryClientProvider` | `services/queryClient.ts` | Cache de React Query (stale: 5min, gc: 15min) |
| `ThemeProvider`    | `context/ThemeContext.tsx` | Tema claro/oscuro con detección del sistema  |
| `AuthProvider`     | `context/AuthContext.tsx` | Sesión: user, token, login, logout, register  |

**Orden de montaje** (en `app/_layout.tsx`):
```
QueryClientProvider → ThemeProvider → AuthProvider → NavigationThemeProvider
```

### Custom Hooks

| Hook                    | Responsabilidad                                                         |
| ----------------------- | ----------------------------------------------------------------------- |
| `useFavoritos()`        | Lista de favoritos, itinerario activo, pin/unpin, delete, edición de items/fechas |
| `useFavoriteToggle()`   | Agregar/quitar de favoritos con invalidación de cache                   |
| `useItinerarioDetalle()`| Fetch del detalle de un itinerario con React Query                      |
| `useAuth()`             | Acceso al contexto de autenticación                                     |
| `useTheme()`            | Acceso al tema actual y función de toggle                               |
| `useColorScheme()`      | Esquema de color actual ('light' | 'dark')                              |

### React Query — Claves de Cache

| Query Key            | Datos                                         |
| -------------------- | --------------------------------------------- |
| `['favorites']`      | Lista de itinerarios favoritos del usuario     |
| `['activeItinerary']`| Itinerario activo (en curso) del usuario       |
| `['itinerarios']`    | Lista de itinerarios del sistema               |
| `['itinerario', id]` | Detalle de un itinerario específico            |
| `['downloadedIds']`  | IDs de itinerarios descargados para offline    |

---

## 🎨 Sistema de Diseño

### Colores (`src/constants/colors.ts`)

La app soporta **modo claro y oscuro** con paletas completas:

| Token             | Light       | Dark        | Uso                          |
| ----------------- | ----------- | ----------- | ---------------------------- |
| `primary`         | `#2563eb`   | `#2563eb`   | Acento principal (azul)      |
| `background`      | `#FAF8FF`   | `#11131A`   | Fondo de pantalla            |
| `surface`         | `#FFFFFF`   | `#1E222B`   | Tarjetas y hojas             |
| `text`            | `#333333`   | `#ECEDEE`   | Texto principal              |
| `textSecondary`   | `#666666`   | `#9CA3AF`   | Texto secundario             |
| `border`          | `#E2E8F0`   | `#2A303C`   | Bordes y separadores         |
| `danger`          | `#FF3B30`   | `#FF3B30`   | Acciones destructivas        |
| `warning`         | `#FFC107`   | `#FFC107`   | Alertas                      |

**Uso en componentes:**
```tsx
import { useTheme } from '@/hooks/useColorScheme';

const { theme } = useTheme();
// theme.primary, theme.background, theme.text, etc.
```

### Tipografías (`src/constants/fonts.ts`)

| Familia                  | Uso                              |
| ------------------------ | -------------------------------- |
| `PlusJakartaSans_700Bold`| Títulos principales              |
| `PlusJakartaSans_500Medium`| Subtítulos                     |
| `Inter_600SemiBold`      | Labels y botones                 |
| `Inter_400Regular`       | Cuerpo de texto                  |

**Tamaños:** `xs` (12) · `sm` (14) · `md` (16) · `lg` (18) · `xl` (20) · `xxl` (24) · `xxxl` (32)

### Iconos (`src/constants/icons.ts`)

Se usa **Material Icons** a través de `@expo/vector-icons/MaterialIcons`. Todos los nombres se importan desde el mapa centralizado:

```tsx
import { icons } from '@/constants/icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

<MaterialIcons name={icons.FavoriteFilled} size={24} color={theme.primary} />
```

### Categorías de Itinerario

| Categoría     | Icono       | Color clave   |
| ------------- | ----------- | ------------- |
| Naturaleza    | 🏔 landscape | `lightgreen`  |
| Gastronomía   | 🍽 restaurant| `orange`      |
| Cultura       | 🏛 museum    | `primary`     |
| Aventura      | 🥾 hiking    | `brownlight`  |
| Noche         | 🌙 nightlife | `gray`        |
| Compras       | 🛍 shopping  | `orange`      |

---

## 🧪 Testing

### Configuración

- **Framework**: Jest + jest-expo
- **Testing Library**: `@testing-library/react-native`
- **Setup global**: `jest.setup.js` (mocks de AsyncStorage, expo-router, etc.)
- **Path aliases**: Configurados en `package.json` → jest.moduleNameMapper

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Con watch mode
npx jest --watch

# Un archivo específico
npx jest src/components/FiltrosBusqueda.test.tsx

# Con cobertura
npx jest --coverage
```

### Tests Existentes

| Archivo                                    | Qué testea                           |
| ------------------------------------------ | ------------------------------------ |
| `FiltrosBusqueda.test.tsx`                 | Filtros de búsqueda por provincia    |
| `CardItinerarioExplorar.test.tsx`          | Card de explorar con favoritos       |
| `CardItinerarioInfo.test.tsx`              | Card de info con actividades         |
| `FiltroCategoriasCarrusel.test.tsx`        | Carrusel de categorías               |
| `CardItinerarioInfoFav.test.tsx`           | Card de favoritos                    |
| `userService.test.ts`                      | Servicio de usuario                  |
| `passwordValidation.test.ts`               | Reglas de validación de contraseña   |

---

## ⚙️ Variables de Entorno y Configuración

### Backend URL

La URL del backend está hardcodeada en `src/services/api.ts`:

```ts
const BASE_URL = 'https://turistear-back.onrender.com';
```

> **Nota**: Para desarrollo local contra un backend propio, cambiar la `BASE_URL` en `api.ts`. La función `getHost()` ya maneja la resolución de `localhost` según la plataforma (emulador Android usa `10.0.2.2`).

### Supabase Storage

Las credenciales de Supabase para subir fotos de perfil están en `src/services/userService.ts`. El bucket `fotos-usuarios` es público.

### Expo Config (`app.json`)

| Campo                 | Valor                |
| --------------------- | -------------------- |
| `name`                | ProyectoTuristear    |
| `slug`                | ProyectoTuristear    |
| `version`             | 1.0.0                |
| `orientation`         | portrait             |
| `scheme`              | miapp                |
| `newArchEnabled`      | false                |
| `typedRoutes`         | true                 |

---

## 📐 Convenciones del Código

### Estructura de Archivos

- **Pantallas**: `src/screens/<modulo>/NombreScreen.tsx`
- **Componentes**: `src/components/<modulo>/NombreComponente.tsx`
- **Estilos**: Archivo separado `*.styles.ts` junto al componente usando `StyleSheet.create()`
- **Hooks**: `src/hooks/useNombre.ts`
- **Servicios**: `src/services/nombreService.ts`
- **Tests**: Junto al archivo que testean con sufijo `.test.tsx` o `.test.ts`

### Path Aliases

Configurados en `tsconfig.json`:
```
@/*        →  ./src/*
@/assets/* →  ./assets/*
```

### Patrones de Código

- **Servicios**: Funciones puras que devuelven `Promise<T>`. No manejan estado.
- **Hooks con React Query**: Usan `useQuery` para reads y `useMutation` para writes con invalidación de cache.
- **Componentes**: Reciben tema vía `useTheme()`. No hardcodear colores.
- **Iconos**: Siempre importar desde `@/constants/icons` en vez de strings directos.
- **Colores**: Siempre usar `theme.propiedad` desde `useTheme()` para soportar modo oscuro.
- **Tipografías**: Usar constantes de `@/constants/fonts` en vez de strings.

---

## 🔧 Troubleshooting

### Error: "No hay conexión con el servidor"

El backend está hosteado en [Render.com](https://render.com) (plan gratuito). El servidor se "duerme" después de inactividad. **La primera request puede tardar ~30 segundos** mientras se despierta.

### El emulador Android no conecta al backend local

Si estás corriendo el backend en tu máquina, asegúrate de que la `BASE_URL` use `10.0.2.2` (el alias de localhost del emulador Android):

```ts
const BASE_URL = 'http://10.0.2.2:8080';
```

### Metro bundler: cache corrupto

```bash
npx expo start --clear
```

### Error con fuentes que no cargan

Verificar que `MaterialIcons.font` esté incluido en el `useFonts()` de `app/_layout.tsx`. Sin esto, los íconos no renderizan.

### Tests fallan con "Cannot find module @/..."

Los path aliases de Jest están configurados en `package.json` bajo `jest.moduleNameMapper`. Verificar que los patrones coincidan con los de `tsconfig.json`.

### AsyncStorage warnings en tests

Son normales y se deben a los mocks en `jest.setup.js`. No afectan el resultado de los tests.

---

## 👥 Equipo — Grupo 3

Desarrollo de Aplicaciones 1

---

> **Backend repo**: El backend de esta aplicación se comunica vía REST API y está desplegado en Render.com.
