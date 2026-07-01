import { Provincia } from '@/types/itinerario';
import { icons } from '@/constants/icons';
import { colors } from '@/constants/colors';

export interface Logro {
  id: string;
  nombre: string;
  icono: any;
  color: string;
  descripcion: string;
  provincias: Provincia[];
}

export const LOGROS: Logro[] = [
  {
    id: 'noa',
    nombre: 'Norteño/a',
    icono: icons.LogroNorte,
    color: colors.logroNorte,
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
    icono: icons.LogroLitoral,
    color: colors.logroLitoral,
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
    icono: icons.LogroCuyo,
    color: colors.logroCuyo,
    descripcion: 'La cuna del vino argentino, al pie de la cordillera de los Andes.',
    provincias: [Provincia.MENDOZA, Provincia.SAN_JUAN, Provincia.SAN_LUIS],
  },
  {
    id: 'centro',
    nombre: 'Pampeano/a',
    icono: icons.LogroCentro,
    color: colors.logroCentro,
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
    icono: icons.LogroPatagonia,
    color: colors.logroPatagonia,
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
    icono: icons.LogroArgentina,
    color: colors.logroArgentina,
    descripcion: 'De La Quiaca a Ushuaia: recorriste el país de punta a punta.',
    provincias: Object.values(Provincia),
  },
];

export const COLOR_POR_PROVINCIA: Record<string, string> = {};
export const REGION_LABEL_POR_PROVINCIA: Record<string, string> = {};

const REGION_NOMBRES: Record<string, string> = {
  noa: 'NOA',
  litoral: 'Litoral',
  cuyo: 'Cuyo',
  centro: 'Pampeana',
  patagonia: 'Patagonia',
};

for (const logro of LOGROS.slice(0, 5)) {
  for (const prov of logro.provincias) {
    COLOR_POR_PROVINCIA[prov] = logro.color;
    REGION_LABEL_POR_PROVINCIA[prov] = REGION_NOMBRES[logro.id] ?? logro.nombre;
  }
}
