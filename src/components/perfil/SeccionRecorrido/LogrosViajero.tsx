import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useColorScheme';
import { Provincia } from '@/types/itinerario';
import { LogroDetalleModal, type LogroDetalle } from './LogroDetalleModal';

// Logros por región turística de Argentina. Cada uno se desbloquea al haber
// visitado TODAS las provincias de la región. La lógica es 100% local: se
// compara contra el set de provincias visitadas que ya devuelve el backend.
interface Logro {
  id: string;
  nombre: string;
  emoji: string;
  color: string;
  descripcion: string;
  provincias: Provincia[];
}

const LOGROS: Logro[] = [
  {
    id: 'noa',
    nombre: 'Norteño/a',
    emoji: '⛰️',
    color: '#C97B4A',
    descripcion: 'El alma del norte argentino: quebradas de colores, cerros y vino de altura.',
    provincias: [
      Provincia.JUJUY,
      Provincia.SALTA,
      Provincia.TUCUMAN,
      Provincia.CATAMARCA,
      Provincia.LA_RIOJA,
      Provincia.SANTIAGO_DEL_ESTERO,
    ],
  },
  {
    id: 'litoral',
    nombre: 'Litoraleño/a',
    emoji: '🌴',
    color: '#3FA34D',
    descripcion: 'Tierra de ríos, selva subtropical y las Cataratas del Iguazú.',
    provincias: [
      Provincia.FORMOSA,
      Provincia.CHACO,
      Provincia.CORRIENTES,
      Provincia.MISIONES,
      Provincia.ENTRE_RIOS,
    ],
  },
  {
    id: 'cuyo',
    nombre: 'Cuyano/a',
    emoji: '🍷',
    color: '#8E2C48',
    descripcion: 'La cuna del vino argentino, al pie de la cordillera de los Andes.',
    provincias: [Provincia.MENDOZA, Provincia.SAN_JUAN, Provincia.SAN_LUIS],
  },
  {
    id: 'centro',
    nombre: 'Pampeano/a',
    emoji: '🌾',
    color: '#D4A12E',
    descripcion: 'El corazón del país: pampas infinitas, sierras y grandes ciudades.',
    provincias: [
      Provincia.CORDOBA,
      Provincia.SANTA_FE,
      Provincia.BUENOS_AIRES,
      Provincia.LA_PAMPA,
      Provincia.CABA,
    ],
  },
  {
    id: 'patagonia',
    nombre: 'Patagónico/a',
    emoji: '🏔️',
    color: '#3B82C4',
    descripcion: 'Glaciares, lagos, montañas y el fin del mundo en Ushuaia.',
    provincias: [
      Provincia.NEUQUEN,
      Provincia.RIO_NEGRO,
      Provincia.CHUBUT,
      Provincia.SANTA_CRUZ,
      Provincia.TIERRA_DEL_FUEGO,
    ],
  },
  {
    id: 'argentina',
    nombre: 'Toda la Argentina',
    emoji: '🇦🇷',
    color: '#3F73E3',
    descripcion: 'De La Quiaca a Ushuaia: recorriste el país de punta a punta.',
    provincias: Object.values(Provincia),
  },
];

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
                  <Text style={styles.emoji}>{logro.emoji}</Text>
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
  emoji: {
    fontSize: 26,
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
