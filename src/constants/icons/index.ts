/**
 * Nombres de los íconos de la aplicación.
 * Estos nombres corresponden a Material Symbols (snake_case)
 * que son compatibles con expo-symbols en Android/Web.
 */
export const icons = {
  // Generales
  ArrowForward: 'arrow_forward',
  ArrowBack: 'arrow_back',
  AddLocationAlt: 'add_location_alt',
  CalendarToday: 'calendar_today',
  CalendarMonth: 'calendar_month',
  RocketLaunch: 'rocket_launch',
  Favorite: 'favorite', 
  FavoriteBorder: 'favorite_border',
  Bookmark: 'bookmark', 
  BookmarkBorder: 'bookmark_border',
  Schedule: 'schedule',
  PhotoCamera: 'photo_camera',
  Lock: 'lock',
  Logout: 'logout',
  Visibility: 'visibility',
  VisibilityOff: 'visibility_off',
  Star: 'star',
  Location: 'location_on',
  Time: 'schedule',

  // Categorías / Actividades
  Landscape: 'landscape',
  Hiking: 'hiking',
  Restaurant: 'restaurant',
  Museum: 'museum',
  Nightlife: 'nightlife',
  ShoppingBag: 'shopping_bag',
  Culture: 'theater_comedy',
  Nature: 'forest',

  // Topbar / Tema
  DarkMode: 'dark_mode',
  LightMode: 'light_mode',

  // Tab Bar (Navegación principal)
  Home: 'home',
  Explore: 'explore',
  Person: 'person',
  Heart: 'favorite',
} as const satisfies Record<string, string>;

export type AppIconKey = keyof typeof icons;
export type MaterialIconName = typeof icons[AppIconKey];
