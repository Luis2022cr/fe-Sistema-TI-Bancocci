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


export const ObtenerModelo = (modeloId?: number) => {
    const queryParams = modeloId ? `?modelo_id=${modeloId}` : '';
    const response = useAxios<Modelo[]>({
        url: `/modelos${queryParams}`,
    }, {
        useCache: false,
    });
    return response;
};


export const CrearModelos = async (nuevosModelos: Post_Modelo): Promise<Post_Modelo> => {
    const response = await axiosInstance.post('/crear_modelos', nuevosModelos);
    return response.data;
};