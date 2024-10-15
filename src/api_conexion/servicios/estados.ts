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

export interface CalendarioUps {
    id: number;
    ups: string;
    modelo: string;
    proximo_cambio: Date;
    agencia: string;
}

export const ObtenerDatosUpsCalendario = () => {
    const response = useAxios<CalendarioUps[]>({
        url: `/calendario/ups`,
    }, {
        useCache: false,
    });
    return response;
};