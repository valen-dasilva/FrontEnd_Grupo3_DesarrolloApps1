export interface WeatherInfo {
  emoji: string;
  label: string;
}

export function getWeatherInfo(code: number): WeatherInfo {
  if (code === 0)                    return { emoji: '☀️',  label: 'Despejado' };
  if (code <= 2)                     return { emoji: '🌤️', label: 'Mayormente despejado' };
  if (code === 3)                    return { emoji: '☁️',  label: 'Nublado' };
  if (code <= 48)                    return { emoji: '🌫️', label: 'Niebla' };
  if (code <= 57)                    return { emoji: '🌦️', label: 'Llovizna' };
  if (code <= 67)                    return { emoji: '🌧️', label: 'Lluvia' };
  if (code <= 77)                    return { emoji: '❄️',  label: 'Nieve' };
  if (code <= 82)                    return { emoji: '🌦️', label: 'Chubascos' };
  if (code <= 86)                    return { emoji: '🌨️', label: 'Nieve con viento' };
  return                                    { emoji: '⛈️',  label: 'Tormenta' };
}

const DAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export function formatWeatherDate(dateStr: string): { dayName: string; dayMonth: string } {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return {
    dayName: DAYS_ES[date.getDay()],
    dayMonth: `${day}/${month}`,
  };
}

export interface WeatherDay {
  date: string;
  dayName: string;
  dayMonth: string;
  weatherCode: number;
  maxTemp: number;
  minTemp: number;
  emoji: string;
  label: string;
}

export function isBadWeather(code: number): boolean {
  return code >= 51;
}

export function getDiaDate(fechaInicio: string, dia: number): string {
  const [year, month, day] = fechaInicio.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + (dia - 1));
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function isInForecastWindow(fechaInicio: string, fechaFin: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxForecast = new Date(today);
  maxForecast.setDate(today.getDate() + 14);

  const start = new Date(fechaInicio);
  const end = new Date(fechaFin);

  // El rango solapa con [today, maxForecast]
  return start <= maxForecast && end >= today;
}
