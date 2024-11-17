import axiosInstance from "../axiosInstance";


// Definimos la interfaz para los datos del inventario
export interface Marca{
    id: number;
    nombre: string;
}

export interface Post_Marca{
 
    nombre: string;
}


export const ObtenerMarca = async (marcaId?: number): Promise<Marca[]> => {
    const queryParams = marcaId ? `?marca_id=${marcaId}` : '';
    try {
      const response = await axiosInstance.get(`/marcas${queryParams}`);
      return response.data; // Suponiendo que la API retorna un array de marcas
    } catch (error) {
      console.error("Error al obtener marcas:", error);
      throw error;
    }
  };


export const CrearMarcas = async (nuevasMarcas: Post_Marca): Promise<Post_Marca> => {
    const response = await axiosInstance.post('/crear_marcas', nuevasMarcas);
    return response.data;
};