import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useColorScheme';
import { LOGROS } from '@/data/logros';
import { LogroDetalleModal, type LogroDetalle } from './LogroDetalleModal';

interface Props {
  provinciasVisitadas: string[];
}

export function LogrosViajero({ provinciasVisitadas }: Props) {
  const { theme } = useTheme();
  const [logroSeleccionado, setLogroSeleccionado] = useState<LogroDetalle | null>(null);

  const visitadasSet = useMemo(() => new Set(provinciasVisitadas), [provinciasVisitadas]);

  const logrosCalculados = useMemo(
    () =>
      LOGROS.map(logro => {
        const visitadas = logro.provincias.filter(p => visitadasSet.has(p)).length;
        const total = logro.provincias.length;
        return { ...logro, visitadas, total, desbloqueado: visitadas === total };
      }),
    [visitadasSet],
  );

  const desbloqueados = logrosCalculados.filter(l => l.desbloqueado).length;

  return (
    <View style={styles.contenedor}>
      <View style={styles.tituloRow}>
        <Text style={[styles.titulo, { color: theme.text }]}>Logros de viajero</Text>
        <View style={[styles.contadorPill, { backgroundColor: theme.surfaceNeutral }]}>
          <Ionicons name="trophy" size={12} color={theme.warning} />
          <Text style={[styles.contadorTexto, { color: theme.textSecondary }]}>
            {desbloqueados}/{LOGROS.length}
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {logrosCalculados.map((logro, index) => (
          <Animated.View key={logro.id} entering={FadeInDown.delay(index * 70).duration(350)}>
            <Pressable
              onPress={() => setLogroSeleccionado(logro)}
              style={({ pressed }) => [
                styles.badge,
                {
                  backgroundColor: theme.card,
                  borderColor: logro.desbloqueado ? logro.color : theme.border,
                },
                pressed && styles.badgePressed,
              ]}
            >
              <View
                style={[
                  styles.circulo,
                  {
                    backgroundColor: logro.desbloqueado ? logro.color : theme.surfaceNeutral,
                  },
                ]}
              >
                {logro.desbloqueado ? (
                  <MaterialIcons name={logro.icono} size={26} color={theme.textInverse} />
                ) : (
                  <Ionicons name="lock-closed" size={20} color={theme.gray} />
                )}
              </View>

              <Text style={[styles.nombre, { color: theme.text }]} numberOfLines={1}>
                {logro.nombre}
              </Text>

              <View
                style={[
                  styles.progresoPill,
                  {
                    backgroundColor: logro.desbloqueado
                      ? `${logro.color}22`
                      : theme.surfaceNeutral,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.progresoTexto,
                    { color: logro.desbloqueado ? logro.color : theme.gray },
                  ]}
                >
                  {logro.desbloqueado ? '¡Logrado!' : `${logro.visitadas}/${logro.total}`}
                </Text>
              </View>
            </Pressable>
          </Animated.View>
        ))}
      </ScrollView>

      <LogroDetalleModal
        logro={logroSeleccionado}
        visitadasSet={visitadasSet}
        onClose={() => setLogroSeleccionado(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    marginBottom: 12,
  },
  tituloRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titulo: {
    fontSize: 14,
    fontWeight: '600',
  },
  contadorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  contadorTexto: {
    fontSize: 11,
    fontWeight: '700',
  },
  scrollContent: {
    gap: 10,
    paddingRight: 4,
  },
  badge: {
    width: 96,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  badgePressed: {
    opacity: 0.7,
  },
  circulo: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  nombre: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  progresoPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  progresoTexto: {
    fontSize: 11,
    fontWeight: '700',
  },
});
