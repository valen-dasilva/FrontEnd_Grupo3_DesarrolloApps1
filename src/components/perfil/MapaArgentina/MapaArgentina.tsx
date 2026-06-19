import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ARGENTINA_PATHS } from '@/data/argentinaPaths';

interface Props {
  provinciasVisitadas: string[];
  colorVisitada?: string;
  colorNoVisitada?: string;
  strokeColor?: string;
  width?: number | string;
  height?: number;
  onProvincePress?: (provincia: string) => void;
  provinciaSeleccionada?: string | null;
  colorSeleccionada?: string;
}

export function MapaArgentina({
  provinciasVisitadas,
  colorVisitada = '#2563eb',
  colorNoVisitada = '#E2E8F0',
  strokeColor = '#FFFFFF',
  width = '100%',
  height = 320,
  onProvincePress,
  provinciaSeleccionada = null,
  colorSeleccionada = '#F59E0B',
}: Props) {
  const visitadasSet = new Set(provinciasVisitadas);

  //Obtiene el color de relleno para una provincia según si fue visitada, seleccionada o no visitada.
  const getFill = (codProvincia: string) => {
    if (codProvincia === provinciaSeleccionada) return colorSeleccionada;
    if (visitadasSet.has(codProvincia)) return colorVisitada;
    return colorNoVisitada;
  };

  return (
    <Svg viewBox="0 0 500 835" width={width} height={height}>
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
  );
}
