import { useAxios } from "../axiosInstance";


// Definimos la interfaz para los datos del inventario
export interface Marca{
    id: number;
    nombre: string;
}


export const ObtenerMarca = (marcaId?: number) => {
    const queryParams = marcaId ? `?marca_id=${marcaId}` : '';
    const response = useAxios<Marca[]>({
        url: `/marcas${queryParams}`,
    }, {
        useCache: false,
    });
    return response;
};
