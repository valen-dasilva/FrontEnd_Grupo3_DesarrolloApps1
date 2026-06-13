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
