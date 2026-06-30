import React from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useColorScheme';
import { Provincia, PROVINCIA_LABEL } from '@/types/itinerario';
import { PROVINCIAS_INFO } from '@/data/provinciasInfo';
import { REGION_LABEL_POR_PROVINCIA } from '@/data/logros';

interface Props {
  provincia: Provincia | null;
  fueVisitada: boolean;
  cantidadViajes: number;
  diasTotales: number;
  titulosItinerarios: string[];
  colorRegion: string;
  onClose: () => void;
}

export function ProvinciaDetalleModal({
  provincia,
  fueVisitada,
  cantidadViajes,
  diasTotales,
  titulosItinerarios,
  colorRegion,
  onClose,
}: Props) {
  const { theme } = useTheme();

  const nombreProvincia = provincia ? (PROVINCIA_LABEL[provincia] ?? provincia) : '';
  const regionLabel = provincia ? (REGION_LABEL_POR_PROVINCIA[provincia] ?? '') : '';
  const descripcion = provincia ? (PROVINCIAS_INFO[provincia]?.descripcion ?? '') : '';

  return (
    <Modal
      visible={provincia !== null}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.contenedor}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />

        <View style={[styles.sheet, { backgroundColor: theme.card }]}>
          <View style={styles.handleRow}>
            <View style={[styles.handle, { backgroundColor: theme.border }]} />
          </View>

          <View style={[styles.header, { backgroundColor: colorRegion }]}>
            <View style={styles.headerTop}>
              <View style={styles.regionBadge}>
                <Text style={styles.regionTexto}>{regionLabel}</Text>
              </View>
              <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={12}>
                <Ionicons name="close" size={16} color="white" />
              </Pressable>
            </View>
            <Text style={styles.provinciaNombre}>{nombreProvincia}</Text>
            <View style={styles.visitadaBadge}>
              <Ionicons
                name={fueVisitada ? 'checkmark-circle' : 'map-outline'}
                size={13}
                color="rgba(255,255,255,0.9)"
              />
              <Text style={styles.visitadaTexto}>
                {fueVisitada ? 'Visitada' : 'Sin visitar'}
              </Text>
            </View>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {fueVisitada && (
              <View style={styles.statsRow}>
                <View style={[styles.statCard, { backgroundColor: theme.surfaceNeutral }]}>
                  <Text style={[styles.statNumero, { color: colorRegion }]}>
                    {cantidadViajes}
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.gray }]}>
                    {cantidadViajes === 1 ? 'viaje' : 'viajes'}
                  </Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: theme.surfaceNeutral }]}>
                  <Text style={[styles.statNumero, { color: colorRegion }]}>
                    {diasTotales}
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.gray }]}>
                    {diasTotales === 1 ? 'día' : 'días'}
                  </Text>
                </View>
              </View>
            )}

            <Text style={[styles.descripcion, { color: theme.textSecondary }]}>
              {descripcion}
            </Text>

            {titulosItinerarios.length > 0 ? (
              <View style={styles.viajesSeccion}>
                <Text style={[styles.viajesLabel, { color: theme.gray }]}>
                  Tus viajes aquí
                </Text>
                {titulosItinerarios.map((titulo, i) => (
                  <View
                    key={i}
                    style={[styles.viajeItem, { backgroundColor: theme.surfaceNeutral }]}
                  >
                    <Ionicons name="briefcase-outline" size={15} color={colorRegion} />
                    <Text
                      style={[styles.viajeTitulo, { color: theme.text }]}
                      numberOfLines={1}
                    >
                      {titulo}
                    </Text>
                  </View>
                ))}
              </View>
            ) : !fueVisitada ? (
              <View style={[styles.noVisitadaMsg, { backgroundColor: theme.surfaceNeutral }]}>
                <Ionicons name="map-outline" size={24} color={theme.gray} />
                <Text style={[styles.noVisitadaTexto, { color: theme.textSecondary }]}>
                  Todavía no fuiste a {nombreProvincia}
                </Text>
                <Text style={[styles.noVisitadaSub, { color: theme.gray }]}>
                  ¡Puede ser tu próxima aventura!
                </Text>
              </View>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '78%',
    overflow: 'hidden',
  },
  handleRow: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 4,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  header: {
    marginHorizontal: 16,
    marginBottom: 4,
    borderRadius: 12,
    padding: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  regionBadge: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  regionTexto: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  closeBtn: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  provinciaNombre: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  visitadaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignSelf: 'flex-start',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  visitadaTexto: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  scrollContent: {
    padding: 16,
    paddingTop: 12,
    gap: 14,
    paddingBottom: 32,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  statNumero: {
    fontSize: 26,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  descripcion: {
    fontSize: 14,
    lineHeight: 22,
  },
  viajesSeccion: {
    gap: 6,
  },
  viajesLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  viajeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  viajeTitulo: {
    fontSize: 13,
    flex: 1,
  },
  noVisitadaMsg: {
    alignItems: 'center',
    gap: 6,
    borderRadius: 12,
    paddingVertical: 22,
    paddingHorizontal: 16,
  },
  noVisitadaTexto: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  noVisitadaSub: {
    fontSize: 12,
    textAlign: 'center',
  },
});
