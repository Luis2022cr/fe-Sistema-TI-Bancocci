import axiosInstance, { useAxios } from "../axiosInstance";

// Definimos la interfaz para los datos de la UPS
export interface UPS_MAPA {

    id: number,
    lat: string,
    lon: string,
    estado: string,
    nombre_ups: string,
    direccion_ip: string,
    kva: number,
    agencia: string,
    codigo: number,
    ubicacion: string

}

// Función para obtener la lista de UPS, con un filtro opcional por tipo de tamaño
export const ObtenerMapaUps = () => {
    const response = useAxios<UPS_MAPA>({
        url: `/ups-mapa`,
    }, {
        useCache: false,
    });
    return response;
};


export interface POST_Mapa {
    ups_id: number,
    lat: string,
    lon: string
}

// Corregimos el método POST para crear un nuevo punto en el mapa
export const CrearPuntoMapa = async (nuevoDirectorio: POST_Mapa): Promise<POST_Mapa> => {
    const response = await axiosInstance.post('/ups-mapa', nuevoDirectorio);
    return response.data;
};

export const BorrarPuntoMapa = async (id: number): Promise<void> => {
    const response = await axiosInstance.delete(`/ups-mapa/${id}`);
    return response.data;
};