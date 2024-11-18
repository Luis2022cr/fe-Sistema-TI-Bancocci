import axiosInstance, { useAxios } from "../axiosInstance";




export interface Modelo{
    id: number;
    nombre: string;
    marca_id: number;
    marca: string;
}

export interface Post_Modelo{
  
    nombre: string;
    marca_id: number;
}

export interface ActualizarModelo{
    
  
    nombre: string;
    marca_id: number;
  
}


export const ObtenerModelo = () => {
    const response = useAxios<Modelo[]>({
        url: `/modelos`,
    }, {
        useCache: false,
    });
    return response;
};

export const ObtenerModeloById = (id: number) => {
    const response = useAxios<Modelo>({
      url: `/modelo/${id}`,
    },{
      useCache: false,
    });
    return response;
  };

export const CrearModelos = async (nuevosModelos: Post_Modelo): Promise<Post_Modelo> => {
    const response = await axiosInstance.post('/crear_modelos', nuevosModelos);
    return response.data;
};


export const ActualizarModelo = async (id: number, nuevoModelo: ActualizarModelo): Promise<ActualizarModelo> => {
    const response = await axiosInstance.put(`/actualizar-modelo/${id}`, nuevoModelo);
    return response.data;
  };
