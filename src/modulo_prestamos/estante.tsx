import React from 'react';

interface EstanteProps {
  estante: number;
  columna: number;
  fila: number;
}

const Estante: React.FC<EstanteProps> = ({ estante, columna, fila }) => {
  const filas = 5;
  const columnas = 3;

  return (
    <>
      <h3 className="text-2xl font-bold mb-4 text-center">Estante {estante}</h3>
      <div className="bg-gradient-to-b from-amber-700 to-amber-800 p-4 rounded-lg shadow-xl">
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: columnas }).map((_, colIndex) => (
            <div key={colIndex} className="text-center font-semibold text-amber-100">
              Columna {colIndex + 1}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 bg-amber-600 p-2 rounded-md">
          {Array.from({ length: filas * columnas }).map((_, index) => {
            const filaActual = Math.floor(index / columnas) + 1;
            const columnaActual = (index % columnas) + 1;
            const esUbicacionActual = filaActual === fila && columnaActual === columna;

            return (
              <div
                key={index}
                className={`relative h-20 flex items-center justify-center border-2 border-amber-800 rounded ${
                  esUbicacionActual ? 'bg-blue-500' : 'bg-amber-50'
                }`}
              >
                {esUbicacionActual && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-16 bg-yellow-200 border-2 border-yellow-600 rounded transform -rotate-3 shadow-md flex items-center justify-center">
                      <span className="text-yellow-800 font-bold">EXP</span>
                    </div>
                  </div>
                )}
                <span className="absolute bottom-1 right-1 text-xs font-semibold text-slate-800">
                  {filaActual},{columnaActual}
                </span>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {Array.from({ length: columnas }).map((_, colIndex) => (
            <div key={colIndex} className="text-center font-semibold text-amber-100">
              Columna {colIndex + 1}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 text-center text-sm text-gray-600">
        El expediente se encuentra en la fila {fila}, columna {columna}
      </div>
    </>
  );
};

export default Estante;

