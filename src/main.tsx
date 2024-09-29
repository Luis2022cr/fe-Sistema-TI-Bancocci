import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import './index.css';
import Layout from './layouts/Layout';
import { AuthProvider } from './api conexion/AuthContext';
import DashboardInicio from './paginas/dashboard_empleados';
import Dashboard_Ups from './paginas/dashboard_ups';
import Dashboard_inventario from './paginas/dashboard_inventario';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <>
    <AuthProvider>

      <BrowserRouter>
        <Routes>
          {/* Rutas que utilizan el Layout por defecto */}
          <Route path="/" element={<Layout />}>
            <Route index element={<App />} />
          </Route>

          <Route path="dashboard-empleados/main" element={<DashboardInicio />} />
          <Route path="dashboard-empleados/informes-ups" element={<Dashboard_Ups />} />
          <Route path="dashboard-empleados/inventario-ti" element={<Dashboard_inventario/>} />
        
           
   
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </>
);
