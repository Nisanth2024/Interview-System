import { useRef, useState } from "react";
import {
  fetchInterviewQuestions,
  createInterviewQuestion,
  updateInterviewQuestion,
  deleteInterviewQuestion
} from "../lib/interviewQuestionsApi";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { NotificationCard } from "../components/NotificationCard";

import { useEffect } from 'react';
import { useNotifications } from "../lib/notificationContext";
import { cn } from "@/lib/utils";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HelpCircle, X, UserPlus, Eye, ArrowRight, Users, Bell, FileText, ChevronRight, ChevronDown, Download, Filter as FilterIcon, Plus, MoreHorizontal, Edit, Trash2, ChevronUp, Copy, FileDown, Check, Calendar, UserCheck, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Candidate type definition (matches backend)
type Candidate = {
  _id?: string;
  id?: number;
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

// Section type definition
type Section = {
  _id?: string;
  id?: string;
  name: string;
  details: string;
  duration?: number;
  questionCount?: number;
  order?: number;
  isActive?: boolean;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
};
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Grid } from "@/components/ui/grid";
import { Flex } from "@/components/ui/flex";
import { Typography } from "@/components/ui/typography";
import { Stack } from "@/components/ui/stack";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { DialogDescription } from "@/components/ui/dialog";

export default function DashboardPage() {
  // State for interviews and candidate view modal
  const [interviews, setInterviews] = useState<any[]>([]);
  const [viewCandidatesStage, setViewCandidatesStage] = useState<string | null>(null);
  const { 
    notifications, 
    unreadCount, 
    loading,
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    clearAllNotifications,
    addNotification,
    refreshNotifications,
    initializeForUser
  } = useNotifications();

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  };

  // Fetch interviews on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/interviews', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setInterviews(data);
        } else {
          setInterviews([]);
        }
      })
      .catch(() => setInterviews([]));
  }, []);

  // Helper: get candidates for a given stage
  const getCandidatesByStage = (stage: string) => {
    const candidateIds = interviews.filter((i: any) => i.stage === stage).map((i: any) => i.candidateId);
    const uniqueIds = Array.from(new Set(candidateIds));
    return candidates.filter((c: Candidate) => uniqueIds.includes(c._id));
  };
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [showAllNotifications, setShowAllNotifications] = useState(false)
  const [, setDepartmentFilter] = useState<'All' | 'Design Department' | 'Engineering Department'>('All')
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  // Fetch candidates and interviews from backend on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    // Fetch candidates
    fetch('http://localhost:5000/api/candidates', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCandidates(data);
        } else {
          setCandidates([]);
        }
      })
      .catch(() => setCandidates([]));

    // Fetch assigned interviewers
    fetch('http://localhost:5000/api/assigned-interviewers', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setInterviewers(data);
        } else {
          setInterviewers([]);
        }
      })
      .catch(() => setInterviewers([]));
  }, []);
  const [language, setLanguage] = useState<'en' | 'es' | 'fr'>('en');
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterDept, setFilterDept] = useState<string>('All');
  // Departments state for MainContent
  const [departments] = useState([
    { name: "Design Department", color: "purple" },
    { name: "Engineering Department", color: "orange" }
  ]);

  // Add state for CandidatesView filter and dropdown
  const [filterOpen, setFilterOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // Handlers for dropdown and select
  const handleDropdown = () => setDropdownOpen((v) => !v);
  const handleSelect = (dept: string) => {
    setDropdownOpen(false);
    setDepartmentFilter(dept as 'All' | 'Design Department' | 'Engineering Department');
    setFilterDept(dept);
    // Navigate to candidates page with department filter
    navigate('/candidates', { state: { departmentFilter: dept } });
  };
  // Export handler - exports candidates data to CSV
  const handleExport = () => {
    try {
      // Filter candidates based on current department filter if any
      const filteredCandidates = filterDept === 'All' 
        ? candidates 
        : candidates.filter(c => c.department === filterDept);

      if (filteredCandidates.length === 0) {
        alert('No candidates data to export');
        return;
      }

      // Create CSV headers
      const headers = ['Name', 'Email', 'Phone', 'Location', 'Department', 'Status', 'Rating', 'Applied Date', 'Experience', 'Skills'];
      
      // Create CSV rows
      const csvRows = [
        headers.join(','),
        ...filteredCandidates.map(candidate => [
          `"${candidate.name || ''}"`,
          `"${candidate.email || ''}"`,
          `"${candidate.phone || ''}"`,
          `"${candidate.location || ''}"`,
          `"${candidate.department || ''}"`,
          `"${candidate.status || ''}"`,
          `"${candidate.rating || ''}"`,
          `"${candidate.appliedDate || ''}"`,
          `"${candidate.experience || ''}"`,
          `"${candidate.skills ? candidate.skills.join('; ') : ''}"`
        ].join(','))
      ];

      // Create and download CSV file
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `candidates_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

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

  // Interview Rounds handlers
  const handleViewCandidates = () => {
    setViewCandidatesStage('Round 1');
  }

  const handleViewCandidatesRound2 = () => {
    setViewCandidatesStage('Round 2');
  }

  // Department filter handler

  // Add person handler
  const handleAddPerson = (person: {
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
      const token = localStorage.getItem('token');
      const newCandidate = {
        name: person.name,
        email: person.email,
        phone: person.phone,
        location: person.location,
        avatar: person.avatar || `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 50)}.jpg`,
        status: 'pending',
        rating: Math.floor(Math.random() * 20 + 30) / 10,
        appliedDate: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
        experience: person.experience,
        skills: person.skills,
        department: person.department as 'Design Department' | 'Engineering Department'
      };
      fetch('http://localhost:5000/api/candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(newCandidate)
      })
        .then(res => res.json())
        .then(data => {
          if (data && data._id) {
            setCandidates(prev => [...prev, data]);
            // Add notification for new candidate
            addNotification({
              type: 'candidate',
              title: 'New Candidate Added',
              message: `${person.name} has been added to ${person.department}`,
              icon: '👤'
            });
            // Refresh notifications to get the latest from backend
            refreshNotifications();
            navigate('/candidates');
            setDepartmentFilter(person.department as 'All' | 'Design Department' | 'Engineering Department');
          }
        });
  }
}

// Delete candidate handler
  // Delete candidate handler

  // Add a ref to control AddPersonModal from outside Header
  const [addPersonModalOpen, setAddPersonModalOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notes, setNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);
  // Highlights card detail dialog state
  const [highlightOpen, setHighlightOpen] = useState(false);
  const [highlightTitle, setHighlightTitle] = useState<string>("");
  const [highlightDetail, setHighlightDetail] = useState<string>("");
  const handleHighlightClick = (title: string, detail: string) => {
    setHighlightTitle(title);
    setHighlightDetail(detail);
    setHighlightOpen(true);
  };

  // State for breadcrumbs and top right components (moved from MainContent)
  const [department] = useState<'All' | 'Design Department' | 'Engineering Department'>('All');

  // Interview Overview state (from backend)
  type InterviewQuestion = {
    _id?: string;
    interviewId?: string;
    prompt: string;
    competency: string;
    time: string;
    level: string;
    editing?: boolean;
    deleted?: boolean;
    answer?: string;
    answering?: boolean;
  };
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  // Use the first interview as the selected one for demo (or let user pick)
  const [selectedInterviewId, setSelectedInterviewId] = useState<string | null>(null);
  // Set selectedInterviewId to first interview (or null)
  useEffect(() => {
    if (interviews.length > 0 && !selectedInterviewId) {
      setSelectedInterviewId(interviews[0]._id || interviews[0].id);
    }
  }, [interviews, selectedInterviewId]);

  // Fetch questions for selected interview
  const fetchAndSetQuestions = async (interviewId: string) => {
    const token = localStorage.getItem('token') || '';
    setQuestionsLoading(true);
    try {
      const data = await fetchInterviewQuestions(interviewId, token);
      setQuestions(Array.isArray(data) ? data : []);
    } catch {
      setQuestions([]);
    } finally {
      setQuestionsLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedInterviewId) return;
    fetchAndSetQuestions(selectedInterviewId);
  }, [selectedInterviewId]);
  const [isInterviewOverviewVisible] = useState(true);
  const editingBlockRef = useRef<HTMLDivElement | null>(null);
  const editPromptInputRef = useRef<HTMLInputElement | null>(null);
  const createPromptInputRef = useRef<HTMLInputElement | null>(null);
  const [createPromptOpen, setCreatePromptOpen] = useState(false);
  // Handler to open create prompt and focus input
  const handleOpenCreatePrompt = () => {
    setCreatePromptOpen(true);
    setTimeout(() => {
      createPromptInputRef.current?.focus();
    }, 100);
  };

  // Handler to open edit question dialog
  const handleOpenEditQuestion = (question: InterviewQuestion) => {
    setEditingQuestion(question);
    setEditQuestionForm({
      prompt: question.prompt,
      competency: question.competency,
      time: question.time.replace(' Min', '').replace('min', '').trim(),
      level: question.level
    });
    setEditQuestionOpen(true);
  };

  // Handler to save edited question
  const handleSaveEditedQuestion = async () => {
    if (!editingQuestion || !selectedInterviewId) return;
    
    const token = localStorage.getItem('token') || '';
    const updatedQuestion = {
      ...editingQuestion,
      prompt: editQuestionForm.prompt,
      competency: editQuestionForm.competency,
      time: editQuestionForm.time + ' Min',
      level: editQuestionForm.level
    };
    
    try {
      if (editingQuestion._id) {
        await updateInterviewQuestion(editingQuestion._id, updatedQuestion, token);
      }
      await fetchAndSetQuestions(selectedInterviewId);
      setEditQuestionOpen(false);
      setEditingQuestion(null);
    } catch (error) {
      console.error('Failed to update question:', error);
    }
  };
  const [newPrompt, setNewPrompt] = useState("");
  const [newCompetency, setNewCompetency] = useState("Team Building");
  const [newTime, setNewTime] = useState("10");
  const [newLevel, setNewLevel] = useState("Pending");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [librarySearch, setLibrarySearch] = useState("");
  
  // Edit Question Dialog State
  const [editQuestionOpen, setEditQuestionOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<InterviewQuestion | null>(null);
  const [editQuestionForm, setEditQuestionForm] = useState({
    prompt: '',
    competency: 'Team Building',
    time: '10',
    level: 'Pending'
  });

  // Predefined templates for Insert From Library
  const predefinedTemplates = [
    {
      id: "js-basics",
      title: "JavaScript Basics",
      category: "Technical",
      questions: [
        {
          prompt: "Explain the difference between var, let, and const in JavaScript",
          competency: "JavaScript Fundamentals",
          time: "10",
          level: "Intermediate"
        },
        {
          prompt: "What is closure in JavaScript and how is it used?",
          competency: "JavaScript Concepts",
          time: "15",
          level: "Advanced"
        },
        {
          prompt: "Explain event bubbling and event delegation",
          competency: "DOM Manipulation",
          time: "10",
          level: "Intermediate"
        }
      ]
    },
    {
      id: "problem-solving",
      title: "Problem Solving",
      category: "General",
      questions: [
        {
          prompt: "Describe a challenging problem you solved in your previous role",
          competency: "Problem Solving",
          time: "15",
          level: "Advanced"
        },
        {
          prompt: "How do you approach debugging a complex issue?",
          competency: "Technical Skills",
          time: "10",
          level: "Intermediate"
        }
      ]
    },
    {
      id: "system-design",
      title: "System Design",
      category: "Technical",
      questions: [
        {
          prompt: "Design a scalable chat application",
          competency: "System Architecture",
          time: "20",
          level: "Advanced"
        },
        {
          prompt: "How would you design a URL shortening service?",
          competency: "System Design",
          time: "15",
          level: "Advanced"
        }
      ]
    }
  ];
  const [questionForm] = useState({
    prompt: '',
    competency: 'Team Building',
    time: '10 Min',
    level: 'Pending',
  });

  // Predefined question bank

  // State for Assigned Interviewers and Section Panel (moved from MainContent)
  const [showInterviewersModal, setShowInterviewersModal] = useState(false);
  const [showCreateInterviewerForm, setShowCreateInterviewerForm] = useState(false);
  const [editInterviewerId, setEditInterviewerId] = useState<string|null>(null);
  const [editInterviewerName, setEditInterviewerName] = useState("");
  const [editInterviewerPhoto, setEditInterviewerPhoto] = useState("");
  const [newInterviewerName, setNewInterviewerName] = useState("");
  const [newInterviewerPhoto, setNewInterviewerPhoto] = useState("");
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, setPhoto: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhoto(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const [sections, setSections] = useState<Section[]>([]);
  const [sectionsLoading, setSectionsLoading] = useState(true);
        const [interviewers, setInterviewers] = useState<any[]>([]);
        useEffect(() => {
          const token = localStorage.getItem('token');
          fetch('http://localhost:5000/api/assigned-interviewers', {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
          })
            .then(res => res.json())
            .then(data => {
              if (Array.isArray(data)) {
                setInterviewers(data);
              } else {
                setInterviewers([]);
              }
            })
            .catch(() => setInterviewers([]));
        }, []);

  // Fetch sections from backend
  useEffect(() => {
    const fetchSections = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, skipping sections fetch');
        setSectionsLoading(false);
        return;
      }

      try {
        setSectionsLoading(true);
        console.log('Fetching sections with token:', token);
        
        const response = await fetch('http://localhost:5000/api/sections', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log('Sections fetch response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Sections data received:', data);
          setSections(Array.isArray(data) ? data : []);
        } else if (response.status === 401) {
          console.log('Unauthorized - token may be invalid');
          setSections([]);
        } else {
          const errorText = await response.text();
          console.error('Failed to fetch sections:', response.status, errorText);
          setSections([]);
        }
      } catch (error) {
        console.error('Error fetching sections:', error);
        setSections([]);
      } finally {
        setSectionsLoading(false);
      }
    };
    
    fetchSections();
  }, []);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newSection, setNewSection] = useState("");
  const [newSectionDetails, setNewSectionDetails] = useState("");
  const [newSectionDuration, setNewSectionDuration] = useState<number>(0);
  const [newSectionQuestionCount, setNewSectionQuestionCount] = useState<number>(0);
  const [creating, setCreating] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editSectionName, setEditSectionName] = useState("");
  const [editSectionDetails, setEditSectionDetails] = useState("");
  const [editSectionDuration, setEditSectionDuration] = useState<number>(0);
  const [editSectionQuestionCount, setEditSectionQuestionCount] = useState<number>(0);
  const [updating, setUpdating] = useState(false);

  // Interviewers data
  // Interviewers are now fetched from backend above

  // Refresh sections function
  const refreshSections = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setSectionsLoading(true);
      const response = await fetch('http://localhost:5000/api/sections', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSections(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error refreshing sections:', error);
    } finally {
      setSectionsLoading(false);
    }
  };

  // Handlers for Section Panel
  const handleCreateSection = async () => {
    if (!newSection.trim()) {
      alert('Section name is required');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Authentication required. Please log in again.');
      navigate('/login');
      return;
    }

    setCreating(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/sections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newSection.trim(),
          details: newSectionDetails.trim() || `${newSectionDuration}m • ${newSectionQuestionCount} Questions`,
          duration: newSectionDuration || 0,
          questionCount: newSectionQuestionCount || 0,
          order: sections.length
        })
      });
      
      if (response.ok) {
        const newSectionData = await response.json();
        console.log('Section created successfully:', newSectionData);
        
        // Add the new section to local state immediately for better UX
        setSections(prev => [...prev, newSectionData]);
        
        // Also refresh to ensure consistency
        await refreshSections();
        
        // Reset form and close dialog
        setAddDialogOpen(false);
        setNewSection("");
        setNewSectionDetails("");
        setNewSectionDuration(0);
        setNewSectionQuestionCount(0);
      } else {
        const errorData = await response.json();
        console.error('Failed to create section:', response.status, errorData);
        
        if (response.status === 401) {
          alert('Authentication expired. Please log in again.');
          navigate('/login');
        } else {
          alert(`Failed to create section: ${errorData.message || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Error creating section:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setCreating(false);
    }
  };
  
  // Edit section handlers
  const handleEditSection = (section: Section) => {
    setEditingSectionId(section._id || section.id || null);
    setEditSectionName(section.name);
    setEditSectionDetails(section.details);
    setEditSectionDuration(section.duration || 0);
    setEditSectionQuestionCount(section.questionCount || 0);
    setEditDialogOpen(true);
  };

  const handleUpdateSection = async () => {
    if (!editingSectionId || !editSectionName.trim()) {
      alert('Section name is required');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Authentication required. Please log in again.');
      navigate('/login');
      return;
    }

    setUpdating(true);
    
    try {
      const response = await fetch(`http://localhost:5000/api/sections/${editingSectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editSectionName.trim(),
          details: editSectionDetails.trim() || `${editSectionDuration}m • ${editSectionQuestionCount} Questions`,
          duration: editSectionDuration || 0,
          questionCount: editSectionQuestionCount || 0
        })
      });
      
      if (response.ok) {
        const updatedSection = await response.json();
        console.log('Section updated successfully:', updatedSection);
        
        // Update local state immediately for better UX
        setSections(prev => prev.map(section => 
          (section._id || section.id) === editingSectionId ? updatedSection : section
        ));
        
        // Also refresh to ensure consistency
        await refreshSections();
        
        // Reset form and close dialog
        setEditDialogOpen(false);
        setEditingSectionId(null);
        setEditSectionName("");
        setEditSectionDetails("");
        setEditSectionDuration(0);
        setEditSectionQuestionCount(0);
      } else {
        const errorData = await response.json();
        console.error('Failed to update section:', response.status, errorData);
        
        if (response.status === 401) {
          alert('Authentication expired. Please log in again.');
          navigate('/login');
        } else {
          alert(`Failed to update section: ${errorData.message || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Error updating section:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setUpdating(false);
    }
  };

  // Delete section handler
  const handleDeleteSection = async (sectionId: string | undefined, index: number) => {
    if (!sectionId) {
      console.error('Section ID is required for deletion');
      alert('Cannot delete section: Invalid section ID');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Authentication required. Please log in again.');
      navigate('/login');
      return;
    }

    if (!confirm('Are you sure you want to delete this section?')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/sections/${sectionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        // Remove from local state immediately for better UX
        setSections(prev => prev.filter(section => section._id !== sectionId));
        
        // Also refresh to ensure consistency
        await refreshSections();
        console.log('Section deleted successfully');
      } else {
        const errorData = await response.json();
        console.error('Failed to delete section:', response.status, errorData);
        
        if (response.status === 401) {
          alert('Authentication expired. Please log in again.');
          navigate('/login');
        } else {
          alert(`Failed to delete section: ${errorData.message || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Error deleting section:', error);
      alert('Network error. Please check your connection and try again.');
    }
  };

  // Interview Rounds Components
  // State for current question index in Previous Background card
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const Round1Card = ({ onViewCandidates }: { onViewCandidates: () => void }) => {
    const round1Candidates = getCandidatesByStage('Round 1');
    const displayCandidates = round1Candidates.slice(0, 3);
    const remainingCount = Math.max(0, round1Candidates.length - 3);
    
    return (
      <Card className="w-full min-h-[140px] sm:min-h-[120px] md:min-h-[140px] lg:min-h-[160px] xl:min-h-[180px] 2xl:min-h-[120px] hover:shadow-md transition-all duration-200 hover:scale-[1.01] overflow-hidden flex flex-col">
        <CardHeader className="pb-0 px-3 sm:px-3 md:px-4 lg:px-4 xl:px-5 2xl:px-2 pt-0 flex-shrink-0">
          <Flex align="center" gap={1} wrap="wrap" className="mb-[-20px] 2xl:mb-[-10px]">
            <Badge variant="outline" className="text-[9px] sm:text-xs leading-tight px-1 py-0.3 2xl:text-[8px] 2xl:px-0.5 border border-black">
              <Typography variant="span" size="xs">Aug 10 - Aug 20</Typography>
            </Badge>
            <Badge variant="outline" className="text-[9px] sm:text-xs leading-tight px-1 py-0.3 flex items-center gap-1 2xl:text-[8px] 2xl:px-0.5 border border-black">
              <Users className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 2xl:w-2 2xl:h-2" />
              <Typography variant="span" size="xs">{round1Candidates.length} Candidates</Typography>
            </Badge>
            <Badge variant="secondary" className="text-[9px] sm:text-xs leading-tight px-1 py-0.3 text-green-700 bg-green-100 2xl:text-[8px] 2xl:px-0.5 border border-black">
              Completed
            </Badge>
          </Flex>
        </CardHeader>
        
        <CardContent className="flex-1 px-3 sm:px-3 md:px-4 lg:px-4 xl:px-5 2xl:px-2 pb-0">
          <Typography 
            variant="h3" 
            size="2xl" 
            weight="medium" 
            className="text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-lg leading-tight mb-0"
          >
            Round 1
          </Typography>
          <Typography 
            variant="p" 
            size="xs" 
            color="muted" 
            className="text-xs sm:text-sm text-muted-foreground 2xl:text-[10px]"
          >
            Initial Review
          </Typography>
        </CardContent>
        
        <CardFooter className="px-3 sm:px-3 md:px-4 lg:px-4 xl:px-5 2xl:px-2 pb-0 pt-0 mt-auto">
          <Flex align="center" justify="between" className="w-full">
            <Flex align="center" className="-space-x-1 sm:-space-x-2 md:-space-x-3 lg:-space-x-3 xl:-space-x-4 2xl:-space-x-2">
              {displayCandidates.map((candidate, index) => (
                <Avatar key={candidate._id || index} className="w-6 h-6 sm:w-5 sm:h-5 md:w-7 md:h-7 lg:w-7 lg:h-7 xl:w-8 xl:h-8 2xl:w-5 2xl:h-5 border-2 border-white">
                  <AvatarImage src={candidate.avatar} />
                  <AvatarFallback className="text-[8px] sm:text-[10px] md:text-xs lg:text-xs xl:text-sm 2xl:text-[8px]">
                    {candidate.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              ))}
              {remainingCount > 0 && (
                <Badge className="bg-emerald-700 text-white text-[9px] sm:text-[10px] md:text-xs lg:text-xs xl:text-sm 2xl:text-[8px] font-medium w-6 h-6 sm:w-5 sm:h-5 md:w-7 md:h-7 lg:w-7 lg:h-7 xl:w-8 xl:h-8 2xl:w-5 2xl:h-5 flex items-center justify-center rounded-full border-2 border-white">
                  +{remainingCount}
                </Badge>
              )}
              {round1Candidates.length === 0 && (
                <div className="text-xs text-gray-400">No candidates</div>
              )}
            </Flex>
            <Button
              size="sm"
              className="text-[10px] sm:text-xs md:text-sm lg:text-sm xl:text-base 2xl:text-xs px-2 sm:px-3 md:px-4 lg:px-4 xl:px-5 2xl:px-2 py-1 sm:py-1.5 md:py-2 lg:py-2 xl:py-2.5 2xl:py-1 h-6 sm:h-7 md:h-8 lg:h-8 xl:h-9 2xl:h-6 bg-black text-white hover:bg-emerald-700 hover:text-white font-medium mr-2 sm:mr-2 md:mr-3 lg:mr-4 xl:mr-5"
              onClick={onViewCandidates}
            >
              <Typography variant="span" size="xs" className="truncate text-white">
                View Candidates
              </Typography>
              <ArrowRight className="ml-1 w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-4 lg:h-4 xl:w-5 xl:h-5 2xl:w-3 2xl:h-3 flex-shrink-0 text-white" />
            </Button>
          </Flex>
        </CardFooter>
      </Card>
    );
  };

  const Round2Card = ({ onViewCandidatesRound2 }: { onViewCandidatesRound2: () => void }) => {
    const round2Candidates = getCandidatesByStage('Round 2');
    const displayCandidates = round2Candidates.slice(0, 3);
    const remainingCount = Math.max(0, round2Candidates.length - 3);
    
    return (
      <Card className="w-full min-h-[140px] sm:min-h-[120px] md:min-h-[140px] lg:min-h-[160px] xl:min-h-[180px] 2xl:min-h-[120px] hover:shadow-md transition-all duration-200 hover:scale-[1.01] overflow-hidden flex flex-col">
        <CardHeader className="pb-0 px-3 sm:px-3 md:px-4 lg:px-4 xl:px-5 2xl:px-2 pt-0 flex-shrink-0">
          <Flex align="center" gap={1} wrap="wrap" className="mb-[-20px] 2xl:mb-[-10px]">
            <Badge variant="outline" className="text-[9px] sm:text-xs leading-tight px-1 py-0.3 2xl:text-[8px] 2xl:px-0.5 border border-black">
              <Typography variant="span" size="xs">Aug 10 - Aug 20</Typography>
            </Badge>
            <Badge variant="outline" className="text-[9px] sm:text-xs leading-tight px-1 py-0.3 flex items-center gap-1 2xl:text-[8px] 2xl:px-0.5 border border-black">
              <Users className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 2xl:w-2 2xl:h-2" />
              <Typography variant="span" size="xs">{round2Candidates.length} Candidates</Typography>
            </Badge>
            <Badge variant="secondary" className="text-[9px] sm:text-xs leading-tight px-1 py-0.3 text-orange-700 bg-orange-100 2xl:text-[8px] 2xl:px-0.5 border border-black">
              In Progress
            </Badge>
          </Flex>
        </CardHeader>
        
        <CardContent className="flex-1 px-3 sm:px-3 md:px-4 lg:px-4 xl:px-5 2xl:px-2 pb-0">
          <Typography 
            variant="h3" 
            size="2xl" 
            weight="medium" 
            className="text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-lg leading-tight mb-0"
          >
            Round 2
          </Typography>
          <Typography 
            variant="p" 
            size="xs" 
            color="muted" 
            className="text-xs sm:text-sm text-muted-foreground 2xl:text-[10px]"
          >
            Technical Review
          </Typography>
        </CardContent>
        
        <CardFooter className="px-3 sm:px-3 md:px-4 lg:px-4 xl:px-5 2xl:px-2 pb-0 pt-0 mt-auto">
          <Flex align="center" justify="between" className="w-full">
            <Flex align="center" className="-space-x-1 sm:-space-x-2 md:-space-x-3 lg:-space-x-3 xl:-space-x-4 2xl:-space-x-2">
              {displayCandidates.map((candidate, index) => (
                <Avatar key={candidate._id || index} className="w-6 h-6 sm:w-5 sm:h-5 md:w-7 md:h-7 lg:w-7 lg:h-7 xl:w-8 xl:h-8 2xl:w-5 2xl:h-5 border-2 border-white">
                  <AvatarImage src={candidate.avatar} />
                  <AvatarFallback className="text-[8px] sm:text-[10px] md:text-xs lg:text-xs xl:text-sm 2xl:text-[8px]">
                    {candidate.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              ))}
              {remainingCount > 0 && (
                <Badge className="bg-emerald-700 text-white text-[9px] sm:text-[10px] md:text-xs lg:text-xs xl:text-sm 2xl:text-[8px] font-medium w-6 h-6 sm:w-5 sm:h-5 md:w-7 md:h-7 lg:w-7 lg:h-7 xl:w-8 xl:h-8 2xl:w-5 2xl:h-5 flex items-center justify-center rounded-full border-2 border-white">
                  +{remainingCount}
                </Badge>
              )}
              {round2Candidates.length === 0 && (
                <div className="text-xs text-gray-400">No candidates</div>
              )}
            </Flex>
            <Button
              size="sm"
              className="text-[10px] sm:text-xs md:text-sm lg:text-sm xl:text-base 2xl:text-xs px-2 sm:px-3 md:px-4 lg:px-4 xl:px-5 2xl:px-2 py-1 sm:py-1.5 md:py-2 lg:py-2 xl:py-2.5 2xl:py-1 h-6 sm:h-7 md:h-8 lg:h-8 xl:h-9 2xl:h-6 bg-black text-white hover:bg-emerald-700 hover:text-white font-medium mr-2 sm:mr-2 md:mr-3 lg:mr-4 xl:mr-5"
              onClick={onViewCandidatesRound2}
            >
              <Typography variant="span" size="xs" className="truncate text-white">
                View Candidates
              </Typography>
              <ArrowRight className="ml-1 w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-4 lg:h-4 xl:w-5 xl:h-5 2xl:w-3 2xl:h-3 flex-shrink-0 text-white" />
            </Button>
          </Flex>
        </CardFooter>
      </Card>
    );
  };

  // NotificationPanel Component

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
            } else if (type === 'prompt') {
              handleOpenCreatePrompt();
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
      
      {/* Notification Panel */}
      {isNotificationOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="flex-1 bg-black/30" onClick={() => setIsNotificationOpen(false)}></div>
          <div className="w-full max-w-md h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
            <div className="h-full flex flex-col">
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Notifications</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsNotificationOpen(false)}
                    className="p-1 hover:bg-gray-200"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <NotificationCard className="h-full border-0 rounded-none shadow-none" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
    <div className="md:pl-60 h-screen pt-10">
      <div className="h-full overflow-y-auto p-2 sm:p-3 md:p-4 ipadpro:max-w-[900px] ipadpro:mx-auto">
        <div className="flex flex-1 flex-col min-h-[calc(100vh-64px)]">
          <AnimatePresence mode="wait">
            <motion.div
              key="main"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {/* Breadcrumbs and Page Title */}
              <div className="w-full px-0 pt-4 pb-0">
                <div className="mb-0 -pl-1 -mt-1 sm:mb-1 md:mb-2 lg:mb-3 flex-shrink-0">
                  <Flex align="center" gap={2} className="flex-wrap items-center space-x-1 md:space-x-2 text-xs md:text-sm text-gray-600 mb-2">
                    <Typography variant="span" size="xs" color="muted">Candidates</Typography>
                    <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                    <Typography variant="span" size="xs" color="muted" className="hidden sm:inline">Junior FrontEnd Developer</Typography>
                    <Typography variant="span" size="xs" color="muted" className="sm:hidden">Junior FrontEnd Developer</Typography>
                    <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                    <Typography variant="span" size="xs" weight="medium" className="text-black">Round 3</Typography>
                  </Flex>
                  <Flex align="center" justify="between" className="flex-col md:flex-row md:items-center md:justify-between w-full gap-0 md:gap-2 lg:flex-nowrap lg:w-auto lg:space-x-2">
                    {/* Move Round title to the left on small screens */}
                    <Typography
                      variant="h2"
                      size="lg"
                      weight="bold"
                      className="text-lg md:text-xl lg:text-2xl w-full md:w-auto text-left md:text-center mb-2 md:mb-0"
                    >
                      Round
                    </Typography>
                    {/* All Departments, Export, Filter buttons at top right */}
                    <Flex
                      align="center"
                      gap={3}
                      className="flex-col sm:flex-row gap-3 w-full sm:w-auto md:ml-auto md:w-auto md:justify-end md:flex-row md:gap-3 lg:flex-nowrap lg:w-auto lg:space-x-2"
                    >
                      <div className="relative">
                        <Button
                          variant="outline"
                          size="sm"
                          className="items-center space-x-1 text-xs px-2 py-1 min-w-[90px] hover:bg-emerald-700 hover:text-white hidden sm:flex"
                          onClick={handleDropdown}
                        >
                          <Typography variant="span" size="xs">{department === 'All' ? 'All Departments' : department}</Typography>
                          <ChevronDown className="w-3 h-3" />
                          </Button>
                          {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-50 ">
                              <Button
                                variant="ghost"
                                className={`w-full justify-start px-4 py-2 hover:bg-emerald-700 hover:text-white ${department === 'All' ? 'font-semibold' : ''}`}
                                onClick={() => handleSelect('All')}
                              >
                                <Typography variant="span" size="sm">All Departments</Typography>
                              </Button>
                              <Button
                                variant="ghost"
                                className={`w-full justify-start px-4 py-2 hover:bg-emerald-700 hover:text-white ${department === 'Design Department' ? 'font-semibold' : ''}`}
                                onClick={() => handleSelect('Design Department')}
                              >
                                <Typography variant="span" size="sm">Design Department</Typography>
                              </Button>
                              <Button
                                variant="ghost"
                                className={`w-full justify-start px-4 py-2 hover:bg-emerald-700 hover:text-white ${department === 'Engineering Department' ? 'font-semibold' : ''}`}
                                onClick={() => handleSelect('Engineering Department')}
                              >
                                <Typography variant="span" size="sm">Engineering Department</Typography>
                              </Button>
                            </div>
                          )}
                        </div>
                        <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2 text-xs px-3 py-2 min-w-[100px] hover:bg-emerald-700 hover:text-white transition-colors duration-200" onClick={handleExport}>
                          <FileDown className="w-4 h-4" />
                          <Typography variant="span" size="xs" className="hidden sm:inline">Export</Typography>
                        </Button>
                        <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-xs px-2 py-1 min-w-[90px] hover:bg-emerald-700 hover:text-white hidden sm:flex" onClick={() => setFilterOpen(true)}>
                              <FilterIcon className="w-3 h-3 mr-0" />
                              <Typography variant="span" size="xs">Filter</Typography>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Filter Candidates</DialogTitle>
                            </DialogHeader>
                            <Stack spacing={2}>
                              <Stack spacing={1}>
                                <Label className="font-semibold text-xs mb-1">Status</Label>
                                <Flex align="center" gap={2} wrap="wrap">
                                  {['pending', 'reviewed', 'shortlisted', 'rejected'].map(status => (
                                    <Label key={status} className="flex items-center gap-1 text-xs">
                                      <Checkbox
                                        checked={filterStatus.includes(status)}
                                        onCheckedChange={checked => {
                                          setFilterStatus(s => checked ? [...s, status] : s.filter(st => st !== status));
                                        }}
                                      />
                                      <Typography variant="span" size="xs">{status.charAt(0).toUpperCase() + status.slice(1)}</Typography>
                                    </Label>
                                  ))}
                                </Flex>
                              </Stack>
                              <Stack spacing={1}>
                                <Label className="font-semibold text-xs mb-1">Department</Label>
                                <Select value={filterDept} onValueChange={setFilterDept}>
                                  <SelectTrigger className="border rounded px-2 py-1 text-xs">
                                    <SelectValue placeholder="Select Department" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="All">All</SelectItem>
                                  {(departments || []).map((dept, idx) => (
                                      <SelectItem key={dept.name + idx} value={dept.name}>{dept.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </Stack>
                            </Stack>
                            <DialogFooter>
                              <Button onClick={() => setFilterOpen(false)} className="bg-black hover:bg-emerald-700 text-white">
                                <Typography variant="span" size="sm" className="text-white">Apply</Typography>
                              </Button>
                              <DialogClose asChild>
                                <Button variant="ghost" className="hover:bg-emerald-700">
                                  <Typography variant="span" size="sm">Cancel</Typography>
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </Flex>
                    </Flex>
                  </div>
                </div>

                {/* Main Content Area - Responsive Layout */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                  className="flex-1 flex flex-col lg:flex-row gap-4 sm:gap-4 md:gap-2 mb-0"
                >
                  {/* Left Side: Main Content (Round Cards and Interview Overview) */}
                  <div className="flex-1 flex flex-col gap-4 sm:gap-4 md:gap-4 lg:gap-6 xl:gap-8 lg:min-w-0">
                    {/* ROUND Panel - Enhanced Responsive Layout */}
                    <Stack spacing={4} className="flex flex-col w-full gap-4 sm:gap-4 md:gap-4 lg:gap-6 xl:gap-8">
                      {/* Mobile & Tablet: Stacked Layout */}
                      <Grid cols={1} gap={4} className="grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:hidden gap-4 sm:gap-4 md:gap-4 w-full">
                        <Grid cols={1} gap={4} className="w-full animate-in fade-in slide-in-from-bottom-4">
                          <div className="w-full">
                            <Round1Card onViewCandidates={handleViewCandidates} />
                          </div>
                          <div className="w-full">
                            <Round2Card onViewCandidatesRound2={handleViewCandidatesRound2} />
                          </div>
                        </Grid>
                      </Grid>
                      
                      {/* Desktop: Side-by-side Layout with Optimized Card Sizes */}
                      <div className="hidden lg:flex lg:flex-row lg:gap-4 xl:gap-6 2xl:gap-6 lg:w-full pr-3 xl:pr-4">
                        <div className="w-[50%]">
                          <Round1Card onViewCandidates={handleViewCandidates} />
                        </div>
                        <div className="w-[50%]">
                          <Round2Card onViewCandidatesRound2={handleViewCandidatesRound2} />
                        </div>
                      </div>
                    </Stack>

                    {/* Interview Overview header and buttons placed above the Interview Overview section on large screens only */}
            <div className="hidden lg:flex w-full items-center justify-between mt-0 mb-2 px-2">
                      <Typography variant="h2" size="lg" weight="bold" className="text-left text-2xl lg:text-3xl">
                        Interview Overview
                      </Typography>
                      <Flex align="center" gap={2}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2 md:p-3 bg-white text-black hover:bg-emerald-700 hover:text-white"
                          onClick={async () => {
                            if (!selectedInterviewId) return;
                            const token = localStorage.getItem('token') || '';
                            const newQ = {
                              interviewId: selectedInterviewId,
                              prompt: 'New Question',
                              competency: 'Team Building',
                              time: '10 Min',
                              level: 'Pending',
                            };
                            try {
                              await createInterviewQuestion(newQ, token);
                              await fetchAndSetQuestions(selectedInterviewId);
                              // Add notification for new interview question
                              addNotification({
                                type: 'interview',
                                title: 'New Interview Question Created',
                                message: `Question "${newQ.prompt.substring(0, 50)}..." has been added`,
                                icon: '📝'
                              });
                            } catch {}
                          }}
                        >
                          <Plus className="w-4 h-4 md:w-5 md:h-5" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-2 md:p-3 bg-white text-black hover:bg-emerald-700 hover:text-white">
                              <MoreHorizontal className="w-4 h-4 md:w-5 md:h-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-red-600" onClick={() => setQuestions([])}>
                              <Typography variant="span" size="sm">Delete All Questions</Typography>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </Flex>
                    </div>
                  </div>

                  {/* Right Side: Reserved Space (Notification panel removed) */}
                  <div className="hidden lg:block w-72 xl:w-80 2xl:w-[355px] border-l border-gray-200 pl-1 xl:pl-1 2xl:pl-2">
                    <motion.div
                      initial={{ opacity: 0, y: 32, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
                      whileHover={{
                        y: -4,
                        scale: 1.02,
                        transition: { duration: 0.2, ease: 'easeOut' }
                      }}
                    >
                      <Card className="rounded-2xl shadow-md w-full min-h-[20px] h-auto pb-3">
                        <CardContent className="px-1 pt-0 pb-1">
                          <Stack spacing={2}>
                          {/* Item 1: PRO mode activated */}
                          <Button
                            variant="ghost"
                            className="w-full justify-start pl-1 pr-2 sm:pl-2 py-2 h-14 border rounded-xl hover:bg-gray-50 text-left"
                            onClick={() => handleHighlightClick('PRO mode activated', 'All premium features are now available for your account')}
                          >
                            <Flex align="center" className="w-full gap-3 sm:gap-4 items-center overflow-hidden">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <Eye className="w-5 h-5 text-gray-700" />
                  </div>
                              <Stack spacing={0} className="flex-1 min-w-0 text-left">
                                <Typography variant="p" size="sm" weight="semibold" className="text-[13px] sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap block">
                                  PRO mode activated
                                </Typography>
                                <Typography variant="p" size="xs" color="muted" className="text-[12px] text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap block">
                                  All premium features.....
                                </Typography>
                              </Stack>
                              <ArrowRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            </Flex>
                          </Button>

                          {/* Item 2: New candidate added (emphasis) */}
                          <Button
                            variant="ghost"
                            className="w-full justify-start pl-1 pr-2 sm:pl-2 py-2 h-14 border rounded-xl hover:bg-gray-50 text-left"
                            onClick={() => handleHighlightClick('New candidate added', 'Alex Johnson has entered the Technical Review phase')}
                          >
                            <Flex align="center" className="w-full gap-3 sm:gap-4 items-center overflow-hidden">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <UserPlus className="w-5 h-5 text-gray-700" />
                  </div>
                              <Stack spacing={0} className="flex-1 min-w-0 text-left">
                                <Typography variant="p" size="sm" weight="semibold" className="text-[13px] sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap block">
                                  New candidate added
                                </Typography>
                                <Typography variant="p" size="xs" color="muted" className="text-[12px] text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap block">
                                  Alex Johnson has entered...
                                </Typography>
                              </Stack>
                              <ArrowRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            </Flex>
                          </Button>

                          {/* Item 3: Phase deadline soon */}
                          <Button
                            variant="ghost"
                            className="w-full justify-start pl-1 pr-2 sm:pl-2 py-2 h-14 border rounded-xl hover:bg-gray-50 text-left"
                            onClick={() => handleHighlightClick('Phase deadline soon', 'Initial Review Phase 3 ends in 2 days')}
                          >
                             <Flex align="center" className="w-full gap-3 sm:gap-4 items-center overflow-hidden">
                               <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <Bell className="w-5 h-5 text-gray-700" />
                              </div>
                              <Stack spacing={0} className="flex-1 min-w-0 text-left">
                                <Typography variant="p" size="sm" weight="semibold" className="text-[13px] sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap block">
                                  Phase deadline soon
                                </Typography>
                                <Typography variant="p" size="xs" color="muted" className="text-[12px] text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap block">
                                  Initial Review Phase 3 ends..
                                </Typography>
                              </Stack>
                              <ArrowRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            </Flex>
                          </Button>
                          {/* Divider and actions */}
                          <Separator className="my-2 sm:my-3 bg-gray-100 h-[1px]" />
                            <Flex align="center" justify="between" className="w-full gap-2">
                            <Button
                              size="lg"
                              className="text-[10px] sm:text-xs md:text-sm lg:text-sm xl:text-base 2xl:text-xs px-2 sm:px-3 md:px-4 lg:px-4 xl:px-5 2xl:px-2 py-1 sm:py-1.5 md:py-2 lg:py-2 xl:py-2.5 2xl:py-1 h-6 sm:h-7 md:h-8 lg:h-8 xl:h-9 2xl:h-6 bg-black text-white hover:bg-emerald-700 hover:text-white font-medium ml-2 sm:ml-3 mr-2 sm:mr-2 md:mr-3 lg:mr-4 xl:mr-5"
                              onClick={() => {
                                setIsNotificationOpen(true);
                                setShowAllNotifications(true);
                              }}
                            >
                              <Typography variant="span" size="xs" className="text-white">See all notifications</Typography>
                              <ArrowRight className="ml-2 w-3 h-3 text-white" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-[10px] sm:text-xs md:text-sm lg:text-sm xl:text-base 2xl:text-xs px-2 sm:px-3 md:px-4 lg:px-4 xl:px-5 2xl:px-2 py-1 sm:py-1.5 md:py-2 lg:py-2 xl:py-2.5 2xl:py-1 h-6 sm:h-7 md:h-8 lg:h-8 xl:h-9 2xl:h-6 bg-gray-200 hover:bg-emerald-700 font-medium mr-2 sm:mr-2 md:mr-3 lg:mr-4 xl:mr-5"
                              onClick={() => setNotesOpen(true)}
                            >
                              <FileText className="w-3.5 h-3.5" />
                              Notes
                            </Button>
                          </Flex>
                          </Stack>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>

                  {/* Mobile & Tablet: Notification panel removed */}
                </motion.div>

                {/* InterviewOverview Components with Right Side Cards */}
                <div className="w-full max-w-none px-0 ml-0 lg:ml-0 mt-2 ">
                  {/* Mobile/tablet header for Interview Overview (placed above Previous Background). Hidden on lg+. */}
                  <Flex align="center" justify="between" className="w-full gap-2 mb-2 pl-0 pr-2 flex lg:hidden">
                    <Typography variant="h2" size="lg" weight="bold" className="text-left text-xl md:text-2xl">
                      Interview Overview
                    </Typography>
                    <Flex align="center" gap={2} className="ml-auto">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 md:p-3 bg-white text-black hover:bg-emerald-700 hover:text-white"
                        onClick={() => {
                          setQuestions(prev => [
                            ...prev,
                            {
                              prompt: 'New Question',
                              competency: 'Team Building',
                              time: '10 Min',
                              level: 'Pending',
                              editing: true,
                              deleted: false,
                              answer: '',
                              answering: false,
                            },
                          ]);
                        }}
                      >
                        <Plus className="w-4 h-4 md:w-5 md:h-5" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="p-2 md:p-3 bg-white text-black hover:bg-emerald-700 hover:text-white">
                            <MoreHorizontal className="w-4 h-4 md:w-5 md:h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-red-600" onClick={async () => {
                            if (!selectedInterviewId) return;
                            const token = localStorage.getItem('token') || '';
                            for (const q of questions) {
                              if (q._id) await deleteInterviewQuestion(q._id, token);
                            }
                            await fetchAndSetQuestions(selectedInterviewId);
                          }}>
                            <Typography variant="span" size="sm">Delete All Questions</Typography>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </Flex>
                  </Flex>
                  <div className="flex flex-col lg:flex-row gap-4 lg:min-h-0 lg:items-stretch">
                    {/* Left Side: InterviewOverview */}
                    <div className="w-full lg:flex-1 lg:w-auto lg:h-full lg:min-h-0">

                      {/* Previous Background Card with fixed height and scrollable questions area */}
                      <Card className="w-full rounded-2xl shadow hover:shadow-md transition-all duration-200 hover:scale-[1.01] flex flex-col h-[700px] md:h-[453px] min-h-0 sm:h-full">
                        <CardHeader className="pl-4 pr-4 pb-0">
                          <Typography variant="h2" size="2xl" weight="medium" className="text-lg md:text-xl">Previous Background</Typography>
                        </CardHeader>
                        <CardContent className="-mt-4 pb-0 px-4 flex flex-col flex-1 min-h-0">
                          {/* Only one question visible, rest scrollable, scrollbar hidden */}
                          <div className="flex-1 min-h-0">
                            {questionsLoading ? (
                              <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-700"></div>
                              </div>
                            ) : questions.length > 0 && (
                              <Card className="w-full bg-white rounded-lg border shadow-sm p-2 sm:p-3 md:p-4 flex flex-col sm:flex-row items-start gap-2 sm:gap-3 mb-2 transition-all duration-200">
                                <Badge className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-gray-200 text-black rounded-full flex items-center justify-center font-semibold flex-shrink-0 text-xs sm:text-sm md:text-base">
                                  {currentQuestionIdx + 1}
                                </Badge>
                                <div className="flex-1 min-w-0">
                                  <Typography variant="h4" size="lg" weight="medium" className="text-xs sm:text-sm md:text-base lg:text-lg leading-snug break-words">
                                    {questions[currentQuestionIdx].prompt}
                                  </Typography>
                                  <Typography variant="p" size="xs" color="muted" className="text-gray-500 text-[10px] sm:text-xs md:text-sm mt-1">
                                    {questions[currentQuestionIdx].time} • {questions[currentQuestionIdx].competency} • {questions[currentQuestionIdx].level}
                                  </Typography>
                                </div>
                                <Flex align="center" gap={1} className="flex-shrink-0">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:bg-emerald-700 hover:text-white"
                                    disabled={currentQuestionIdx === 0}
                                    onClick={() => {
                                      if (currentQuestionIdx > 0) {
                                        setCurrentQuestionIdx(idx => idx - 1);
                                      }
                                    }}
                                  >
                                    <ChevronUp className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:bg-emerald-700 hover:text-white"
                                    onClick={() => {
                                      handleOpenEditQuestion(questions[currentQuestionIdx]);
                                    }}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:bg-emerald-700 hover:text-white"
                                    onClick={async () => {
                                      if (!selectedInterviewId) return;
                                      const token = localStorage.getItem('token') || '';
                                      const q = questions[currentQuestionIdx];
                                      if (q._id) await deleteInterviewQuestion(q._id, token);
                                      await fetchAndSetQuestions(selectedInterviewId);
                                      setCurrentQuestionIdx(idx => Math.max(0, idx - 1));
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:bg-emerald-700 hover:text-white"
                                    onClick={async () => {
                                      if (!selectedInterviewId) return;
                                      // Duplicate question in backend and UI
                                      const token = localStorage.getItem('token') || '';
                                      const q = questions[currentQuestionIdx];
                                      const newQ = { ...q, prompt: q.prompt + ' (Copy)', interviewId: selectedInterviewId };
                                      delete newQ._id;
                                      await createInterviewQuestion(newQ, token);
                                      await fetchAndSetQuestions(selectedInterviewId);
                                    }}
                                  >
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:bg-emerald-700 hover:text-white"
                                    disabled={currentQuestionIdx === questions.length - 1}
                                    onClick={() => {
                                      if (currentQuestionIdx < questions.length - 1) {
                                        setCurrentQuestionIdx(idx => idx + 1);
                                      }
                                    }}
                                  >
                                    <ChevronDown className="w-4 h-4" />
                                  </Button>
                                </Flex>
                              </Card>
                            )}
                          </div>

                          {/* Editing Block */}
                          <Card ref={editingBlockRef} className="bg-gray-100 rounded-xl py-1 px-1 sm:py-1.5 sm:px-2 md:py-2 md:px-3 lg:py-2 lg:px-3 xl:py-2 xl:px-4 2xl:py-1 2xl:px-2">
                            <CardContent className="py-0.5 px-1 sm:px-2 md:px-3 md:py-1">
                                  <Flex align="start" gap={2} className="mb-1">
                                <Badge className="w-7 h-7 bg-white text-black rounded-full flex items-center justify-center font-semibold">2</Badge>
                                <Typography variant="h3" size="lg" weight="medium">Editing</Typography>
                                  </Flex>

                              <Grid cols={1} gap={2} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-start">
                                <div className="md:col-span-2">
                                  <Label className="text-sm mb-1">Prompt</Label>
                                  <Input ref={editPromptInputRef} className="w-full h-9 bg-white" placeholder="How are JavaScript and........" />
                                </div>
                                <div>
                                  <Label className="text-sm mb-1">Competencies</Label>
                                  <Select defaultValue="Teambuilding">
                                    <SelectTrigger className="w-full h-8 bg-white">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Teambuilding">Teambuilding</SelectItem>
                                          <SelectItem value="Technical Skills">Technical Skills</SelectItem>
                                          <SelectItem value="Communication">Communication</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                <div>
                                  <Label className="text-sm mb-1">Time</Label>
                                  <Flex align="center" gap={2}>
                                      <Input className="w-16 sm:w-20 h-9 bg-white text-center" defaultValue="10" />
                                    <Typography variant="span" size="xs" color="muted" className="text-gray-500">min</Typography>
                                  </Flex>
                                </div>
                                <div>
                                  <Label className="text-sm mb-1">Level</Label>
                                  <Select defaultValue="Beginner">
                                    <SelectTrigger className="w-full h-8 bg-white">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Beginner">Beginner</SelectItem>
                                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                                          <SelectItem value="Advanced">Advanced</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                              </Grid>

                              <Typography variant="h4" size="sm" weight="bold" className="mt-0.5 mb-1">Guidelines</Typography>
                              <Card className="bg-white rounded-xl overflow-hidden py-1 px-1 sm:py-1.5 sm:px-2 md:py-2 md:px-3">
                                <CardContent className="p-1 sm:p-1 md:p-1.5">
                                  <Typography variant="p" size="xs" weight="bold" className="mb-0.5">Some of the key features of design are:</Typography>
                                  <div className="max-h-[48px] overflow-y-auto pr-1 text-[10px] sm:max-h-[64px] sm:text-xs md:max-h-[76px] lg:max-h-[88px] xl:max-h-[96px] scrollbar-none">
                                    <ul className="list-disc pl-3 sm:pl-4 leading-snug text-gray-700 space-y-0">
                                      <li>A line is a visual trace created by any writing tool or the meeting point of two shapes</li>
                                      <li>Size refers to how much visual space one element occupies compared to another</li>
                                    </ul>
                                  </div>
                                </CardContent>
                              </Card>
                                  
                              <Flex gap={2} className="mt-2 sm:mt-3 md:mt-4 lg:mt-6 flex-col md:flex-row">
                                {/* Insert From Library Button and Modal */}
                                <Dialog open={libraryOpen} onOpenChange={setLibraryOpen}>
                                  <DialogTrigger asChild>
                                    <Button size="sm" variant="outline" className="w-full md:flex-1 bg-white hover:bg-emerald-700 hover:text-white">Insert From Library</Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-lg w-full">
                                    <DialogHeader>
                                      <DialogTitle>Template Library</DialogTitle>
                                    </DialogHeader>
                                    <Input
                                      placeholder="Search or filter by category..."
                                      className="mb-2"
                                      value={librarySearch}
                                      onChange={e => setLibrarySearch(e.target.value)}
                                    />
                                    <ScrollArea className="h-[300px] pr-2">
                                      <div className="grid gap-3">
                                        {predefinedTemplates
                                          .filter(t =>
                                            t.title.toLowerCase().includes(librarySearch.toLowerCase()) ||
                                            t.category.toLowerCase().includes(librarySearch.toLowerCase())
                                          )
                                          .map(template => (
                                            <Card
                                              key={template.id}
                                              className="cursor-pointer hover:border-primary transition-colors"
                                              onClick={async () => {
                                                if (!selectedInterviewId) return;
                                                const token = localStorage.getItem('token') || '';
                                                for (const q of template.questions) {
                                                  await createInterviewQuestion({
                                                    ...q,
                                                    time: q.time + ' Min',
                                                    editing: false,
                                                    deleted: false,
                                                    answer: '',
                                                    answering: false,
                                                    interviewId: selectedInterviewId,
                                                  }, token);
                                                }
                                                await fetchAndSetQuestions(selectedInterviewId);
                                                setLibraryOpen(false);
                                              }}
                                            >
                                              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                                                <CardTitle className="text-base">{template.title}</CardTitle>
                                                <Badge>{template.category}</Badge>
                                              </CardHeader>
                                              <CardContent>
                                                <p className="text-xs text-muted-foreground">
                                                  {template.questions.length} questions
                                                </p>
                                              </CardContent>
                                            </Card>
                                          ))}
                                        {predefinedTemplates.filter(t =>
                                          t.title.toLowerCase().includes(librarySearch.toLowerCase()) ||
                                          t.category.toLowerCase().includes(librarySearch.toLowerCase())
                                        ).length === 0 && (
                                          <Typography variant="p" size="sm" className="text-gray-400">No templates found.</Typography>
                                        )}
                                      </div>
                                    </ScrollArea>
                                  </DialogContent>
                                </Dialog>
                                {/* Create New Prompt Button and Modal */}
                                <Dialog open={createPromptOpen} onOpenChange={setCreatePromptOpen}>
                                  <DialogTrigger asChild>
                                    <Button size="sm" className="w-full md:flex-1 bg-black text-white hover:bg-emerald-700">Create New Prompt</Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-sm w-full">
                                    <DialogHeader>
                                      <DialogTitle>Create New Prompt</DialogTitle>
                                    </DialogHeader>
                                    <Grid cols={1} gap={2} className="grid grid-cols-1 gap-2">
                                      <div>
                                        <Label className="text-sm mb-1">Prompt</Label>
                                        <Input
                                          className="w-full h-8 bg-white"
                                          placeholder="Type the question..."
                                          value={newPrompt}
                                          onChange={e => setNewPrompt(e.target.value)}
                                          ref={createPromptInputRef}
                                        />
                                      </div>
                                      <div>
                                        <Label className="text-sm mb-1">Competency</Label>
                                        <Select value={newCompetency} onValueChange={setNewCompetency}>
                                          <SelectTrigger className="w-full h-8 bg-white">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="Team Building">Team Building</SelectItem>
                                            <SelectItem value="Technical Skills">Technical Skills</SelectItem>
                                            <SelectItem value="Communication">Communication</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <Label className="text-sm mb-1">Time</Label>
                                        <Flex align="center" gap={2}>
                                          <Input
                                            className="w-16 h-8 bg-white"
                                            value={newTime}
                                            onChange={e => setNewTime(e.target.value.replace(/[^0-9]/g, ""))}
                                          />
                                          <Typography variant="span" size="xs" color="muted">min</Typography>
                                        </Flex>
                                      </div>
                                      <div>
                                        <Label className="text-sm mb-1">Level</Label>
                                        <Select value={newLevel} onValueChange={setNewLevel}>
                                          <SelectTrigger className="w-full h-8 bg-white">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="Beginner">Beginner</SelectItem>
                                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                                            <SelectItem value="Advanced">Advanced</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </Grid>
                                    <DialogFooter>
                                      <DialogClose asChild>
                                        <Button
                                          className="bg-black text-white hover:bg-emerald-700 hover:text-white"
                                          onClick={() => {
                                            if (!newPrompt.trim() || !newCompetency || !newTime.trim() || !newLevel) return;
                                            const minutes = newTime.replace(/[^0-9]/g, "") || "10";
                                            const newQuestion = {
                                              prompt: newPrompt.trim(),
                                              competency: newCompetency,
                                              time: `${minutes} Min`,
                                              level: newLevel,
                                              editing: false,
                                              deleted: false,
                                              answer: "",
                                              answering: false,
                                            };
                                            // Save to backend
                                            if (!selectedInterviewId) return;
                                            const token = localStorage.getItem('token') || '';
                                            createInterviewQuestion({ ...newQuestion, interviewId: selectedInterviewId }, token).then(async () => {
                                              await fetchAndSetQuestions(selectedInterviewId);
                                              // Add notification for new interview question
                                              addNotification({
                                                type: 'interview',
                                                title: 'New Interview Question Created',
                                                message: `Question "${newQuestion.prompt.substring(0, 50)}..." has been added`,
                                                icon: '📝'
                                              });
                                            });
                                            setNewPrompt("");
                                            setNewCompetency("Team Building");
                                            setNewTime("10");
                                            setNewLevel("Pending");
                                            setCreatePromptOpen(false);
                                          }}
                                          disabled={!newPrompt.trim() || !newCompetency || !newTime.trim() || !newLevel}
                                        >
                                          <Typography variant="span" size="sm" className="text-white">Save</Typography>
                                        </Button>
                                      </DialogClose>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </Flex>
                            </CardContent>
                          </Card>
                          </CardContent>
                        </Card>
                    </div>

                    {/* Right Side: Assigned Interviewers and Section Panel */}
                    <div className="w-full lg:w-72 xl:w-80 2xl:w-[355px] flex flex-col gap-4 lg:h-full lg:min-h-0 lg:ml-2">
                      {/* Assigned Interviewers Card */}
                      <motion.div
                        initial={{ opacity: 0, y: 32, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
                        whileHover={{
                          y: -4,
                          scale: 1.02,
                          transition: { duration: 0.2, ease: 'easeOut' }
                        }}
                        className="lg:flex-[3] lg:min-h-0 lg:h-0"
                      >
                        <Card className="rounded-2xl shadow-md px-3 py-2 md:px-3 md:py-2 flex flex-col justify-center min-h-[120px] w-full">
                          <CardHeader className="p-0 mb-1">
                            <Flex align="center" justify="between" className="w-full">
                              <Typography variant="h2" size="2xl" weight="medium" className="text-lg md:text-xl lg:text-xl">
                                Assigned Interviewers
                              </Typography>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-2 rounded-full hover:bg-emerald-700 focus:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-600"
                                aria-label="View all interviewers"
                                onClick={() => setShowInterviewersModal(true)}
                              >
                                <ArrowRight className="w-5 h-5 text-gray-700" />
                              </Button>
                            </Flex>
                            <Typography variant="p" size="xs" color="muted" className="text-gray-500 text-[11px] md:text-xs mt-0.5">
                              Interview panel for this position
                            </Typography>
                          </CardHeader>
                          <CardContent className="p-0">
                            <Flex align="center" className="w-full">
                              <Flex align="center" className="-space-x-2">
                                {interviewers.length === 0 ? (
                                  <Typography variant="span" size="sm" className="font-medium text-gray-500">No interviewers assigned yet.</Typography>
                                ) : (
                                  <>
                                    {interviewers.slice(0, 3).map((user, idx) => (
                                      <Avatar key={user._id || idx} className="w-7 h-7 border-2 border-white">
                                        <AvatarImage src={user.avatar || user.img} alt={user.name} />
                                        <AvatarFallback>{user.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                                      </Avatar>
                                    ))}
                                    {interviewers.length > 3 && (
                                      <Badge className="bg-emerald-700 text-white text-[11px] md:text-xs font-medium w-7 h-7 flex items-center justify-center rounded-full">
                                        +{interviewers.length - 3}
                                      </Badge>
                                    )}
                                  </>
                                )}
                              </Flex>
                            </Flex>
                          </CardContent>
                        </Card>
                        {/* Modal for all interviewers */}
                        {/* New Assigned Interviewers Modal with create, edit, delete options */}
                        {showInterviewersModal && (
                          <Dialog open={showInterviewersModal} onOpenChange={setShowInterviewersModal}>
                            <DialogContent className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl px-2 sm:px-4 py-4 rounded-xl">
                              <DialogHeader>
                                <DialogTitle className="text-lg sm:text-xl md:text-2xl">Assigned Interviewers</DialogTitle>
                              </DialogHeader>
                              {showCreateInterviewerForm ? (
                                <form
                                  className="flex flex-col gap-4 mt-2"
                                  onSubmit={async e => {
                                    e.preventDefault();
                                    if (!newInterviewerName.trim()) {
                                      alert('Interviewer name is required.');
                                      return;
                                    }
                                    if (!newInterviewerPhoto || typeof newInterviewerPhoto !== 'string' || newInterviewerPhoto.trim() === '') {
                                      alert('Interviewer avatar is required.');
                                      return;
                                    }
                                    // Validate avatar image size (base64 string length)
                                    if (newInterviewerPhoto.length > 1000000) { // ~1MB
                                      alert('Avatar image is too large. Please choose a smaller image (max 1MB).');
                                      return;
                                    }
                                    const token = localStorage.getItem('token');
                                    try {
                                      const payload = {
                                        name: newInterviewerName.trim(),
                                        avatar: newInterviewerPhoto.trim()
                                      };
                                      // Debug: log payload before sending
                                      console.log('Sending interviewer:', JSON.stringify(payload));
                                      const res = await fetch('http://localhost:5000/api/assigned-interviewers', {
                                        method: 'POST',
                                        headers: {
                                          'Content-Type': 'application/json',
                                          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                                        },
                                        body: JSON.stringify(payload)
                                      });
                                      const data = await res.json();
                                      if (data && data._id) {
                                        setInterviewers(prev => [...prev, data]);
                                      }
                                    } catch (err) {
                                      alert('Failed to add interviewer. Please try again.');
                                    }
                                    setNewInterviewerName("");
                                    setNewInterviewerPhoto("");
                                    setShowCreateInterviewerForm(false);
                                  }}
                                >
                                  <Label htmlFor="interviewer-name" className="text-xs font-medium">Name</Label>
                                  <Input
                                    id="interviewer-name"
                                    type="text"
                                    value={newInterviewerName}
                                    onChange={e => setNewInterviewerName(e.target.value)}
                                    placeholder="Enter interviewer name"
                                    className="text-sm"
                                    required
                                  />
                                  <Label htmlFor="interviewer-photo" className="text-xs font-medium">Profile Photo</Label>
                                  <Input
                                    id="interviewer-photo"
                                    type="file"
                                    accept="image/*"
                                    className="text-sm"
                                    onChange={e => handlePhotoUpload(e, setNewInterviewerPhoto)}
                                  />
                                  {newInterviewerPhoto && (
                                    <Avatar className="w-14 h-14 mx-auto">
                                      <AvatarImage src={newInterviewerPhoto} alt="Preview" />
                                      <AvatarFallback>IMG</AvatarFallback>
                                    </Avatar>
                                  )}
                                  <Flex gap={2} className="mt-2">
                                    <Button type="submit" size="sm" className="bg-black text-white hover:bg-emerald-700 w-full sm:w-auto">Create</Button>
                                    <Button type="button" size="sm" variant="outline" className="w-full sm:w-auto" onClick={() => setShowCreateInterviewerForm(false)}>Cancel</Button>
                                  </Flex>
                                </form>
                              ) : editInterviewerId ? (
                                <form
                                  className="flex flex-col gap-4 mt-2"
                                  onSubmit={async e => {
                                    e.preventDefault();
                                    const token = localStorage.getItem('token');
                                    try {
                                      const res = await fetch(`http://localhost:5000/api/assigned-interviewers/${editInterviewerId}`, {
                                          method: 'PUT',
                                          headers: {
                                            'Content-Type': 'application/json',
                                            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                                          },
                                          body: JSON.stringify({
                                            name: editInterviewerName,
                                            avatar: editInterviewerPhoto
                                          })
                                        });
                                      const data = await res.json();
                                      if (data && data._id) {
                                        setInterviewers(prev => prev.map(intv => intv._id === editInterviewerId ? data : intv));
                                      }
                                    } catch (err) {
                                      // Optionally show error to user
                                    }
                                    setEditInterviewerId(null);
                                    setEditInterviewerName("");
                                    setEditInterviewerPhoto("");
                                  }}
                                >
                                  <Label htmlFor="edit-interviewer-name" className="text-xs font-medium">Name</Label>
                                  <Input
                                    id="edit-interviewer-name"
                                    type="text"
                                    value={editInterviewerName}
                                    onChange={e => setEditInterviewerName(e.target.value)}
                                    placeholder="Edit interviewer name"
                                    className="text-sm"
                                    required
                                  />
                                  <Label htmlFor="edit-interviewer-photo" className="text-xs font-medium">Profile Photo</Label>
                                  <Input
                                    id="edit-interviewer-photo"
                                    type="file"
                                    accept="image/*"
                                    className="text-sm"
                                    onChange={e => handlePhotoUpload(e, setEditInterviewerPhoto)}
                                  />
                                  {editInterviewerPhoto && (
                                    <Avatar className="w-14 h-14 mx-auto">
                                      <AvatarImage src={editInterviewerPhoto} alt="Preview" />
                                      <AvatarFallback>IMG</AvatarFallback>
                                    </Avatar>
                                  )}
                                  <Flex gap={2} className="mt-2">
                                    <Button type="submit" size="sm" className="bg-black text-white hover:bg-emerald-700 w-full sm:w-auto">Save</Button>
                                    <Button type="button" size="sm" variant="outline" className="w-full sm:w-auto" onClick={() => setEditInterviewerId(null)}>Cancel</Button>
                                  </Flex>
                                </form>
                              ) : (
                                <>
                                  <ScrollArea className="max-h-[350px] sm:max-h-[400px] md:max-h-[500px]">
                                    <Stack spacing={2} className="py-2">
                                      {interviewers.length === 0 ? (
                                        <Typography variant="span" size="sm" className="font-medium text-gray-500 text-center">No interviewers assigned yet.</Typography>
                                      ) : (
                                        interviewers.map((user, idx) => (
                                          <Card key={user._id || idx} className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 p-2 mb-2 w-full">
                                            <Avatar className="w-14 h-14 sm:w-10 sm:h-10 border-2 border-white mb-2 sm:mb-0 cursor-pointer" onClick={() => {}}>
                                              <AvatarImage src={user.avatar || user.img} alt={user.name} />
                                              <AvatarFallback>{user.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                                            </Avatar>
                                            <Stack spacing={0} className="flex-1 min-w-0 items-center sm:items-start">
                                              <Typography variant="p" size="sm" weight="medium" className="text-base truncate text-center sm:text-left">{user.name}</Typography>
                                              {user.department && <Typography variant="p" size="xs" color="muted" className="text-xs text-gray-500 truncate text-center sm:text-left">{user.department}</Typography>}
                                            </Stack>
                                            <Flex gap={1} className="w-full sm:w-auto justify-center sm:justify-end mt-2 sm:mt-0">
                                              <Button size="sm" variant="outline" className="text-xs px-2 py-1 w-20 sm:w-auto" aria-label="Edit interviewer" onClick={() => {
                                                setEditInterviewerId(user._id);
                                                setEditInterviewerName(user.name);
                                                setEditInterviewerPhoto(user.avatar || "");
                                              }}>
                                                Edit
                                              </Button>
                                              <Button size="sm" variant="destructive" className="text-xs px-2 py-1 w-20 sm:w-auto" aria-label="Delete interviewer" onClick={async () => {
                                                const token = localStorage.getItem('token');
                                                try {
                                                  await fetch(`http://localhost:5000/api/assigned-interviewers/${user._id}`, {
                                                    method: 'DELETE',
                                                    headers: {
                                                      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                                                    }
                                                  });
                                                  setInterviewers(prev => prev.filter(intv => intv._id !== user._id));
                                                } catch (err) {
                                                  // Optionally show error to user
                                                }
                                              }}>
                                                Delete
                                              </Button>
                                            </Flex>
                                          </Card>
                                        ))
                                      )}
                                    </Stack>
                                  </ScrollArea>
                                  <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-2">
                                    <Button size="sm" className="bg-black text-white hover:bg-emerald-700 w-full sm:w-auto" aria-label="Create interviewer" onClick={() => setShowCreateInterviewerForm(true)}>
                                      Create Interviewer
                                    </Button>
                                    <DialogClose asChild>
                                      <Button variant="outline" className="hover:bg-emerald-700 w-full sm:w-auto">Close</Button>
                                    </DialogClose>
                                  </DialogFooter>
                                </>
                              )}
                            </DialogContent>
                          </Dialog>
                        )}
                      </motion.div>

                      {/* Section Panel Card */}
                      <motion.div
                        initial={{ opacity: 0, y: 32, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.18, ease: 'easeOut' }}
                        whileHover={{
                          y: -4,
                          scale: 1.02,
                          transition: { duration: 0.2, ease: 'easeOut' }
                        }}
                        className="flex flex-col gap-0 lg:flex-[7] lg:min-h-0 lg:h-0"
                      >
                        <Card className="rounded-2xl shadow hover:shadow-md transition-all duration-200 flex flex-col gap-2 md:gap-3 mt-0 h-[305px] w-full lg:max-w-[355px] py-2 md:py-3">
                          <CardHeader className="pt-0 pb-0 px-3 md:px-4 flex-shrink-0">
                            <Flex align="center" justify="between" className="gap-2">
                              <Typography variant="h2" size="2xl" weight="medium" className="text-lg md:text-xl lg:text-xl">Section</Typography>
                              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    className="bg-black text-white hover:bg-emerald-700 hover:text-white rounded-xl px-2 py-1 text-sm font-medium transition-colors"
                                  >
                                    <Typography variant="span" size="sm" className="hidden sm:inline md:inline text-white">Add Section</Typography>
                                    <span className="inline-flex sm:hidden md:hidden text-white"><Plus className="w-4 h-4" /></span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="p-4 sm:p-6 max-w-sm sm:max-w-md w-full mx-4">
                                  <DialogHeader className="space-y-2">
                                    <DialogTitle className="text-lg font-semibold">Add New Section</DialogTitle>
                                    <DialogDescription className="text-sm text-gray-600">
                                      Create a new interview section with details and timing.
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  <div className="space-y-4 mt-4">
                                    {/* Section Name */}
                                    <div className="space-y-2">
                                      <Label htmlFor="section-name" className="text-sm font-medium">
                                        Section Name *
                                      </Label>
                                      <Input
                                        id="section-name"
                                        className="w-full"
                                        placeholder="e.g., Technical Assessment"
                                        value={newSection}
                                        onChange={e => setNewSection(e.target.value)}
                                        autoFocus
                                      />
                                    </div>

                                    {/* Duration and Question Count Row */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      <div className="space-y-2">
                                        <Label htmlFor="duration" className="text-sm font-medium">
                                          Duration (minutes)
                                        </Label>
                                        <Input
                                          id="duration"
                                          type="number"
                                          min="0"
                                          max="180"
                                          className="w-full"
                                          placeholder="30"
                                          value={newSectionDuration || ''}
                                          onChange={e => setNewSectionDuration(parseInt(e.target.value) || 0)}
                                        />
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <Label htmlFor="question-count" className="text-sm font-medium">
                                          Questions
                                        </Label>
                                        <Input
                                          id="question-count"
                                          type="number"
                                          min="0"
                                          max="50"
                                          className="w-full"
                                          placeholder="5"
                                          value={newSectionQuestionCount || ''}
                                          onChange={e => setNewSectionQuestionCount(parseInt(e.target.value) || 0)}
                                        />
                                      </div>
                                    </div>

                                    {/* Custom Details (Optional) */}
                                    <div className="space-y-2">
                                      <Label htmlFor="details" className="text-sm font-medium">
                                        Custom Details <span className="text-gray-400">(optional)</span>
                                      </Label>
                                      <Input
                                        id="details"
                                        className="w-full"
                                        placeholder="Leave empty to auto-generate from duration and questions"
                                        value={newSectionDetails}
                                        onChange={e => setNewSectionDetails(e.target.value)}
                                      />
                                    </div>

                                    {/* Preview */}
                                    {(newSection.trim() || newSectionDuration > 0 || newSectionQuestionCount > 0) && (
                                      <div className="bg-gray-50 rounded-lg p-3 border">
                                        <Label className="text-xs font-medium text-gray-600 mb-1 block">
                                          Preview
                                        </Label>
                                        <div className="space-y-1">
                                          <Typography variant="p" size="sm" weight="medium" className="text-gray-900">
                                            {newSection.trim() || 'Section Name'}
                                          </Typography>
                                          <Typography variant="p" size="xs" color="muted" className="text-gray-500">
                                            {newSectionDetails.trim() || `${newSectionDuration}m • ${newSectionQuestionCount} Questions`}
                                          </Typography>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="w-full sm:flex-1 order-2 sm:order-1"
                                      onClick={() => {
                                        setAddDialogOpen(false);
                                        setNewSection("");
                                        setNewSectionDetails("");
                                        setNewSectionDuration(0);
                                        setNewSectionQuestionCount(0);
                                      }}
                                      disabled={creating}
                                    >
                                      <Typography variant="span" size="sm">Cancel</Typography>
                                    </Button>
                                    <Button
                                      size="sm"
                                      className="w-full sm:flex-1 bg-black text-white hover:bg-emerald-700 font-medium order-1 sm:order-2 disabled:opacity-50"
                                      onClick={handleCreateSection}
                                      disabled={!newSection.trim() || creating}
                                    >
                                      {creating ? (
                                        <div className="flex items-center gap-2">
                                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                          <Typography variant="span" size="sm" className="text-white">Creating...</Typography>
                                        </div>
                                      ) : (
                                        <Typography variant="span" size="sm" className="text-white">Create Section</Typography>
                                      )}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </Flex>
                          </CardHeader>
                           <CardContent className="pt-0 pb-1 md:pb-2 w-full px-3 md:px-4 flex-grow overflow-y-auto scrollbar-none">
                            <Stack spacing={1} className="flex flex-col gap-1 w-full">
                              {sectionsLoading ? (
                                <div className="flex items-center justify-center py-4">
                                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-700"></div>
                                </div>
                              ) : sections.length === 0 ? (
                                <div className="text-center py-4 text-gray-500 text-xs">
                                  No sections available. Create your first section!
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 gap-1 w-full">
                                  {sections.map((section: Section, idx: number) => (
                                    <motion.div
                                      key={section._id || idx}
                                      initial={{ opacity: 0, y: 5 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.15, delay: idx * 0.03 }}
                                      className="w-full"
                                    >
                                      <Card className="bg-white rounded-md border hover:shadow-sm transition-all duration-200 hover:scale-[1.005] w-full h-[61px] pt-1 group">
                                        <CardContent className="px-3 py-2">
                                          <div className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                              <h4 className="text-sm font-medium text-gray-900 truncate mb-0.5">
                                                {section.name}
                                              </h4>
                                            </div>
                                            <DropdownMenu>
                                              <DropdownMenuTrigger asChild>
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className="text-gray-400 hover:bg-gray-100 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-200 w-5 h-5 flex-shrink-0"
                                                  aria-label="Section actions"
                                                >
                                                  <MoreHorizontal className="w-3 h-3" />
                                                </Button>
                                              </DropdownMenuTrigger>
                                              <DropdownMenuContent align="end" className="w-28">
                                                <DropdownMenuItem 
                                                  className="px-2 py-1.5 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer"
                                                  onClick={() => handleEditSection(section)}
                                                >
                                                  <Edit className="w-3 h-3 mr-1.5" />
                                                  Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                  className="px-2 py-1.5 text-xs text-red-600 hover:bg-red-50 cursor-pointer"
                                                  onClick={() => handleDeleteSection(section._id || section.id, idx)}
                                                >
                                                  <Trash2 className="w-3 h-3 mr-1.5" />
                                                  Delete
                                                </DropdownMenuItem>
                                              </DropdownMenuContent>
                                            </DropdownMenu>
                                          </div>
                                              <div className="text-xs text-gray-500 leading-tight">
                                                {section.details}
                                              </div>
                                        </CardContent>
                                      </Card>
                                    </motion.div>
                                  ))}
                                </div>
                              )}
                            </Stack>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      {/* Modal for viewing candidates by stage */}
      <Dialog open={!!viewCandidatesStage} onOpenChange={() => setViewCandidatesStage(null)}>
        <DialogContent className="max-w-lg w-full bg-gray-50">
          <DialogHeader>
            <DialogTitle>Candidates in {viewCandidatesStage}</DialogTitle>
            <DialogDescription>
              Only candidates whose interview stage is <b>{viewCandidatesStage}</b> are shown below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {viewCandidatesStage && getCandidatesByStage(viewCandidatesStage).length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No candidates found for {viewCandidatesStage}</div>
            ) : viewCandidatesStage && getCandidatesByStage(viewCandidatesStage).map((candidate: Candidate) => (
              <Card key={candidate._id} className="p-3 bg-white rounded-lg border">
                <CardContent className="p-0 flex items-center gap-3">
                  <Avatar className="w-8 h-8"><AvatarImage src={candidate.avatar} /><AvatarFallback>{candidate.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback></Avatar>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{candidate.name}</div>
                    <div className="text-xs text-gray-500">{candidate.department}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewCandidatesStage(null)} className="w-full">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Highlights detail dialog */}
      <Dialog open={highlightOpen} onOpenChange={setHighlightOpen}>
        <DialogContent className="max-w-xs w-full sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{highlightTitle}</DialogTitle>
          </DialogHeader>
          <Typography variant="p" size="sm" className="text-gray-600">
            {highlightDetail}
          </Typography>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="bg-black text-white hover:bg-emerald-700">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Responsive Notification Sidebar using ShadCN */}
      {isNotificationOpen && (
        <>
          {/* Mobile backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 sm:hidden z-40" 
            onClick={() => setIsNotificationOpen(false)}
          />
          
          {/* Notification Panel */}
          <Card className="fixed right-0 top-0 h-full w-full sm:w-48 md:w-44 lg:w-48 xl:w-52 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 shadow-2xl border-l border-slate-200 dark:border-slate-700 border-r-0 border-t-0 border-b-0 rounded-none z-50">
            <CardHeader className="pb-2 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="p-1 rounded-md bg-emerald-100 dark:bg-emerald-900/30">
                    <Bell className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <CardTitle className="text-sm font-semibold text-slate-900 dark:text-slate-100">Notifications</CardTitle>
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="text-xs bg-red-500 hover:bg-red-600 px-1.5 py-0.5">
                      {unreadCount}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {notifications.length > 0 && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-xs px-2 py-1 h-auto text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800"
                        disabled={unreadCount === 0}
                      >
                        <Check className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">Mark all</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllNotifications}
                        className="text-xs px-2 py-1 h-auto text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
                        title="Clear all notifications"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsNotificationOpen(false)}
                    className="h-7 w-7 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0 flex-1 overflow-hidden">
              <ScrollArea className="h-full px-2 sm:px-3 py-1.5">
                <div className="space-y-2 sm:space-y-3">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mb-2"></div>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Loading notifications...</p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
                      <Bell className="w-8 h-8 sm:w-12 sm:h-12 text-slate-300 dark:text-slate-600 mb-2 sm:mb-3" />
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">No notifications</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">You're all caught up!</p>
                    </div>
                  ) : (
                    notifications.map((notification, index) => (
                      <div key={notification.id}>
                        <div
                          className={cn(
                            "relative p-2 sm:p-3 rounded-lg border transition-all duration-200 hover:shadow-sm",
                            notification.read 
                              ? "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-75" 
                              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm"
                          )}
                        >
                          {!notification.read && (
                            <div className="absolute top-2 left-2 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                          )}
                          
                          <div className="flex items-start gap-2 sm:gap-3 ml-2">
                            <div className="flex-shrink-0 mt-0.5">
                              <div className={cn(
                                "p-1 sm:p-1.5 rounded-md",
                                notification.type === 'interview' && "bg-blue-100 dark:bg-blue-900/30",
                                notification.type === 'candidate' && "bg-green-100 dark:bg-green-900/30",
                                notification.type === 'general' && "bg-amber-100 dark:bg-amber-900/30",
                                notification.type === 'interviewer' && "bg-purple-100 dark:bg-purple-900/30"
                              )}>
                                {notification.type === 'interview' && <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-600 dark:text-blue-400" />}
                                {notification.type === 'candidate' && <UserCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600 dark:text-green-400" />}
                                {notification.type === 'general' && <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-600 dark:text-amber-400" />}
                                {notification.type === 'interviewer' && <Bell className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-purple-600 dark:text-purple-400" />}
                              </div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-1 sm:gap-2">
                                <div className="flex-1">
                                  <h4 className={cn(
                                    "text-xs sm:text-sm font-medium leading-tight",
                                    notification.read ? "text-slate-600 dark:text-slate-400" : "text-slate-900 dark:text-slate-100"
                                  )}>
                                    {notification.title}
                                  </h4>
                                  <p className={cn(
                                    "text-xs mt-0.5 sm:mt-1 leading-relaxed line-clamp-2",
                                    notification.read ? "text-slate-500 dark:text-slate-500" : "text-slate-600 dark:text-slate-400"
                                  )}>
                                    {notification.message}
                                  </p>
                                  <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
                                    <span className="text-xs text-slate-400 dark:text-slate-500">
                                      {formatTimeAgo(notification.timestamp)}
                                    </span>
                                    <Badge 
                                      variant="outline" 
                                      className="text-xs px-1.5 py-0.5 h-auto capitalize"
                                    >
                                      {notification.type}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {!notification.read && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => markAsRead(notification.id)}
                                      className="w-5 h-5 sm:w-6 sm:h-6 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                                      title="Mark as read"
                                    >
                                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeNotification(notification.id)}
                                    className="w-5 h-5 sm:w-6 sm:h-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 hover:text-red-600"
                                    title="Remove notification"
                                  >
                                    <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {index < notifications.length - 1 && (
                          <Separator className="my-2 sm:my-3 bg-slate-200 dark:bg-slate-700" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            
            {/* Footer with responsive buttons */}
            <div className="border-t border-slate-200 dark:border-slate-700 p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <div className="flex flex-col gap-1.5">
                <Button 
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 shadow-sm text-xs h-7" 
                  onClick={() => {
                    refreshNotifications();
                    setIsNotificationOpen(false);
                  }}
                >
                  <Bell className="w-2.5 h-2.5 mr-1" />
                  <span className="hidden sm:inline">Refresh & Close</span>
                  <span className="sm:hidden">Refresh</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs h-7"
                  onClick={() => setNotesOpen(true)}
                >
                  <FileText className="w-2.5 h-2.5 mr-1" />
                  Notes
                </Button>
              </div>
            </div>
          </Card>
        </>
      )}
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
          <ScrollArea className="max-h-40">
            <div className="space-y-2">
              {notes.length === 0 ? (
                <div className="text-gray-400 text-xs text-center">No notes yet.</div>
              ) : (
                notes.map((note, idx) => (
                  <Card key={idx} className="bg-gray-100">
                    <CardContent className="p-2 text-xs flex justify-between items-center">
                      <span>{note}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 ml-2 text-xs p-0 h-auto" 
                        onClick={() => setNotes(notes.filter((_, i) => i !== idx))}
                      >
                        Delete
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="text-xs px-3 py-1 border rounded hover:bg-emerald-700">
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
          <Card className="bg-gray-100">
            <CardContent className="p-3 text-xs text-gray-700">
              <strong>Common Topics:</strong>
              <ul className="list-disc pl-5 mt-1">
                <li>How to add a candidate</li>
                <li>How to schedule an interview</li>
                <li>How to use the dashboard</li>
                <li>Contact support</li>
              </ul>
            </CardContent>
          </Card>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="text-xs px-3 py-1 border rounded hover:bg-emerald-700">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Section Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md w-full mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Edit Section</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Update the section details below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-section-name" className="text-sm font-medium">
                Section Name *
              </Label>
              <Input
                id="edit-section-name"
                placeholder="Enter section name"
                value={editSectionName}
                onChange={(e) => setEditSectionName(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-section-details" className="text-sm font-medium">
                Details
              </Label>
              <Textarea
                id="edit-section-details"
                placeholder="Enter section details (optional)"
                value={editSectionDetails}
                onChange={(e) => setEditSectionDetails(e.target.value)}
                rows={3}
                className="w-full resize-none"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-section-duration" className="text-sm font-medium">
                  Duration (minutes)
                </Label>
                <Input
                  id="edit-section-duration"
                  type="number"
                  placeholder="0"
                  value={editSectionDuration || ''}
                  onChange={(e) => setEditSectionDuration(parseInt(e.target.value) || 0)}
                  className="w-full"
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-section-questions" className="text-sm font-medium">
                  Questions Count
                </Label>
                <Input
                  id="edit-section-questions"
                  type="number"
                  placeholder="0"
                  value={editSectionQuestionCount || ''}
                  onChange={(e) => setEditSectionQuestionCount(parseInt(e.target.value) || 0)}
                  className="w-full"
                  min="0"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false);
                setEditingSectionId(null);
                setEditSectionName("");
                setEditSectionDetails("");
                setEditSectionDuration(0);
                setEditSectionQuestionCount(0);
              }}
              className="w-full sm:w-auto"
              disabled={updating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateSection}
              disabled={updating || !editSectionName.trim()}
              className="w-full sm:w-auto bg-black text-white hover:bg-emerald-700"
            >
              {updating ? 'Updating...' : 'Update Section'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Question Dialog */}
      <Dialog open={editQuestionOpen} onOpenChange={setEditQuestionOpen}>
        <DialogContent className="max-w-4xl w-full mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Edit Question</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Update the question details below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Prompt Field - Full width on mobile, spans both columns on larger screens */}
              <div className="lg:col-span-2">
                <Label htmlFor="edit-prompt" className="text-sm font-medium mb-2 block">
                  Question Prompt *
                </Label>
                <Textarea
                  id="edit-prompt"
                  className="w-full min-h-[100px] resize-none bg-white"
                  placeholder="Enter your question here..."
                  value={editQuestionForm.prompt}
                  onChange={(e) => setEditQuestionForm(prev => ({ ...prev, prompt: e.target.value }))}
                />
              </div>
              
              {/* Competency Field */}
              <div>
                <Label htmlFor="edit-competency" className="text-sm font-medium mb-2 block">
                  Competency
                </Label>
                <Select 
                  value={editQuestionForm.competency} 
                  onValueChange={(value) => setEditQuestionForm(prev => ({ ...prev, competency: value }))}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select competency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Team Building">Team Building</SelectItem>
                    <SelectItem value="Technical Skills">Technical Skills</SelectItem>
                    <SelectItem value="Communication">Communication</SelectItem>
                    <SelectItem value="Problem Solving">Problem Solving</SelectItem>
                    <SelectItem value="Leadership">Leadership</SelectItem>
                    <SelectItem value="JavaScript Fundamentals">JavaScript Fundamentals</SelectItem>
                    <SelectItem value="JavaScript Concepts">JavaScript Concepts</SelectItem>
                    <SelectItem value="DOM Manipulation">DOM Manipulation</SelectItem>
                    <SelectItem value="System Architecture">System Architecture</SelectItem>
                    <SelectItem value="System Design">System Design</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Time Field */}
              <div>
                <Label htmlFor="edit-time" className="text-sm font-medium mb-2 block">
                  Time (minutes)
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="edit-time"
                    type="number"
                    className="w-20 text-center bg-white"
                    placeholder="10"
                    value={editQuestionForm.time}
                    onChange={(e) => setEditQuestionForm(prev => ({ ...prev, time: e.target.value }))}
                    min="1"
                    max="60"
                  />
                  <span className="text-sm text-gray-500">min</span>
                </div>
              </div>
              
              {/* Level Field - Full width on mobile */}
              <div className="lg:col-span-2">
                <Label htmlFor="edit-level" className="text-sm font-medium mb-2 block">
                  Difficulty Level
                </Label>
                <Select 
                  value={editQuestionForm.level} 
                  onValueChange={(value) => setEditQuestionForm(prev => ({ ...prev, level: value }))}
                >
                  <SelectTrigger className="w-full lg:w-48 bg-white">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setEditQuestionOpen(false);
                setEditingQuestion(null);
                setEditQuestionForm({
                  prompt: '',
                  competency: 'Team Building',
                  time: '10',
                  level: 'Pending'
                });
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEditedQuestion}
              disabled={!editQuestionForm.prompt.trim()}
              className="w-full sm:w-auto bg-black text-white hover:bg-emerald-700"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
