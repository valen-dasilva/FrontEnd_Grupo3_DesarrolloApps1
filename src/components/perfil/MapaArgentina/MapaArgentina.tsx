import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ARGENTINA_PATHS } from '@/data/argentinaPaths';

const CABA_PATH = ARGENTINA_PATHS.find(p => p.enum === 'CABA')!;

interface Props {
  provinciasVisitadas: string[];
  coloresPorProvincia?: Record<string, string>;
  colorVisitada?: string;
  colorNoVisitada?: string;
  strokeColor?: string;
  width?: number | string;
  height?: number;
  onProvincePress?: (provincia: string) => void;
  provinciaSeleccionada?: string | null;
  colorSeleccionada?: string;
  cabaLabelColor?: string;
}

export function MapaArgentina({
  provinciasVisitadas,
  coloresPorProvincia,
  colorVisitada = '#2563eb',
  colorNoVisitada = '#E2E8F0',
  strokeColor = '#FFFFFF',
  width = '100%',
  height = 320,
  onProvincePress,
  provinciaSeleccionada = null,
  colorSeleccionada = '#F59E0B',
  cabaLabelColor = '#888',
}: Props) {
  const visitadasSet = new Set(provinciasVisitadas);

  const getFill = (codProvincia: string) => {
    if (codProvincia === provinciaSeleccionada) return colorSeleccionada;
    if (coloresPorProvincia && codProvincia in coloresPorProvincia) {
      return coloresPorProvincia[codProvincia];
    }
    if (visitadasSet.has(codProvincia)) return colorVisitada;
    return colorNoVisitada;
  };

  return (
    <View style={{ flexDirection: 'row', width: width as any, alignItems: 'center' }}>
      <View style={{ flex: 1 }}>
        <Svg viewBox="0 0 500 835" width="100%" height={height}>
          {ARGENTINA_PATHS.map((provincia) => (
            <Path
              key={provincia.enum}
              d={provincia.path}
              fill={getFill(provincia.enum)}
              stroke={strokeColor}
              strokeWidth={1.5}
              onPress={onProvincePress ? () => onProvincePress(provincia.enum) : undefined}
            />
          ))}
        </Svg>
      </View>

      {/* Inset ampliado de CABA — sin él sería un pixel en el mapa nacional */}
      <View style={{ width: 72, alignItems: 'center', gap: 6 }}>
        <Text style={{ fontSize: 10, fontWeight: '700', color: cabaLabelColor, letterSpacing: 0.5 }}>
          CABA
        </Text>
        <Svg viewBox="375 318 8 8" width={56} height={56}>
          <Path
            d={CABA_PATH.path}
            fill={getFill('CABA')}
            stroke={strokeColor}
            strokeWidth={0.3}
            onPress={onProvincePress ? () => onProvincePress('CABA') : undefined}
          />
        </Svg>
      </View>
    </View>
  );
}
