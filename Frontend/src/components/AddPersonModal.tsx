import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Stack } from "@/components/ui/stack";
import { Flex } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Typography } from "@/components/ui/typography";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface AddPersonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPerson: (person: {
    type: 'candidate';
    name: string;
    email: string;
    phone: string;
    location: string;
    department: string;
    experience: string;
    skills: string[];
    avatar?: string;
  }) => void;
}

export function AddPersonModal({ open, onOpenChange, onAddPerson }: AddPersonModalProps) {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [department, setDepartment] = useState<'Engineering Department' | 'Design Department' | ''>('');
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [showSkillRecommendations, setShowSkillRecommendations] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [candidateStatus, setCandidateStatus] = useState<'shortlisted' | 'pending' | 'rejected'>('pending');

  // Recommended skills
  const getRecommendedSkills = () => [
    "React", "Vue.js", "Angular", "TypeScript", "Node.js", "Figma", "Photoshop"
  ];

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleAddRecommendedSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
    setShowSkillRecommendations(false);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = () => {
    // Candidate logic
    if (!name.trim() || !email.trim() || !phone.trim() || !location.trim() || !department) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    if (!experience.trim()) {
      showToast('Please enter experience.', 'error');
      return;
    }
    if (!Array.isArray(skills)) {
      showToast('Skills must be an array.', 'error');
      return;
    }
    if (skills.length === 0) {
      showToast('Please add at least one skill.', 'error');
      return;
    }
    if (department !== 'Design Department' && department !== 'Engineering Department') {
      showToast('Department must be either Design Department or Engineering Department.', 'error');
      return;
    }
    let avatarUrl = `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 50)}.jpg`;
    if (profilePhoto instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        const candidateData = {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          location: location.trim(),
          department,
          experience: experience.trim(),
          skills: Array.isArray(skills) ? skills.map(s => s.trim()).filter(Boolean) : [],
          avatar: base64data,
          status: candidateStatus,
          rating: Math.floor(Math.random() * 20 + 30) / 10,
          appliedDate: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
        };
        onAddPerson({
          type: 'candidate',
          ...candidateData
        });
      };
      reader.readAsDataURL(profilePhoto);
    } else {
      const candidateData = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        location: location.trim(),
        department,
        experience: experience.trim(),
        skills: Array.isArray(skills) ? skills.map(s => s.trim()).filter(Boolean) : [],
        avatar: avatarUrl,
        status: candidateStatus,
        rating: Math.floor(Math.random() * 20 + 30) / 10,
        appliedDate: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
      };
      onAddPerson({
        type: 'candidate',
        ...candidateData
      });
    }
    setDepartment('');
    setExperience('');
    setSkills([]);
    setProfilePhoto(null);
    setCandidateStatus('pending');
    setNewSkill('');
    onOpenChange(false);
    showToast('Candidate added successfully!', 'success');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddSkill();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[400px] p-3"
        style={{ minHeight: 'auto', maxHeight: '80vh', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        aria-describedby="add-person-modal-desc"
      >
        <DialogDescription id="add-person-modal-desc" className="text-xs text-gray-500 mb-2">
          Add candidate details.
        </DialogDescription>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold mb-1">Add Candidate</DialogTitle>
        </DialogHeader>
        <Stack spacing={1}>
          <Grid cols={2} gap={1} className="w-full items-center">
            <Stack spacing={1}>
              <Label htmlFor="profilePhoto" className="text-xs">Photo</Label>
              <Input
                id="profilePhoto"
                type="file"
                accept="image/*"
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    setProfilePhoto(e.target.files[0]);
                  } else {
                    setProfilePhoto(null);
                  }
                }}
                className="bg-white border border-gray-300 shadow-sm text-xs"
              />
              {profilePhoto instanceof File && (
                <img src={URL.createObjectURL(profilePhoto)} alt="Profile Preview" className="mt-1 w-12 h-12 rounded-full object-cover border" />
              )}
            </Stack>
            <Stack spacing={1}>
              <Label htmlFor="candidateStatus" className="text-xs">Status</Label>
              <Select value={candidateStatus} onValueChange={value => setCandidateStatus(value as 'shortlisted' | 'pending' | 'rejected')}>
                <SelectTrigger className="bg-white border border-gray-300 shadow-sm text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </Stack>
          </Grid>
          <Grid cols={2} gap={1} className="w-full items-center">
            <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name *" className="bg-white border border-gray-300 shadow-sm text-xs" />
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email *" className="bg-white border border-gray-300 shadow-sm text-xs" />
          </Grid>
          <Grid cols={2} gap={1} className="w-full items-center">
            <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone *" className="bg-white border border-gray-300 shadow-sm text-xs" />
            <Input id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="Location *" className="bg-white border border-gray-300 shadow-sm text-xs" />
          </Grid>
          <Grid cols={2} gap={1} className="w-full items-center">
            <Select value={department} onValueChange={value => setDepartment(value as 'Engineering Department' | 'Design Department' | '')}>
              <SelectTrigger className="bg-white border border-gray-300 shadow-sm text-xs">
                <SelectValue placeholder="Department *" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Engineering Department">Engineering</SelectItem>
                <SelectItem value="Design Department">Design</SelectItem>
              </SelectContent>
            </Select>
            <Input id="experience" value={experience} onChange={e => setExperience(e.target.value)} placeholder="Experience *" className="bg-white border border-gray-300 shadow-sm text-xs" />
          </Grid>
          <Stack spacing={0}>
            <Label className="text-xs">Skills</Label>
            <Flex gap={1} className="w-full">
              <Input value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyPress={handleKeyPress} placeholder="Add skill" className="bg-white border border-gray-300 shadow-sm text-xs w-[120px] min-w-0" style={{ flex: 'none' }} />
              <DropdownMenu open={showSkillRecommendations} onOpenChange={setShowSkillRecommendations}>
                <DropdownMenuTrigger asChild>
                  <Button type="button" size="sm" className="bg-white text-black border border-gray-300 shadow-sm hover:bg-emerald-700 hover:text-white p-1" onClick={() => setShowSkillRecommendations(true)}>
                    <Plus className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <ScrollArea className="max-h-40">
                    <Stack spacing={1} className="p-1">
                      <Typography variant="p" size="xs" color="muted" className="text-xs font-medium text-gray-500 mb-1">Recommended</Typography>
                      <Grid cols={1} gap={1}>
                        {[...new Set(getRecommendedSkills().filter(skill => !skills.includes(skill)))]
                          .slice(0, 10)
                          .map((skill) => (
                            <DropdownMenuItem
                              key={skill}
                              onClick={() => handleAddRecommendedSkill(skill)}
                              className="text-xs cursor-pointer hover:bg-emerald-700"
                            >
                              <Typography variant="span" size="xs">{skill}</Typography>
                            </DropdownMenuItem>
                          ))}
                      </Grid>
                      {getRecommendedSkills().filter(skill => !skills.includes(skill)).length === 0 && (
                        <Typography variant="p" size="xs" color="muted" className="text-xs text-gray-400 p-1">All added</Typography>
                      )}
                    </Stack>
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>
            </Flex>
            {skills.length > 0 && (
              <div style={{ maxHeight: '40px', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }} className="flex flex-wrap gap-1 mt-1 hide-scrollbar">
                {skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1 text-xs px-2 py-1">
                    <Typography variant="span" size="xs">{skill}</Typography>
                    <X className="w-3 h-3 cursor-pointer hover:text-red-500 transition-colors" onClick={e => { e.stopPropagation(); handleRemoveSkill(skill); }} />
                  </Badge>
                ))}
              </div>
            )}
          </Stack>
        </Stack>
        <DialogFooter className="flex gap-2 justify-end mt-2">
          <DialogClose asChild>
            <Button variant="outline" className="hover:bg-emerald-700 px-4 py-1 text-xs">Cancel</Button>
          </DialogClose>
          <Button className="bg-white text-black hover:bg-emerald-700 hover:text-white px-4 py-1 text-xs" onClick={handleSubmit} disabled={!name || !email || !phone || !location || !department || !experience || skills.length === 0}>Add Person</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
interface AddPersonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPerson: (person: {
    type: 'candidate';
    name: string;
    email: string;
    phone: string;
    location: string;
    department: string;
    experience: string;
    skills: string[];
    avatar?: string;
  }) => void;
}