import { useState } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Typography } from "@/components/ui/typography";
import { Flex } from "@/components/ui/flex";
import { Stack } from "@/components/ui/stack";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useProfile } from "../lib/profileContext";
import { useEffect } from "react";
import { useToast } from "../components/ui/toast";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'es' | 'fr'>('en');
  const { profile, setProfile } = useProfile();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Local state for editing
  const [editName, setEditName] = useState(profile.name);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editAvatar, setEditAvatar] = useState(profile.avatar);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [editDescription, setEditDescription] = useState(
    `Hi, I'm ${profile.name}. I'm passionate about building modern web applications and collaborating with cross-functional teams. Reach out to me at ${profile.email} for any project or team opportunities!`
  );
  const [descEditMode, setDescEditMode] = useState(false);

  useEffect(() => {
    setEditAvatar(profile.avatar);
    setEditName(profile.name);
    setEditEmail(profile.email);
  }, [profile.avatar, profile.name, profile.email]);

  // Avatar upload handler (preview only, doesn't save until handleSave)
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatar(reader.result as string);
        setHasUnsavedChanges(true);
        // Don't update profile immediately - only on save
      };
      reader.readAsDataURL(file);
    }
  };

  // Cancel changes handler
  const handleCancelChanges = () => {
    setEditName(profile.name);
    setEditEmail(profile.email);
    setEditAvatar(profile.avatar);
    setPassword('');
    setHasUnsavedChanges(false);
  };

  // Save handler (update global profile)
  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('Please log in to update your profile.', 'error');
        return;
      }

      const updateData: any = {
        name: editName,
        email: editEmail,
        avatar: editAvatar
      };

      // Only include password if it's not empty
      if (password && password.trim()) {
        updateData.password = password;
      }

      const response = await fetch('http://localhost:5000/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        const result = await response.json();
        setProfile({ 
          name: result.user.name, 
          email: result.user.email, 
          avatar: result.user.avatar 
        });
        
        // Clear password field after successful update
        setPassword('');
        setHasUnsavedChanges(false);
        
        showToast('Profile updated successfully!', 'success');
      } else {
        const error = await response.json();
        showToast(error.message || 'Failed to update profile.', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Failed to update profile. Please try again.', 'error');
    }
  };

  // Sidebar navigation handlers
  const handleShowAllCandidates = () => navigate('/candidates');
  const handleShowInterviews = () => navigate('/interviews');
  const handleShowDashboard = () => navigate('/dashboard');
  const handleMenuClick = () => setIsSidebarOpen((open) => !open);

  // Show not-logged-in indicator if profile is empty
  const isLoggedIn = !!profile.email && !!profile.name;

  return (
  <div className="w-full h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      {!isLoggedIn && (
        <div className="w-full flex justify-center items-center bg-red-100 text-red-700 py-2 font-semibold">
          You are not logged in.
        </div>
      )}
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header
          onMenuClick={handleMenuClick}
          onNotificationClick={() => {}}
          onAddPerson={() => {}}
          onCreateType={() => {}}
          language={language}
          setLanguage={setLanguage}
        />
      </div>
      {/* Fixed Sidebar */}
      <div className="fixed top-[64px] left-4 h-[calc(100vh-64px)] w-64 z-40 hidden md:flex flex-col">
        <Sidebar
          className="rounded-xl h-full"
          onShowAllCandidates={handleShowAllCandidates}
          onShowInterviews={handleShowInterviews}
          onShowDashboard={handleShowDashboard}
          language={language}
          setLanguage={setLanguage}
          onAddPerson={() => {}}
          onNotificationClick={() => {}}
        />
      </div>
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[9999] flex md:hidden">
          <div className={`relative w-64 h-full z-50 bg-gray-200 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <Sidebar className="rounded-xl h-full bg-gray-200" onClose={() => setIsSidebarOpen(false)} onShowAllCandidates={handleShowAllCandidates} onShowInterviews={handleShowInterviews} onShowDashboard={handleShowDashboard} language={language} setLanguage={setLanguage} onAddPerson={() => {}} onNotificationClick={() => {}} />
          </div>
          <div className="flex-1 h-full bg-black/30 z-40" onClick={() => setIsSidebarOpen(false)}></div>
        </div>
      )}
      {/* Main Content Area */}
      <div className="md:pl-64 h-screen pt-10">
        <div className="h-full overflow-y-auto p-2 sm:p-3 md:p-4">
          <div className="flex flex-1 flex-col min-h-[calc(100vh-64px)] w-full max-w-none">
            <div className="flex items-center gap-2 mb-6 mt-2">
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 p-0 rounded-full hover:bg-emerald-700"
                onClick={() => navigate(-1)}
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Typography variant="h1" size="lg" weight="bold" className="text-2xl md:text-3xl">
                Settings
              </Typography>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Summary Card */}
              <Card className="rounded-2xl shadow bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-0 w-full">
                <CardHeader className="pb-2 pt-6 px-6">
                  <CardTitle className="text-lg md:text-xl font-semibold">Profile Summary</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4 px-6 pb-8 pt-2 w-full">
                  <Avatar className="w-24 h-24 mb-2">
                    <AvatarImage src={profile.avatar} />
                    <AvatarFallback className="text-2xl">{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <Typography variant="h2" size="lg" weight="bold" className="text-xl text-center">{profile.name}</Typography>
                  <Typography variant="p" size="sm" color="muted" className="text-gray-500 text-center">{profile.email}</Typography>
                  {/* ShadCN badge for status */}
                  <div className="flex flex-col items-center gap-2 w-full mt-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">Active User</span>
                  </div>
                  {/* Editable description */}
                  <div className="w-full flex flex-col items-center mt-2">
                    {descEditMode ? (
                      <>
                        <textarea
                          className="w-full max-w-xs border rounded p-2 text-sm text-gray-700 mb-2"
                          value={editDescription}
                          onChange={e => setEditDescription(e.target.value)}
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setDescEditMode(false)}>Cancel</Button>
                          <Button size="sm" onClick={() => setDescEditMode(false)}>Save</Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <Typography variant="p" size="sm" className="text-center text-gray-700 mb-2">
                          {editDescription}
                        </Typography>
                        <Button size="sm" variant="outline" onClick={() => setDescEditMode(true)}>
                          Edit Description
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Project/Account Details Card */}
              <Card className="rounded-2xl shadow bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-0 w-full">
                <CardHeader className="pb-2 pt-6 px-6">
                  <CardTitle className="text-lg md:text-xl font-semibold">Account & Profile</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6 px-6 pb-8 pt-2 w-full">
                  <div className="w-full flex justify-center mb-2">
                    <label htmlFor="avatar-upload" className="relative cursor-pointer group">
                      <Avatar className="w-20 h-20 border-2 border-emerald-500 shadow">
                        <AvatarImage src={editAvatar} />
                        <AvatarFallback className="text-2xl">{(editName || "").split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        <span className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow group-hover:bg-emerald-700 transition-colors">
                          {/* ShadCN Edit icon (lucide-react) */}
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black hover:bg-emerald-700"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </span>
                      </Avatar>
                      <Input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>
                  <Stack spacing={4} className="w-full max-w-xs">
                    <div className="w-full flex flex-col items-start">
                      <Label htmlFor="name" className="mb-1 block text-sm font-medium pl-1">Name</Label>
                      <Input
                        id="name"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="w-full"
                        placeholder="Your Name"
                      />
                    </div>
                    <div className="w-full flex flex-col items-start">
                      <Label htmlFor="email" className="mb-1 block text-sm font-medium pl-1">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editEmail}
                        onChange={e => setEditEmail(e.target.value)}
                        className="w-full"
                        placeholder="you@example.com"
                      />
                    </div>
                    <div className="w-full flex flex-col items-start">
                      <Label htmlFor="password" className="mb-1 block text-sm font-medium pl-1">Password</Label>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full"
                        placeholder="Enter new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="mt-2 bg-black text-white hover:bg-emerald-700 hover:text-white"
                        onClick={() => setShowPassword(v => !v)}
                      >
                        {showPassword ? "Hide Password" : "Show Password"}
                      </Button>
                    </div>
                  </Stack>
                  <Flex direction="row" gap={3} className="mt-4 w-full justify-center">
                    <Button
                      className="flex-1 bg-black text-white hover:bg-emerald-700 hover:text-white py-2 rounded-lg font-semibold"
                      onClick={handleSave}
                    >
                      Save Changes
                    </Button>
                    {hasUnsavedChanges && (
                      <Button
                        variant="outline"
                        className="flex-1 py-2 rounded-lg font-semibold"
                        onClick={handleCancelChanges}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      className="flex-1 py-2 rounded-lg font-semibold"
                      onClick={() => {
                        setProfile({ name: '', email: '', avatar: '' });
                        navigate('/');
                      }}
                    >
                      Logout
                    </Button>
                  </Flex>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
  {/* Removed redundant bottom logout button for clarity */}
    </div>
  );
}
