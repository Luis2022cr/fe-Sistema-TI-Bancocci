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
import HistorialInventario from './components/inventarios/historial_Inventario';
import CrearInventarios from './components/inventarios/crear_Inventario';
import EditarInventario from './components/inventarios/update_Inventario';
import Historial_Ups from './components/ups/Historial_Ups';
import CrearUpsForm from './components/ups/crear-ups';
import NotificationList from './components/notificaciones';
import ProfileCard from './components/perfil';
import UpdateContraseñaP from './components/updateContraseña';
import UdpateUps from './components/ups/update_ups';
import LogViewer from './components/Pruebas/logs';
import EmpleadoAuth from './api_conexion/seguridad/EmpleadoAuth';
import AdminAuth from './api_conexion/seguridad/AdminAuth';
import DashboardInicio from './paginas/dashboard-empleados/dashboard_empleados';
import Dashboard_inventario from './paginas/dashboard-empleados/dashboard_inventario';
import Dashboard_Ups from './paginas/dashboard-empleados/dashboard_ups';
import PaginaAgencias from './paginas/dashboard-admin/Agencia/agencias';
import CrearAgencia from './paginas/dashboard-admin/Agencia/crearAgencia';
import UpdateAgencias from './paginas/dashboard-admin/Agencia/updateAgencia';
import DashboardAdmin from './paginas/dashboard-admin/dashboard_admin';
import Dashboard_ConfigAdmin from './paginas/dashboard-admin/dashboard_configuraciones';
import Dashboard_inventarioAdmin from './paginas/dashboard-admin/dashboard_inventarioAdmin';
import Dashboard_UpsAdmin from './paginas/dashboard-admin/dashboard_upsAdmin';
import CrearDepartamentos from './paginas/dashboard-admin/Departamento/crearDepto';
import PaginaDepartamento from './paginas/dashboard-admin/Departamento/departamento';
import UpdateDepartamentos from './paginas/dashboard-admin/Departamento/updateDepartamento';
import CrearMarca from './paginas/dashboard-admin/Marca/crearMarca';
import PaginaMarcas from './paginas/dashboard-admin/Marca/marca';
import UpdateMarca from './paginas/dashboard-admin/Marca/updateMarca';
import CrearModelo from './paginas/dashboard-admin/Modelo/crearModelo';
import PaginaModelos from './paginas/dashboard-admin/Modelo/modelos';
import UpdateModelo from './paginas/dashboard-admin/Modelo/updateModelo';
import ControlEquiposV2 from './components/pdf/plantilla_reporte_v2';
import Dashboard_Control from './paginas/dashboard-empleados/dashboard_control';
import HistorialporID from './components/pdf/plantilla_reporte';
import HistorialControlEquipo from './components/pdf/historialDeControl';

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
            <Route path="empleado/historial-control-equipo/:id" element={<HistorialporID />} /> {/* ver reporte por id */}
            <Route path="empleado/crear-control-equipo" element={<ControlEquiposV2 />} /> {/* crear control de equipo */}
          </Route>

          <Route path="/" element={<Layout_2 />}>

            <Route path="/" element={<EmpleadoAuth />}>

              <Route path="empleado/main" element={<DashboardInicio />} />
              <Route path="empleado/informes-ups" element={<Dashboard_Ups />} />
              <Route path="empleado/inventario-ti" element={<Dashboard_inventario />} />
              <Route path="empleado/control-equipo" element={<Dashboard_Control />} />
              <Route path="empleado/directorio" element={<Directorio />} />
              <Route path="empleado/directorio/:id" element={<UpdateDirectorio />} />
              <Route path="empleado/calendario" element={<Calendario />} />
              <Route path="empleado/informes-ups/:tipoTamanoId" element={<Pagina_Ups />} />
              <Route path="empleado/inventario-ti/:tipoInventarioId" element={<Pagina_Inventario />} />
              <Route path="empleado/historial_ups/:id" element={<Historial_Ups />} />
              <Route path="empleado/mapa/ups" element={<MapaCopan />} />
              <Route path="empleado/agregar-inventario" element={<CrearInventarios />} />
              <Route path="empleado/actualizar_inventario/:id" element={<EditarInventario />} />
              <Route path="empleado/historial_inventario/:id" element={<HistorialInventario />} />
              <Route path="empleado/notificaciones" element={<NotificationList />} />
              <Route path="empleado/perfil" element={<ProfileCard />} />
              <Route path="empleado/perfil/cambiar-contraseña" element={<UpdateContraseñaP />} />
              <Route path="empleado/ups/editar-ups/:id" element={<UdpateUps />} />
              <Route path="empleado/crear/ups" element={<CrearUpsForm />} />
              <Route path="empleado/historial/control-equipo" element={<HistorialControlEquipo />} />

            </Route>

            <Route path="/" element={<AdminAuth />}>

              <Route path="administracion/main" element={<DashboardAdmin />} />
              <Route path="administracion/informes-ups" element={<Dashboard_UpsAdmin />} />
              <Route path="administracion/configuraciones" element={<Dashboard_ConfigAdmin />} />
              <Route path="administracion/inventario-ti" element={<Dashboard_inventarioAdmin />} />
              <Route path="administracion/gestion-usuarios" element={<GestionUsuarios />} />
              <Route path="administracion/gestion-usuarios/editar-usuario/:id" element={<UpdateUsuario />} />
              <Route path="administracion/gestion-usuarios/password/:id" element={<UpdateContraseña />} />
              <Route path="administracion/directorio" element={<Directorio />} />
              <Route path="administracion/directorio/:id" element={<UpdateDirectorio />} />
              <Route path="administracion/calendario" element={<Calendario />} />
              <Route path="administracion/informes-ups/:tipoTamanoId" element={<Pagina_Ups />} />
              <Route path="administracion/inventario-ti/:tipoInventarioId" element={<Pagina_Inventario />} />
              <Route path="administracion/historial_ups/:id" element={<Historial_Ups />} />
              <Route path="administracion/mapa/ups" element={<MapaCopan />} />
              <Route path="administracion/crear/ups" element={<CrearUpsForm />} />
              <Route path="administracion/notificaciones" element={<NotificationList />} />
              <Route path="administracion/perfil" element={<ProfileCard />} />
              <Route path="administracion/perfil/cambiar-contraseña" element={<UpdateContraseñaP />} />
              <Route path="administracion/historial_inventario/:id" element={<HistorialInventario />} />
              <Route path="administracion/agregar-inventario" element={<CrearInventarios />} />
              <Route path="administracion/actualizar_inventario/:id" element={<EditarInventario />} />
              <Route path="administracion/ups/editar-ups/:id" element={<UdpateUps />} />
              <Route path="administracion/agregar-inventario" element={<CrearInventarios />} />
              <Route path="administracion/actualizar_inventario/:id" element={<EditarInventario />} />
              <Route path="administracion/ups/editar-ups/:id" element={<UdpateUps />} />
              <Route path="administracion/agencias" element={<PaginaAgencias />} />
              <Route path="administracion/crear-agencias" element={<CrearAgencia />} />
              <Route path="administracion/actualizar-agencia/:id" element={<UpdateAgencias />} />
              <Route path="administracion/departamentos" element={<PaginaDepartamento />} />
              <Route path="administracion/crear-departamentos" element={<CrearDepartamentos />} />
              <Route path="administracion/actualizar-departamento/:id" element={<UpdateDepartamentos />} />
              <Route path="administracion/marca" element={<PaginaMarcas />} />
              <Route path="administracion/crear-marcas" element={<CrearMarca />} />
              <Route path="administracion/actualizar-marca/:id" element={<UpdateMarca />} />
              <Route path="administracion/modelo" element={<PaginaModelos />} />
              <Route path="administracion/crear-modelos" element={<CrearModelo />} />
              <Route path="administracion/actualizar-modelo/:id" element={<UpdateModelo />} />
              <Route path="administracion/logs" element={<LogViewer />} />
              
            </Route>

          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </>
);
