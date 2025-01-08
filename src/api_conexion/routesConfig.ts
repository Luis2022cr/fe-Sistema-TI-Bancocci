// Rutas del Dashboard de Administrador
export const adminRoutes = {
  "Gestion Usuarios": "/admin/gestion-usuarios",
  "Informe UPS": "/ti/informes-ups",
  "Directorio TI": "/ti/directorio",
  "Inventario TI": "/ti/inventario-ti",
  "Entrada y salida Equipo": "/ti/control-equipo",
  "Otros": "/ti/configuraciones",
} as const;

export type AdminRouteKeys = keyof typeof adminRoutes;

export const upsAdminRoutes = {
  "UPS Pequeño": "/ti/informes-ups/1",
  "Mapa": "/ti/mapa/ups",
  "UPS Grande": "/ti/informes-ups/2",
} as const;

export type UpsAdminRouteKeys = keyof typeof upsAdminRoutes;

export const inventarioAdminRoutes = {
  "Desktop": "/ti/inventario-ti/1",
  "Laptop": "/ti/inventario-ti/2",
  "Impresora": "/ti/inventario-ti/3",
  "Impresora Financiera": "/ti/inventario-ti/4",
  "Teléfono": "/ti/inventario-ti/5",
  "Planta": "/ti/inventario-ti/6",
  "Monitor": "/ti/inventario-ti/7",
  "Proyector": "/ti/inventario-ti/8",
  "Otros": "/ti/inventario-ti/9",
} as const;

export type InventarioAdminRouteKeys = keyof typeof inventarioAdminRoutes;

export const configAdminRoutes = {
  "Agencias": "/ti/agencias",
  "Departamentos": "/ti/departamentos",
  "Marca": "/ti/marca",
  "Modelo": "/ti/modelo",
  "Logs": "/ti/logs",
} as const;

export type ConfigAdminRoutes = keyof typeof configAdminRoutes;

export const controlRoutesAdmin = {
  "Historial Entradas y Salidas de Equipo": "/ti/historial/control-equipo",
  "Crear nueva Entrada o Salida": "/ti/crear-control-equipo",
} as const;

export type ControlAdminRouteKeys = keyof typeof controlRoutesAdmin;

// Rutas del Dashboard de Empleados
export const empleadosRoutes = {
  "Informe UPS": "/ti/informe-ups",
  "Directorio TI": "/ti/directorio",
  "Inventario TI": "/ti/inventarios-ti",
  "Entrada y salida Equipo": "/ti/control-equipos",
} as const;

export type EmpleadosRouteKeys = keyof typeof empleadosRoutes;

export const upsRoutes = {
  "UPS Pequeño": "/ti/informes-ups/1",
  "Mapa": "/ti/mapa/ups",
  "UPS Grande": "/ti/informes-ups/2",
} as const;

export type UpsRouteKeys = keyof typeof upsRoutes;

export const inventarioRoutes = {
  "Desktop": "/ti/inventario-ti/1",
  "Laptop": "/ti/inventario-ti/2",
  "Impresora": "/ti/inventario-ti/3",
  "Impresora Financiera": "/ti/inventario-ti/4",
  "Teléfono": "/ti/inventario-ti/5",
  "Planta": "/ti/inventario-ti/6",
  "Monitor": "/ti/inventario-ti/7",
  "Proyector": "/ti/inventario-ti/8",
  "Otros": "/ti/inventario-ti/9",
} as const;

export type InventarioRouteKeys = keyof typeof inventarioRoutes;

export const configEmpleadoRoutes = {
  "Agencias": "/ti/agencias",
  "Departamentos": "/ti/departamentos",
  "Marca": "/ti/marca",
  "Modelo": "/ti/modelo",
} as const;

export type ConfigEmpleadoRoutes = keyof typeof configEmpleadoRoutes;

export const controlRoutes = {
  "Historial Entradas y Salidas de Equipo": "/ti/historial/control-equipo",
  "Crear nueva Entrada o Salida": "/ti/crear-control-equipo",
} as const;

export type ControlRouteKeys = keyof typeof controlRoutes;
