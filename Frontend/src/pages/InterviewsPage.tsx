import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid } from "@/components/ui/grid";
import { Stack } from "@/components/ui/stack";
import { Input } from "@/components/ui/input";
import { HelpCircle, X, UserPlus, Clock, Calendar, Users, Plus, Edit, Eye, CheckCircle, AlertCircle, Star, ArrowLeft } from "lucide-react";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/toast";
// Candidate type definition (keep in sync with CandidatesPage)
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


import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

export default function InterviewsPage() {
  const { showToast } = useToast();

  // Delete interview handler
  const handleDeleteInterview = async (interviewId: string) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:5000/api/interviews/${interviewId}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      setInterviews(prev => prev.filter(interview => (interview._id || interview.id) !== interviewId));
      showToast('Interview schedule deleted successfully!', 'error');
    } catch (err) {
      showToast('Failed to delete interview schedule. Please try again.', 'error');
    }
  };
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [showAllNotifications, setShowAllNotifications] = useState(false)


  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [interviewers, setInterviewers] = useState<any[]>([]);
  const [language, setLanguage] = useState<'en' | 'es' | 'fr'>('en');
    // Assigned Interviewer form state
    const [newInterviewerName, setNewInterviewerName] = useState("");
    const [newInterviewerAvatar, setNewInterviewerAvatar] = useState("");

  // Backend fetches removed. You can manually set candidates, interviews, and interviewers here if needed.

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
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  }



  // Add person handler


  // Delete candidate handler (not used, but fixed for type)
  // const handleDeleteCandidate = (id: string) => {
  //   setCandidates(candidates.filter(candidate => candidate._id !== id));
  // }

  const [notesOpen, setNotesOpen] = useState(false);
  const [notes, setNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);


  // Enhanced data structures
  // Removed unused Interviewer type

  type Interview = {
  id: number;
  candidateId: string;
  interviewer: string;
  position: string;
  department: string;
  date: string;
  time: string;
  duration: string;
  stage: string;
  };

  // Interviewers are now fetched from backend and stored in state


  // ...existing code...

  // Simple interview creation state (from InterviewsView)
  const [createOpen, setCreateOpen] = useState(false);
  const [interviewTitle, setInterviewTitle] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [selectedInterviewer, setSelectedInterviewer] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [roundType, setRoundType] = useState("");
  const [duration, setDuration] = useState("");
  const [instructions, setInstructions] = useState("");




  // Default simple interviews (from InterviewsView)


  // Initialize simple interviews
  useEffect(() => {

  }, []);


  // State for modals and UI
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [interviewDetailsModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [assignInterviewerModalOpen, setAssignInterviewerModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(0);
  
  // Form data for interview creation/editing
  const [interviewFormData, setInterviewFormData] = useState({
  candidateId: '',
  interviewer: '',
  position: '',
  department: '',
  date: '',
  time: '',
  duration: '',
  stage: ''
  });

  // Helper functions

  // Helper function to get candidate data

  // Helper function to get interviewer data

  // Interview management functions
  const handleScheduleInterview = () => {
    setScheduleModalOpen(true);
  };

  // Create or update interview and sync with backend
  const handleSaveInterview = async () => {
    const token = localStorage.getItem('token');
    
    // Default values when user doesn't provide data
    const defaultCandidate = candidates.length > 0 ? candidates[0] : null;
    const defaultInterviewer = interviewers.length > 0 ? interviewers[0] : null;
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Use provided data or fallback to defaults
    const candidateId = interviewFormData.candidateId || (defaultCandidate?._id || '');
    const candidateObj = candidates.find(c => c._id === candidateId) || defaultCandidate;
    const candidateName = candidateObj?.name || 'Default Candidate';
    const interviewerName = interviewFormData.interviewer || (defaultInterviewer?.name || 'Default Interviewer');
    const position = interviewFormData.position || 'Software Developer';
    const department = interviewFormData.department || 'Engineering';
    const date = interviewFormData.date || currentDate;
    const time = interviewFormData.time || '10:00';
    const duration = interviewFormData.duration || '60';
    const stage = interviewFormData.stage || 'Round 1';
    
    try {
      if (selectedInterview) {
        const res = await fetch(`http://localhost:5000/api/interviews/${selectedInterview.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            candidate: candidateName,
            interviewer: interviewerName,
            position: position,
            department: department,
            date: date,
            time: time,
            duration: duration,
            stage: stage,
          })
        });
        if (res.ok) {
          showToast('Interview schedule updated successfully!', 'success');
        }
      } else {
        const res = await fetch('http://localhost:5000/api/interviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            candidateId: candidateId,
            interviewer: interviewerName,
            position: position,
            department: department,
            date: date,
            time: time,
            duration: duration,
            stage: stage
          })
        });
        if (res.ok) {
          showToast('Interview scheduled successfully!', 'success');
        }
      }
      // Refresh interviews from backend
      const refreshRes = await fetch('http://localhost:5000/api/interviews', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const data = await refreshRes.json();
      setInterviews(Array.isArray(data) ? data : []);
      setScheduleModalOpen(false);
      setSelectedInterview(null);
      setInterviewFormData({
    candidateId: '',
    interviewer: '',
    position: '',
    department: '',
    date: '',
    time: '',
    duration: '',
    stage: ''
      });
    } catch (error) {
      showToast('Failed to save interview schedule. Please try again.', 'error');
    }
  };






  const handleAddFeedback = (interviewId: number, feedback: string, rating: number) => {
    setInterviews(interviews.map(interview => 
      interview.id === interviewId 
        ? { ...interview, feedback, rating, status: 'completed' as const, progress: 100 }
        : interview
    ));
  };

  // Remove unused handleShowDashboard function

  // Always fetch candidates and interviewers on mount and after interview creation
  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchCandidates = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/candidates', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        const data = res.ok ? await res.json() : [];
        setCandidates(Array.isArray(data) ? data : []);
      } catch (err) {
        setCandidates([]);
      }
    };
    const fetchInterviewers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/assigned-interviewers', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        const data = res.ok ? await res.json() : [];
        setInterviewers(Array.isArray(data) ? data : []);
      } catch (err) {
        setInterviewers([]);
      }
    };
    const fetchInterviews = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/interviews', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        const data = res.ok ? await res.json() : [];
        setInterviews(Array.isArray(data) ? data : []);
      } catch (err) {
        setInterviews([]);
      }
    };
    fetchCandidates();
    fetchInterviewers();
    fetchInterviews();
  }, []);


  function refreshCandidates(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    // Re-fetch candidates from backend
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/candidates', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setCandidates(Array.isArray(data) ? data : []))
      .catch(() => setCandidates([]));
  }

  function refreshInterviewers(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    // Re-fetch interviewers from backend
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/assigned-interviewers', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setInterviewers(Array.isArray(data) ? data : []))
      .catch(() => setInterviewers([]));
  }

  function handleShowDashboard(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="w-full h-screen bg-gray-200">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header 
          onMenuClick={handleMenuClick}
          onNotificationClick={handleNotificationClick}
          onCreateType={(type) => {
            if (type === 'interview') {
              navigate('/interviews');
            } else if (type === 'candidate') {
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
          onNotificationClick={handleNotificationClick}
        />
      </div>
      
      {/* Mobile sidebar overlay (only on small screens) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[9999] flex md:hidden">
          <div className={`relative w-48 h-full z-50 bg-gray-200 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          </div>
          <div className="flex-1 h-full bg-black/30 z-40" onClick={() => setIsSidebarOpen(false)}></div>
        </div>
      )}
      
      {/* Main Content Area */}
      <div className="md:pl-60 h-screen pt-10">
        <div className="h-full overflow-y-auto p-2 sm:p-3 md:p-4 ipadpro:max-w-[900px] ipadpro:mx-auto">
          <div className="flex flex-1 flex-col min-h-[calc(100vh-64px)]">
            {/* Enhanced Header Section - moved to top */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Button 
                    onClick={handleBackToDashboard} 
                    variant="ghost" 
                    className="p-2 hover:bg-emerald-700 rounded-full transition-colors w-9 h-9 flex items-center justify-center"
                    aria-label="Back to Dashboard"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                  </Button>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Interviews</h1>
                    <p className="text-gray-600">Manage and track interview schedules</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleScheduleInterview} 
                    className="bg-black text-white hover:bg-emerald-700 hover:text-white"
                  >
                    <Plus className="w-4 h-4 lg:mr-2" />
                    <span className="hidden lg:inline">Schedule Interview</span>
                  </Button>
                </div>
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key="interviews"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Recent Interviews Card - Responsive, ShadCN only, matches form fields */}
                <Card className="mt-2 mb-8 shadow-md rounded-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-emerald-700" />
                      Recent Interviews
                    </CardTitle>
                    <CardDescription>
                      Track interview details as per the form
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Desktop Table */}
                    <div className="hidden md:block">
                      <table className="w-full text-xs md:text-sm">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left">Candidate</th>
                            <th className="px-4 py-2 text-left">Interviewer</th>
                            <th className="px-4 py-2 text-left">Position</th>
                            <th className="px-4 py-2 text-left">Department</th>
                            <th className="px-4 py-2 text-left">Date</th>
                            <th className="px-4 py-2 text-left">Time</th>
                            <th className="px-4 py-2 text-left">Duration</th>
                            <th className="px-4 py-2 text-left">Stage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {interviews.length === 0 ? (
                            <tr><td colSpan={8} className="text-center py-4 text-muted-foreground">No interviews scheduled</td></tr>
                          ) : interviews.map((interview, _idx) => {
                            const candidate = candidates.find(c => c._id === interview.candidateId);
                            const interviewer = interviewers.find(i => i.name === interview.interviewer);
                            const key = interview._id || interview.id || _idx;
                            return (
                              <tr key={key} className="border-b">
                                <td className="px-4 py-2">
                                  <div className="flex items-center gap-2">
                                    <Avatar className="w-6 h-6"><AvatarImage src={candidate?.avatar} /><AvatarFallback>{candidate?.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                                    <span>{candidate?.name}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-2">
                                  <div className="flex items-center gap-2">
                                    <Avatar className="w-6 h-6"><AvatarImage src={interviewer?.avatar} /><AvatarFallback>{interviewer?.name?.split(' ').map((n: any[]) => n[0]).join('')}</AvatarFallback></Avatar>
                                    <span>{interviewer?.name}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-2">{interview.position}</td>
                                <td className="px-4 py-2">{interview.department}</td>
                                <td className="px-4 py-2">{interview.date}</td>
                                <td className="px-4 py-2">{interview.time}</td>
                                <td className="px-4 py-2">{interview.duration}</td>
                                <td className="px-4 py-2">{interview.stage}</td>
                                <td className="px-4 py-2 text-right">
                                  <Button variant="ghost" size="icon" aria-label="Delete Interview" onClick={() => handleDeleteInterview(interview._id || interview.id)}>
                                    <Trash2 className="w-5 h-5 text-red-600" />
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-4">
                      {interviews.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground">No interviews scheduled</div>
                      ) : interviews.map((interview, _idx) => {
                        const candidate = candidates.find(c => c._id === interview.candidateId);
                        const interviewer = interviewers.find(i => i.name === interview.interviewer);
                        const key = interview._id || interview.id || _idx;
                        return (
                          <Card key={key} className="p-3 rounded-lg border">
                            <CardContent className="p-0">
                              <div className="flex items-center gap-3 mb-2">
                                <Avatar className="w-8 h-8"><AvatarImage src={candidate?.avatar} /><AvatarFallback>{candidate?.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{candidate?.name}</div>
                                  <div className="text-xs text-gray-500">{interview.position} • {interview.department}</div>
                                </div>
                                <Button variant="ghost" size="icon" aria-label="Delete Interview" onClick={() => handleDeleteInterview(interview._id || interview.id)}>
                                  <Trash2 className="w-5 h-5 text-red-600" />
                                </Button>
                              </div>
                              <div className="flex items-center gap-2 text-xs mb-1">
                                <Users className="w-4 h-4 text-gray-400" />
                                <span>{interviewer?.name}</span>
                              </div>
                              <div className="flex gap-2 text-xs mb-1">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span>{interview.date}</span>
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span>{interview.time}</span>
                              </div>
                              <div className="flex gap-2 text-xs mb-1">
                                <span className="font-semibold">Duration:</span>
                                <span>{interview.duration} min</span>
                                <span className="font-semibold">Stage:</span>
                                <span>{interview.stage}</span>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      
               
      
      {/* Desktop Notification Dropdown/Modal */}
      {isNotificationOpen && (
        <div className="hidden md:block fixed top-20 right-8 z-[9999] w-96 bg-white shadow-xl rounded-xl">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <div>
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsNotificationOpen(false)
                  setShowAllNotifications(false)
                }}
                className="p-2 bg-black text-white hover:bg-emerald-700 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
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
                  <p className="text-sm font-medium">Interview scheduled</p>
                  <p className="text-xs text-gray-600">Alex Johnson's interview is scheduled for tomorrow at 10:00 AM</p>
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
                      <p className="text-xs text-gray-600">Michael Chen has been added to the interview pipeline</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-emerald-700">
                    <div className="w-4 h-4 text-orange-600 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Interview reminder</p>
                      <p className="text-xs text-gray-600">Emily Davis's interview starts in 30 minutes</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="p-4">
            <div className="flex space-x-2">
              <div>
                <Button 
                  onClick={handleSeeAllNotifications}
                  className="flex-1 bg-black text-white hover:bg-emerald-700 hover:text-white text-xs py-2 px-3"
                >
                  {showAllNotifications ? 'Show less' : 'See all notifications'}
                </Button>
              </div>
              <div>
                <Button 
                  variant="outline"
                  size="sm"
                  className="text-xs py-2 px-3 bg-black text-white hover:bg-emerald-700 hover:text-white"
                  onClick={() => setNotesOpen(true)}
                >
                  Notes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      

      {/* Schedule Interview Modal - Refactored for Candidates Form Style */}
      <Dialog open={scheduleModalOpen} onOpenChange={setScheduleModalOpen}>
        <DialogContent className="max-w-2xl w-full bg-gray-200 p-0 rounded-xl border-none shadow-none">
          <div className="p-0">
            <Card className="bg-gray p-6 rounded-xl border-none shadow-none">
              <CardContent className="p-0">
                <DialogHeader className="pb-4">
                  <DialogTitle className="text-xl md:text-2xl font-semibold">
                    {selectedInterview ? 'Edit Interview' : 'Schedule New Interview'}
                  </DialogTitle>
                  <DialogDescription className="text-sm md:text-base">
                    {selectedInterview ? 'Update interview details' : 'Schedule a new interview with candidate and interviewer'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                  {/* Candidate and Interviewer Selection */}
                  <Grid cols={2} gap={2} className="grid-cols-1 md:grid-cols-2 gap-1 md:gap-2">
                    <Stack spacing={1} className="min-w-0">
                      <Label htmlFor="candidate" className="text-sm font-medium">Candidate</Label>
                      <Select
                        value={interviewFormData.candidateId || ""}
                        onValueChange={value => setInterviewFormData({...interviewFormData, candidateId: value})}
                      >
                        <SelectTrigger 
                          className="h-10 md:h-11 w-full bg-white border border-gray-300 shadow-sm text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          style={{ 
                            color: interviewFormData.candidateId ? '#111827' : '#6b7280',
                            '--placeholder-color': '#6b7280'
                          } as React.CSSProperties}
                        >
                          <SelectValue placeholder="Select Candidate" />
                        </SelectTrigger>
                        <SelectContent className="w-full min-w-[200px] bg-white">
                          {candidates.length === 0 ? (
                            <div className="px-4 py-2 text-foreground flex flex-col items-center">
                              No candidates found
                              <Button size="sm" variant="outline" className="mt-2" onClick={refreshCandidates}>Refresh</Button>
                            </div>
                          ) : candidates.map(candidate => (
                            <SelectItem key={candidate._id} value={candidate._id}>
                              <div className="flex items-center gap-2 w-full">
                                <Avatar className="w-6 h-6 flex-shrink-0">
                                  <AvatarImage src={candidate.avatar} />
                                  <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <span className="truncate">{candidate.name} - {candidate.department}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Stack>
                    <Stack spacing={1} className="min-w-0">
                      <Label htmlFor="interviewer" className="text-sm font-medium">Interviewer</Label>
                      <Select
                        value={interviewFormData.interviewer || ""}
                        onValueChange={value => setInterviewFormData({...interviewFormData, interviewer: value})}
                      >
                        <SelectTrigger 
                          className="h-10 md:h-11 w-full bg-white border border-gray-300 shadow-sm text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          style={{ 
                            color: interviewFormData.interviewer ? '#111827' : '#6b7280',
                            '--placeholder-color': '#6b7280'
                          } as React.CSSProperties}
                        >
                          <SelectValue placeholder="Select Interviewer" />
                        </SelectTrigger>
                        <SelectContent className="w-full min-w-[200px] bg-white">
                          {interviewers.length === 0 ? (
                            <div className="px-4 py-2 text-muted-foreground flex flex-col items-center">
                              No interviewers found
                              <Button size="sm" variant="outline" className="mt-2" onClick={refreshInterviewers}>Refresh</Button>
                            </div>
                          ) : interviewers.map(interviewer => (
                            <SelectItem key={interviewer._id || interviewer.id} value={interviewer.name}>
                              <div className="flex items-center gap-2 w-full">
                                <Avatar className="w-6 h-6 flex-shrink-0">
                                  <AvatarImage src={interviewer.avatar} />
                                  <AvatarFallback>{interviewer.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <span className="truncate">{interviewer.name} - {interviewer.department}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Stack>
                  </Grid>

                  {/* Position and Department */}
                  <Grid cols={2} gap={2} className="grid-cols-1 md:grid-cols-2 gap-1 md:gap-2">
                    <Stack spacing={1} className="min-w-0">
                      <Label htmlFor="position" className="text-sm font-medium">Position</Label>
                        <Input
                          id="position"
                          value={interviewFormData.position}
                          onChange={e => setInterviewFormData({...interviewFormData, position: e.target.value})}
                          className="h-9 md:h-10 w-full bg-white border border-gray-300 shadow-sm text-xs md:text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder:text-gray-500"
                          placeholder="Software Developer (default)"
                        />
                    </Stack>
                    <Stack spacing={1} className="min-w-0">
                      <Label htmlFor="department" className="text-sm font-medium">Department</Label>
                      <Select value={interviewFormData.department || ""} onValueChange={(value) => setInterviewFormData({...interviewFormData, department: value})}>
                        <SelectTrigger 
                          className="h-10 md:h-11 w-full bg-white border border-gray-300 shadow-sm text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          style={{ 
                            color: interviewFormData.department ? '#111827' : '#6b7280',
                            '--placeholder-color': '#6b7280'
                          } as React.CSSProperties}
                        >
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent className="w-full min-w-[200px] bg-white">
                          <SelectItem value="Engineering">Engineering</SelectItem>
                          <SelectItem value="Design">Design</SelectItem>
                        </SelectContent>
                      </Select>
                    </Stack>
                  </Grid>

                  {/* Date, Time, and Duration */}
                  <Grid cols={3} gap={2} className="grid-cols-1 md:grid-cols-3 gap-1 md:gap-2">
                    <Stack spacing={1}>
                      <Label htmlFor="date" className="text-sm font-medium">Date</Label>
                      <Input 
                        id="date"
                        type="date"
                        value={interviewFormData.date} 
                        onChange={(e) => setInterviewFormData({...interviewFormData, date: e.target.value})}
                        placeholder="Today (default)"
                        className="h-8 md:h-9 bg-white border border-gray-300 shadow-sm text-xs md:text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder:text-gray-500"
                      />
                    </Stack>
                    <Stack spacing={1}>
                      <Label htmlFor="time" className="text-sm font-medium">Time</Label>
                      <Select
                        value={interviewFormData.time || ""}
                        onValueChange={value => setInterviewFormData({...interviewFormData, time: value})}
                      >
                        <SelectTrigger 
                          className="h-8 md:h-9 w-full bg-white border border-gray-300 shadow-sm text-xs md:text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          style={{ 
                            color: interviewFormData.time ? '#111827' : '#6b7280',
                            '--placeholder-color': '#6b7280'
                          } as React.CSSProperties}
                        >
                          <SelectValue placeholder="Select Time" />
                        </SelectTrigger>
                        <SelectContent className="w-full min-w-[150px] bg-white max-h-[200px] overflow-y-auto">
                          <SelectItem value="09:00">09:00 AM</SelectItem>
                          <SelectItem value="09:30">09:30 AM</SelectItem>
                          <SelectItem value="10:00">10:00 AM</SelectItem>
                          <SelectItem value="10:30">10:30 AM</SelectItem>
                          <SelectItem value="11:00">11:00 AM</SelectItem>
                          <SelectItem value="11:30">11:30 AM</SelectItem>
                          <SelectItem value="12:00">12:00 PM</SelectItem>
                          <SelectItem value="12:30">12:30 PM</SelectItem>
                          <SelectItem value="13:00">01:00 PM</SelectItem>
                          <SelectItem value="13:30">01:30 PM</SelectItem>
                          <SelectItem value="14:00">02:00 PM</SelectItem>
                          <SelectItem value="14:30">02:30 PM</SelectItem>
                          <SelectItem value="15:00">03:00 PM</SelectItem>
                          <SelectItem value="15:30">03:30 PM</SelectItem>
                          <SelectItem value="16:00">04:00 PM</SelectItem>
                          <SelectItem value="16:30">04:30 PM</SelectItem>
                          <SelectItem value="17:00">05:00 PM</SelectItem>
                          <SelectItem value="17:30">05:30 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </Stack>
                    <Stack spacing={1}>
                      <Label htmlFor="duration" className="text-sm font-medium">Duration (minutes)</Label>
                      <Input 
                        id="duration"
                        type="number"
                        value={interviewFormData.duration} 
                        onChange={(e) => setInterviewFormData({...interviewFormData, duration: e.target.value})}
                        placeholder="60 (default)"
                        className="h-8 md:h-9 bg-white border border-gray-300 shadow-sm text-xs md:text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder:text-gray-500"
                      />
                    </Stack>
                  </Grid>

                  {/* Stage and Location */}
                  <Grid cols={2} gap={2} className="grid-cols-1 md:grid-cols-2 gap-1 md:gap-2">
                    <Stack spacing={1} className="min-w-0">
                      <Label htmlFor="stage" className="text-sm font-medium">Stage</Label>
                      <Select value={interviewFormData.stage || ""} onValueChange={(value) => setInterviewFormData({...interviewFormData, stage: value})}>
                        <SelectTrigger 
                          className="h-10 md:h-11 w-full bg-white border border-gray-300 shadow-sm text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          style={{ 
                            color: interviewFormData.stage ? '#111827' : '#6b7280',
                            '--placeholder-color': '#6b7280'
                          } as React.CSSProperties}
                        >
                          <SelectValue placeholder="Round 1 (default)" />
                        </SelectTrigger>
                        <SelectContent className="w-full min-w-[200px] bg-white">
                          <SelectItem value="Round 1">Round 1</SelectItem>
                          <SelectItem value="Round 2">Round 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </Stack>
                  </Grid>
                </div>
                <DialogFooter className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-2 w-full">
                    <Button 
                      variant="outline" 
                      onClick={() => setScheduleModalOpen(false)}
                      className="flex-1 sm:flex-none"
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="bg-black text-white hover:bg-emerald-700 hover:text-white flex-1 sm:flex-none"
                      onClick={handleSaveInterview}
                    >
                      {selectedInterview ? 'Update Interview' : 'Schedule Interview'}
                    </Button>
                  </div>
                </DialogFooter>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>



      {/* Assign Interviewer Modal */}
      <Dialog open={assignInterviewerModalOpen} onOpenChange={setAssignInterviewerModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Assigned Interviewer</DialogTitle>
            <DialogDescription>
              Enter the interviewer's name and avatar URL.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="interviewer-name">Name</Label>
              <Input
                id="interviewer-name"
                value={newInterviewerName}
                onChange={e => setNewInterviewerName(e.target.value)}
                placeholder="Interviewer Name"
                required
              />
            </div>
            <div>
              <Label htmlFor="interviewer-avatar">Avatar URL</Label>
              <Input
                id="interviewer-avatar"
                value={newInterviewerAvatar}
                onChange={e => setNewInterviewerAvatar(e.target.value)}
                placeholder="https://..."
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignInterviewerModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-black text-white hover:bg-emerald-700 hover:text-white"
              onClick={async () => {
                if (!newInterviewerName.trim() || !newInterviewerAvatar.trim()) {
                  showToast("Name and avatar are required.", 'error');
                  return;
                }
                try {
                  const token = localStorage.getItem('token');
                  const res = await fetch('http://localhost:5000/api/assigned-interviewers', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    },
                    body: JSON.stringify({
                      name: newInterviewerName,
                      avatar: newInterviewerAvatar
                    })
                  });
                  if (res.ok) {
                    const newInterviewer = await res.json();
                    setInterviewers(prev => [...prev, newInterviewer]);
                    setNewInterviewerName("");
                    setNewInterviewerAvatar("");
                    setAssignInterviewerModalOpen(false);
                    showToast('Interviewer added successfully!', 'success');
                  } else {
                    showToast('Failed to add interviewer. Please try again.', 'error');
                  }
                } catch (error) {
                  showToast('Failed to add interviewer. Please try again.', 'error');
                }
              }}
            >
              Add Interviewer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback Modal */}
      <Dialog open={feedbackModalOpen} onOpenChange={setFeedbackModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Feedback</DialogTitle>
            <DialogDescription>
              Provide feedback and rating for this interview
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rating">Rating</Label>
              <Select onValueChange={(value) => setFeedbackRating(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Poor</SelectItem>
                  <SelectItem value="2">2 - Fair</SelectItem>
                  <SelectItem value="3">3 - Good</SelectItem>
                  <SelectItem value="4">4 - Very Good</SelectItem>
                  <SelectItem value="5">5 - Excellent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="feedback">Feedback</Label>
              <Textarea 
                id="feedback"
                placeholder="Provide detailed feedback about the interview..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedbackModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-black text-white hover:bg-emerald-700 hover:text-white"
              onClick={() => {
                if (selectedInterview && feedbackText && feedbackRating) {
                  handleAddFeedback(selectedInterview.id, feedbackText, feedbackRating);
                  setFeedbackText('');
                  setFeedbackRating(0);
                  setFeedbackModalOpen(false);
                }
              }}
            >
              Add Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
     

      {/* Simple Interview Creation Modal (from InterviewsView) */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Interview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Interview Title (e.g., Junior Frontend Developer - Round 1)"
              value={interviewTitle}
              onChange={e => setInterviewTitle(e.target.value)}
              required
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                placeholder="Date"
                value={interviewDate}
                onChange={e => setInterviewDate(e.target.value)}
                required
              />
              <Input
                type="time"
                placeholder="Time"
                value={interviewTime}
                onChange={e => setInterviewTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="block text-xs font-medium mb-1">Interviewers</Label>
              <Select value={selectedInterviewer} onValueChange={setSelectedInterviewer}>
                <SelectTrigger>
                  <SelectValue placeholder="Select interviewer" />
                </SelectTrigger>
                <SelectContent>
                  {interviewers.map((user) => (
                    <SelectItem key={user.name} value={user.name}>{user.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="block text-xs font-medium mb-1">Candidates</Label>
              <Select value={selectedCandidate} onValueChange={setSelectedCandidate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select candidate" />
                </SelectTrigger>
                <SelectContent>
                  {/* TODO: Populate with real candidates */}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="block text-xs font-medium mb-1">Round Type</Label>
              <Select value={roundType} onValueChange={setRoundType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select round type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Screening">Screening</SelectItem>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Final">Final</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input
              placeholder="Duration (e.g., 30 min)"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              required
            />
            <Textarea
              placeholder="Instructions (optional guidelines or documents)"
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={() => {
              setCreateOpen(false);
              setInterviewTitle("");
              setInterviewDate("");
              setInterviewTime("");
              setSelectedInterviewer("");
              setSelectedCandidate("");
              setRoundType("");
              setDuration("");
              setInstructions("");
            }} className="hover:bg-emerald-700">
              Create
            </Button>
            <DialogClose asChild>
              <Button variant="ghost" className="hover:bg-emerald-700">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
                        </div>
  );
}
