import axiosInstance from "../axiosInstance";

export interface Rol {
    id: number;
    descripcion: string;

}

export const ObtenerRoles = async (): Promise<Rol[]> => {
    const response = await axiosInstance.get('/roles');
    return response.data;
};
