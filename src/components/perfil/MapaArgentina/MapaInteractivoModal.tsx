import React, { useCallback, useState } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { MapaArgentina } from './MapaArgentina';
import { HeaderModal } from './HeaderModal';
import { PanelEstadisticasProvincia } from './PanelEstadisticasProvincia';
import { ItinerarioResumen } from '@/services/itinerariosService';
import { Provincia } from '@/types/itinerario';
import { useTheme } from '@/hooks/useColorScheme';
import { useProvinciaStats } from '@/hooks/useProvinciaStats';

interface Props {
  visible: boolean;
  onClose: () => void;
  provinciasVisitadas: string[];
  itinerarios: ItinerarioResumen[];
}

export function MapaInteractivoModal({
  visible,
  onClose,
  provinciasVisitadas,
  itinerarios,
}: Props) {
  const { theme } = useTheme();
  // useWindowDimensions se recalcula al rotar; Dimensions.get('window') es estático
  const { width, height } = useWindowDimensions();
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState<Provincia | null>(null);

  const { fueVisitada, cantidadViajes, diasTotales, itinerariosEnProvincia, colorResaltado } =
    useProvinciaStats(provinciasVisitadas, itinerarios, provinciaSeleccionada);

  // Toggle: tocar la misma provincia la deselecciona; tocar otra la selecciona
  const handleTapEnProvincia = useCallback((provincia: string) => {
    setProvinciaSeleccionada(prev => (prev === provincia ? null : (provincia as Provincia)));
  }, []);

  // Limpia la selección al cerrar para que la próxima apertura empiece en blanco
  const handleCerrarModal = useCallback(() => {
    setProvinciaSeleccionada(null);
    onClose();
  }, [onClose]);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={[styles.contenedorPrincipal, { backgroundColor: theme.background }]}>

        <HeaderModal titulo="Mi recorrido" onCerrar={handleCerrarModal} />

        {/* Mapa con pan + zoom nativo vía ScrollView */}
        <ScrollView
          style={styles.contenedorScrollMapa}
          contentContainerStyle={styles.contenedorInternoMapa}
          minimumZoomScale={0.6}
          maximumZoomScale={4}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          centerContent
        >
          {/* key atado a `visible` para que el ZoomIn se redispare en cada apertura */}
          <Animated.View key={visible ? 'abierto' : 'cerrado'} entering={ZoomIn.duration(450)}>
            <MapaArgentina
              provinciasVisitadas={provinciasVisitadas}
              colorVisitada={theme.primary}
              colorNoVisitada={theme.border}
              strokeColor={theme.background}
              width={width * 1.1}
              height={height * 0.65}
              onProvincePress={handleTapEnProvincia}
              provinciaSeleccionada={provinciaSeleccionada}
              colorSeleccionada={colorResaltado}
            />
          </Animated.View>
        </ScrollView>

        {provinciaSeleccionada ? (
          <PanelEstadisticasProvincia
            provincia={provinciaSeleccionada}
            fueVisitada={fueVisitada}
            cantidadViajes={cantidadViajes}
            diasTotales={diasTotales}
            titulosItinerarios={itinerariosEnProvincia.map(it => it.titulo)}
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
