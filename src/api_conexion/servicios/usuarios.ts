import axiosInstance, { useAxios } from "../axiosInstance";

export interface ObtenerUsuariosById {
    id: number;
    nombre: string;
    correo: string;
    rol_id: number;
    rol: string; 
}
export interface Usuario {
    id: number;
    nombre: string;
    correo: string;
    usuario: string;
    rol_id: number;
    rol: string; 
}


export const ObtenerUsuarios = async (): Promise<Usuario[]> => {
    const response = await axiosInstance.get('/usuarios');
    return response.data;
};


export const ObtenerUsuariosById = (id: number) => {
    const response = useAxios<Usuario>({
      url: `/usuarios/${id}`,
    },{
      useCache: false,
    });
    return response;
  };
  

  export interface Post_Usuario {
    

    nombre: string;
    usuario?: string;
    correo: string;
    contraseña?: string;
    rol_id: number;
    
}

export interface UsuarioRespuesta {
    message: string;
    usuario: string;
    contraseña: string;
}


export interface Update_Usuario {
    
    nombre: string;
    correo: string;
    rol_id: number;
    
}

export interface Update_Contraseña {
    
    nuevaContraseña: string;
    confirmarContraseña: string;
   
    
}

export const CrearUsuarios = async (nuevoUsuario: Post_Usuario): Promise<Post_Usuario> => {
    const response = await axiosInstance.post('/auth/registro', nuevoUsuario);
    return response.data;
};


export const UpdateUsuarios = async (id: number, nuevoUsuario: Update_Usuario): Promise<Update_Usuario> => {
    const response = await axiosInstance.put(`/usuarios/${id}`, nuevoUsuario);
    return response.data;
};
  
export const UpdateContraseña = async (id: number, nuevaContraseña: Update_Contraseña): Promise<Update_Contraseña> => {
    const response = await axiosInstance.put(`/auth/cambio-contrasena-admin/${id}`, nuevaContraseña);
    return response.data;
};
  
export const PUpdateContraseña = async (nuevaContraseña: Update_Contraseña): Promise<Update_Contraseña> => {
    const response = await axiosInstance.put(`/auth/cambio-contrasena`, nuevaContraseña);
    return response.data;
};

