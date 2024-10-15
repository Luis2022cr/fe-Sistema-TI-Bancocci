
import { useAxios } from "../axiosInstance";
export interface Departamento {
    id: number;
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