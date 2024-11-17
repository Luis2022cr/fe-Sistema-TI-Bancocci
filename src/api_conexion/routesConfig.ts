// Direcciones Dashobard Admin
export const adminRoutes = {

  "Gestion Usuarios": "/dashboard-admin/gestion-usuarios",
  "Informe UPS": "/dashboard-admin/informes-ups",
  "Directorio TI": "/dashboard-admin/directorio",
  "Inventario TI": "/dashboard-admin/inventario-ti",
 
} as const;

export type AdminRouteKeys = keyof typeof adminRoutes;

export const upsAdminRoutes = {

  "UPS Pequeño": "/dashboard-admin/informes-ups/1",
  "Mapa": "/dashboard-admin/mapa/ups",
  "UPS Grande": "/dashboard-admin/informes-ups/2", 
 
} as const;

export type UpsAdminRouteKeys = keyof typeof upsAdminRoutes;

export const inventarioAdminRoutes = {
  
  "Desktop": "/dashboard-admin/inventario-ti/1",
  "Laptop": "/dashboard-admin/inventario-ti/2",
  "Impresora": "/dashboard-admin/inventario-ti/3",
  "Impresora Financiera": "/dashboard-admin/inventario-ti/4",
  "Teléfono": "/dashboard-admin/inventario-ti/5",
  "Planta": "/dashboard-admin/inventario-ti/6",
  "Monitor": "/dashboard-admin/inventario-ti/7",
  "Proyector": "/dashboard-admin/inventario-ti/8",
  "Otros": "/dashboard-admin/inventario-ti/9",
 
} as const;

export type InventarioAdminRouteKeys = keyof typeof inventarioAdminRoutes;



// Direcciones Dashobard Empleados
export const empleadosRoutes = {

  "Informe UPS": "/dashboard-empleados/informes-ups",
  "Directorio TI": "/dashboard-empleados/directorio",
  "Inventario TI": "/dashboard-empleados/inventario-ti",
  "Reporte E/S Equipo": "/dashboard-empleados/reportes",
 
} as const;

export type EmpleadosRouteKeys = keyof typeof empleadosRoutes;

export const upsRoutes = {

  "UPS Pequeño": "/dashboard-empleados/informes-ups/1",
  "Mapa": "/dashboard-empleados/mapa/ups",
  "UPS Grande": "/dashboard-empleados/informes-ups/2",
 
} as const;

export type UpsRouteKeys = keyof typeof upsRoutes;


export const inventarioRoutes = {
  
  "Desktop": "/dashboard-empleados/inventario-ti/1",
  "Laptop": "/dashboard-empleados/inventario-ti/2",
  "Impresora": "/dashboard-empleados/inventario-ti/3",
  "Impresora Financiera": "/dashboard-empleados/inventario-ti/4",
  "Teléfono": "/dashboard-empleados/inventario-ti/5",
  "Planta": "/dashboard-empleados/inventario-ti/6",
  "Monitor": "/dashboard-empleados/inventario-ti/7",
  "Proyector": "/dashboard-empleados/inventario-ti/8",
  "Otros": "/dashboard-empleados/inventario-ti/9",
 
} as const;

export type InventarioRouteKeys = keyof typeof inventarioRoutes;


export const configAdminRoutes = {

  "Agencias": "/dashboard-admin/agencias",
  "Departamentos": "/dashboard-admin/departamentos",
  "Marca - Modelo": "/dashboard-admin/marca-modelo", 
 
 
} as const;

export type ConfigAdminRoutes = keyof typeof configAdminRoutes;