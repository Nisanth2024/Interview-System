// Candidate type definition (matches backend)
type Candidate = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  avatar?: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
  rating?: number;
  appliedDate?: string;
  experience?: string;
  skills?: string[];
  department?: 'Design Department' | 'Engineering Department';
};
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { AddPersonModal } from "../components/AddPersonModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Grid } from "@/components/ui/grid";
import { Flex } from "@/components/ui/flex";
import { Stack } from "@/components/ui/stack";
import { Typography } from "@/components/ui/typography";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HelpCircle, X, UserPlus, Clock, ArrowLeft, Mail, Phone, Calendar, MapPin, Star, Eye, MessageSquare, MoreHorizontal, Edit, Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/toast";



export default function CandidatesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [showAllNotifications, setShowAllNotifications] = useState(false)
  const [departmentFilter, setDepartmentFilter] = useState<'All' | 'Design Department' | 'Engineering Department'>('All')
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [language, setLanguage] = useState<'en' | 'es' | 'fr'>('en');

  // Set department filter from navigation state
  useEffect(() => {
    if (location.state?.departmentFilter) {
      setDepartmentFilter(location.state.departmentFilter);
    }
  }, [location.state]);

  // Toggle sidebar open/close
  const handleMenuClick = () => setIsSidebarOpen((open) => !open)

  // Toggle notification panel open/close
  const handleNotificationClick = () => setIsNotificationOpen((open) => !open)

  // Toggle between showing one or all notifications
  const handleSeeAllNotifications = () => setShowAllNotifications(!showAllNotifications)

  // Navigation handlers
  const handleShowAllCandidates = () => {
    navigate('/candidates');
  }
  const handleShowInterviews = () => {
    navigate('/interviews');
  }
  const handleShowDashboard = () => {
    navigate('/dashboard');
  }
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  }

  // Redirect to login if token is missing or invalid
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetch('http://localhost:5000/api/candidates', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(async res => {
        if (res.status === 401) {
          // Token invalid or expired, redirect to login
          localStorage.removeItem('token');
          navigate('/login');
          return [];
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setCandidates(data);
        } else {
          setCandidates([]);
        }
      })
      .catch(() => setCandidates([]));
  }, [navigate]);

  // ...existing code...

  // Add person handler
  const handleAddPerson = async (person: {
    type: 'candidate' | 'interviewer'
    name: string
    email: string
    phone: string
    location: string
    department: string
    experience: string
    skills: string[]
    avatar?: string
  }) => {
    if (person.type === 'candidate') {
      // Send to backend with JWT token, only required fields
      const token = localStorage.getItem('token');
      const candidatePayload = {
        name: person.name,
        email: person.email,
        phone: person.phone,
        location: person.location,
        department: person.department,
        experience: person.experience,
        skills: Array.isArray(person.skills) ? person.skills : [],
        avatar: person.avatar || '',
        status: (person as any).status || 'pending',
        rating: Math.floor(Math.random() * 20 + 30) / 10,
        appliedDate: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
      };
      try {
        const res = await fetch('http://localhost:5000/api/candidates', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify(candidatePayload)
        });
        
        if (res.ok) {
          const newCandidate = await res.json();
          // Refresh the entire candidate list from backend to ensure consistency
          const refreshRes = await fetch('http://localhost:5000/api/candidates', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const updatedCandidates = await refreshRes.json();
          setCandidates(Array.isArray(updatedCandidates) ? updatedCandidates : []);
          setDepartmentFilter(person.department as 'All' | 'Design Department' | 'Engineering Department');
          showToast('Candidate added successfully!', 'success');
        }
      } catch (error) {
        console.error('Error adding candidate:', error);
        showToast('Failed to add candidate. Please try again.', 'error');
      }
    } else {
      // For interviewers, you could add them to a separate state or handle differently
      console.log('Added interviewer:', person)
    }
  }

  // Delete candidate handler
  const handleDeleteCandidate = async (id: string) => {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:5000/api/candidates/${id}`, {
      method: 'DELETE',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    // Refresh candidate list from backend to ensure permanent deletion
    fetch('http://localhost:5000/api/candidates', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCandidates(data);
          showToast('Candidate deleted successfully!', 'error');
        } else {
          setCandidates([]);
        }
      })
      .catch(() => setCandidates([]));
  }

  // Recommended skills for edit form
  const getRecommendedSkills = () => [
    "React", "Vue.js", "Angular", "TypeScript", "Node.js", "Figma", "Photoshop"
  ];

  const handleEditAddSkill = () => {
    if (editNewSkill.trim() && !editSkills.includes(editNewSkill.trim())) {
      setEditSkills([...editSkills, editNewSkill.trim()]);
      setEditNewSkill('');
    }
  };

  const handleEditAddRecommendedSkill = (skill: string) => {
    if (!editSkills.includes(skill)) {
      setEditSkills([...editSkills, skill]);
    }
    setEditShowSkillRecommendations(false);
  };

  const handleEditRemoveSkill = (skillToRemove: string) => {
    setEditSkills(editSkills.filter(skill => skill !== skillToRemove));
  };

  // Edit candidate handlers
  const handleEditCandidate = (candidate: Candidate) => {
    setEditCandidate(candidate);
    setEditName(candidate.name);
    setEditEmail(candidate.email);
    setEditPhone(candidate.phone);
    setEditLocation(candidate.location);
    setEditDepartment(candidate.department || '');
    setEditExperience(candidate.experience || '');
    setEditSkills(candidate.skills || []);
    setEditStatus(candidate.status);
    setEditNewSkill('');
    setEditShowSkillRecommendations(false);
    setEditProfilePhoto(null);
  };

  const handleSaveEdit = async () => {
    if (!editCandidate) return;
    
    // Validation
    if (!editName.trim() || !editEmail.trim() || !editPhone.trim() || !editLocation.trim() || !editDepartment) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    if (!editExperience.trim()) {
      showToast('Please enter experience.', 'error');
      return;
    }
    if (editSkills.length === 0) {
      showToast('Please add at least one skill.', 'error');
      return;
    }
    
    const token = localStorage.getItem('token');
    
    // Handle avatar upload if new photo is selected
    if (editProfilePhoto instanceof File) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        const updateData = {
          name: editName.trim(),
          email: editEmail.trim(),
          phone: editPhone.trim(),
          location: editLocation.trim(),
          department: editDepartment,
          experience: editExperience.trim(),
          skills: editSkills.map(s => s.trim()).filter(Boolean),
          status: editStatus,
          avatar: base64data
        };
        
        try {
          const response = await fetch(`http://localhost:5000/api/candidates/${editCandidate._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify(updateData)
          });
          
          if (response.ok) {
            const updatedCandidate = await response.json();
            setCandidates(prev => prev.map(c => c._id === editCandidate._id ? updatedCandidate : c));
            handleCancelEdit();
            showToast('Candidate updated successfully!', 'success');
          }
        } catch (error) {
          console.error('Error updating candidate:', error);
        }
      };
      reader.readAsDataURL(editProfilePhoto);
    } else {
      // Update without changing avatar
      try {
        const updateData = {
          name: editName.trim(),
          email: editEmail.trim(),
          phone: editPhone.trim(),
          location: editLocation.trim(),
          department: editDepartment,
          experience: editExperience.trim(),
          skills: editSkills.map(s => s.trim()).filter(Boolean),
          status: editStatus
        };
        
        const response = await fetch(`http://localhost:5000/api/candidates/${editCandidate._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify(updateData)
        });
        
        if (response.ok) {
          const updatedCandidate = await response.json();
          setCandidates(prev => prev.map(c => c._id === editCandidate._id ? updatedCandidate : c));
          handleCancelEdit();
          showToast('Candidate updated successfully!', 'success');
        }
      } catch (error) {
        console.error('Error updating candidate:', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditCandidate(null);
    setEditName('');
    setEditEmail('');
    setEditPhone('');
    setEditLocation('');
    setEditDepartment('');
    setEditExperience('');
    setEditSkills([]);
    setEditNewSkill('');
    setEditShowSkillRecommendations(false);
    setEditStatus('pending');
    setEditProfilePhoto(null);
  };

  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditAddSkill();
    }
  };

  // Add a ref to control AddPersonModal from outside Header
  const [addPersonModalOpen, setAddPersonModalOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notes, setNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState("");
  // ...existing code...
  const [helpOpen, setHelpOpen] = useState(false);

  // Helper functions from CandidatesView
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'reviewed':
        return 'bg-blue-100 text-blue-800'
      case 'shortlisted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending'
      case 'reviewed':
        return 'Reviewed'
      case 'shortlisted':
        return 'Shortlisted'
      case 'rejected':
        return 'Rejected'
      default:
        return status
    }
  }

  // State for modals from CandidatesView
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null)
  const [previewCandidate, setPreviewCandidate] = useState<Candidate | null>(null);
  const [commentsCandidate, setCommentsCandidate] = useState<Candidate | null>(null);
  const [commentsMap, setCommentsMap] = useState<{ [id: string]: string[] }>({});
  const [newComment, setNewComment] = useState("");
  const [editCandidate, setEditCandidate] = useState<Candidate | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editDepartment, setEditDepartment] = useState<'Engineering Department' | 'Design Department' | ''>('');
  const [editExperience, setEditExperience] = useState('');
  const [editSkills, setEditSkills] = useState<string[]>([]);
  const [editNewSkill, setEditNewSkill] = useState('');
  const [editShowSkillRecommendations, setEditShowSkillRecommendations] = useState(false);
  const [editStatus, setEditStatus] = useState<'pending' | 'reviewed' | 'shortlisted' | 'rejected'>('pending');
  const [editProfilePhoto, setEditProfilePhoto] = useState<File | null>(null);

  // Filter candidates based on department
  const filteredCandidates = departmentFilter === 'All' 
    ? candidates 
    : candidates.filter(c => c.department === departmentFilter)

  return (
    <div className="w-full h-screen bg-gray-200">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header 
          onMenuClick={handleMenuClick}
          onNotificationClick={handleNotificationClick}
          onAddPerson={handleAddPerson}
          onCreateType={(type) => {
            if (type === 'interview') {
              navigate('/interviews');
            } else if (type === 'candidate') {
              setAddPersonModalOpen(true);
            }
          }}
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
          onAddPerson={() => setAddPersonModalOpen(true)}
          onNotificationClick={handleNotificationClick}
        />
      </div>
      {/* Mobile sidebar overlay (only on small screens) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[9999] flex md:hidden">
          <div className={`relative w-64 h-full z-50 bg-gray-200 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <Sidebar className="rounded-xl h-full bg-gray-200" onClose={() => setIsSidebarOpen(false)} onShowAllCandidates={handleShowAllCandidates} onShowInterviews={handleShowInterviews} onShowDashboard={handleShowDashboard} language={language} setLanguage={setLanguage} onAddPerson={() => setAddPersonModalOpen(true)} onNotificationClick={handleNotificationClick} />
          </div>
          <div className="flex-1 h-full bg-black/30 z-40" onClick={() => setIsSidebarOpen(false)}></div>
        </div>
      )}
      {/* Main Content Area */}
      <div className="md:pl-64 h-screen pt-10">
        <div className="h-full overflow-y-auto p-2 sm:p-3 md:p-4 ipadpro:max-w-[900px] ipadpro:mx-auto">
          <div className="flex flex-1 flex-col min-h-[calc(100vh-64px)]">
            <AnimatePresence mode="wait">
              <motion.div
                key="candidates"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Card className="bg-gray-200 p-2 sm:p-4 md:p-6 rounded-lg min-h-screen flex flex-col border-none shadow-none">
                  <CardContent className="p-0">
                    <Flex direction="col" className="w-full min-w-0 flex-1">
                      <Flex align="center" justify="between" className="w-full gap-2 mb-4">
                        <Flex align="center" gap={2}>
                          <Button variant="ghost" size="icon" className="w-9 h-9 p-0 rounded-full hover:bg-emerald-700" onClick={handleBackToDashboard} aria-label="Back">
                            <ArrowLeft className="w-5 h-5" />
                          </Button>
                          <Typography variant="h1" size="lg" weight="bold" className="text-2xl md:text-3xl">
                            All Candidates
                          </Typography>
                        </Flex>
                      </Flex>
                    </Flex>

                    {/* Stats */}
                    <Grid cols={4} gap={2} className="grid-cols-2 md:grid-cols-4 gap-2 mb-8">
                      <Card className="rounded-lg border-none shadow-none">
                        <CardContent className="p-1.5 flex flex-col justify-center items-center text-center">
                          <Typography variant="h2" size="xl" weight="bold" className="text-xl font-bold text-blue-600">
                            {filteredCandidates.length}
                          </Typography>
                          <Typography variant="p" size="xs" color="muted" className="text-xs text-gray-600">
                            Total Candidates
                          </Typography>
                        </CardContent>
                      </Card>
                      <Card className="rounded-lg border-none shadow-none">
                        <CardContent className="p-1.5 flex flex-col justify-center items-center text-center">
                          <Typography variant="h2" size="xl" weight="bold" className="text-xl font-bold text-yellow-600">
                            {filteredCandidates.filter(c => c.status === 'pending').length}
                          </Typography>
                          <Typography variant="p" size="xs" color="muted" className="text-xs text-gray-600">
                            Pending Review
                          </Typography>
                        </CardContent>
                      </Card>
                      <Card className="rounded-lg border-none shadow-none">
                        <CardContent className="p-1.5 flex flex-col justify-center items-center text-center">
                          <Typography variant="h2" size="xl" weight="bold" className="text-xl font-bold text-emerald-700">
                            {filteredCandidates.filter(c => c.status === 'shortlisted').length}
                          </Typography>
                          <Typography variant="p" size="xs" color="muted" className="text-xs text-gray-600">
                            Shortlisted
                          </Typography>
                        </CardContent>
                      </Card>
                      <Card className="rounded-lg border-none shadow-none">
                        <CardContent className="p-1.5 flex flex-col justify-center items-center text-center">
                          <Typography variant="h2" size="xl" weight="bold" className="text-xl font-bold text-red-600">
                            {filteredCandidates.filter(c => c.status === 'rejected').length}
                          </Typography>
                          <Typography variant="p" size="xs" color="muted" className="text-xs text-gray-600">
                            Rejected
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    {/* Candidates List */}
                    <Card className="shadow-none border-none bg-transparent p-0">
                      <CardContent className="p-0">
                        <div className="flex flex-col gap-4 w-full">
                          {filteredCandidates.map(candidate => (
                            <Card
                              key={candidate._id}
                              className="w-full rounded-xl shadow hover:shadow-md transition-all duration-200 bg-white p-0"
                            >
                              <CardContent className="p-4 w-full">
                                <Flex align="start" justify="between" wrap="wrap">
                                  <Flex align="start" gap={3}>
                                    <Avatar className="w-10 h-10 md:w-12 md:h-12">
                                      <AvatarImage src={candidate.avatar && candidate.avatar !== '' ? candidate.avatar : undefined} />
                                      <AvatarFallback className="text-xs md:text-sm">
                                        {candidate.name.split(' ').map((n: string) => n[0]).join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                    <Stack spacing={1} className="flex-1 space-y-0.5">
                                      <Flex align="center" gap={2}>
                                        <Typography variant="h3" size="lg" weight="semibold" className="text-base md:text-lg font-semibold">
                                          {candidate.name}
                                        </Typography>
                                        <Badge className={`text-xs px-2 py-1 rounded-full ${getStatusColor(candidate.status)}`}>
                                          {getStatusText(candidate.status)}
                                        </Badge>
                                      </Flex>
                                      <Flex align="center" gap={4} wrap="wrap">
                                        <Flex align="center" gap={1}>
                                          <Mail className="w-3 h-3 text-gray-400" />
                                          <Typography variant="span" size="xs" color="muted" className="text-xs text-gray-600">{candidate.email}</Typography>
                                        </Flex>
                                        <Flex align="center" gap={1}>
                                          <Phone className="w-3 h-3 text-gray-400" />
                                          <Typography variant="span" size="xs" color="muted" className="text-xs text-gray-600">{candidate.phone}</Typography>
                                        </Flex>
                                        <Flex align="center" gap={1}>
                                          <MapPin className="w-3 h-3 text-gray-400" />
                                          <Typography variant="span" size="xs" color="muted" className="text-xs text-gray-600">{candidate.location}</Typography>
                                        </Flex>
                                      </Flex>
                                      <Flex align="center" gap={2}>
                                        <Star className="w-3 h-3 text-yellow-500" />
                                        <Typography variant="span" size="xs" className="text-xs font-medium">{candidate.rating}</Typography>
                                        <Typography variant="span" size="xs" color="muted" className="text-xs text-gray-500">•</Typography>
                                        <Typography variant="span" size="xs" color="muted" className="text-xs text-gray-500">{candidate.experience}</Typography>
                                      </Flex>
                                    </Stack>
                                  </Flex>
                                  <Flex gap={1}>
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      className="text-xs p-1 hover:bg-emerald-700" 
                                      onClick={() => setPreviewCandidate(candidate)}
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      className="text-xs p-1 hover:bg-emerald-700" 
                                      onClick={() => setCommentsCandidate(candidate)}
                                    >
                                      <MessageSquare className="w-4 h-4" />
                                    </Button>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button size="sm" variant="ghost" className="text-xs p-1 hover:bg-emerald-700">
                                          <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => setPreviewCandidate(candidate)}>
                                          <Eye className="w-4 h-4 mr-2" />
                                          <Typography variant="span" size="sm">View Details</Typography>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setCommentsCandidate(candidate)}>
                                          <MessageSquare className="w-4 h-4 mr-2" />
                                          <Typography variant="span" size="sm">Add Comments</Typography>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleEditCandidate(candidate)}>
                                          <Edit className="w-4 h-4 mr-2" />
                                          <Typography variant="span" size="sm">Edit</Typography>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setDeleteDialogOpen(candidate._id)}>
                                          <Typography variant="span" size="sm" className="text-red-600">Delete</Typography>
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </Flex>
                                </Flex>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      {/* Notification Panel - slides in from right on mobile, dropdown/modal on desktop */}
      {/* Mobile Notification Panel */}
      <div className={
        `md:hidden fixed inset-y-0 right-0 z-[9999] transform transition-transform duration-300 ease-in-out
        ${isNotificationOpen ? 'translate-x-0' : 'translate-x-full'}`
      }>
        <div className="w-80 h-full bg-white shadow-lg flex flex-col">
          {/* Notification Panel Header */}
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsNotificationOpen(false)
                setShowAllNotifications(false)
              }}
              className="p-2 hover:bg-emerald-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          {/* Notification Content */}
          <div className={`flex-1 p-4 ${showAllNotifications ? 'overflow-y-auto' : 'overflow-hidden'}`}>
            <div className="space-y-4">
              {/* Always show the first notification */}
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-emerald-700">
                <div className="w-4 h-4 text-black mt-0.5">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">PRO mode activated</p>
                  <p className="text-xs text-gray-600">All premium features are now available for your account</p>
                </div>
              </div>
              {showAllNotifications && (
                <>
                  <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-emerald-700 cursor-pointer" onClick={() => setAddPersonModalOpen(true)}>
                    <div className="w-4 h-4 text-green-600 mt-0.5">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New candidate added</p>
                      <p className="text-xs text-gray-600">Alex Johnson has entered the Technical Review phase</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-emerald-700">
                    <div className="w-4 h-4 text-orange-600 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Phase deadline soon</p>
                      <p className="text-xs text-gray-600">Initial Review Phase 3 ends in 2 days</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          {/* Notification Panel Footer */}
          <div className="p-4">
            <div className="flex space-x-2">
              <Button 
                onClick={handleSeeAllNotifications}
                className="flex-1 bg-black text-white hover:bg-emerald-700 text-xs py-2 px-3"
              >
                {showAllNotifications ? 'Show less' : 'See all notifications'}
              </Button>
              <Button 
                variant="outline"
                size="sm"
                className="text-xs py-2 px-3 hover:bg-emerald-700"
                onClick={() => setNotesOpen(true)}
              >
                Notes
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Desktop Notification Dropdown/Modal */}
      {isNotificationOpen && (
        <div className="hidden md:block fixed top-20 right-8 z-[9999] w-96 bg-white shadow-xl rounded-xl animate-fade-in">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsNotificationOpen(false)
                setShowAllNotifications(false)
              }}
              className="p-2 hover:bg-emerald-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className={`flex-1 p-4 ${showAllNotifications ? 'overflow-y-auto' : 'overflow-hidden'}`}>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-emerald-700">
                <div className="w-4 h-4 text-black mt-0.5">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">PRO mode activated</p>
                  <p className="text-xs text-gray-600">All premium features are now available for your account</p>
                </div>
              </div>
              {showAllNotifications && (
                <>
                  <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-emerald-700">
                    <div className="w-4 h-4 text-green-600 mt-0.5">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New candidate added</p>
                      <p className="text-xs text-gray-600">Alex Johnson has entered the Technical Review phase</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-emerald-700">
                    <div className="w-4 h-4 text-orange-600 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Phase deadline soon</p>
                      <p className="text-xs text-gray-600">Initial Review Phase 3 ends in 2 days</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="p-4">
            <div className="flex space-x-2">
              <Button 
                onClick={handleSeeAllNotifications}
                className="flex-1 bg-black text-white hover:bg-emerald-700 text-xs py-2 px-3"
              >
                {showAllNotifications ? 'Show less' : 'See all notifications'}
              </Button>
              <Button 
                variant="outline"
                size="sm"
                className="text-xs py-2 px-3 hover:bg-emerald-700"
                onClick={() => setNotesOpen(true)}
              >
                Notes
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* AddPersonModal for notification redirect */}
      <AddPersonModal 
        open={addPersonModalOpen}
        onOpenChange={setAddPersonModalOpen}
        onAddPerson={handleAddPerson}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen !== null} onOpenChange={() => setDeleteDialogOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Candidate</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this candidate? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(null)}>
              <Typography variant="span" size="sm">Cancel</Typography>
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (deleteDialogOpen !== null) {
                  handleDeleteCandidate(deleteDialogOpen);
                  setDeleteDialogOpen(null);
                }
              }}
            >
              <Typography variant="span" size="sm">Delete</Typography>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={previewCandidate !== null} onOpenChange={() => setPreviewCandidate(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Candidate Details</DialogTitle>
          </DialogHeader>
          {previewCandidate && (
            <Stack spacing={4}>
              <Flex align="start" gap={4}>
                <Avatar className="w-16 h-16">
                  <AvatarImage src={previewCandidate.avatar && previewCandidate.avatar !== '' ? previewCandidate.avatar : undefined} />
                  <AvatarFallback className="text-lg">
                    {previewCandidate.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Stack spacing={2} className="flex-1">
                  <Typography variant="h3" size="lg" weight="bold">{previewCandidate.name}</Typography>
                  <Badge className={`text-sm px-3 py-1 rounded-full ${getStatusColor(previewCandidate.status)}`}>
                    {getStatusText(previewCandidate.status)}
                  </Badge>
                  <Typography variant="p" size="sm" color="muted">{previewCandidate.email}</Typography>
                  <Typography variant="p" size="sm" color="muted">{previewCandidate.phone}</Typography>
                  <Typography variant="p" size="sm" color="muted">{previewCandidate.location}</Typography>
                </Stack>
              </Flex>
              
              <Grid cols={2} gap={4}>
                <Stack spacing={2}>
                  <Typography variant="h4" size="sm" weight="semibold" className="font-semibold mb-2">
                    Application Details
                  </Typography>
                  <Stack spacing={2}>
                    <Flex align="center" gap={2}>
                      <Calendar className="w-4 h-4" />
                      <Typography variant="span" size="sm">Applied: {previewCandidate.appliedDate}</Typography>
                    </Flex>
                    <Flex align="center" gap={2}>
                      <Star className="w-4 h-4 text-yellow-500" />
                      <Typography variant="span" size="sm">Rating: {previewCandidate.rating}</Typography>
                    </Flex>
                    <Typography variant="span" size="sm">
                      Experience: {previewCandidate.experience}
                    </Typography>
                  </Stack>
                </Stack>
                
                <Stack spacing={2}>
                  <Typography variant="h4" size="sm" weight="semibold" className="font-semibold mb-2">
                    Skills
                  </Typography>
                  <Flex align="center" gap={1} wrap="wrap">
                    {(previewCandidate.skills || []).map((skill: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Typography variant="span" size="xs">{skill}</Typography>
                      </Badge>
                    ))}
                  </Flex>
                </Stack>
              </Grid>
            </Stack>
          )}
          <DialogFooter>
            <Button onClick={() => setPreviewCandidate(null)}>
              <Typography variant="span" size="sm">Close</Typography>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Comments Modal */}
      <Dialog open={commentsCandidate !== null} onOpenChange={() => setCommentsCandidate(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
            <DialogDescription>Add notes about this candidate.</DialogDescription>
          </DialogHeader>
          {commentsCandidate && (
            <Stack spacing={4}>
              <Stack spacing={1}>
                <Label htmlFor="new-comment">Add Comment</Label>
                <Input
                  id="new-comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Enter your comment..."
                />
              </Stack>
              
              <Button 
                onClick={() => {
                  if (newComment.trim() && commentsCandidate) {
                    const candidateId = commentsCandidate._id;
                    setCommentsMap(prev => ({
                      ...prev,
                      [candidateId]: [...(prev[candidateId] || []), newComment]
                    }));
                    setNewComment("");
                  }
                }}
                disabled={!newComment.trim()}
                className="w-full"
              >
                <Typography variant="span" size="sm">Add Comment</Typography>
              </Button>
              
              <ScrollArea className="max-h-40">
                <Stack spacing={2}>
                  {(commentsMap[commentsCandidate._id] || []).map((comment, index) => (
                    <Card key={index} className="p-2">
                      <Typography variant="p" size="sm">{comment}</Typography>
                    </Card>
                  ))}
                </Stack>
              </ScrollArea>
            </Stack>
          )}
          <DialogFooter>
            <Button onClick={() => setCommentsCandidate(null)}>
              <Typography variant="span" size="sm">Close</Typography>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Candidate Dialog - AddPersonModal Style */}
      <Dialog open={!!editCandidate} onOpenChange={() => handleCancelEdit()}>
        <DialogContent
          className="sm:max-w-[400px] p-3"
          style={{ minHeight: 'auto', maxHeight: '80vh', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          aria-describedby="edit-candidate-modal-desc"
        >
          <DialogDescription id="edit-candidate-modal-desc" className="text-xs text-gray-500 mb-2">
            Edit candidate details.
          </DialogDescription>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold mb-1">Edit Candidate</DialogTitle>
          </DialogHeader>
          <Stack spacing={1}>
            <Grid cols={2} gap={1} className="w-full items-center">
              <Stack spacing={1}>
                <Label htmlFor="editProfilePhoto" className="text-xs">Photo</Label>
                <Input
                  id="editProfilePhoto"
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setEditProfilePhoto(e.target.files[0]);
                    } else {
                      setEditProfilePhoto(null);
                    }
                  }}
                  className="bg-white border border-gray-300 shadow-sm text-xs"
                />
                {editProfilePhoto instanceof File && (
                  <img src={URL.createObjectURL(editProfilePhoto)} alt="Profile Preview" className="mt-1 w-12 h-12 rounded-full object-cover border" />
                )}
                {!editProfilePhoto && editCandidate?.avatar && (
                  <img src={editCandidate.avatar} alt="Current Avatar" className="mt-1 w-12 h-12 rounded-full object-cover border" />
                )}
              </Stack>
              <Stack spacing={1}>
                <Label htmlFor="editStatus" className="text-xs">Status</Label>
                <Select value={editStatus} onValueChange={value => setEditStatus(value as 'pending' | 'reviewed' | 'shortlisted' | 'rejected')}>
                  <SelectTrigger className="bg-white border border-gray-300 shadow-sm text-xs">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="shortlisted">Shortlisted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </Stack>
            </Grid>
            <Grid cols={2} gap={1} className="w-full items-center">
              <Input 
                id="editName" 
                value={editName} 
                onChange={e => setEditName(e.target.value)} 
                placeholder="Full Name *" 
                className="bg-white border border-gray-300 shadow-sm text-xs" 
              />
              <Input 
                id="editEmail" 
                type="email" 
                value={editEmail} 
                onChange={e => setEditEmail(e.target.value)} 
                placeholder="Email *" 
                className="bg-white border border-gray-300 shadow-sm text-xs" 
              />
            </Grid>
            <Grid cols={2} gap={1} className="w-full items-center">
              <Input 
                id="editPhone" 
                value={editPhone} 
                onChange={e => setEditPhone(e.target.value)} 
                placeholder="Phone *" 
                className="bg-white border border-gray-300 shadow-sm text-xs" 
              />
              <Input 
                id="editLocation" 
                value={editLocation} 
                onChange={e => setEditLocation(e.target.value)} 
                placeholder="Location *" 
                className="bg-white border border-gray-300 shadow-sm text-xs" 
              />
            </Grid>
            <Grid cols={2} gap={1} className="w-full items-center">
              <Select value={editDepartment} onValueChange={value => setEditDepartment(value as 'Engineering Department' | 'Design Department' | '')}>
                <SelectTrigger className="bg-white border border-gray-300 shadow-sm text-xs">
                  <SelectValue placeholder="Department *" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Engineering Department">Engineering</SelectItem>
                  <SelectItem value="Design Department">Design</SelectItem>
                </SelectContent>
              </Select>
              <Input 
                id="editExperience" 
                value={editExperience} 
                onChange={e => setEditExperience(e.target.value)} 
                placeholder="Experience *" 
                className="bg-white border border-gray-300 shadow-sm text-xs" 
              />
            </Grid>
            <Stack spacing={0}>
              <Label className="text-xs">Skills</Label>
              <Flex gap={1} className="w-full">
                <Input 
                  value={editNewSkill} 
                  onChange={e => setEditNewSkill(e.target.value)} 
                  onKeyPress={handleEditKeyPress} 
                  placeholder="Add skill" 
                  className="bg-white border border-gray-300 shadow-sm text-xs w-[120px] min-w-0" 
                  style={{ flex: 'none' }} 
                />
                <DropdownMenu open={editShowSkillRecommendations} onOpenChange={setEditShowSkillRecommendations}>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      type="button" 
                      size="sm" 
                      className="bg-white text-black border border-gray-300 shadow-sm hover:bg-emerald-700 hover:text-white p-1" 
                      onClick={() => setEditShowSkillRecommendations(true)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <ScrollArea className="max-h-40">
                      <Stack spacing={1} className="p-1">
                        <Typography variant="p" size="xs" color="muted" className="text-xs font-medium text-gray-500 mb-1">Recommended</Typography>
                        <Grid cols={1} gap={1}>
                          {[...new Set(getRecommendedSkills().filter(skill => !editSkills.includes(skill)))]
                            .slice(0, 10)
                            .map((skill) => (
                              <DropdownMenuItem
                                key={skill}
                                onClick={() => handleEditAddRecommendedSkill(skill)}
                                className="text-xs cursor-pointer hover:bg-emerald-700"
                              >
                                <Typography variant="span" size="xs">{skill}</Typography>
                              </DropdownMenuItem>
                            ))}
                        </Grid>
                        {getRecommendedSkills().filter(skill => !editSkills.includes(skill)).length === 0 && (
                          <Typography variant="p" size="xs" color="muted" className="text-xs text-gray-400 p-1">All added</Typography>
                        )}
                      </Stack>
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Flex>
              {editSkills.length > 0 && (
                <div style={{ maxHeight: '40px', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }} className="flex flex-wrap gap-1 mt-1 hide-scrollbar">
                  {editSkills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1 text-xs px-2 py-1">
                      <Typography variant="span" size="xs">{skill}</Typography>
                      <X className="w-3 h-3 cursor-pointer hover:text-red-500 transition-colors" onClick={e => { e.stopPropagation(); handleEditRemoveSkill(skill); }} />
                    </Badge>
                  ))}
                </div>
              )}
            </Stack>
          </Stack>
          <DialogFooter className="flex gap-2 justify-end mt-2">
            <Button variant="outline" className="hover:bg-emerald-700 px-4 py-1 text-xs" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button 
              className="bg-white text-black hover:bg-emerald-700 hover:text-white px-4 py-1 text-xs" 
              onClick={handleSaveEdit} 
              disabled={!editName || !editEmail || !editPhone || !editLocation || !editDepartment || !editExperience || editSkills.length === 0}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notes Modal */}
      <Dialog open={notesOpen} onOpenChange={setNotesOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Notes</DialogTitle>
          </DialogHeader>
          <div className="mb-2 text-sm text-gray-600">
            Add, view, or edit private notes related to candidates, interview rounds, questions, sections, or interviewers.
          </div>
          <div className="space-y-2 mb-2">
            <Textarea
              className="w-full"
              rows={3}
              placeholder="Add a new note..."
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
            />
            <Button
              className="bg-black text-white px-3 py-1 hover:bg-emerald-700 text-xs"
              onClick={() => {
                if (newNote.trim()) {
                  setNotes([newNote, ...notes]);
                  setNewNote("");
                }
              }}
            >
              Add Note
            </Button>
          </div>
          <div className="max-h-40 overflow-y-auto space-y-2">
            {notes.length === 0 ? (
              <div className="text-gray-400 text-xs text-center">No notes yet.</div>
            ) : (
              notes.map((note, idx) => (
                <div key={idx} className="bg-gray-100 rounded p-2 text-xs flex justify-between items-center">
                  <span>{note}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 ml-2 text-xs p-0 h-auto" 
                    onClick={() => setNotes(notes.filter((_, i) => i !== idx))}
                  >
                    Delete
                  </Button>
                </div>
              ))
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="text-xs px-3 py-1 rounded hover:bg-emerald-700">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Help & Support Modal */}
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Help & Support</DialogTitle>
          </DialogHeader>
          <div className="mb-2 text-sm text-gray-600 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-500" />
            Welcome to the Help Center! How can we assist you?
          </div>
          <div className="mb-2 text-xs text-gray-500">This is a placeholder for chat support or help articles. You can integrate a real chat widget or FAQ here.</div>
          <div className="bg-gray-100 rounded p-3 text-xs text-gray-700 mb-2">
            <strong>Common Topics:</strong>
            <ul className="list-disc pl-5 mt-1">
              <li>How to add a candidate</li>
              <li>How to schedule an interview</li>
              <li>How to use the dashboard</li>
              <li>Contact support</li>
            </ul>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="text-xs px-3 py-1 rounded hover:bg-emerald-700">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ...existing code...
