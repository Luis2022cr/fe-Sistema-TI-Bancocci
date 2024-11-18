import axiosInstance, { useAxios } from "../axiosInstance";

export interface Agencia {

    id: number;
    nombre: string;
    ubicacion: string;
    codigo: number;
    estado_agencias_id: number;
    estado_agencias: string;

    
}

export interface Post_Agencia {

    nombre: string;
    ubicacion: string;
    codigo: number;
    
}

export interface UpdateAgencia {

    nombre: string;
    ubicacion: string;
    codigo: number;
    estado_agencias_id: number;
    
}

export const ObtenerAgencia = () => {
    const response = useAxios<Agencia[]>({
        url: `/agencias`,
    }, {
        useCache: false,
    });
    return response;
};


export const ObtenerAgenciaById = (id: number) => {
    const response = useAxios<Agencia>({
      url: `/agencia/${id}`,
    },{
      useCache: false,
    });
    return response;
  };

export const CrearAgencias = async (nuevaAgencia: Post_Agencia): Promise<Post_Agencia> => {
    const response = await axiosInstance.post('/crear_agencias', nuevaAgencia);
    return response.data;
};

export const ActualizarAgencias = async (id: number, nuevaAgencia: UpdateAgencia): Promise<UpdateAgencia> => {
    const response = await axiosInstance.put(`/actualizar-agencia/${id}`, nuevaAgencia);
    return response.data;
  };