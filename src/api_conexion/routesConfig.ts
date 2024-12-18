// Direcciones Dashobard Admin
export const adminRoutes = {

  "Gestion Usuarios": "/administracion/gestion-usuarios",
  "Informe UPS": "/administracion/informes-ups",
  "Directorio TI": "/administracion/directorio",
  "Inventario TI": "/administracion/inventario-ti",
  "Entrada y salida Equipo": "/administracion/control-equipo",
  "Otros": "/administracion/configuraciones",

} as const;

export type AdminRouteKeys = keyof typeof adminRoutes;

export const upsAdminRoutes = {

  "UPS Pequeño": "/administracion/informes-ups/1",
  "Mapa": "/administracion/mapa/ups",
  "UPS Grande": "/administracion/informes-ups/2", 
 
} as const;

export type UpsAdminRouteKeys = keyof typeof upsAdminRoutes;

export const inventarioAdminRoutes = {
  
  "Desktop": "/administracion/inventario-ti/1",
  "Laptop": "/administracion/inventario-ti/2",
  "Impresora": "/administracion/inventario-ti/3",
  "Impresora Financiera": "/administracion/inventario-ti/4",
  "Teléfono": "/administracion/inventario-ti/5",
  "Planta": "/administracion/inventario-ti/6",
  "Monitor": "/administracion/inventario-ti/7",
  "Proyector": "/administracion/inventario-ti/8",
  "Otros": "/administracion/inventario-ti/9",
 
} as const;

export type InventarioAdminRouteKeys = keyof typeof inventarioAdminRoutes;



// Direcciones Dashobard Empleados
export const empleadosRoutes = {

  "Informe UPS": "/empleado/informes-ups",
  "Directorio TI": "/empleado/directorio",
  "Inventario TI": "/empleado/inventario-ti",
  "Entrada y salida Equipo": "/empleado/control-equipo",
 
} as const;

export type EmpleadosRouteKeys = keyof typeof empleadosRoutes;

export const upsRoutes = {

  "UPS Pequeño": "/empleado/informes-ups/1",
  "Mapa": "/empleado/mapa/ups",
  "UPS Grande": "/empleado/informes-ups/2",
 
} as const;

export type UpsRouteKeys = keyof typeof upsRoutes;


export const inventarioRoutes = {
  
  "Desktop": "/empleado/inventario-ti/1",
  "Laptop": "/empleado/inventario-ti/2",
  "Impresora": "/empleado/inventario-ti/3",
  "Impresora Financiera": "/empleado/inventario-ti/4",
  "Teléfono": "/empleado/inventario-ti/5",
  "Planta": "/empleado/inventario-ti/6",
  "Monitor": "/empleado/inventario-ti/7",
  "Proyector": "/empleado/inventario-ti/8",
  "Otros": "/empleado/inventario-ti/9",
 
} as const;

export type InventarioRouteKeys = keyof typeof inventarioRoutes;

export const configAdminRoutes = {

  "Agencias": "/administracion/agencias",
  "Departamentos": "/administracion/departamentos",
  "Marca": "/administracion/marca", 
  "Modelo": "/administracion/modelo", 
  "Logs": "/administracion/logs", 
 
 
} as const;

export type ConfigAdminRoutes = keyof typeof configAdminRoutes;

export const controlRoutes = {

  "Historial Entradas y Salidas de Equipo": "/empleado/historial/control-equipo",
  "Crear nueva Entrada o Salida": "/empleado/crear-control-equipo",
 
} as const;

export type ControlRouteKeys = keyof typeof controlRoutes;

export const controlRoutesAdmin = {

  "Historial Entradas y Salidas de Equipo": "/administracion/historial/control-equipo",
  "Crear nueva Entrada o Salida": "/administracion/crear-control-equipo",
 
} as const;

export type ControlAminRouteKeys = keyof typeof controlRoutesAdmin;

export const configEmpleadoRoutes = {

  "Agencias": "/empleado/agencias",
  "Departamentos": "/empleado/departamentos",
  "Marca": "/empleado/marca", 
  "Modelo": "/empleado/modelo", 
 
} as const;

export type ConfigEmpleadoRoutes = keyof typeof configEmpleadoRoutes;