/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@app/components/ui/card';
import { Button } from '@app/components/ui/button';
import { Badge } from '@app/components/ui/badge';
import { Input } from '@app/components/ui/input';
import { Calendar, Plus, Search, MoreHorizontal, Edit3, Trash2, Eye, Users, MapPin, Clock, CheckCircle, XCircle, Pause, PlayCircle, RefreshCw, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IEventSummaryResponse } from '@app/types/event/IEventResponse';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@app/store/hooks';
import { profileCurrentProfileSelector } from '@app/store/selectors/profile-selectors';
import { eventsPageStateSelector } from '@app/store/selectors/events-selectors';
import { getEventsByAssociationActionAsync, deleteEventActionAsync } from '@app/store/actions/events/events-async-actions';
import { createAnnouncementActionAsync } from '@app/store/actions/announcements/announcements-async-actions';
import alertService from '@app/services/alert';
import AttendeesModal from '@app/components/ui/AttendeesModal';
import { getEventAttendeesRequest } from '@app/api/requests/event-requests';
import { CreateAnnouncementModal } from '@app/components/ui/CreateAnnouncementModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@app/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@app/components/ui/dropdown-menu';

const AssociationEvents = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [attendeesModalOpen, setAttendeesModalOpen] = useState(false);
  const [selectedEventForAttendees, setSelectedEventForAttendees] = useState<IEventSummaryResponse | null>(null);
  const [attendeesCounts, setAttendeesCounts] = useState<Record<string, number>>({});
  const [attendeesLoading, setAttendeesLoading] = useState<Record<string, boolean>>({});
  const [isCreatingAnnouncement, setIsCreatingAnnouncement] = useState(false);
  const [selectedEventForAnnouncement, setSelectedEventForAnnouncement] = useState<IEventSummaryResponse | null>(null);
  const [isCreatingAnnouncementLoading, setIsCreatingAnnouncementLoading] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const currentProfile = useSelector(profileCurrentProfileSelector);
  const eventsState = useSelector(eventsPageStateSelector);
  const { events, loading, error } = eventsState;

  const fetchAssociationEvents = useCallback(async () => {
    if (currentProfile?.associationProfile?.id) {
      try {
        console.log('🔍 AssociationEvents - Fetching events for association:', currentProfile.associationProfile.id);
        await dispatch(
          getEventsByAssociationActionAsync({
            associationId: currentProfile.associationProfile.id,
            params: { upcomingOnly: false }, // Get all events, not just upcoming
          }),
        ).unwrap();
      } catch (errorCatch) {
        console.error('Failed to fetch association events:', errorCatch);
        alertService.errorAlert({
          title: 'Error Loading Events',
          message: 'Failed to load events. Please try again.',
        });
      }
    } else {
      console.log('❌ AssociationEvents - No association profile found:', currentProfile);
    }
  }, [dispatch, currentProfile]);

  const fetchAttendeesCount = async (eventId: string) => {
    try {
      setAttendeesLoading(prev => ({ ...prev, [eventId]: true }));
      const attendees = await getEventAttendeesRequest(eventId);
      setAttendeesCounts(prev => ({ ...prev, [eventId]: attendees.length }));
    } catch (catched) {
      console.error(`Failed to fetch attendees for event ${eventId}:`, catched);
      setAttendeesCounts(prev => ({ ...prev, [eventId]: 0 }));
    } finally {
      setAttendeesLoading(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const fetchAllAttendeesCounts = useCallback(async () => {
    if (events && events.length > 0) {
      // Fetch attendees counts for all events
      const promises = events.map(event => fetchAttendeesCount(event.id));
      await Promise.all(promises);
    }
  }, [events]);

  useEffect(() => {
    setMounted(true);
    fetchAssociationEvents();
  }, [fetchAssociationEvents]);

  useEffect(() => {
    fetchAllAttendeesCounts();
  }, [fetchAllAttendeesCounts]);

  useEffect(() => {
    console.log('📊 AssociationEvents - Events state updated:', {
      events,
      loading,
      error,
      eventsCount: events?.length,
    });
    if (error) {
      alertService.errorAlert({
        title: 'Error',
        message: error,
      });
    }
  }, [error, events, loading]);

  // Since the backend now returns status as strings, we can use them directly
  const getStatusString = (status: number | string): string => {
    // Handle both string and numeric status values for backward compatibility
    if (typeof status === 'string') {
      return status;
    }

    // Map numeric status values (fallback for old data)
    switch (status) {
      case 0:
        return 'Draft';
      case 1:
        return 'Published';
      case 2:
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  const filteredEvents = (events || []).filter((event: IEventSummaryResponse) => {
    const matchesSearch =
      !searchTerm ||
      (event.title && event.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase()));
    const eventStatus = getStatusString(event.status);
    const matchesStatus = statusFilter === 'all' || eventStatus.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return <CheckCircle className="w-3 h-3 text-green-600" />;
      case 'draft':
        return <Edit3 className="w-3 h-3 text-yellow-600" />;
      case 'canceled':
        return <XCircle className="w-3 h-3 text-red-600" />;
      case 'postponed':
        return <Pause className="w-3 h-3 text-orange-600" />;
      case 'completed':
        return <CheckCircle className="w-3 h-3 text-blue-600" />;
      default:
        return <PlayCircle className="w-3 h-3 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'draft':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'canceled':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'postponed':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleDeleteEventFromDropdown = (e: React.MouseEvent, eventId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDropdownId(null); // Close dropdown
    setEventToDelete(eventId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteEvent = async () => {
    if (!eventToDelete) return;

    setIsDeleting(true);
    try {
      await dispatch(deleteEventActionAsync(eventToDelete));
      alertService.successAlert('Event deleted successfully!');
      setDeleteDialogOpen(false);
      setEventToDelete(null);

      // Refresh events list
      await fetchAssociationEvents();
    } catch (errorCatch) {
      console.error('Failed to delete event:', errorCatch);
      alertService.errorAlert({
        title: 'Delete Failed',
        message: 'Failed to delete event. Please try again.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditEvent = (event: IEventSummaryResponse) => {
    navigate(`/association/events/${event.id}/edit`);
  };

  const handleEditEventFromDropdown = (e: React.MouseEvent, _eventId: string, event: IEventSummaryResponse) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDropdownId(null); // Close dropdown
    handleEditEvent(event);
  };

  const handleViewEvent = (event: IEventSummaryResponse) => {
    navigate(`/events/${event.slug}`);
  };

  const handleViewEventFromDropdown = (e: React.MouseEvent, event: IEventSummaryResponse) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDropdownId(null); // Close dropdown
    handleViewEvent(event);
  };

  const canEditEvent = (event: IEventSummaryResponse): boolean => {
    const status = getStatusString(event.status);
    return status.toLowerCase() !== 'completed';
  };

  const handleViewAttendeesFromDropdown = (e: React.MouseEvent, event: IEventSummaryResponse) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedEventForAttendees(event);
    setAttendeesModalOpen(true);
  };

  const handleCloseAttendeesModal = () => {
    setAttendeesModalOpen(false);
    setSelectedEventForAttendees(null);
  };

  const getEventStats = () => {
    const stats = {
      total: events?.length || 0,
      published: events?.filter(event => getStatusString(event.status).toLowerCase() === 'published').length || 0,
      upcoming:
        events?.filter(event => {
          const status = getStatusString(event.status).toLowerCase();
          return status === 'published' && new Date(event.startDate) > new Date();
        }).length || 0,
      attendees: Object.values(attendeesCounts).reduce((sum, count) => sum + count, 0),
    };
    return stats;
  };

  const stats = getEventStats();

  const handleCreateAnnouncement = async (data: { title: string; content: string; type: 'general' | 'event'; eventId?: string; image?: File }) => {
    if (!currentProfile?.associationProfile?.id) return;

    setIsCreatingAnnouncementLoading(true);
    try {
      await dispatch(
        createAnnouncementActionAsync({
          associationId: currentProfile.associationProfile.id,
          title: data.title,
          content: data.content,
          eventId: data.type === 'event' ? data.eventId : undefined,
          image: data.image,
        }),
      ).unwrap();

      // Close modal first
      setIsCreatingAnnouncement(false);
      setSelectedEventForAnnouncement(null);

      // Show success message
      alertService.successAlert('Announcement created successfully');
    } catch (catched) {
      console.error('Failed to create announcement:', catched);

      // Close modal to prevent blocking
      setIsCreatingAnnouncement(false);
      setSelectedEventForAnnouncement(null);

      // Show error with more specific message
      const errorMessage = catched instanceof Error ? catched.message : 'Failed to create announcement. Please try again.';
      alertService.errorAlert({
        title: 'Error Creating Announcement',
        message: errorMessage,
      });
    } finally {
      setIsCreatingAnnouncementLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted/60 rounded-lg animate-pulse" />
            <div className="space-y-2">
              <div className="h-6 bg-muted/60 rounded w-48 animate-pulse" />
              <div className="h-4 bg-muted/60 rounded w-32 animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted/60 rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted/60 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Error loading events: {error}</p>
            <Button onClick={fetchAssociationEvents} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200 ${loading ? 'animate-spin' : ''}`} />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 md:px-4 py-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Events</h1>
            <p className="text-muted-foreground mt-1 text-sm">Manage events for {currentProfile?.associationProfile?.name}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={fetchAssociationEvents}
              disabled={loading}
              className="h-8 text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200"
            >
              <RefreshCw className={`w-3 h-3 mr-1.5 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={() => navigate('/association/events/create')} className="h-8 text-xs">
              <Plus className="w-3 h-3 mr-1.5" />
              Create Event
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Total Events</p>
                  <p className="text-xl font-bold">{stats.total}</p>
                </div>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Published</p>
                  <p className="text-xl font-bold">{stats.published}</p>
                </div>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Drafts</p>
                  <p className="text-xl font-bold">{stats.total - stats.published}</p>
                </div>
                <FileText className="h-4 w-4 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Total Attendees</p>
                  <p className="text-xl font-bold">{stats.attendees}</p>
                </div>
                <Users className="h-4 w-4 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input placeholder="Search events..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-8 h-8 text-sm" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 h-8 text-sm">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-sm">
                All Events
              </SelectItem>
              <SelectItem value="published" className="text-sm">
                Published
              </SelectItem>
              <SelectItem value="draft" className="text-sm">
                Drafts
              </SelectItem>
              <SelectItem value="completed" className="text-sm">
                Completed
              </SelectItem>
              <SelectItem value="cancelled" className="text-sm">
                Cancelled
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Events List */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-5 bg-muted rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-full mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{searchTerm || statusFilter !== 'all' ? 'No events found' : 'No events yet'}</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                {searchTerm || statusFilter !== 'all' ? 'Try adjusting your search or filter criteria' : 'Create your first event to get started'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button onClick={() => navigate('/association/events/create')} className="h-8 text-xs">
                  <Plus className="w-3 h-3 mr-1.5" />
                  Create Event
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {filteredEvents.map((event, index) => (
              <div
                key={event.id}
                className="animate-in fade-in-0 slide-in-from-bottom-4"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both',
                }}
              >
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold truncate">{event.title || 'Untitled Event'}</h3>
                            <Badge className={`text-xs border ${getStatusColor(getStatusString(event.status))}`}>
                              {getStatusIcon(getStatusString(event.status))}
                              <span className="ml-1">{getStatusString(event.status)}</span>
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {event.startDate ? new Date(event.startDate).toLocaleDateString() : 'No date'}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.location || 'No location'}
                            </span>
                            <span
                              className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"
                              onClick={e => {
                                e.stopPropagation();
                                handleViewAttendeesFromDropdown(e, event);
                              }}
                              title="Click to view attendees"
                            >
                              <Users className="w-3 h-3" />
                              {attendeesLoading[event.id] ? <span className="animate-pulse">...</span> : `${attendeesCounts[event.id] ?? 0} attendees`}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedEventForAnnouncement(event);
                            setIsCreatingAnnouncement(true);
                          }}
                          title="Make Announcement"
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                        <DropdownMenu open={openDropdownId === event.id} onOpenChange={open => setOpenDropdownId(open ? event.id : null)}>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={e => handleViewEventFromDropdown(e, event)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={e => handleEditEventFromDropdown(e, event.id, event)}
                              disabled={!canEditEvent(event)}
                              className={!canEditEvent(event) ? 'opacity-50 cursor-not-allowed' : ''}
                            >
                              <Edit3 className="w-4 h-4 mr-2" />
                              Edit Event
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={e => handleDeleteEventFromDropdown(e as any, event.id)}>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Event
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}

        {/* Modals */}
        {selectedEventForAttendees && (
          <AttendeesModal
            isOpen={!!selectedEventForAttendees}
            onClose={handleCloseAttendeesModal}
            eventId={selectedEventForAttendees.id}
            eventTitle={selectedEventForAttendees.title || 'Event'}
          />
        )}

        {selectedEventForAnnouncement && (
          <CreateAnnouncementModal
            isOpen={!!selectedEventForAnnouncement}
            onClose={() => setSelectedEventForAnnouncement(null)}
            onSubmit={handleCreateAnnouncement}
            events={[selectedEventForAnnouncement]}
            isLoading={isCreatingAnnouncement}
          />
        )}
      </div>
    </div>
  );
};

export default AssociationEvents;
