// rutas de dashboard 
export const empleadosRoutes = {

  "Informe UPS": "/dashboard-empleados/informes-ups",
  "Directorio TI": "/dashboard-empleados/directorio-ti",
  "Inventario TI": "/dashboard-empleados/inventario-ti",
 
} as const;

export type EmpleadosRouteKeys = keyof typeof empleadosRoutes;
  
export const upsRoutes = {

  "UPS Pequeño": "/dashboard-empleados/informes-ups/ups-pequeño",
  "UPS Grande": "/dashboard-empleados/informes-ups/ups-grande",
 
} as const;

export type UpsRouteKeys = keyof typeof upsRoutes;


export const inventarioRoutes = {

  
  "Desktop": "/dashboard-empleados/inventario-ti/desktop",
  "Laptop": "/dashboard-empleados/inventario-ti/laptop",
  "Impresora": "/dashboard-empleados/inventario-ti/impresora",
  "Impresora Financiera": "/dashboard-empleados/inventario-ti/impresora-financiera",
  "Teléfono": "/dashboard-empleados/inventario-ti/telefono",
  "Planta": "/dashboard-empleados/inventario-ti/planta",
  "Monitor": "/dashboard-empleados/inventario-ti/monitor",
  "Proyector": "/dashboard-empleados/inventario-ti/proyector",
  "Otros": "/dashboard-empleados/inventario-ti/otros",
 
} as const;

export type InventarioRouteKeys = keyof typeof inventarioRoutes;