import { Provincia } from '@/types/itinerario';

export interface Coords {
  lat: number;
  lng: number;
}

export const PROVINCIA_COORDS: Record<Provincia, Coords> = {
  [Provincia.BUENOS_AIRES]:        { lat: -36.6769, lng: -60.5583 },
  [Provincia.CABA]:                { lat: -34.6037, lng: -58.3816 },
  [Provincia.CATAMARCA]:           { lat: -28.4696, lng: -65.7795 },
  [Provincia.CHACO]:               { lat: -26.9478, lng: -60.6500 },
  [Provincia.CHUBUT]:              { lat: -43.2937, lng: -65.1112 },
  [Provincia.CORDOBA]:             { lat: -31.4135, lng: -64.1811 },
  [Provincia.CORRIENTES]:          { lat: -29.4153, lng: -58.9820 },
  [Provincia.ENTRE_RIOS]:          { lat: -31.7748, lng: -60.4956 },
  [Provincia.FORMOSA]:             { lat: -24.8943, lng: -59.9306 },
  [Provincia.JUJUY]:               { lat: -23.2116, lng: -65.3000 },
  [Provincia.LA_PAMPA]:            { lat: -36.6148, lng: -64.2839 },
  [Provincia.LA_RIOJA]:            { lat: -29.4127, lng: -66.8550 },
  [Provincia.MENDOZA]:             { lat: -32.8908, lng: -68.8272 },
  [Provincia.MISIONES]:            { lat: -27.3621, lng: -55.9007 },
  [Provincia.NEUQUEN]:             { lat: -38.9516, lng: -68.0591 },
  [Provincia.RIO_NEGRO]:           { lat: -40.8135, lng: -63.0000 },
  [Provincia.SALTA]:               { lat: -24.7859, lng: -65.4117 },
  [Provincia.SAN_JUAN]:            { lat: -31.5375, lng: -68.5364 },
  [Provincia.SAN_LUIS]:            { lat: -33.2950, lng: -66.3356 },
  [Provincia.SANTA_CRUZ]:          { lat: -51.6230, lng: -69.2183 },
  [Provincia.SANTA_FE]:            { lat: -31.6107, lng: -60.6970 },
  [Provincia.SANTIAGO_DEL_ESTERO]: { lat: -27.7951, lng: -64.2615 },
  [Provincia.TIERRA_DEL_FUEGO]:    { lat: -54.8019, lng: -68.3030 },
  [Provincia.TUCUMAN]:             { lat: -26.8083, lng: -65.2176 },
};
