import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import './index.css';
import Layout from './layouts/Layout';
import { AuthProvider } from './api conexion/AuthContext';
import DashboardInicio from './paginas/dashboard_empleados';
import Dashboard_Ups from './paginas/dashboard_ups';
import Dashboard_inventario from './paginas/dashboard_inventario';
import Layout_2 from './layouts/Layout_2';
import Login from './paginas/Login';
import Directorio from './components/directorio/directorio';
import UpdateDirectorio from './components/directorio/updateDirectorio';

import DashboardAdmin from './paginas/dashboard_admin';
import GestionUsuarios from './paginas/GestionUsuarios/gestion_usuarios';
import UpdateUsuario from './paginas/GestionUsuarios/updateUsuario';
import UpdateContraseña from './paginas/GestionUsuarios/updateContraseña';
import Calendario from './components/otros/PaginaDeCalendario';


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


            <Route path="dashboard-admin/main" element={<DashboardAdmin />} />
            <Route path="dashboard-admin/gestion-usuarios" element={<GestionUsuarios />} />
            <Route path="dashboard-admin/gestion-usuarios/editar-usuario/:id" element={<UpdateUsuario />} />
            <Route path="dashboard-admin/gestion-usuarios/password/:id" element={<UpdateContraseña />} />
            <Route path="dashboard-admin/informes-ups" element={<Dashboard_Ups />} />
            <Route path="dashboard-admin/inventario-ti" element={<Dashboard_inventario />} />
            <Route path="dashboard-admin/directorio" element={<Directorio />} />


            <Route path="dashboard-empleados/calendario" element={<Calendario />} />
          </Route>

          

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </>
);
