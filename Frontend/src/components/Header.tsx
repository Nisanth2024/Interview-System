import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Flex } from "@/components/ui/flex";
import { Typography } from "@/components/ui/typography";
import { Stack } from "@/components/ui/stack";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, UserPlus, Bell, Calendar, ArrowRight, ChevronDown, Menu, Plus, Settings } from "lucide-react";
import { SearchModal } from "./SearchModal";
import { AddPersonModal } from "./AddPersonModal";
import { useTranslation } from "@/lib/useTranslation";
import { useProfile } from "@/lib/profileContext";
import { useNotifications } from "@/lib/notificationContext";

interface HeaderProps {
  onMenuClick: () => void
  onNotificationClick: () => void
  onCreateSection?: () => void
  onCreateType?: (type: 'interview' | 'round' | 'prompt' | 'candidate') => void
  onAddPerson?: (person: {
    type: 'candidate' | 'interviewer'
    name: string
    email: string
    phone: string
    location: string
    department: string
    experience: string
    skills: string[]
    avatar?: string
  }) => void
  language: 'en' | 'es' | 'fr'
  setLanguage: (lang: 'en' | 'es' | 'fr') => void
}

export function Header({ onMenuClick, onNotificationClick, onCreateType, onAddPerson, language, setLanguage }: HeaderProps) {
  const { profile, setProfile } = useProfile();
  const navigate = useNavigate();
  const t = useTranslation(language);
  const { unreadCount, clearUserData } = useNotifications();
  // Get today's date in a readable format
  const today = new Date();
  const dateString = today.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  const [searchOpen, setSearchOpen] = useState(false);
  const [addPersonOpen, setAddPersonOpen] = useState(false);
  const [, setAddPersonButtonVisible] = useState(true);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notes, setNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState("");
  const [] = useState<'light' | 'dark'>("light");

  // Handle notification click - call the parent handler
  const handleNotificationClick = () => {
    onNotificationClick();
  };
  return (
    <Card className="flex flex-wrap items-left justify-between p-1 sm:p-1.5 md:p-2 bg-white rounded-t-xl shadow-sm relative">
      <Flex align="center" gap={3} className="space-x-1.5 md:space-x-3 w-full justify-between">
        {/* Left group: menu, logo, actions */}
        <Flex align="center" gap={3}>
          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden p-1 bg-black text-white hover:bg-emerald-700 hover:text-white transition-colors" onClick={onMenuClick}>
            <Menu className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
          {/* Logo */}
          <img src="dashboard logo.png" alt="Logo" className="w-8 h-8 rounded-lg object-contain bg-gray-100" />
          {/* Global Actions - hide some on mobile */}
          <Flex align="center" gap={1} className="space-x-0.5 md:space-x-1.5">
            <Button
              variant="outline"
              size="sm"
              className="p-1 sm:p-1.5 md:p-2 flex items-center gap-1 bg-gray-200 text-black hover:bg-emerald-700 hover:text-white transition-colors text-xs sm:text-sm md:text-base"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="w-4 h-4 md:w-5 md:h-5" />
              <Typography variant="span" size="xs" className="hidden sm:inline text-xs font-medium">{t.search}</Typography>
            </Button>
            <Button 
              variant="outline"
              size="sm" 
              className="hidden sm:flex p-1 sm:p-1.5 md:p-2 bg-gray-200 text-black hover:bg-emerald-700 hover:text-white transition-colors text-xs sm:text-sm md:text-base"
              onClick={() => {
                setAddPersonOpen(true);
                setAddPersonButtonVisible(true);
              }}
            >
              <UserPlus className="w-4 h-4 md:w-5 md:h-5" />
              <Typography variant="span" size="xs" className="hidden sm:inline text-xs font-medium">{t.addPerson}</Typography>
            </Button>
            <Button variant="outline" size="sm" className="hidden sm:flex relative p-1 md:p-1 fullscreen:hidden bg-grey-300 text-black hover:bg-emerald-700 hover:text-white transition-colors items-center gap-1" onClick={handleNotificationClick}>
              <span className="relative flex items-center">
                <Bell className="w-3 h-3 md:w-4 md:h-4" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px] md:text-[10px] font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </span>
              <Typography variant="span" size="xs" className="hidden sm:inline text-xs font-medium">{t.notification}</Typography>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden sm:flex p-1 md:p-1 text-black hover:bg-emerald-700 hover:text-white transition-colors items-center gap-1 w-10 min-w-[40px] justify-center">
                  <div className="flex flex-row space-x-0.5">
                    <div className="w-1 h-1 bg-current rounded-full"></div>
                    <div className="w-1 h-1 bg-current rounded-full"></div>
                    <div className="w-1 h-1 bg-current rounded-full"></div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex items-center gap-2" onClick={() => window.location.assign('/settings')}>
                  <Settings className="w-4 h-4" />
                  <Typography variant="span" size="sm">Settings</Typography>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-default select-none">
                  <span className="font-semibold">{profile.name}</span>
                  <span className="text-xs text-gray-500">{profile.email}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 text-red-600" onClick={() => {
                  setProfile({ name: '', email: '', avatar: '' });
                  localStorage.removeItem('token');
                  // Clear notification data on logout
                  clearUserData();
                  navigate('/');
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-6-3h12m0 0l-3-3m3 3l-3 3" />
                  </svg>
                  <Typography variant="span" size="sm">Logout</Typography>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Flex>
        </Flex>
        {/* Right group: plus button and others */}
        <Flex align="center" gap={2}>
          {/* Language Selector - always visible */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hidden sm:flex items-center space-x-1 p-1 md:p-1 bg-grey-300 text-black hover:bg-emerald-700 hover:text-white transition-colors">
                <Typography variant="span" size="xs" className="text-xs md:text-sm">{language === 'en' ? 'En' : language === 'es' ? 'Es' : 'Fr'}</Typography>
                <ChevronDown className="w-2.5 md:w-2 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setLanguage('en')} className="hover:bg-emerald-700">
                <Typography variant="span" size="sm">English</Typography>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('es')} className="hover:bg-emerald-700">
                <Typography variant="span" size="sm">Spanish</Typography>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('fr')} className="hover:bg-emerald-700">
                <Typography variant="span" size="sm">French</Typography>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Date - always visible */}
          <Flex align="center" gap={1} className="hidden sm:flex items-center space-x-1 text-xs md:text-sm text-gray-600">
            <Calendar className="w-3 h-3 md:w-3 md:h-4" />
            <Typography variant="span" size="xs" className="text-xs md:text-sm text-gray-600">{dateString}</Typography>
          </Flex>
          {/* Create Button with Dropdown - always top right */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="bg-black text-white hover:bg-emerald-700 hover:text-white font-medium text-[10px] sm:text-xs md:text-sm lg:text-sm xl:text-base 2xl:text-xs px-2 sm:px-3 md:px-4 lg:px-4 xl:px-5 2xl:px-2 py-1 sm:py-1.5 md:py-2 lg:py-2 xl:py-2.5 2xl:py-1 h-6 sm:h-7 md:h-8 lg:h-8 xl:h-9 2xl:h-6 rounded-full flex items-center justify-center sm:ml-2"
              >
                <Typography variant="span" size="xs" className="hidden sm:inline text-white">{t.create}</Typography>
                <span className="sm:hidden flex items-center justify-center text-white"><Plus className="w-5 h-5" /></span>
                <ArrowRight className="hidden sm:block w-3 h-3 md:w-4 md:h-4 ml-1 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onCreateType && onCreateType('interview')} className="hover:bg-emerald-700">
                <Typography variant="span" size="sm">{t.newInterview}</Typography>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onCreateType && onCreateType('prompt')} className="hover:bg-emerald-700">
                <Typography variant="span" size="sm">{t.newPrompt}</Typography>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onCreateType && onCreateType('candidate')} className="hover:bg-emerald-700">
                <Typography variant="span" size="sm">{t.newCandidate}</Typography>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Flex>
      </Flex>
      {/* REMOVE this duplicate block below */}
      {/* Top-right controls - responsive positioning */}
      {/* <Flex align="center" gap={3} className="space-x-1.5 md:space-x-3 flex-wrap mt-1 sm:mt-0 md:absolute md:right-0 md:top-2 w-full justify-end">
        ...DUPLICATE CONTENT...
      </Flex> */}
      {/* ...rest of the code... */}
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} language={language} setLanguage={setLanguage} />
      <AddPersonModal 
        open={addPersonOpen} 
        onOpenChange={setAddPersonOpen} 
        onAddPerson={onAddPerson || (() => {})}
      />

      {/* Notes Modal */}
      <Dialog open={notesOpen} onOpenChange={setNotesOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Notes</DialogTitle>
          </DialogHeader>
          <Typography variant="p" size="sm" color="muted" className="mb-2 text-sm text-gray-600">
            Add, view, or edit private notes related to candidates, interview rounds, questions, sections, or interviewers.
          </Typography>
          <Stack spacing={2} className="mb-2">
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
              <Typography variant="span" size="xs">Add Note</Typography>
            </Button>
          </Stack>
          <ScrollArea className="max-h-40">
            <Stack spacing={2}>
              {notes.length === 0 ? (
                <Typography variant="p" size="xs" color="muted" align="center" className="text-gray-400 text-xs text-center">No notes yet.</Typography>
              ) : (
                notes.map((note, idx) => (
                  <Flex key={idx} align="center" justify="between" className="bg-gray-100 rounded p-2 text-xs">
                    <Typography variant="span" size="xs">{note}</Typography>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 ml-2 text-xs p-0 h-auto" 
                      onClick={() => setNotes(notes.filter((_, i) => i !== idx))}
                    >
                      <Typography variant="span" size="xs">Delete</Typography>
                    </Button>
                  </Flex>
                ))
              )}
            </Stack>
          </ScrollArea>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="text-xs px-3 py-1 rounded hover:bg-emerald-700">
                <Typography variant="span" size="xs">Close</Typography>
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}