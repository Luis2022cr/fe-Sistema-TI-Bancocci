import axiosInstance, { useAxios } from "../axiosInstance";

export interface Departamento {
    id: number;
    nombre: string;
}

export const ObtenerDepartamentos = async (): Promise<Departamento[]> => {
    const response = await axiosInstance.get('/departamentos');
    return response.data;
};

export const ObtenerDepartamento = () => {
    const response = useAxios<Departamento[]>({
        url: `/departamentos`,
    }, {
        useCache: false,
    });
    return response;
};