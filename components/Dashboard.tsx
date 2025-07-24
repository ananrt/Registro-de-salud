import React, { useState } from 'react';
import type { UserProfile, HealthReading } from '../types.ts';
import { Header } from './Header.tsx';
import { DataEntryForm } from './DataEntryForm.tsx';
import { DataTable } from './DataTable.tsx';
import { exportToPDF } from '../services/pdfExporter.ts';
import { Icon } from './Icon.tsx';
import { ICONS } from '../constants.ts';


interface DashboardProps {
  profile: UserProfile;
  onAddReading: (reading: HealthReading) => void;
  onSwitchProfile: () => void;
  onDeleteReading: (readingId: string) => void;
  onDeleteProfile: (profileId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ profile, onAddReading, onSwitchProfile, onDeleteReading, onDeleteProfile }) => {
  const [deleteStep, setDeleteStep] = useState<'closed' | 'confirm' | 'export'>('closed');

  const handleExportAndDelete = () => {
    exportToPDF(profile);
    onDeleteProfile(profile.id);
    setDeleteStep('closed');
  };

  const handleDeleteWithoutExporting = () => {
    onDeleteProfile(profile.id);
    setDeleteStep('closed');
  };

  return (
    <>
      <div className="space-y-6">
        <Header
          profileName={profile.name}
          onSwitchProfile={onSwitchProfile}
        />
        
        <div className="bg-[#FEF7FF] p-6 rounded-3xl shadow-lg">
          <h2 className="text-xl font-medium text-[#49454F] mb-4">Nuevo registro</h2>
          <DataEntryForm onAddReading={onAddReading} />
        </div>

        <div className="bg-[#FEF7FF] p-6 rounded-3xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium text-[#49454F]">Historial</h2>
            <button
              onClick={() => exportToPDF(profile)}
              disabled={profile.readings.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-[#6750A4] text-white rounded-full shadow-md hover:bg-[#58448f] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Icon path={ICONS.DOWNLOAD} className="w-5 h-5" />
              <span>Exportar PDF</span>
            </button>
          </div>
          <DataTable readings={profile.readings} onDeleteReading={onDeleteReading} />
        </div>
        
        <div className="mt-4 text-center">
            <button
                onClick={() => setDeleteStep('confirm')}
                className="inline-flex items-center gap-2 px-4 py-2 text-red-600 font-medium rounded-full hover:bg-red-100 transition-colors"
            >
                <Icon path={ICONS.TRASH} className="w-5 h-5" />
                <span>Eliminar perfil</span>
            </button>
        </div>
      </div>

      {deleteStep === 'confirm' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
          <div className="bg-[#FEF7FF] rounded-3xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold text-[#1C1B1F]">Eliminar perfil</h3>
            <p className="mt-2 text-[#49454F]">¿Está seguro de que desea eliminar este perfil? Esta acción es permanente y eliminará todos los datos de salud asociados.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteStep('closed')}
                className="px-4 py-2 text-[#6750A4] font-medium rounded-full hover:bg-[#EADDFF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6750A4] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => setDeleteStep('export')}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-colors"
              >
                Eliminar perfil
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteStep === 'export' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
          <div className="bg-[#FEF7FF] rounded-3xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-[#1C1B1F]">Exportar datos antes de eliminar</h3>
            <p className="mt-2 text-[#49454F]">Tiene la opción de guardar una copia de sus datos en PDF antes de eliminar permanentemente el perfil.</p>
            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setDeleteStep('closed')}
                className="px-4 py-2 text-[#6750A4] font-medium rounded-full hover:bg-[#EADDFF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6750A4] transition-colors order-last sm:order-first"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteWithoutExporting}
                className="px-4 py-2 bg-red-200 text-red-800 font-medium rounded-full hover:bg-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-colors"
              >
                Eliminar sin exportar
              </button>
              <button
                onClick={handleExportAndDelete}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-colors"
              >
                Exportar y eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};