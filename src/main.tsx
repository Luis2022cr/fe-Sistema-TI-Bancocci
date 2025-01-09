import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import './index.css';
import Layout from './layouts/Layout';
import { AuthProvider } from './api_conexion/AuthContext';
import Layout_TI from './layouts/Layout_TI';
import Login from './dashboards/Login';
import Directorio from './modulo_ti/directorio/directorio';
import UpdateDirectorio from './modulo_ti/directorio/updateDirectorio';
import GestionUsuarios from './dashboards/GestionUsuarios/gestion_usuarios';
import UpdateUsuario from './dashboards/GestionUsuarios/updateUsuario';
import UpdateContraseña from './dashboards/GestionUsuarios/updateContraseña';
import Calendario from './modulo_ti/otros/PaginaDeCalendario';
import Pagina_Inventario from './modulo_ti/inventarios/Pagina_Inventario';
import MapaCopan from './modulo_ti/mapa/Mapa';
import Pagina_Ups from './modulo_ti/ups/Pagina_Ups';
import HistorialInventario from './modulo_ti/inventarios/historial_Inventario';
import CrearInventarios from './modulo_ti/inventarios/crear_Inventario';
import EditarInventario from './modulo_ti/inventarios/update_Inventario';
import Historial_Ups from './modulo_ti/ups/Historial_Ups';
import CrearUpsForm from './modulo_ti/ups/crear-ups';
import NotificationList from './modulo_ti/notificaciones';
import ProfileCard from './modulo_ti/perfil';
import UpdateContraseñaP from './modulo_ti/updateContraseña';
import UdpateUps from './modulo_ti/ups/update_ups';
import LogViewer from './modulo_ti/Pruebas/logs';
import EmpleadoAuth from './api_conexion/seguridad/EmpleadoAuth';
import AdminAuth from './api_conexion/seguridad/AdminAuth';
import DashboardInicio from './dashboards/dashboard-empleados/dashboard_empleados';
import Dashboard_inventario from './dashboards/dashboard-empleados/dashboard_inventario';
import Dashboard_Ups from './dashboards/dashboard-empleados/dashboard_ups';
import PaginaAgencias from './modulo_ti/Agencia/agencias';
import CrearAgencia from './modulo_ti/Agencia/crearAgencia';
import UpdateAgencias from './modulo_ti/Agencia/updateAgencia';
import DashboardAdmin from './dashboards/dashboard-admin/dashboard_admin';
import Dashboard_ConfigAdmin from './dashboards/dashboard-admin/dashboard_configuraciones';
import Dashboard_inventarioAdmin from './dashboards/dashboard-admin/dashboard_inventarioAdmin';
import Dashboard_UpsAdmin from './dashboards/dashboard-admin/dashboard_upsAdmin';
import CrearDepartamentos from './modulo_ti/Departamento/crearDepto';
import PaginaDepartamento from './modulo_ti/Departamento/departamento';
import UpdateDepartamentos from './modulo_ti/Departamento/updateDepartamento';
import CrearMarca from './modulo_ti/Marca/crearMarca';
import PaginaMarcas from './modulo_ti/Marca/marca';
import UpdateMarca from './modulo_ti/Marca/updateMarca';
import CrearModelo from './modulo_ti/Modelo/crearModelo';
import PaginaModelos from './modulo_ti/Modelo/modelos';
import UpdateModelo from './modulo_ti/Modelo/updateModelo';
import Dashboard_Control from './dashboards/dashboard-empleados/dashboard_control';
import HistorialporID from './modulo_ti/pdf/plantilla_reporte';
import HistorialControlEquipo from './modulo_ti/pdf/historialDeControl';
import CrearControlEquipos from './modulo_ti/pdf/CrearControlEquipos';
import Dashboard_Control_Admin from './dashboards/dashboard-admin/dashboard_control-admin';
import Inventario_Obsoleto from './modulo_ti/inventarios/inventario_obsoleto';
import ExcelInventario from './modulo_ti/inventarios/subir_Excel_inventario';
import Dashboard_ConfigEmpleado from './dashboards/dashboard-empleados/dashboard_configuraciones_empleado';
import TiAuth from './api_conexion/seguridad/TiAuth';
import Layout_Prestamos from './layouts/Layout_Prestamos';
import PrestamosAuth from './api_conexion/seguridad/PrestamosAuth';
import DashboardPrestamos from './dashboards/dashboard_prestamos/dashboard_prestamos';
import UbicacionExpediente from './modulo_prestamos/ubicacion_historial_expediente';
import PaginaExpediente from './modulo_prestamos/Expedientes';
import CrearExpediente from './modulo_prestamos/crear_Expediente';
import PerfilPrestamos from './modulo_prestamos/perfil_prestamos';
import EditarExpediente from './modulo_prestamos/update_Expediente';
import ExpedientesDeBaja from './modulo_prestamos/ExpedientesDeBaja';
import HistorialPrestamos from './modulo_prestamos/historial_Prestamos';

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
            <Route path="ti/historial-control-equipo/:id" element={<HistorialporID />} /> {/* ver reporte por id */}
            <Route path="ti/crear-control-equipo" element={<CrearControlEquipos />} /> {/* crear control de equipo */}
          </Route>

          <Route path="/" element={<Layout_TI />}>

            <Route path="/" element={<EmpleadoAuth />}>
              <Route path="ti/main" element={<DashboardInicio />} />
              <Route path="ti/informe-ups" element={<Dashboard_Ups />} />
              <Route path="ti/inventarios-ti" element={<Dashboard_inventario />} />
              <Route path="ti/control-equipos" element={<Dashboard_Control />} />
              <Route path="ti/configuraciones" element={<Dashboard_ConfigEmpleado />} />
            </Route>

            <Route path="/" element={<AdminAuth />}>
              <Route path="admin/main" element={<DashboardAdmin />} />
              <Route path="ti/informes-ups" element={<Dashboard_UpsAdmin />} />
              <Route path="ti/configuracion" element={<Dashboard_ConfigAdmin />} />
              <Route path="ti/inventario-ti" element={<Dashboard_inventarioAdmin />} />
              <Route path="admin/gestion-usuarios" element={<GestionUsuarios />} />
              <Route path="admin/gestion-usuarios/editar-usuario/:id" element={<UpdateUsuario />} />
              <Route path="admin/gestion-usuarios/password/:id" element={<UpdateContraseña />} />
              <Route path="ti/logs" element={<LogViewer />} />
            </Route>

            <Route path="/" element={<TiAuth />}>
              <Route path="ti/directorio" element={<Directorio />} />
              <Route path="ti/directorio/:id" element={<UpdateDirectorio />} />
              <Route path="ti/calendario" element={<Calendario />} />
              <Route path="ti/informes-ups/:tipoTamanoId" element={<Pagina_Ups />} />
              <Route path="ti/inventario-ti/:tipoInventarioId" element={<Pagina_Inventario />} />
              <Route path="ti/historial_ups/:id" element={<Historial_Ups />} />
              <Route path="ti/mapa/ups" element={<MapaCopan />} />
              <Route path="ti/crear/ups" element={<CrearUpsForm />} />
              <Route path="ti/notificaciones" element={<NotificationList />} />
              <Route path="ti/perfil" element={<ProfileCard />} />
              <Route path="ti/perfil/cambiar-contraseña" element={<UpdateContraseñaP />} />
              <Route path="ti/historial_inventario/:id" element={<HistorialInventario />} />
              <Route path="ti/agregar-inventario" element={<CrearInventarios />} />
              <Route path="ti/actualizar_inventario/:id" element={<EditarInventario />} />
              <Route path="ti/ups/editar-ups/:id" element={<UdpateUps />} />
              <Route path="ti/agregar-inventario" element={<CrearInventarios />} />
              <Route path="ti/actualizar_inventario/:id" element={<EditarInventario />} />
              <Route path="ti/ups/editar-ups/:id" element={<UdpateUps />} />
              <Route path="ti/agencias" element={<PaginaAgencias />} />
              <Route path="ti/crear-agencias" element={<CrearAgencia />} />
              <Route path="ti/actualizar-agencia/:id" element={<UpdateAgencias />} />
              <Route path="ti/departamentos" element={<PaginaDepartamento />} />
              <Route path="ti/crear-departamentos" element={<CrearDepartamentos />} />
              <Route path="ti/actualizar-departamento/:id" element={<UpdateDepartamentos />} />
              <Route path="ti/marca" element={<PaginaMarcas />} />
              <Route path="ti/crear-marcas" element={<CrearMarca />} />
              <Route path="ti/actualizar-marca/:id" element={<UpdateMarca />} />
              <Route path="ti/modelo" element={<PaginaModelos />} />
              <Route path="ti/crear-modelos" element={<CrearModelo />} />
              <Route path="ti/actualizar-modelo/:id" element={<UpdateModelo />} />
              <Route path="ti/historial/control-equipo" element={<HistorialControlEquipo />} />
              <Route path="ti/control-equipo" element={<Dashboard_Control_Admin />} />
              <Route path="ti/inventario/obsoleto" element={<Inventario_Obsoleto />} />
              <Route path="ti/inventario/Subir_Excel" element={<ExcelInventario />} />
            </Route>

          </Route>

          <Route path="/" element={<Layout_Prestamos />}>

            <Route path="/" element={<PrestamosAuth />}>
              <Route path="prestamos/main" element={<DashboardPrestamos />} /> 
              <Route path="prestamos/expedientes" element={<PaginaExpediente />} />
              <Route path="prestamos/expedientes_de_baja" element={<ExpedientesDeBaja />} /> 
              <Route path="prestamos/agregar_expediente" element={<CrearExpediente />} />
              <Route path="prestamos/editar_expediente/:id" element={<EditarExpediente />} />
              <Route path="prestamos/Ubicacion_expediente" element={<UbicacionExpediente />} />
              <Route path="prestamos/perfil" element={<PerfilPrestamos />} />
              <Route path="prestamos/historial/:id" element={<HistorialPrestamos />} />

            </Route>
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </>
);
