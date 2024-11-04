import { useAxios } from "../axiosInstance";

export interface Perfil {
    id: number;
    nombre: string;
    correo: string;
    usuario: string;
    rol_id: number;
    rol: string; 
}

export const ObtenerPerfil = (perfilId?: number) => {
    const queryParams = perfilId ? `?usuario_id=${perfilId}` : '';
    return useAxios<Perfil>({
        url: `/perfil/usuario${queryParams}`,
    }, {
        useCache: false,
    });
};
