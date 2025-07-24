import React, { useState } from 'react';
import type { UserProfile } from '../types.ts';
import { Icon } from './Icon.tsx';
import { ICONS } from '../constants.ts';

interface ProfileSelectorProps {
  profiles: UserProfile[];
  onSelectProfile: (id: string) => void;
  onCreateProfile: (name: string) => void;
}

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({ profiles, onSelectProfile, onCreateProfile }) => {
  const [newProfileName, setNewProfileName] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProfileName.trim()) {
      onCreateProfile(newProfileName.trim());
      setNewProfileName('');
      setIsCreateModalOpen(false);
    }
  };

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setNewProfileName('');
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[90vh]">
        <div className="w-full max-w-md p-6 bg-[#FEF7FF] rounded-3xl shadow-lg">
          <div className="text-center">
              <Icon path={ICONS.HEALTH} className="w-16 h-16 mx-auto text-[#6750A4]" />
              <h1 className="text-3xl font-bold text-[#1C1B1F] mt-4">Registro de salud</h1>
              <p className="text-md text-[#49454F] mt-2">Selecciona un perfil para continuar</p>
          </div>

          <div className="mt-8">
              <h2 className="text-lg font-medium text-[#49454F] mb-3">Usuarios</h2>
              {profiles.length > 0 ? (
                  <ul className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
                      {profiles.map(profile => (
                          <li key={profile.id}>
                              <button
                                  onClick={() => onSelectProfile(profile.id)}
                                  className="w-full flex items-center justify-between text-left p-4 bg-[#EADDFF] hover:bg-[#D0BCFF] rounded-xl transition-colors duration-200"
                              >
                                  <span className="font-medium text-[#21005D]">{profile.name}</span>
                                  <Icon path={ICONS.ARROW_RIGHT} className="w-5 h-5 text-[#21005D]" />
                              </button>
                          </li>
                      ))}
                  </ul>
              ) : (
                  <div className="text-center text-[#49454F] bg-[#F7F2FA] p-6 rounded-lg mt-4">
                    <Icon path={ICONS.USER_ADD} className="w-12 h-12 mx-auto text-gray-400"/>
                    <p className="mt-4 font-medium">Aún no hay perfiles.</p>
                    <p className="text-sm">Crea tu primer perfil con el botón de abajo.</p>
                  </div>
              )}
          </div>
        </div>

        {/* Floating Action Button */}
        <button
          onClick={openCreateModal}
          title="Crear nuevo perfil"
          className="fixed bottom-8 right-8 bg-[#6750A4] text-white p-4 rounded-2xl shadow-lg hover:bg-[#58448f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6750A4] transition-all duration-300 transform hover:scale-105"
        >
           <Icon path={ICONS.ADD} className="w-8 h-8" />
        </button>
      </div>

      {/* Create Profile Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
          <div className="bg-[#FEF7FF] rounded-3xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold text-[#1C1B1F]">Crear nuevo perfil</h3>
            <p className="mt-2 text-[#49454F]">Introduce un nombre para el nuevo perfil de usuario.</p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="new-profile-name" className="block text-sm font-medium text-[#49454F] mb-1">Nombre de usuario</label>
                <input
                    id="new-profile-name"
                    type="text"
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    required
                    autoFocus
                    className="w-full bg-[#E7E0EC] border-2 border-transparent focus:ring-2 focus:ring-[#6750A4] focus:border-[#6750A4] text-[#1C1B1F] placeholder:text-[#49454F] rounded-lg p-3 outline-none transition"
                />
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="px-4 py-2 text-[#6750A4] font-medium rounded-full hover:bg-[#EADDFF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6750A4] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!newProfileName.trim()}
                  className="px-4 py-2 bg-[#6750A4] text-white font-medium rounded-full hover:bg-[#58448f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6750A4] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Crear Perfil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};