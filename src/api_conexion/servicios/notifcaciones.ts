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

