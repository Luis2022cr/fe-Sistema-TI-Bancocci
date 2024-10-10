import { useAxios } from "../axiosInstance";



export interface Modelo{
    id: number;
    nombre: string;
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
