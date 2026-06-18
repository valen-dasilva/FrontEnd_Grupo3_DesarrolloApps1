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
}

export function MapaArgentina({
  provinciasVisitadas,
  colorVisitada = '#2563eb',
  colorNoVisitada = '#E2E8F0',
  strokeColor = '#FFFFFF',
  width = '100%',
  height = 320,
}: Props) {
  const visitadasSet = new Set(provinciasVisitadas);

  return (
    <Svg viewBox="0 0 500 835" width={width} height={height}>
      {ARGENTINA_PATHS.map((provincia) => (
        <Path
          key={provincia.enum}
          d={provincia.path}
          fill={
            provincia.enum === 'BUENOS_AIRES'
              ? '#FF0000'
              : visitadasSet.has(provincia.enum)
                ? colorVisitada
                : colorNoVisitada
          }
          stroke={strokeColor}
          strokeWidth={1.5}
        />
      ))}
    </Svg>
  );
}
