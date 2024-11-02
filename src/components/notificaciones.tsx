import { useEffect, useState } from 'react';
import { NewspaperIcon } from 'lucide-react';
import { ObtenerNotificaciones, Notificacion } from '@/api_conexion/servicios/notifcaciones';

const NotificationList = () => {

    const [notifications, setNotifications] = useState<Notificacion[]>([]);
    const [{ data, loading, error }] = ObtenerNotificaciones(); 


    useEffect(() => {
        if (data) {
            setNotifications(data); 
        }
    },  [data, loading, error]);

    if (loading) return <p>Cargando notificaciones...</p>;
    if (error) return <p>Error al cargar las notificaciones: {error.message}</p>;
   
    return (
        <div className="w-full mt-10 p-4 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-center text-blue-950">Notificaciones</h2>
            <div className="space-y-4">
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <div key={notification.id} className="flex items-center bg-blue-100 p-4 rounded-md shadow-sm">
                            <NewspaperIcon className="w-8 h-8 text-blue-600 mr-4" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                                <p className="text-xs text-gray-500">{notification.time}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No hay notificaciones disponibles.</p>
                )}
            </div>
        </div>
    );
};

export default NotificationList;
