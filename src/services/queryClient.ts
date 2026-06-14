import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 15, // 15 minutos (antes cacheTime)
      refetchOnWindowFocus: false, // Desactivar en móvil para evitar llamadas al reabrir la app
      retry: 1, // Reintentar una vez
    },
  },
});
