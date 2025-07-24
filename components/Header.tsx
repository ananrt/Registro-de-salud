import React from 'react';
import { Icon } from './Icon.tsx';
import { ICONS } from '../constants.ts';

interface HeaderProps {
  profileName: string;
  onSwitchProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ profileName, onSwitchProfile }) => {
  return (
    <header className="flex justify-between items-center py-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#1C1B1F]">
          Bienvenido/a, <span className="text-[#6750A4]">{profileName}</span>
        </h1>
        <p className="text-md text-[#49454F]">Su panel de salud</p>
      </div>
      <button
        onClick={onSwitchProfile}
        title="Cambiar Perfil"
        className="flex items-center gap-2 px-3 py-2 bg-[#EADDFF] text-[#21005D] rounded-full hover:bg-[#D0BCFF] transition-colors"
      >
        <Icon path={ICONS.USER_SWITCH} className="w-5 h-5" />
        <span className="hidden sm:inline">Cambiar</span>
      </button>
    </header>
  );
};