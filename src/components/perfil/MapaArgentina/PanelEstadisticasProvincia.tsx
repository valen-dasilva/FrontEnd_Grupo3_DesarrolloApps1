import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { PROVINCIA_LABEL, Provincia } from '@/types/itinerario';

interface Props {
  provincia: Provincia;
  fueVisitada: boolean;
  cantidadViajes: number;
  diasTotales: number;
  titulosItinerarios: string[];
  colorVisitada: string;
  theme: Record<string, string>;
}

export function PanelEstadisticasProvincia({
  provincia,
  fueVisitada,
  cantidadViajes,
  diasTotales,
  titulosItinerarios,
  colorVisitada,
  theme,
}: Props) {
  return (
    <View style={[styles.panelEstadisticas, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
      <View style={styles.filaPrincipalPanel}>

        {/* Izquierda: nombre de provincia + badge "Visitada / Sin visitar" */}
        <View style={styles.columnaIzquierdaPanel}>
          <Text style={[styles.nombreProvinciaSeleccionada, { color: theme.text }]}>
            {PROVINCIA_LABEL[provincia] ?? provincia}
          </Text>
          <View style={[
            styles.badgeEstadoVisita,
            {
              backgroundColor: fueVisitada
                ? colorVisitada + '22'
                : theme.border,
            },
          ]}>
            <MaterialIcons
              name={fueVisitada ? 'check-circle' : 'radio-button-unchecked'}
              size={14}
              color={fueVisitada ? colorVisitada : theme.gray}
            />
            <Text style={[styles.textoEstadoVisita, { color: fueVisitada ? colorVisitada : theme.gray }]}>
              {fueVisitada ? 'Visitada' : 'Sin visitar'}
            </Text>
          </View>
        </View>

        {/* Derecha: contadores de viajes y días (solo si fue visitada) */}
        {fueVisitada && (
          <View style={styles.columnaDerecha}>
            <View style={styles.itemContador}>
              <Text style={[styles.numeroContador, { color: colorVisitada }]}>
                {cantidadViajes}
              </Text>
              <Text style={[styles.etiquetaContador, { color: theme.gray }]}>
                {cantidadViajes === 1 ? 'viaje' : 'viajes'}
              </Text>
            </View>
            <View style={[styles.separadorVertical, { backgroundColor: theme.border }]} />
            <View style={styles.itemContador}>
              <Text style={[styles.numeroContador, { color: colorVisitada }]}>
                {diasTotales}
              </Text>
              <Text style={[styles.etiquetaContador, { color: theme.gray }]}>
                {diasTotales === 1 ? 'día' : 'días'}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Títulos de los itinerarios completados en esa provincia */}
      {titulosItinerarios.length > 0 && (
        <Text
          style={[styles.listaTitulosItinerarios, { color: theme.gray }]}
          numberOfLines={2}
        >
          {titulosItinerarios.join(' · ')}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panelEstadisticas: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  filaPrincipalPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  columnaIzquierdaPanel: { flex: 1 },
  nombreProvinciaSeleccionada: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  badgeEstadoVisita: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  textoEstadoVisita: { fontSize: 12, fontWeight: '600' },
  columnaDerecha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  itemContador: { alignItems: 'center' },
  numeroContador: { fontSize: 22, fontWeight: '800' },
  etiquetaContador: { fontSize: 11, fontWeight: '500' },
  separadorVertical: { width: 1, height: 32, borderRadius: 1 },
  listaTitulosItinerarios: {
    fontSize: 12,
    marginTop: 8,
    lineHeight: 16,
  },
});
