export enum CategoriaItinerario {
  NATURALEZA = 'NATURALEZA',
  GASTRONOMIA = 'GASTRONOMIA',
  AVENTURA = 'AVENTURA',
  CULTURA = 'CULTURA',
  NOCHE = 'NOCHE',
  COMPRA = 'COMPRA',
}

export enum Provincia {
  BUENOS_AIRES = 'BUENOS_AIRES',
  CABA = 'CABA',
  CATAMARCA = 'CATAMARCA',
  CHACO = 'CHACO',
  CHUBUT = 'CHUBUT',
  CORDOBA = 'CORDOBA',
  CORRIENTES = 'CORRIENTES',
  ENTRE_RIOS = 'ENTRE_RIOS',
  FORMOSA = 'FORMOSA',
  JUJUY = 'JUJUY',
  LA_PAMPA = 'LA_PAMPA',
  LA_RIOJA = 'LA_RIOJA',
  MENDOZA = 'MENDOZA',
  MISIONES = 'MISIONES',
  NEUQUEN = 'NEUQUEN',
  RIO_NEGRO = 'RIO_NEGRO',
  SALTA = 'SALTA',
  SAN_JUAN = 'SAN_JUAN',
  SAN_LUIS = 'SAN_LUIS',
  SANTA_CRUZ = 'SANTA_CRUZ',
  SANTA_FE = 'SANTA_FE',
  SANTIAGO_DEL_ESTERO = 'SANTIAGO_DEL_ESTERO',
  TIERRA_DEL_FUEGO = 'TIERRA_DEL_FUEGO',
  TUCUMAN = 'TUCUMAN',
}

export const PROVINCIA_LABEL: Record<Provincia, string> = {
  [Provincia.BUENOS_AIRES]: 'Buenos Aires',
  [Provincia.CABA]: 'CABA',
  [Provincia.CATAMARCA]: 'Catamarca',
  [Provincia.CHACO]: 'Chaco',
  [Provincia.CHUBUT]: 'Chubut',
  [Provincia.CORDOBA]: 'Córdoba',
  [Provincia.CORRIENTES]: 'Corrientes',
  [Provincia.ENTRE_RIOS]: 'Entre Ríos',
  [Provincia.FORMOSA]: 'Formosa',
  [Provincia.JUJUY]: 'Jujuy',
  [Provincia.LA_PAMPA]: 'La Pampa',
  [Provincia.LA_RIOJA]: 'La Rioja',
  [Provincia.MENDOZA]: 'Mendoza',
  [Provincia.MISIONES]: 'Misiones',
  [Provincia.NEUQUEN]: 'Neuquén',
  [Provincia.RIO_NEGRO]: 'Río Negro',
  [Provincia.SALTA]: 'Salta',
  [Provincia.SAN_JUAN]: 'San Juan',
  [Provincia.SAN_LUIS]: 'San Luis',
  [Provincia.SANTA_CRUZ]: 'Santa Cruz',
  [Provincia.SANTA_FE]: 'Santa Fe',
  [Provincia.SANTIAGO_DEL_ESTERO]: 'Santiago del Estero',
  [Provincia.TIERRA_DEL_FUEGO]: 'Tierra del Fuego',
  [Provincia.TUCUMAN]: 'Tucumán',
};

export const CATEGORIA_LABEL: Record<CategoriaItinerario, string> = {
  [CategoriaItinerario.NATURALEZA]: 'Naturaleza',
  [CategoriaItinerario.GASTRONOMIA]: 'Gastronomía',
  [CategoriaItinerario.AVENTURA]: 'Aventura',
  [CategoriaItinerario.CULTURA]: 'Cultura',
  [CategoriaItinerario.NOCHE]: 'Noche',
  [CategoriaItinerario.COMPRA]: 'Compra',
};

export interface ItinerarioSistemaResumenDTO {
  idItinerario: number;
  titulo: string;
  descripcion: string;
  provincia: Provincia;
  fechaInicio: string;
  fechaFin: string;
  fotoPortada: string;
  duracionDias: number;
  etiquetas: CategoriaItinerario[];
  likes: number;
}

export interface ActividadDTO {
  idActividad: number;
  nombre: string;
  descripcion: string;
  localidad: string;
  direccion: string;
}

export interface ItemItinerarioSistemaDTO {
  id: number;
  dia: number;
  hora: string; // "HH:mm:ss" format from LocalTime
  actividad: ActividadDTO;
}

export interface ItinerarioSistemaDTO {
  idItinerario: number;
  titulo: string;
  descripcion: string;
  provincia: Provincia;
  fechaInicio: string;
  fechaFin: string;
  fotoPortada: string;
  duracionDias: number;
  etiquetas: CategoriaItinerario[];
  items: ItemItinerarioSistemaDTO[];
}

// Actividad dentro del itinerario personalizado del usuario.
// Devuelto como parte de ItinerarioEnCursoDTO.
export interface ItemItinerarioUsuarioDTO {
  id: number;
  nombreActividad: string;
  descripcion?: string;
  localidad?: string;
  direccion?: string;
  dia: number;
  hora?: string; // "HH:mm:ss" — puede ser null si no tiene hora cargada
}

// DTO del itinerario activo del usuario (aquel cuyas fechas contienen el día de hoy).
// Devuelto por GET /favoritos/activo — usa JWT, no necesita userId en la ruta.
export interface ItinerarioEnCursoDTO {
  idItinerarioUsuario: number;
  idItinerarioSistema?: number; // legacy: los itinerarios de usuario ya no referencian al sistema
  titulo: string;
  descripcion: string;
  provincia: Provincia;
  fechaInicio: string;
  fechaFin: string;
  fotoPortada?: string;
  duracionDias: number;
  etiquetas: CategoriaItinerario[];
  items: ItemItinerarioUsuarioDTO[];
  completado?: boolean;
  isOptimistic?: boolean;
}
