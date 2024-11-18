import axiosInstance, { useAxios } from "../axiosInstance";


// Definimos la interfaz para los datos del inventario
export interface Marca{
    id: number;
    nombre: string;
}

export interface Post_Marca{
 
    nombre: string;
}

export const ObtenerMarca = (marcaId?: number) => {
  const queryParams = marcaId ? `?marca_id=${marcaId}` : '';

  const response = useAxios<Marca[]>({
    url: `/marcas${queryParams}`,
  },{
    useCache: false,
  });
  return response;
};

export const ObtenerMarcaById = (id: number) => {
  const response = useAxios<Marca>({
    url: `/marca/${id}`,
  },{
    useCache: false,
  });
  return response;
};


export const CrearMarcas = async (nuevasMarcas: Post_Marca): Promise<Post_Marca> => {
    const response = await axiosInstance.post('/crear_marcas', nuevasMarcas);
    return response.data;
};


export const ActualizarMarca = async (id: number, nuevaMarca: Post_Marca): Promise<Post_Marca> => {
    const response = await axiosInstance.put(`/actualizar-marca/${id}`, nuevaMarca);
    return response.data;
  };