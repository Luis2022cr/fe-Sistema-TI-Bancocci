
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

export const ObtenerDepartamentoById = (id: number) => {
  const response = useAxios<Departamento>({
    url: `/departamento/${id}`,
  },{
    useCache: false,
  });
  return response;
};

export const CrearDtos = async (nuevoDtos: Post_Departamento): Promise<Post_Departamento> => {
    const response = await axiosInstance.post('/crear_departamentos', nuevoDtos);
    return response.data;
};

export const UpdateDepartamento = async (id: number, nuevoDepartamento: Post_Departamento): Promise<Post_Departamento> => {
  const response = await axiosInstance.put(`/actualizar-departamento/${id}`, nuevoDepartamento);
  return response.data;
};