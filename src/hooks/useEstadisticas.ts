import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { getEstadisticas } from '@/services/userService';

export function useEstadisticas() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['estadisticas', user?.idUsuario],
    queryFn: getEstadisticas,
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
}
