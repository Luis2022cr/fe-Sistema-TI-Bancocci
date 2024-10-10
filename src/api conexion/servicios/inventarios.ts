import axiosInstance, { useAxios } from "../axiosInstance";

// Definimos la interfaz para los datos del inventario
export interface Inventario {
    id: number;
    codigo: string;
    serie: string;
    modelo: string;
    comentarios: string;
    fecha_creacion: string;
    fecha_modificacion: string;
    tipo_inventario: string;
    marca: string;
    agencia_origen: string;
    agencia_actual: string;
    estado: string;
    usuario: string;
}

export interface InventarioById {
    id: number;
    codigo: string;
    serie: string;
    tipo_inventario_id: number; // ID del tipo de inventario
    marca_id: number;            // ID de la marca
    modelo_id: number;           // ID del modelo
    agencias_id_origen: number;  // ID de la agencia de origen
    agencias_id_actual: number;   // ID de la agencia actual
    estado_id: number;            // ID del estado
    usuario_id: number;           // ID del usuario
    comentarios: string | null;   // Comentarios, puede ser nulo
    fecha_creacion: string;       // Fecha de creación en formato ISO
    fecha_modificacion: string;    // Fecha de modificación en formato ISO
    tipo_inventario: string;      // Nombre del tipo de inventario
    marca: string;                // Nombre de la marca
    modelo: string;               // Nombre del modelo
    agencia_origen: string;       // Nombre de la agencia de origen
    agencia_actual: string;       // Nombre de la agencia actual
    estado: string;               // Estado del inventario
    usuario: string;              // Nombre del usuario
}


export interface Post_Inventario {
    codigo: string;
    serie: string;
    tipo_inventario_id: number;
    marca_id: number;
    modelo_id: number;
    agencias_id_origen: number;
    agencias_id_actual: number;
    estado_id: number;
    usuario_id: number;
    comentarios?: string | null;
    fecha_creacion: string;
    fecha_modificacion: string;
}

export interface Actualizar_Inventario {
    codigo: string;
    serie: string;
    tipo_inventario_id: number;
    marca_id: number;
    modelo_id: number;
    agencias_id_origen: number;
    agencias_id_actual: number;
    estado_id: number;
    usuario_id: number;
    comentarios?: string | null;
    fecha_modificacion: string;
}

// Función para obtener la lista de inventarios, con un filtro opcional por tipo de inventario
export const ObtenerInventarios = (tipoInventarioId?: number) => {
    const queryParams = tipoInventarioId ? `?tipo_inventario_id=${tipoInventarioId}` : '';
    const response = useAxios<Inventario[]>({
        url: `/inventarios${queryParams}`,
    }, {
        useCache: false,
    });
    return response;
};

export const ObtenerInventariosById = (id: number) => {
    const response = useAxios<InventarioById>({
      url: `/inventarios/${id}`,
    },{
      useCache: false,
    });
    return response;
  };
  
export const CrearInventario = async (nuevoInventario: Post_Inventario): Promise<Post_Inventario> => {
    const response = await axiosInstance.post('/inventarios', nuevoInventario);
    return response.data;
};

export const UpdateInventario = async (id: number, nuevoInventario: Actualizar_Inventario): Promise<Actualizar_Inventario> => {
    const response = await axiosInstance.put(`/inventarios/${id}`, nuevoInventario);
    return response.data;
};