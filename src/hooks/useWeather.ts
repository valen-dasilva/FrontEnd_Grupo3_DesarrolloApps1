import { useQuery } from '@tanstack/react-query';
import { Coords } from '@/utils/provinciaCoords';
import { WeatherDay, getWeatherInfo, formatWeatherDate, isInForecastWindow } from '@/utils/weatherUtils';

interface UseWeatherParams {
  coords: Coords;
  fechaInicio: string;
  fechaFin: string;
}

interface WeatherResult {
  available: boolean;
  days: WeatherDay[];
}

async function fetchWeather(
  coords: Coords,
  fechaInicio: string,
  fechaFin: string,
): Promise<WeatherResult> {
  if (!isInForecastWindow(fechaInicio, fechaFin)) {
    return { available: false, days: [] };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxForecast = new Date(today);
  maxForecast.setDate(today.getDate() + 14);

  // Ajustamos el rango al overlap entre el itinerario y la ventana de forecast
  const start = new Date(Math.max(new Date(fechaInicio).getTime(), today.getTime()));
  const end   = new Date(Math.min(new Date(fechaFin).getTime(),   maxForecast.getTime()));

  const startStr = start.toISOString().split('T')[0];
  const endStr   = end.toISOString().split('T')[0];

  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${coords.lat}&longitude=${coords.lng}` +
    `&daily=weathercode,temperature_2m_max,temperature_2m_min` +
    `&timezone=America%2FArgentina%2FBuenos_Aires` +
    `&start_date=${startStr}&end_date=${endStr}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Error al obtener el clima');

  const json = await response.json();
  const { time, weathercode, temperature_2m_max, temperature_2m_min } = json.daily;

  const days: WeatherDay[] = (time as string[]).map((date: string, i: number) => {
    const code = weathercode[i] as number;
    const { emoji, label } = getWeatherInfo(code);
    const { dayName, dayMonth } = formatWeatherDate(date);
    return {
      date,
      dayName,
      dayMonth,
      weatherCode: code,
      maxTemp: Math.round(temperature_2m_max[i] as number),
      minTemp: Math.round(temperature_2m_min[i] as number),
      emoji,
      label,
    };
  });

  return { available: true, days };
}

export function useWeather({ coords, fechaInicio, fechaFin }: UseWeatherParams) {
  const enabled = !!fechaInicio && !!fechaFin && !!(coords.lat || coords.lng);

  return useQuery<WeatherResult>({
    queryKey: ['weather', coords.lat, coords.lng, fechaInicio, fechaFin],
    queryFn: () => fetchWeather(coords, fechaInicio, fechaFin),
    staleTime: 30 * 60 * 1000,
    enabled,
    retry: 1,
  });
}
