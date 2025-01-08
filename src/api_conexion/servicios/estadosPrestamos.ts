import { useAxios } from "../axiosInstance";

export interface EstadoPrestamos{
    id: number;
    nombre: string;
}

export const ObtenerEstadoPrestamos = () => {
    const response = useAxios<EstadoPrestamos[]>({
        url: `/estados_prestamos`,
    }, {
        useCache: false,
    });
    return response;
};
