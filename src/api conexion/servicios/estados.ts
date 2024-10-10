import { useAxios } from "../axiosInstance";

export interface EstadoUps {
    id: number;
    nombre: string;
}

export const ObtenerEstadoUps = () => {
    const response = useAxios<EstadoUps[]>({
        url: `/estado_ups`,
    }, {
        useCache: false,
    });
    return response;
};

export interface TipoTamaño {
    id: number;
    nombre: string;
}

export const ObtenerTipoTamaño = () => {
    const response = useAxios<TipoTamaño[]>({
        url: `/tipo_tamanos`,
    }, {
        useCache: false,
    });
    return response;
};