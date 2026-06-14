/**
 * Documento de Constantes de Colores de TuristeAR
 * 
 * Este archivo contiene la paleta de colores empleada tanto para el modo base (claro)
 * como para el modo oscuro, respetando las especificaciones del diseño:
 * 
 * - MODO OSCURO:
 *   - Background: '#11131A' (Fondo base oscuro solicitado)
 *   - Card/Surface: '#1E222B' (Ligeramente más claro para las tarjetas y hojas)
 *   - Text: '#ECEDEE' / '#9CA3AF' (Para máxima legibilidad sobre fondo oscuro)
 *   - Border: '#2A303C' (Sutil contraste para separar secciones)
 *   - Onboarding Gradient: '#11131A' a '#1A1D26' (Paleta oscura premium)
 * 
 * - MODO CLARO (Base):
 *   - Background: '#FAF8FF'
 *   - Card/Surface: '#FFFFFF'
 *   - Text: '#333333' / '#666666'
 *   - Border: '#F0F0F0'
 *   - Onboarding Gradient: '#4C7BF4' a '#1E40AF' (Azul vibrante)
 */

const themeColors = {
  light: {
    primary: '#2563eb',
    background: '#FAF8FF',
    surface: '#FFFFFF',
    surfaceHighlight: '#E8F0FE',
    surfaceNeutral: '#F0F4F8',
    surfaceNeutralAlt: '#F5F7FA',
    text: '#333333',
    textSecondary: '#666666',
    textInverse: '#FFFFFF',
    border: '#E2E8F0',
    borderDark: '#E0E0E0',
    warning: '#FFC107',
    danger: '#FF3B30',
    transparent: 'transparent',
    black: '#000000',
    card: '#FFFFFF',
    gray: '#8A8A9E',
    inputBg: '#FFFFFF',
    gradientStart: '#4C7BF4',
    gradientEnd: '#1E40AF',
    brownlight: '#98755C',
    lightgreen: '#57A773',
    orange: '#ffa600',
    button_gray: '#646770',
    avatarBg: '#D6E0F5',
    categorySelected: '#EFF4FF',
  },
  dark: {
    primary: '#2563eb',
    background: '#11131A', // Fondo oscuro principal
    surface: '#1E222B', // Tarjetas / Hojas
    surfaceHighlight: '#2A303D',
    surfaceNeutral: '#191D26',
    surfaceNeutralAlt: '#141720',
    text: '#ECEDEE', // Texto principal
    textSecondary: '#9CA3AF', // Texto secundario
    textInverse: '#FFFFFF',
    border: '#2A303C', // Bordes oscuros
    borderDark: '#3A4256',
    warning: '#FFC107',
    danger: '#FF3B30',
    transparent: 'transparent',
    black: '#000000',
    card: '#1E222B', // Fondo de tarjetas
    gray: '#8E9AA8',
    inputBg: '#1E222B', // Fondo de inputs
    gradientStart: '#11131A', // Fondo del onboarding en modo oscuro
    gradientEnd: '#1A1D26',
    brownlight: '#B28E75',
    lightgreen: '#74C390',
    orange: '#FFB833',
    button_gray: '#8C8F9E',
    avatarBg: '#2A303D',
    categorySelected: '#2A303D',
  }
};

export const colors = {
  ...themeColors.light, // Soporte retrocompatible para estilos estáticos
  light: themeColors.light,
  dark: themeColors.dark
};
