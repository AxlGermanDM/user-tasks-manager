export type TaskStatus = 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADA';

export interface Task {
    id: number;
    titulo: string;
    descripcion: string;
    estado: TaskStatus;
    usuarioAsignadoId: number;
  }
  
  export interface TaskCreateRequest {
    titulo: string;
    descripcion: string;
    estado: TaskStatus;
    usuarioAsignadoId: number | null;
  }