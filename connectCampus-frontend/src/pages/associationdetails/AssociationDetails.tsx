import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { getAssociationActionAsync } from '@app/store/actions/association/association-async-actions';
import { associationCurrentAssociationSelector, associationIsLoadingSelector } from '@app/store/selectors/association-selectors';
import { profileCurrentProfileSelector, profileStudentSelector } from '@app/store/selectors/profile-selectors';
import { followersTotalCountSelector } from '@app/store/selectors/follow-selectors';
import { userSelector } from '@app/store/selectors/user-selectors';
import { Card, CardContent } from '@app/components/ui/card';
import { Button } from '@app/components/ui/button';
import { Badge } from '@app/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@app/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@app/components/ui/tabs';
import { Calendar, Users, MapPin, Globe, Mail, Heart, Share2, Shield, Info, FileText, MessageCircle } from 'lucide-react';
import FollowButton from '@app/components/ui/FollowButton';
import { getEventsByAssociationActionAsync } from '@app/store/actions/events/events-async-actions';
import { getAssociationFollowersActionAsync } from '@app/store/actions/follow/follow-async-actions';
import { fetchUserAndProfileActionAsync } from '@app/store/actions/user/user-async-actions';
import AboutTab from './components/AboutTab';
import FollowersTab from './components/FollowersTab';
import EventsTab from './components/EventsTab';
import AnnouncementsTab from './components/AnnouncementsTab';
import { EventSummary, EventStatus } from '@app/types/event';
import { getChatGroupsRequest, createOrGetChatGroupRequest } from '@app/api/requests/chat-requests';

const AssociationDetails = () => {
  const { identifier } = useParams<{ identifier?: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [totalEvents, setTotalEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventSummary[]>([]);
  const [pastEvents, setPastEvents] = useState<EventSummary[]>([]);
  const [totalFollowers, setTotalFollowers] = useState([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventsActiveTab, setEventsActiveTab] = useState('upcoming');
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  const association = useAppSelector(associationCurrentAssociationSelector);
  const loading = useAppSelector(associationIsLoadingSelector);
  const profile = useAppSelector(profileCurrentProfileSelector);
  const studentProfile = useAppSelector(profileStudentSelector);
  const user = useAppSelector(userSelector);
  const followerCount = useAppSelector(followersTotalCountSelector);

  // Check if current user is a Student
  const isStudent = profile?.role === 'Student';

  // Check if this is the association's own page
  const isOwnAssociationPage = profile?.role === 'Association' && profile?.associationProfile?.slug === identifier;

  // Function to fetch association stats
  const fetchAssociationStats = async (associationId: string) => {
    setStatsLoading(true);
    try {
      // Fetch all events by association
      const allEventsResult = await dispatch(
        getEventsByAssociationActionAsync({
          associationId,
          params: { upcomingOnly: false },
        }),
      ).unwrap();

      // Fetch followers by association
      const followersResult = await dispatch(
        getAssociationFollowersActionAsync({
          associationId,
        }),
      ).unwrap();

      // Set all events
      const allEvents = allEventsResult?.events || [];

      // Split events into upcoming and past based on status
      // Upcoming: Published events that haven't ended yet
      const now = new Date();
      const upcoming = allEvents.filter(event => event.status === EventStatus.Published && new Date(event.startDate) > now);
      // Past: Only events with Completed status
      const past = allEvents.filter(event => event.status === EventStatus.Completed);

      // Set the data
      setTotalEvents(allEvents);
      setUpcomingEvents(upcoming);
      setPastEvents(past);
      setTotalFollowers(followersResult?.followers || followersResult || []);
    } catch (error) {
      console.error('Error fetching association stats:', error);
      // Set empty arrays on error
      setTotalEvents([]);
      setUpcomingEvents([]);
      setPastEvents([]);
      setTotalFollowers([]);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    if (identifier) {
      dispatch(getAssociationActionAsync(identifier));
    }
    
    // Ensure profile is loaded if user is authenticated
    if (!profile && user) {
      console.log('Profile not loaded, fetching profile data...');
      dispatch(fetchUserAndProfileActionAsync());
    }
  }, [dispatch, identifier, profile, user]);

  // Fetch additional stats once association is loaded
  useEffect(() => {
    if (association?.id) {
      fetchAssociationStats(association.id);
    }
  }, [association?.id]);

  // Format date for events (e.g., "May 15, 2023")
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  // Format time for events (e.g., "2:30 PM")
  const formatTime = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  // Filter events based on search term
  const filteredUpcomingEvents = upcomingEvents.filter(
    event =>
      !searchTerm ||
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.tags && event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))),
  );

  const filteredPastEvents = pastEvents.filter(
    event =>
      !searchTerm ||
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.tags && event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))),
  );

  // Handle search term change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle events tab change
  const handleEventsTabChange = (tab: string) => {
    setEventsActiveTab(tab);
  };

  // Handle opening chat - navigate to messages page with specific chat
  const handleOpenChat = async () => {
    console.log('handleOpenChat called');
    
    const studentId = studentProfile?.id || profile?.id;
    
    if (!association?.id || !studentId) {
      console.log('Missing association or student data');
      return;
    }

    if (!isStudent) {
      console.log('User is not a student');
      return;
    }

    try {
      console.log('Attempting to get or create chat group...');
      
      // First, try to get existing chat groups to find one between this student and association
      const chatGroupsResponse = await getChatGroupsRequest();
      console.log('Chat groups response:', chatGroupsResponse);
      
      const existingChatGroup = chatGroupsResponse.items.find(
        (group) => 
          (group.studentId === studentId && group.associationId === association.id) ||
          (group.associationId === studentId && group.studentId === association.id)
      );

      if (existingChatGroup) {
        console.log('Found existing chat group:', existingChatGroup);
        // Navigate to messages page with specific chat group
        navigate(`/messages?chatId=${existingChatGroup.id}`);
      } else {
        console.log('Creating new chat group...');
        // Create a new chat group
        const newChatGroup = await createOrGetChatGroupRequest({
          studentId: studentId,
          associationId: association.id
        });
        console.log('Created new chat group:', newChatGroup);
        // Navigate to messages page with new chat group
        navigate(`/messages?chatId=${newChatGroup.id}`);
      }
    } catch (error) {
      console.error('Error opening chat:', error);
      // Navigate to messages page anyway - user can create chat there
      navigate('/messages');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-3 md:p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="h-32 bg-muted/60 rounded-lg animate-pulse" />
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-muted/60 rounded-lg animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-5 bg-muted/60 rounded w-1/3 animate-pulse" />
              <div className="h-3 bg-muted/60 rounded w-1/4 animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 bg-muted/60 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!association) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Association not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-3 md:p-4">
        {/* Hero Section - Compact */}
        <div className={`relative mb-4 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Cover Image - Reduced height */}
          <div className="h-32 relative overflow-hidden rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10">
            <img src={association.coverImage || '/placeholder.svg'} alt={association.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <Button variant="ghost" size="sm" className="absolute top-2 right-2 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 h-8 px-2 text-xs">
              <Share2 className="w-3 h-3 mr-1" />
              Share
            </Button>
          </div>

          {/* Profile Card - More compact */}
          <Card className="relative -mt-8 mx-3 border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Avatar and Basic Info */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 flex-1">
                  <div className="relative">
                    <Avatar className="w-16 h-16 border-2 border-white shadow-md">
                      <AvatarImage src={association.logo || '/placeholder.svg'} alt={association.name} />
                      <AvatarFallback className="text-sm font-semibold bg-primary/10">{association.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {association.isVerified && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                        <Shield className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="text-center sm:text-left flex-1">
                    <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                      <h1 className="text-xl font-bold">{association.name}</h1>
                      <Badge variant="secondary" className="text-xs">
                        {association.category}
                      </Badge>
                      {association.isVerified && (
                        <Badge variant="default" className="text-xs bg-blue-600 hover:bg-blue-700">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center sm:justify-start">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {association.location}
                      </span>
                      <span>Founded {association.foundedYear}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Hidden when association views their own page */}
                {!isOwnAssociationPage && (
                  <div className="flex gap-2 justify-center sm:justify-end">
                    {/* Only show Follow button if user is a Student */}
                    {isStudent && profile && <FollowButton associationId={association.id} association={association} size="sm" />}
                    {/* Chat button - only for students */}
                    {isStudent && profile && (
                      <Button variant="outline" size="sm" className="h-8 px-3" onClick={handleOpenChat}>
                        <MessageCircle className="w-3 h-3" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="h-8 px-3">
                      <Heart className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 px-3">
                      <Mail className="w-3 h-3" />
                    </Button>
                    {association.website && (
                      <Button variant="outline" size="sm" asChild className="h-8 px-3">
                        <a href={association.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="w-3 h-3" />
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats - More compact */}
        <div className={`grid grid-cols-3 gap-3 mb-4 transition-all duration-500 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 text-center">
              <Users className="w-4 h-4 text-primary mx-auto mb-1" />
              <div className="text-lg font-semibold">{statsLoading ? <span className="w-8 h-6 bg-muted/60 rounded animate-pulse inline-block" /> : totalFollowers.length}</div>
              <div className="text-xs text-muted-foreground">Followers</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 text-center">
              <Calendar className="w-4 h-4 text-green-600 mx-auto mb-1" />
              <div className="text-lg font-semibold">{statsLoading ? <span className="w-8 h-6 bg-muted/60 rounded animate-pulse inline-block" /> : totalEvents.length}</div>
              <div className="text-xs text-muted-foreground">Events</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 text-center">
              <Calendar className="w-4 h-4 text-orange-600 mx-auto mb-1" />
              <div className="text-lg font-semibold">{statsLoading ? <span className="w-8 h-6 bg-muted/60 rounded animate-pulse inline-block" /> : upcomingEvents.length}</div>
              <div className="text-xs text-muted-foreground">Upcoming</div>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs - More compact */}
        <div className={`transition-all duration-500 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            {/* Tab Navigation - Reduced height */}
            <TabsList className="grid w-full grid-cols-4 h-8 bg-muted/30 rounded-lg p-0.5">
              <TabsTrigger value="about" className="text-xs h-7">
                <Info className="w-3 h-3 mr-1" />
                About
              </TabsTrigger>
              <TabsTrigger value="events" className="text-xs h-7">
                <Calendar className="w-3 h-3 mr-1" />
                Events
              </TabsTrigger>
              <TabsTrigger value="announcements" className="text-xs h-7">
                <FileText className="w-3 h-3 mr-1" />
                News
              </TabsTrigger>
              <TabsTrigger value="followers" className="text-xs h-7">
                <Users className="w-3 h-3 mr-1" />
                Followers
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <TabsContent value="about" className="mt-0">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <AboutTab
                    association={{
                      name: association.name,
                      description: association.description,
                      website: association.website,
                      location: association.location,
                      foundedYear: association.foundedYear,
                      followers: followerCount,
                      email: association.email,
                      phone: association.phone,
                      address: association.address,
                      facebook: association.facebook,
                      twitter: association.twitter,
                      instagram: association.instagram,
                      linkedIn: association.linkedIn,
                      category: association.category,
                      isVerified: association.isVerified,
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <EventsTab
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              activeEventsTab={eventsActiveTab}
              onEventsTabChange={handleEventsTabChange}
              filteredUpcomingEvents={filteredUpcomingEvents}
              filteredPastEvents={filteredPastEvents}
              formatDate={formatDate}
              formatTime={formatTime}
            />

            <TabsContent value="announcements" className="mt-0">
              <AnnouncementsTab associationId={association.id} />
            </TabsContent>

            <TabsContent value="followers" className="mt-0">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  {statsLoading ? (
                    <div className="space-y-3">
                      <div className="h-10 bg-muted/60 rounded animate-pulse" />
                      <div className="h-10 bg-muted/60 rounded animate-pulse" />
                      <div className="h-10 bg-muted/60 rounded animate-pulse" />
                    </div>
                  ) : totalFollowers.length > 0 ? (
                    <FollowersTab followers={totalFollowers} />
                  ) : (
                    <div className="text-center py-4">
                      <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                      <h3 className="font-semibold mb-1 text-sm">No followers yet</h3>
                      <p className="text-xs text-muted-foreground">This association doesn't have any followers</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

    </div>
  );
};

export default AssociationDetails;
