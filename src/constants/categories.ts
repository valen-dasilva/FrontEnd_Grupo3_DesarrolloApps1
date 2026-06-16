import { icons } from './icons';

export const categoryIconMap: Record<string, keyof typeof icons> = {
  'Cultura': 'Museum',
  'Naturaleza': 'Landscape',
  'Gastronomía': 'Restaurant',
  'Gastronomia': 'Restaurant',
  'Aventura': 'Hiking',
  'Noche': 'Nightlife',
  'Compras': 'ShoppingBag',
  'Compra': 'ShoppingBag',
};

/*
 * Mapa de colores por categoría. Cada valor es una key de themeColors
 */
export const categoryColorKey: Record<string, 'lightgreen' | 'orange' | 'primary' | 'brownlight' | 'gray'> = {
  'Naturaleza': 'lightgreen',
  'Gastronomía': 'orange',
  'Gastronomia': 'orange',
  'Cultura': 'primary',
  'Aventura': 'brownlight',
  'Noche': 'gray',
  'Compras': 'orange',
  'Compra': 'orange',
};
