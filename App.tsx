import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage.ts';
import type { UserProfile, HealthReading } from './types.ts';
import { ProfileSelector } from './components/ProfileSelector.tsx';
import { Dashboard } from './components/Dashboard.tsx';

const App: React.FC = () => {
  const [profiles, setProfiles] = useLocalStorage<UserProfile[]>('health-tracker-profiles', []);
  const [activeProfileId, setActiveProfileId] = useLocalStorage<string | null>('health-tracker-active-profile', null);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || null;

  const handleProfileSelect = (id: string) => {
    setActiveProfileId(id);
  };

  const handleProfileCreate = (name: string) => {
    if (name.trim() === '') return;
    const newProfile: UserProfile = {
      id: `user_${Date.now()}`,
      name,
      readings: [],
    };
    const updatedProfiles = [...profiles, newProfile];
    setProfiles(updatedProfiles);
    setActiveProfileId(newProfile.id);
  };
  
  const handleSwitchProfile = () => {
    setActiveProfileId(null);
  };

  const handleAddReading = (reading: HealthReading) => {
    if (!activeProfileId) return;
    const updatedProfiles = profiles.map(profile => {
      if (profile.id === activeProfileId) {
        return {
          ...profile,
          readings: [reading, ...profile.readings]
        };
      }
      return profile;
    });
    setProfiles(updatedProfiles);
  };

  const handleDeleteReading = (readingId: string) => {
    if (!activeProfileId) return;
    const updatedProfiles = profiles.map(profile => {
      if (profile.id === activeProfileId) {
        return {
          ...profile,
          readings: profile.readings.filter(reading => reading.id !== readingId)
        };
      }
      return profile;
    });
    setProfiles(updatedProfiles);
  };

  const handleProfileDelete = (profileId: string) => {
    const updatedProfiles = profiles.filter(p => p.id !== profileId);
    setProfiles(updatedProfiles);
    setActiveProfileId(null);
  };

  return (
    <div className="min-h-screen bg-[#FFFBFE] text-[#1C1B1F] font-sans">
      <main className="max-w-2xl mx-auto p-4 md:p-6">
        {activeProfile ? (
          <Dashboard
            profile={activeProfile}
            onAddReading={handleAddReading}
            onSwitchProfile={handleSwitchProfile}
            onDeleteReading={handleDeleteReading}
            onDeleteProfile={handleProfileDelete}
          />
        ) : (
          <ProfileSelector
            profiles={profiles}
            onSelectProfile={handleProfileSelect}
            onCreateProfile={handleProfileCreate}
          />
        )}
      </main>
    </div>
  );
};

export default App;