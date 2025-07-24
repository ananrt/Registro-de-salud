import React, { useState } from 'react';
import { ReadingType, type HealthReading } from '../types.ts';
import { Icon } from './Icon.tsx';
import { ICONS } from '../constants.ts';

interface DataTableProps {
  readings: HealthReading[];
  onDeleteReading: (readingId: string) => void;
}

export const DataTable: React.FC<DataTableProps> = ({ readings, onDeleteReading }) => {
  const [readingToDelete, setReadingToDelete] = useState<HealthReading | null>(null);

  const handleConfirmDelete = () => {
    if (readingToDelete) {
      onDeleteReading(readingToDelete.id);
      setReadingToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setReadingToDelete(null);
  };

  if (readings.length === 0) {
    return (
      <div className="text-center py-10 px-6 bg-[#F7F2FA] rounded-2xl">
        <Icon path={ICONS.CHART} className="w-12 h-12 mx-auto text-gray-400" />
        <p className="mt-4 text-lg font-medium text-[#49454F]">Aún no se han registrado lecturas</p>
        <p className="text-sm text-gray-500">Utilice el formulario de arriba para añadir su primer registro de salud</p>
      </div>
    );
  }

  // Sort readings by timestamp, newest first
  const sortedReadings = [...readings].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left table-fixed">
          <thead className="border-b-2 border-b-[#E7E0EC]">
            <tr>
              <th className="p-3 text-sm font-semibold text-[#49454F] w-1/4">Fecha</th>
              <th className="p-3 text-sm font-semibold text-[#49454F] w-1/4">Tipo</th>
              <th className="p-3 text-sm font-semibold text-[#49454F] w-1/4">Lectura</th>
              <th className="p-3 text-sm font-semibold text-[#49454F] text-right w-1/4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sortedReadings.map((reading, index) => (
              <tr key={reading.id} className={`border-b border-b-[#E7E0EC] ${index % 2 === 0 ? 'bg-transparent' : 'bg-[#F7F2FA]'}`}>
                <td className="p-3 align-top">
                  <div className="text-sm font-medium text-[#1C1B1F]">{new Date(reading.timestamp).toLocaleDateString('es-ES')}</div>
                  <div className="text-xs text-gray-500">{new Date(reading.timestamp).toLocaleTimeString('es-ES')}</div>
                </td>
                <td className="p-3 align-top">
                  {reading.type === ReadingType.BloodPressure ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Presión
                      </span>
                  ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Azúcar
                      </span>
                  )}
                </td>
                <td className="p-3 align-top text-sm text-[#1C1B1F]">
                  {reading.type === ReadingType.BloodPressure ? (
                    <div>
                      <div><strong>SIS:</strong> {reading.systolic} <span className="text-xs text-gray-500">mmHg</span></div>
                      <div><strong>DIA:</strong> {reading.diastolic} <span className="text-xs text-gray-500">mmHg</span></div>
                      <div><strong>Pulso:</strong> {reading.pulse} <span className="text-xs text-gray-500">LPM</span></div>
                    </div>
                  ) : (
                    <div>
                      <div><strong>Glucosa:</strong> {reading.glucose} <span className="text-xs text-gray-500">mg/dL</span></div>
                      <div className="text-xs text-gray-600">({reading.context})</div>
                    </div>
                  )}
                </td>
                <td className="p-3 align-top text-right">
                  <button
                    onClick={() => setReadingToDelete(reading)}
                    title="Eliminar registro"
                    className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                  >
                    <Icon path={ICONS.TRASH} className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {readingToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
          <div className="bg-[#FEF7FF] rounded-3xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold text-[#1C1B1F]">Confirmar Eliminación</h3>
            <p className="mt-2 text-[#49454F]">¿Está seguro de que desea eliminar este registro? Esta acción no se puede deshacer.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-[#6750A4] font-medium rounded-full hover:bg-[#EADDFF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6750A4] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};