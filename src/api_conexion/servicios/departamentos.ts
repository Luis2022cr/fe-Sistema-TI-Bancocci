
import axiosInstance, { useAxios } from "../axiosInstance";

export interface Departamento {
    id: number;
    nombre: string;
}

export interface Post_Departamento {
   
    nombre: string;
}

export const ObtenerDepartamento = () => {
    const response = useAxios<Departamento[]>({
        url: `/departamentos`,
    }, {
        useCache: false,
    });
    return response;
};

export const CrearDtos = async (nuevoDtos: Post_Departamento): Promise<Post_Departamento> => {
    const response = await axiosInstance.post('/crear_departamentos', nuevoDtos);
    return response.data;
};