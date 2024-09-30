import { useAxios } from "../axiosInstance";

export interface Agencia {

    id: number;
    nombre: string;
    ubicacion: string;
    codigo: string;
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