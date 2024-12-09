import axiosInstance, { useAxios } from "../axiosInstance";

export interface ControlEquipo {
    fecha: string;
    fecha1: string;
    fecha2: string;
    tecnico: string;
    agencia: string;
    ticketAyuda: string;
    equipoReparacion: boolean;
    equipoPrestado: boolean;
    otrosEspecificar: string;
    cambioEquipo: boolean;
    devolucionEquipo: boolean;
    entregaEquipo: boolean;
    equipoReparado: boolean;
    infraestructura: boolean;
    soporte: boolean;
    equipos: {
        descripcionEquipo: string;
        inventario: string;
        modeloTipo: string;
        serie: string;
        pertenece: string;
        destino: string;
    }[];
    observaciones: string;
}

export const crearControlEquipo = async (controlEquipoData: ControlEquipo): Promise<ControlEquipo> => {
    const response = await axiosInstance.post('/control_equipo_pdf', controlEquipoData);
    return response.data;
};

export interface Reparacion {
    reparacion_id: number;
    fecha: string; // Puede ser una fecha en formato ISO o string
    tecnico: string;
    agencia: string;
    ticket_ayuda: string;
    equipo_reparacion: number;
    equipo_prestado: number;
    otros_especificar: string;
    cambio_equipo: number;
    devolucion_equipo: number;
    entrega_equipo: number;
    equipo_reparado: number;
    infraestructura: number;
    soporte: number;
    observaciones: string;
    fecha_creacion: string; // Fecha en formato ISO
    fecha_modificacion: string; // Fecha en formato ISO
    equipos: EquipoReparacion[]; // Arreglo de equipos relacionados a la reparación
}

export interface EquipoReparacion {
    reparacion_id: number;
    descripcion_equipo: string;
    inventario: string;
    modelo_tipo: string;
    serie: string;
    pertenece: string;
    destino: string;
}


export const ObtenerControlById = (id: number) => {
    id = 4;
    const response = useAxios<Reparacion>({
      url: `/control_equipo/${id}`,
    },{
      useCache: false,
    });
    return response;
  };