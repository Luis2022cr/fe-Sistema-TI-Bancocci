import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import './index.css';
import Layout from './layouts/Layout';
import { AuthProvider } from './api conexion/AuthContext';
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
import UpsCard from './components/ups/pruebaHistorial';
import DashboardAdmin from './paginas/dashboard-admin/dashboard_admin';
import Dashboard_UpsAdmin from './paginas/dashboard-admin/dashboard_upsAdmin';
import Dashboard_inventarioAdmin from './paginas/dashboard-admin/dashboard_inventarioAdmin';
import DashboardInicio from './paginas/dashboard-empleados/dashboard_empleados';
import Dashboard_inventario from './paginas/dashboard-empleados/dashboard_inventario';
import Dashboard_Ups from './paginas/dashboard-empleados/dashboard_ups';

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
            <Route path="dashboard-empleados/historial_ups" element={<UpsCard />} />
            <Route path="dashboard-empleados/mapa/ups" element={<MapaCopan />} />


            <Route path="dashboard-admin/main" element={<DashboardAdmin />} />
            <Route path="dashboard-admin/informes-ups" element={<Dashboard_UpsAdmin />} />
            <Route path="dashboard-admin/inventario-ti" element={<Dashboard_inventarioAdmin />} />
            <Route path="dashboard-admin/gestion-usuarios" element={<GestionUsuarios />} />
            <Route path="dashboard-admin/gestion-usuarios/editar-usuario/:id" element={<UpdateUsuario />} />
            <Route path="dashboard-admin/gestion-usuarios/password/:id" element={<UpdateContraseña />} />
            <Route path="dashboard-admin/directorio" element={<Directorio />} />
            <Route path="dashboard-admin/directorio/:id" element={<UpdateDirectorio />} />
            <Route path="dashboard-admin/calendario" element={<Calendario />} />
            <Route path="dashboard-admin/informes-ups/:tipoTamanoId" element={<Pagina_Ups />} />
            <Route path="dashboard-admin/inventario-ti/:tipoInventarioId" element={<Pagina_Inventario />} />
            <Route path="dashboard-admin/historial_ups" element={<UpsCard />} />
            <Route path="dashboard-admin/mapa/ups" element={<MapaCopan />} />


          </Route>

          

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </>
);
