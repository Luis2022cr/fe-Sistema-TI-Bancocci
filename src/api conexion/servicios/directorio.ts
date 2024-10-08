import axiosInstance, { useAxios } from "../axiosInstance";

export interface Directorio {
    id: number;
    extension: number;
    departamento: string;
    agencia: string;
    empleado: string;
    agenciaId: number;
    codigo: number;
    departamento_id: number;
}

export const ObtenerDirectorios = () => {
    const response = useAxios<Directorio>({
      url: `/directorios`,
    },{
      useCache: false,
    });
    return response;
  };

export const ObtenerDirectoriosById = (id: number) => {
    const response = useAxios<Directorio>({
      url: `/directorios/${id}`,
    },{
      useCache: false,
    });
    return response;
  };
  

export interface Post_Directorio {
    extension: number;
    departamento_id: number;
    agencias_id: number;
    empleado: string;
}

export const CrearDirectorios = async (nuevoDirectorio: Post_Directorio): Promise<Post_Directorio> => {
    const response = await axiosInstance.post('/directorios', nuevoDirectorio);
    return response.data;
};


export const UpdateDirectorios = async (id: number, nuevoDirectorio: Post_Directorio): Promise<Post_Directorio> => {
    const response = await axiosInstance.put(`/directorios/${id}`, nuevoDirectorio);
    return response.data;
};

// export const UpdateDirectorios = (id: number, nuevoDirectorio: Post_Directorio) => {
//     const response = useAxios<Directorio>({
//       url: `/directorios/${id}`, nuevoDirectorio,
//       method: 'PUT';
//     },{
//       useCache: false,
//     });
//     return response;
//   };
  

export const BorrarDirectorios = async (id: number): Promise<void> => {
    const response = await axiosInstance.delete(`/directorios/${id}`);
    return response.data;
};