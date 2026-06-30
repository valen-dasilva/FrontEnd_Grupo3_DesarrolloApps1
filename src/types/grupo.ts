export type GroupMemberRole = 'CREADOR' | 'MIEMBRO';

export interface GroupMember {
  idUsuario: number;
  nombre: string;
  fotoPerfil: string | null;
  rol: GroupMemberRole;
}

export interface GroupSummary {
  idGrupo: number;
  nombre: string;
  fotoPortada: string | null;
  cantidadMiembros: number;
  nombreCreador: string;
  soyCreador: boolean;
  tieneEncuestaAbierta: boolean;
}

export interface Group {
  idGrupo: number;
  nombre: string;
  descripcion: string | null;
  fotoPortada: string | null;
  creadorId: number;
  nombreCreador: string;
  cantidadMiembros: number;
  fechaCreacion: string;
  activo: boolean;
  soyCreador: boolean;
  tieneEncuestaAbierta: boolean;
  miembros: GroupMember[];
}

export interface InvitationCode {
  codigo: string;
  fechaExpiracion: string;
}

export interface GroupFormValues {
  nombre: string;
  descripcion: string | null;
  fotoPortada: string | null;
}
