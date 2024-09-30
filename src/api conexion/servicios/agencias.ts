import axiosInstance, { useAxios } from "../axiosInstance";

export interface Agencia {

    id: number;
    nombre: string;
    ubicacion: string;
    codigo: string;
    estado_agencias_id: number;
    
}

export const ObtenerAgencias = async (): Promise<Agencia[]> => {
    const response = await axiosInstance.get('/agencias');
    console.log(response.data)
    return response.data;
};

export const ObtenerAgencia = () => {
    const response = useAxios<Agencia[]>({
        url: `/agencias`,
    }, {
        useCache: false,
    });
    return response;
};