import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@app/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@app/components/ui/avatar';
import { Badge } from '@app/components/ui/badge';
import { ScrollArea } from '@app/components/ui/scroll-area';
import { Skeleton } from '@app/components/ui/skeleton';
import { Users, Calendar, AlertCircle } from 'lucide-react';
import { getEventAttendeesRequest } from '@app/api/requests/event-requests';
import alertService from '@app/services/alert';

interface Attendee {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  educationLevel?: string;
  avatarUrl?: string;
  registeredAt: string;
  isAttended: boolean;
}

interface AttendeesModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
}

const AttendeesModal: React.FC<AttendeesModalProps> = ({ isOpen, onClose, eventId, eventTitle }) => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendees = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getEventAttendeesRequest(eventId);
      setAttendees(data);
    } catch (err: any) {
      console.error('Failed to fetch attendees:', err);
      const errorMessage = err?.response?.data?.message || 'Failed to load attendees';
      setError(errorMessage);
      alertService.errorAlert({
        title: 'Error Loading Attendees',
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && eventId) {
      fetchAttendees();
    } else if (!isOpen) {
      // Reset state when modal closes
      setAttendees([]);
      setError(null);
      setLoading(false);
    }
  }, [isOpen, eventId]);

  const formatRegistrationDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      ))}
    </div>
  );

  const ErrorState = () => (
    <div className="text-center py-8">
      <div className="w-12 h-12 mx-auto bg-destructive/10 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="h-6 w-6 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Failed to Load Attendees</h3>
      <p className="text-muted-foreground text-sm">{error}</p>
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-8">
      <div className="w-12 h-12 mx-auto bg-muted/50 rounded-full flex items-center justify-center mb-4">
        <Users className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No Attendees Yet</h3>
      <p className="text-muted-foreground text-sm">No one has registered for this event yet.</p>
    </div>
  );

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Event Attendees
          </DialogTitle>
          <p className="text-sm text-muted-foreground line-clamp-1">{eventTitle}</p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Stats Header */}
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Total Registered</span>
            </div>
            <Badge variant="secondary">{loading ? '...' : attendees.length}</Badge>
          </div>

          {/* Attendees List */}
          <ScrollArea className="h-80">
            {loading ? (
              <LoadingSkeleton />
            ) : error ? (
              <ErrorState />
            ) : attendees.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-2">
                {attendees.map(attendee => (
                  <div key={attendee.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={attendee.avatarUrl} alt={`${attendee.firstName} ${attendee.lastName}`} />
                      <AvatarFallback className="text-xs">{getInitials(attendee.firstName, attendee.lastName)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {attendee.firstName} {attendee.lastName}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Registered {formatRegistrationDate(attendee.registeredAt)}</span>
                      </div>
                      {attendee.educationLevel && <p className="text-xs text-muted-foreground">{attendee.educationLevel}</p>}
                    </div>

                    {attendee.isAttended && (
                      <Badge variant="default" className="text-xs">
                        Attended
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AttendeesModal;
