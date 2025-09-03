import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface Profile {
  name: string;
  email: string;
  avatar: string;
}

interface ProfileContextType {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
}



const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile>(() => {
    const stored = localStorage.getItem('profile');
    return stored ? JSON.parse(stored) : { name: '', email: '', avatar: '' };
  });

  React.useEffect(() => {
    if (profile && profile.email) {
      localStorage.setItem('profile', JSON.stringify(profile));
    } else {
      localStorage.removeItem('profile');
    }
  }, [profile]);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfile must be used within a ProfileProvider');
  return context;
};
