type Valores = Record<string, string | number | boolean | null | undefined>; // Acepta valores de formulario
type NombresLegibles = Record<string, string>; // Los nombres siempre son strings

export const validarCampos = (
  valores: Valores,
  nombresLegibles: NombresLegibles
): string | null => {
  const faltantes = Object.entries(nombresLegibles)
    .filter(([key]) => !valores[key]) // Verifica si el campo está vacío
    .map(([, label]) => label); // Obtiene el nombre legible

  return faltantes.length > 0
    ? `Por favor, rellena los siguientes campos: ${faltantes.join(", ")}.`
    : null;
};
