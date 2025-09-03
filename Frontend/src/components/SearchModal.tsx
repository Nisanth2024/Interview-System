import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { Stack } from "@/components/ui/stack";
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
import { Flex } from "@/components/ui/flex";
import { Typography } from "@/components/ui/typography";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";



interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: 'en' | 'es' | 'fr';
  setLanguage: (lang: 'en' | 'es' | 'fr') => void;
}



export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch candidates data from backend
  useEffect(() => {
    const fetchCandidates = async () => {
      if (!open) return;
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/candidates', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        const data = await res.json();
        setCandidates(Array.isArray(data) ? data : []);
      } catch (error) {
        setCandidates([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, [open]);

  // Filter candidates based on search query
  const filteredCandidates = candidates.filter(candidate => 
    candidate.name.toLowerCase().includes(query.toLowerCase()) ||
    candidate.email.toLowerCase().includes(query.toLowerCase()) ||
    candidate.department?.toLowerCase().includes(query.toLowerCase()) ||
    candidate.skills?.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>
            Search for candidates.
          </DialogDescription>
        </DialogHeader>
        <Stack spacing={2} className="mb-2">
          <div className="relative">
            <Input
              placeholder="Search Candidates"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </Stack>
        <ScrollArea className="max-h-80">
          <Stack spacing={2}>
            {loading ? (
              <Typography variant="p" size="sm" color="muted" align="center" className="text-center text-gray-400 py-8">Loading candidates...</Typography>
            ) : filteredCandidates.length === 0 && query ? (
              <Typography variant="p" size="sm" color="muted" align="center" className="text-center text-gray-400 py-8">No candidates found matching "{query}".</Typography>
            ) : filteredCandidates.length === 0 ? (
              <Typography variant="p" size="sm" color="muted" align="center" className="text-center text-gray-400 py-8">Start typing to search candidates.</Typography>
            ) : null}
             {filteredCandidates.map((c: Candidate) => (
               <Card key={c._id} className="hover:shadow-md transition-shadow cursor-pointer p-3 w-full">
                <CardContent className="p-0">
                  <Flex align="start" gap={3} className="w-full">
                    <Avatar className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
                      <AvatarImage src={c.avatar} alt={c.name} />
                      <AvatarFallback className="text-sm">{c.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <Flex direction="col" gap={2} className="w-full">
                        <div>
                          <Typography variant="p" size="base" weight="semibold" className="font-semibold text-base truncate">{c.name}</Typography>
                          <Typography variant="p" size="xs" color="muted" className="text-xs text-gray-500 truncate">{c.email}</Typography>
                        </div>
                        <Flex align="center" gap={2} wrap="wrap" className="flex-wrap">
                          <Badge className={`text-xs px-2 py-1 rounded-full ${
                            c.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            c.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                            c.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {c.status}
                          </Badge>
                          {c.rating && (
                            <Typography variant="span" size="xs" className="text-xs text-yellow-600 font-semibold flex items-center">
                              ★ {c.rating}
                            </Typography>
                          )}
                          <Typography variant="span" size="xs" color="muted" className="text-xs text-gray-400">{c.department}</Typography>
                          <Typography variant="span" size="xs" color="muted" className="text-xs text-gray-400">{c.location}</Typography>
                        </Flex>
                        {c.skills && c.skills.length > 0 && (
                          <Flex gap={1} wrap="wrap" className="flex-wrap">
                            {c.skills.slice(0, 3).map((skill, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs px-2 py-0.5">
                                {skill}
                              </Badge>
                            ))}
                            {c.skills.length > 3 && (
                              <Typography variant="span" size="xs" color="muted" className="text-xs text-gray-400">
                                +{c.skills.length - 3} more
                              </Typography>
                            )}
                          </Flex>
                        )}
                      </Flex>
                    </div>
                  </Flex>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 