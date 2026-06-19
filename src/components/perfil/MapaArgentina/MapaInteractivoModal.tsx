import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { MapaArgentina } from './MapaArgentina';
import { HeaderModal } from './HeaderModal';
import { PanelEstadisticasProvincia } from './PanelEstadisticasProvincia';
import { ItinerarioResumen } from '@/services/favoritosService';
import { Provincia } from '@/types/itinerario';

const ANCHO_PANTALLA = Dimensions.get('window').width;
const ALTO_PANTALLA = Dimensions.get('window').height;

// Color ámbar para resaltar una provincia visitada al tocarla
const COLOR_RESALTADO_VISITADA = '#F59E0B';
// Color gris para resaltar una provincia sin visitar al tocarla
const COLOR_RESALTADO_NO_VISITADA = '#94A3B8';

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
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState<Provincia | null>(null);

  const handleTapEnProvincia = (provincia: string) => {
    // Toggle: tocar la misma provincia la deselecciona; tocar otra la selecciona
    setProvinciaSeleccionada(prev => (prev === provincia ? null : provincia as Provincia));
  };

  const handleCerrarModal = () => {
    setProvinciaSeleccionada(null); // limpiamos para que la próxima apertura empiece sin selección
    onClose();
  };

  // Set para buscar en O(1) si una provincia fue visitada (más eficiente que .includes())
  const provinciasVisitadasSet = new Set(provinciasVisitadas);

  // Itinerarios completados del usuario en la provincia actualmente seleccionada
  const itinerariosEnProvinciaSeleccionada = provinciaSeleccionada
    ? favoritos.filter(fav => fav.completado && fav.provincia === provinciaSeleccionada)
    : [];

  const diasTotalesEnProvinciaSeleccionada = itinerariosEnProvinciaSeleccionada
    .reduce((acumulado, fav) => acumulado + fav.duracionDias, 0);

  const cantidadViajesEnProvinciaSeleccionada = itinerariosEnProvinciaSeleccionada.length;

  const provinciaSeleccionadaFueVisitada = provinciasVisitadasSet.has(provinciaSeleccionada ?? '');

  // El color del highlight del mapa depende de si la provincia tocada fue visitada
  const colorResaltadoProvinciaActual = provinciaSeleccionadaFueVisitada
    ? COLOR_RESALTADO_VISITADA
    : COLOR_RESALTADO_NO_VISITADA;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={[styles.contenedorPrincipal, { backgroundColor: theme.background }]}>

        <HeaderModal titulo="Mi recorrido" onCerrar={handleCerrarModal} theme={theme} />

        {/* Mapa interactivo con pan + zoom nativo via ScrollView */}
        <ScrollView
          style={styles.contenedorScrollMapa}
          contentContainerStyle={styles.contenedorInternoMapa}
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
            width={ANCHO_PANTALLA * 1.1}
            height={ALTO_PANTALLA * 0.65}
            onProvincePress={handleTapEnProvincia}
            provinciaSeleccionada={provinciaSeleccionada}
            colorSeleccionada={colorResaltadoProvinciaActual}
          />
        </ScrollView>

        {provinciaSeleccionada ? (
          <PanelEstadisticasProvincia
            provincia={provinciaSeleccionada}
            fueVisitada={provinciaSeleccionadaFueVisitada}
            cantidadViajes={cantidadViajesEnProvinciaSeleccionada}
            diasTotales={diasTotalesEnProvinciaSeleccionada}
            titulosItinerarios={itinerariosEnProvinciaSeleccionada.map(fav => fav.titulo)}
            colorVisitada={colorVisitada}
            theme={theme}
          />
        ) : (
          <View style={[styles.panelSugerencia, { borderTopColor: theme.border }]}>
            <Text style={[styles.textoSugerencia, { color: theme.gray }]}>
              Tocá una provincia para ver sus estadísticas
            </Text>
          </View>
        )}

      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  contenedorPrincipal: { flex: 1 },
  contenedorScrollMapa: { flex: 1 },
  contenedorInternoMapa: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  panelSugerencia: {
    paddingVertical: 16,
    alignItems: 'center',
    borderTopWidth: 1,
  },
  textoSugerencia: { fontSize: 13 },
});
