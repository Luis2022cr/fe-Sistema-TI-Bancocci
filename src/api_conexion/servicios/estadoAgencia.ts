import { useAxios } from "../axiosInstance";



export interface Estado{
    id: number;
    nombre: string;
}

export const ObtenerEstadoAgencia = () => {
    const response = useAxios<Estado[]>({
        url: `/estado_agencias`,
    }, {
        useCache: false,
    });
    return response;
};