import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@app/components/ui/card';
import { Button } from '@app/components/ui/button';
import { Badge } from '@app/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@app/components/ui/avatar';
import { Calendar, Users, Settings, Plus, TrendingUp, Star, MapPin, FileText, ArrowUpRight, Globe } from 'lucide-react';
import { AppDispatch } from '@app/store';
import { profileCurrentProfileSelector } from '@app/store/selectors/profile-selectors';
import { userIsLoadingSelector } from '@app/store/selectors/user-selectors';
import { fetchUserAndProfileActionAsync } from '@app/store/actions/user/user-async-actions';
import { getEventsByAssociationActionAsync } from '@app/store/actions/events/events-async-actions';
import { getAssociationFollowersActionAsync } from '@app/store/actions/follow/follow-async-actions';

const AssociationDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [mounted, setMounted] = useState(false);

  // State for fetched data
  const [totalEvents, setTotalEvents] = useState<any[]>([]);
  const [totalUpcomingEvents, setTotalUpcomingEvents] = useState<any[]>([]);
  const [totalFollowers, setTotalFollowers] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Get data from Redux store
  const profile = useSelector(profileCurrentProfileSelector);
  const isLoading = useSelector(userIsLoadingSelector);

  useEffect(() => {
    setMounted(true);
    if (!profile) {
      dispatch(fetchUserAndProfileActionAsync());
    }
  }, [dispatch, profile]);

  // Fetch association data when profile is available
  useEffect(() => {
    const fetchAssociationData = async () => {
      if (profile?.associationProfile?.id) {
        setDataLoading(true);
        try {
          const associationId = profile.associationProfile.id;

          // Fetch all events by association
          const allEventsResult = await dispatch(
            getEventsByAssociationActionAsync({
              associationId,
              params: { upcomingOnly: false },
            }),
          ).unwrap();

          // Fetch upcoming events by association
          const upcomingEventsResult = await dispatch(
            getEventsByAssociationActionAsync({
              associationId,
              params: { upcomingOnly: true },
            }),
          ).unwrap();

          // Fetch followers by association
          const followersResult = await dispatch(
            getAssociationFollowersActionAsync({
              associationId,
            }),
          ).unwrap();

          // Set the data
          setTotalEvents(allEventsResult?.events || []);
          setTotalUpcomingEvents(upcomingEventsResult?.events || []);
          setTotalFollowers(followersResult?.followers || followersResult || []);
        } catch (error) {
          console.error('Error fetching association data:', error);
          // Set empty arrays on error
          setTotalEvents([]);
          setTotalUpcomingEvents([]);
          setTotalFollowers([]);
        } finally {
          setDataLoading(false);
        }
      }
    };

    fetchAssociationData();
  }, [dispatch, profile?.associationProfile?.id]);

  const associationData = profile?.associationProfile;

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-muted/60 rounded-lg animate-pulse" />
            <div className="space-y-2">
              <div className="h-6 bg-muted/60 rounded w-48 animate-pulse" />
              <div className="h-4 bg-muted/60 rounded w-32 animate-pulse" />
            </div>
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 bg-muted/60 rounded-lg animate-pulse" />
            ))}
          </div>

          {/* Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-64 bg-muted/60 rounded-lg animate-pulse" />
            <div className="h-64 bg-muted/60 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!associationData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-muted-foreground">No association data found</div>
          <Button onClick={() => navigate('/profile')} variant="outline" size="sm">
            Go to Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 md:px-4 py-4 max-w-7xl space-y-6">
        {/* Header */}
        <div
          className={`flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border">
              <AvatarImage src={associationData.logo || '/placeholder.svg'} alt={associationData.name} />
              <AvatarFallback className="text-sm font-semibold bg-primary/10">{associationData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">{associationData.name}</h1>
                {associationData.isVerified && (
                  <Badge variant="secondary" className="text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {associationData.location}
                </span>
                <span>Since {associationData.foundedYear}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button size="sm" onClick={() => navigate('/association/create-event')}>
              <Plus className="w-4 h-4 mr-1" />
              New Event
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/association/settings')}
              className="hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200"
            >
              <Settings className="w-4 h-4 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200" />
            </Button>
          </div>
        </div>

        {/* Compact Stats Grid */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-500 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-xl font-semibold">{dataLoading ? <div className="w-8 h-6 bg-muted/60 rounded animate-pulse" /> : totalFollowers.length}</div>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="text-xl font-semibold">{dataLoading ? <div className="w-8 h-6 bg-muted/60 rounded animate-pulse" /> : totalEvents.length}</div>
                  <p className="text-xs text-muted-foreground">Total Events</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <div className="text-xl font-semibold">{dataLoading ? <div className="w-8 h-6 bg-muted/60 rounded animate-pulse" /> : totalUpcomingEvents.length}</div>
                  <p className="text-xs text-muted-foreground">Upcoming</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">{associationData.category}</p>
                  <p className="text-xs text-muted-foreground">Category</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-500 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Quick Actions */}
          <Card className="lg:col-span-2 border-0 shadow-sm bg-gradient-to-br from-background via-background to-muted/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                  <Calendar className="w-3 h-3 text-white" />
                </div>
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-4">
                {/* Manage Events */}
                <div
                  className="group relative overflow-hidden rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200/50 hover:border-blue-300"
                  onClick={() => navigate('/association/events')}
                >
                  <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-30 transition-opacity">
                    <Calendar className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-3 shadow-sm">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Manage Events</h3>
                    <p className="text-xs text-gray-600">Create and manage your events</p>
                  </div>
                </div>

                {/* Announcements */}
                <div
                  className="group relative overflow-hidden rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200/50 hover:border-green-300"
                  onClick={() => navigate('/association/announcements')}
                >
                  <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-30 transition-opacity">
                    <FileText className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-3 shadow-sm">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Announcements</h3>
                    <p className="text-xs text-gray-600">Share news and updates</p>
                  </div>
                </div>

                {/* View Followers */}
                <div
                  className="group relative overflow-hidden rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200/50 hover:border-purple-300"
                  onClick={() => navigate('/association/follows')}
                >
                  <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-30 transition-opacity">
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-3 shadow-sm">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">View Followers</h3>
                    <p className="text-xs text-gray-600">Manage your community</p>
                  </div>
                </div>

                {/* Settings */}
                <div
                  className="group relative overflow-hidden rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200/50 hover:border-orange-300"
                  onClick={() => navigate('/association/settings')}
                >
                  <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-30 transition-opacity">
                    <Settings className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-3 shadow-sm">
                      <Settings className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Settings</h3>
                    <p className="text-xs text-gray-600">Configure your profile</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Association Info */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Profile Status</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Verification</span>
                  <Badge variant={associationData.isVerified ? 'default' : 'secondary'} className="text-xs">
                    {associationData.isVerified ? 'Verified' : 'Not Verified'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Featured</span>
                  <Badge variant={associationData.isFeatured ? 'default' : 'secondary'} className="text-xs">
                    {associationData.isFeatured ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>

              {associationData.description && (
                <div className="pt-3 border-t">
                  <p className="text-sm text-muted-foreground line-clamp-3">{associationData.description}</p>
                </div>
              )}

              {associationData.website && (
                <div className="pt-3">
                  <a href={associationData.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                    <Globe className="w-3 h-3" />
                    Visit Website
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              )}

              <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/association/settings')}>
                Update Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssociationDashboard;
