import { useAxios } from "../axiosInstance";


export interface Notificacion {
    id: number;
    message: string; 
    time: string;    
}

export interface NotificacionCheck {
    
    hayNotificaciones: string; 
      
}


export const ObtenerNotificaciones = (tipoId?: number) => {
    const queryParams = tipoId ? `?tipo_id=${tipoId}` : '';
    return useAxios<Notificacion[]>({
        url: `/notificaciones${queryParams}`,
    }, {
        useCache: false,
    });
};

export const ObtenerNotificacionesCheck = () => {
    return useAxios<NotificacionCheck>({
        url: `/notificaciones/check`,
    }, {
        useCache: false,
    });
};



export interface Logs {
    id: number;
    descripcion: string; 
    cambio_realizado: string;  
    usuario_id: number;
    fecha_cambio: Date;  
    usuario_nombre: string
}


export const ObtenerLogs = () => {
    const response = useAxios<Logs[]>({
        url: `/logs`,
    }, {
        useCache: false,
    });
    return response;
};