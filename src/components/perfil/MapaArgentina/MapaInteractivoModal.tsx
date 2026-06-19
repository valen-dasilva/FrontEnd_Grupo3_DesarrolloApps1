import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MapaArgentina } from './MapaArgentina';
import { ItinerarioResumen } from '@/services/favoritosService';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const NOMBRE_PROVINCIA: Record<string, string> = {
  BUENOS_AIRES: 'Buenos Aires',
  CABA: 'Ciudad Autónoma de Buenos Aires',
  CATAMARCA: 'Catamarca',
  CHACO: 'Chaco',
  CHUBUT: 'Chubut',
  CORDOBA: 'Córdoba',
  CORRIENTES: 'Corrientes',
  ENTRE_RIOS: 'Entre Ríos',
  FORMOSA: 'Formosa',
  JUJUY: 'Jujuy',
  LA_PAMPA: 'La Pampa',
  LA_RIOJA: 'La Rioja',
  MENDOZA: 'Mendoza',
  MISIONES: 'Misiones',
  NEUQUEN: 'Neuquén',
  RIO_NEGRO: 'Río Negro',
  SALTA: 'Salta',
  SAN_JUAN: 'San Juan',
  SAN_LUIS: 'San Luis',
  SANTA_CRUZ: 'Santa Cruz',
  SANTA_FE: 'Santa Fe',
  SANTIAGO_DEL_ESTERO: 'Santiago del Estero',
  TIERRA_DEL_FUEGO: 'Tierra del Fuego',
  TUCUMAN: 'Tucumán',
};

interface Props {
  visible: boolean;
  onClose: () => void;
  provinciasVisitadas: string[];
  favoritos: ItinerarioResumen[];
  colorVisitada?: string;
  colorNoVisitada?: string;
  strokeColor?: string;
  theme: Record<string, string>;
}

export function MapaInteractivoModal({
  visible,
  onClose,
  provinciasVisitadas,
  favoritos,
  colorVisitada = '#2563eb',
  colorNoVisitada = '#E2E8F0',
  strokeColor,
  theme,
}: Props) {
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState<string | null>(null);

  const handleProvincePress = (provincia: string) => {
    setProvinciaSeleccionada(prev => (prev === provincia ? null : provincia));
  };

  const handleClose = () => {
    setProvinciaSeleccionada(null);
    onClose();
  };

  const visitadasSet = new Set(provinciasVisitadas);

  const statsDeProvancia = provinciaSeleccionada
    ? favoritos.filter(f => f.completado && f.provincia === provinciaSeleccionada)
    : [];

  const diasEnProvincia = statsDeProvancia.reduce((acc, f) => acc + f.duracionDias, 0);
  const vecesVisitada = statsDeProvancia.length;

  const colorSeleccionada = visitadasSet.has(provinciaSeleccionada ?? '')
    ? '#F59E0B'
    : '#94A3B8';

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Mi recorrido</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
            <MaterialIcons name="close" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        {/* Mapa con pan + zoom nativo via ScrollView */}
        <ScrollView
          style={styles.mapScroll}
          contentContainerStyle={styles.mapContainer}
          minimumZoomScale={0.6}
          maximumZoomScale={4}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          centerContent
        >
          <MapaArgentina
            provinciasVisitadas={provinciasVisitadas}
            colorVisitada={colorVisitada}
            colorNoVisitada={colorNoVisitada}
            strokeColor={strokeColor ?? theme.background}
            width={SCREEN_WIDTH * 1.1}
            height={SCREEN_HEIGHT * 0.65}
            onProvincePress={handleProvincePress}
            provinciaSeleccionada={provinciaSeleccionada}
            colorSeleccionada={colorSeleccionada}
          />
        </ScrollView>

        {/* Panel inferior: stats de la provincia seleccionada */}
        {provinciaSeleccionada ? (
          <View style={[styles.statsPanel, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
            <View style={styles.statsPanelRow}>
              <View style={styles.statsPanelLeft}>
                <Text style={[styles.provinciaNombre, { color: theme.text }]}>
                  {NOMBRE_PROVINCIA[provinciaSeleccionada] ?? provinciaSeleccionada}
                </Text>
                <View style={[
                  styles.estadoBadge,
                  { backgroundColor: visitadasSet.has(provinciaSeleccionada) ? colorVisitada + '22' : theme.border },
                ]}>
                  <MaterialIcons
                    name={visitadasSet.has(provinciaSeleccionada) ? 'check-circle' : 'radio-button-unchecked'}
                    size={14}
                    color={visitadasSet.has(provinciaSeleccionada) ? colorVisitada : theme.gray}
                  />
                  <Text style={[styles.estadoText, { color: visitadasSet.has(provinciaSeleccionada) ? colorVisitada : theme.gray }]}>
                    {visitadasSet.has(provinciaSeleccionada) ? 'Visitada' : 'Sin visitar'}
                  </Text>
                </View>
              </View>

              {visitadasSet.has(provinciaSeleccionada) && (
                <View style={styles.statsPanelRight}>
                  <View style={styles.statItem}>
                    <Text style={[styles.statNum, { color: colorVisitada }]}>{vecesVisitada}</Text>
                    <Text style={[styles.statLbl, { color: theme.gray }]}>
                      {vecesVisitada === 1 ? 'viaje' : 'viajes'}
                    </Text>
                  </View>
                  <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
                  <View style={styles.statItem}>
                    <Text style={[styles.statNum, { color: colorVisitada }]}>{diasEnProvincia}</Text>
                    <Text style={[styles.statLbl, { color: theme.gray }]}>
                      {diasEnProvincia === 1 ? 'día' : 'días'}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {statsDeProvancia.length > 0 && (
              <Text style={[styles.itinerariosList, { color: theme.gray }]} numberOfLines={2}>
                {statsDeProvancia.map(f => f.titulo).join(' · ')}
              </Text>
            )}
          </View>
        ) : (
          <View style={[styles.hintPanel, { borderTopColor: theme.border }]}>
            <Text style={[styles.hintText, { color: theme.gray }]}>
              Tocá una provincia para ver sus estadísticas
            </Text>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  closeBtn: { padding: 4 },
  mapScroll: { flex: 1 },
  mapContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  statsPanel: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  statsPanelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsPanelLeft: { flex: 1 },
  provinciaNombre: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  estadoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  estadoText: { fontSize: 12, fontWeight: '600' },
  statsPanelRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '800' },
  statLbl: { fontSize: 11, fontWeight: '500' },
  statDivider: { width: 1, height: 32, borderRadius: 1 },
  itinerariosList: {
    fontSize: 12,
    marginTop: 8,
    lineHeight: 16,
  },
  hintPanel: {
    paddingVertical: 16,
    alignItems: 'center',
    borderTopWidth: 1,
  },
  hintText: { fontSize: 13 },
});
