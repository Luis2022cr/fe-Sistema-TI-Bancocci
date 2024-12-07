import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import './index.css';
import Layout from './layouts/Layout';
import { AuthProvider } from './api_conexion/AuthContext';
import Layout_2 from './layouts/Layout_2';
import Login from './paginas/Login';
import Directorio from './components/directorio/directorio';
import UpdateDirectorio from './components/directorio/updateDirectorio';

import GestionUsuarios from './paginas/GestionUsuarios/gestion_usuarios';
import UpdateUsuario from './paginas/GestionUsuarios/updateUsuario';
import UpdateContraseña from './paginas/GestionUsuarios/updateContraseña';
import Calendario from './components/otros/PaginaDeCalendario';
import Pagina_Inventario from './components/inventarios/Pagina_Inventario';
import MapaCopan from './components/mapa/Mapa';
import Pagina_Ups from './components/ups/Pagina_Ups';
import DashboardAdmin from './paginas/dashboard-admin/dashboard_admin';
import Dashboard_UpsAdmin from './paginas/dashboard-admin/dashboard_upsAdmin';
import Dashboard_inventarioAdmin from './paginas/dashboard-admin/dashboard_inventarioAdmin';
import DashboardInicio from './paginas/dashboard-empleados/dashboard_empleados';
import Dashboard_inventario from './paginas/dashboard-empleados/dashboard_inventario';
import Dashboard_Ups from './paginas/dashboard-empleados/dashboard_ups';
import HistorialInventario from './components/inventarios/historial_Inventario';
import CrearInventarios from './components/inventarios/crear_Inventario';
import EditarInventario from './components/inventarios/update_Inventario';
import Historial_Ups from './components/ups/Historial_Ups';
import CrearUpsForm from './components/ups/crear-ups';
import NotificationList from './components/notificaciones';
import ProfileCard from './components/perfil';
import UpdateContraseñaP from './components/updateContraseña';
import UdpateUps from './components/ups/update_ups';
import ControlEquiposV2 from './components/pdf/plantilla_reporte_v2';
import Dashboard_ConfigAdmin from './paginas/dashboard-admin/dashboard_configuraciones';
import PaginaAgencias from './paginas/dashboard-admin/Agencia/agencias';
import CrearAgencia from './paginas/dashboard-admin/Agencia/crearAgencia';
import PaginaDepartamento from './paginas/dashboard-admin/Departamento/departamento';
import CrearDepartamentos from './paginas/dashboard-admin/Departamento/crearDepto';

import CrearMarca from './paginas/dashboard-admin/Marca/crearMarca';
import CrearModelo from './paginas/dashboard-admin/Modelo/crearModelo';
import LogViewer from './components/Pruebas/logs';
import UpdateDepartamentos from './paginas/dashboard-admin/Departamento/updateDepartamento';
import UpdateAgencias from './paginas/dashboard-admin/Agencia/updateAgencia';
import UpdateModelo from './paginas/dashboard-admin/Modelo/updateModelo';
import PaginaMarcas from './paginas/dashboard-admin/Marca/marca';
import PaginaModelos from './paginas/dashboard-admin/Modelo/modelos';
import UpdateMarca from './paginas/dashboard-admin/Marca/updateMarca';






const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <>
    <AuthProvider>

      <BrowserRouter>
        <Routes>
          {/* Rutas que utilizan el Layout por defecto */}
          <Route path="/" element={<Layout />}>
            <Route index element={<App />} />
            <Route path="login" element={<Login />} />
            <Route path="dashboard-empleados/reportes" element={<ControlEquiposV2 />} />
          </Route>
         
          <Route path="/" element={<Layout_2 />}>
          
            <Route path="dashboard-empleados/main" element={<DashboardInicio />} />
            <Route path="dashboard-empleados/informes-ups" element={<Dashboard_Ups />} />
            <Route path="dashboard-empleados/inventario-ti" element={<Dashboard_inventario />} />
            
            <Route path="dashboard-empleados/directorio" element={<Directorio />} />
            <Route path="dashboard-empleados/directorio/:id" element={<UpdateDirectorio />} />
            <Route path="dashboard-empleados/calendario" element={<Calendario />} />
            <Route path="dashboard-empleados/informes-ups/:tipoTamanoId" element={<Pagina_Ups />} />
            <Route path="dashboard-empleados/inventario-ti/:tipoInventarioId" element={<Pagina_Inventario />} />
            <Route path="dashboard-empleados/historial_ups/:id" element={<Historial_Ups />} />
            <Route path="dashboard-empleados/mapa/ups" element={<MapaCopan />} />
            <Route path="dashboard-empleados/agregar-inventario" element={<CrearInventarios />} />
            <Route path="dashboard-empleados/actualizar_inventario/:id" element={<EditarInventario />} />
            <Route path="dashboard-empleados/historial_inventario/:id" element={<HistorialInventario />} />
            <Route path="dashboard-empleados/notificaciones" element={<NotificationList />} />
            <Route path="dashboard-empleados/perfil" element={<ProfileCard />} />
            <Route path="dashboard-empleados/perfil/cambiar-contraseña" element={<UpdateContraseñaP />} />
            <Route path="dashboard-empleados/ups/editar-ups/:id" element={<UdpateUps />} />
            <Route path="dashboard-empleados/crear/ups" element={<CrearUpsForm />} />


            <Route path="dashboard-admin/main" element={<DashboardAdmin />} />
            <Route path="dashboard-admin/informes-ups" element={<Dashboard_UpsAdmin />} />
            <Route path="dashboard-admin/configuraciones" element={<Dashboard_ConfigAdmin />} />
            <Route path="dashboard-admin/inventario-ti" element={<Dashboard_inventarioAdmin />} />
            <Route path="dashboard-admin/gestion-usuarios" element={<GestionUsuarios />} />
            <Route path="dashboard-admin/gestion-usuarios/editar-usuario/:id" element={<UpdateUsuario />} />
            <Route path="dashboard-admin/gestion-usuarios/password/:id" element={<UpdateContraseña />} />
            
            <Route path="dashboard-admin/directorio" element={<Directorio />} />
            <Route path="dashboard-admin/directorio/:id" element={<UpdateDirectorio />} />
            <Route path="dashboard-admin/calendario" element={<Calendario />} />
            <Route path="dashboard-admin/informes-ups/:tipoTamanoId" element={<Pagina_Ups />} />
            <Route path="dashboard-admin/inventario-ti/:tipoInventarioId" element={<Pagina_Inventario />} />
            <Route path="dashboard-admin/historial_ups/:id" element={<Historial_Ups />} />
            <Route path="dashboard-admin/mapa/ups" element={<MapaCopan />} />
            <Route path="dashboard-admin/crear/ups" element={<CrearUpsForm />} />
            <Route path="dashboard-admin/notificaciones" element={<NotificationList />} />
            <Route path="dashboard-admin/perfil" element={<ProfileCard />} />
            <Route path="dashboard-admin/perfil/cambiar-contraseña" element={<UpdateContraseñaP />} />
            <Route path="dashboard-admin/historial_inventario/:id" element={<HistorialInventario />} />
            <Route path="dashboard-admin/agregar-inventario" element={<CrearInventarios />} />
            <Route path="dashboard-admin/actualizar_inventario/:id" element={<EditarInventario />} />
            <Route path="dashboard-admin/ups/editar-ups/:id" element={<UdpateUps />} />
            <Route path="dashboard-admin/agregar-inventario" element={<CrearInventarios />} />
            <Route path="dashboard-admin/actualizar_inventario/:id" element={<EditarInventario />} />
            <Route path="dashboard-admin/ups/editar-ups/:id" element={<UdpateUps />} />


            <Route path="dashboard-admin/agencias" element={<PaginaAgencias />} />
            <Route path="dashboard-admin/crear-agencias" element={<CrearAgencia />} />
            <Route path="dashboard-admin/actualizar-agencia/:id" element={<UpdateAgencias/>} />
            <Route path="dashboard-admin/departamentos" element={<PaginaDepartamento />} />
            <Route path="dashboard-admin/crear-departamentos" element={<CrearDepartamentos />} />
            <Route path="dashboard-admin/actualizar-departamento/:id" element={<UpdateDepartamentos />} />
            <Route path="dashboard-admin/marca" element={<PaginaMarcas />} />
            <Route path="dashboard-admin/crear-marcas" element={<CrearMarca />} />
            <Route path="dashboard-admin/actualizar-marca/:id" element={<UpdateMarca/>} />
            <Route path="dashboard-admin/modelo" element={<PaginaModelos />} />
            <Route path="dashboard-admin/crear-modelos" element={<CrearModelo />} />
            <Route path="dashboard-admin/actualizar-modelo/:id" element={<UpdateModelo/>} />
            <Route path="dashboard-admin/logs" element={<LogViewer />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </>
);
