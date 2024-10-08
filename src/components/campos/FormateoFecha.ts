
export const formatearFecha = (fechaString: string) => {
    const fecha = new Date(fechaString);
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(fecha);
  }
  