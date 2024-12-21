import axiosInstance, { useAxios } from "../axiosInstance";


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
    codigo_agencia_origen: number;
    codigo_agencia_actual: number
    estado: string;
    usuario: string;
}

export interface InventarioById {
    id: number;
    codigo: string;
    serie: string;
    tipo_inventario_id: number; 
    marca_id: number;            
    modelo_id: number;           
    agencias_id_origen: number; 
    agencias_id_actual: number;   
    estado_id: number;            
    usuario_id: number;           
    comentarios: string | null;   
    fecha_creacion: Date | null;       
    fecha_modificacion: string;    
    tipo_inventario: string;      
    marca: string;                
    modelo: string;              
    agencia_origen: string;       
    agencia_actual: string;       
    estado: string;               
    usuario: string;              
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
    comentarios?: string | null;
    fecha_creacion: string;
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
    fecha_creacion: string;
}


export const ObtenerInventarios = (tipoInventarioId?: number) => {
    const queryParams = tipoInventarioId ? `?tipo_inventario_id=${tipoInventarioId}` : '';
    const response = useAxios<Inventario[]>({
        url: `/inventarios${queryParams}`,
    }, {
        useCache: false,
    });
    return response;
};

export const ObtenerInventariosObsoletos = () => {
    const response = useAxios<Inventario[]>({
        url: `/inventario_obsoleto`,
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

export interface HistorialCambioInventario {

    cambio_realizado: string;
    fecha_cambio: string;
    usuario_id: number;
    usuario: string;
}

export interface InventarioConHistorial {
    id: number;
    codigo: string;
    serie: string;
    tipo_inventario_id: number; 
    marca_id: number;            
    modelo_id: number;           
    agencias_id_origen: number; 
    agencias_id_actual: number;   
    estado_id: number;            
    usuario_id: number;           
    comentarios: string | null;   
    fecha_creacion: string;       
    fecha_modificacion: string;    
    tipo_inventario: string;      
    marca: string;                
    modelo: string;              
    agencia_origen: string;       
    agencia_actual: string;       
    estado: string;               
    usuario: string;  
    historial: HistorialCambioInventario[]; 
}

export interface Post_Historial_Inventario {
    inventario_id: number;
    cambio_realizado: string;
    fecha_cambio: string;
}

export const ObtenerInventariosPorTipoConHistorial = (tipo_inventario_id: number) => {
    const response = useAxios<InventarioConHistorial[]>({
        url: `/inventarios/${tipo_inventario_id}/historial`, 
    }, {
        useCache: false,
    });
    return response;
};


export const ObtenerInventarioConHistorial = (id?: number) => {
    const response = useAxios<InventarioConHistorial>({
        url: `/inventario/${id}`, 
    }, {
        useCache: false,
    });
    return response;
};
export const ObtenerInventarioHistorial = (id?: number) => {
    const response = useAxios<InventarioConHistorial>({
        url: `/inventario/${id}`, 
    }, {
        useCache: false,
    });
    return response;
};

export const CrearHistorialInventario = async (nuevoHistorial: Post_Historial_Inventario): Promise<[Post_Historial_Inventario]> => {
    const response = await axiosInstance.post('/historial_inventario', nuevoHistorial);
    return response.data;
};