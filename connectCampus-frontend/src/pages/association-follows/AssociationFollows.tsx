import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent } from '@app/components/ui/card';
import { Button } from '@app/components/ui/button';
import { Badge } from '@app/components/ui/badge';
import { Input } from '@app/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@app/components/ui/avatar';
import { Users, Search, Star, Calendar, TrendingUp, UserMinus, Loader2, RefreshCw } from 'lucide-react';
import { AppDispatch } from '@app/store';
import { getAssociationFollowersActionAsync, removeFollowerActionAsync } from '@app/store/actions/follow/follow-async-actions';
import { profileCurrentProfileSelector } from '@app/store/selectors/profile-selectors';
import { followersSelector, followIsLoadingSelector } from '@app/store/selectors/follow-selectors';
import useFollow from '@app/hooks/useFollow';

const AssociationFollows = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [removingFollowerId, setRemovingFollowerId] = useState<string | null>(null);

  const profile = useSelector(profileCurrentProfileSelector);
  const followers = useSelector(followersSelector);
  const loading = useSelector(followIsLoadingSelector);
  const associationId = profile?.associationProfile?.id;

  // Use the useFollow hook to get date-based statistics
  const { dateStats } = useFollow({
    associationId,
    autoCheck: false, // Don't auto-check follow status for association's own page
  });

  // Load followers when component mounts
  useEffect(() => {
    setMounted(true);
    if (associationId) {
      dispatch(
        getAssociationFollowersActionAsync({
          associationId,
          params: { page: 1, pageSize: 50 },
        }),
      );
    }
  }, [dispatch, associationId]);

  // Filter followers based on search term
  const filteredFollowers = (followers || []).filter((follower: any) => {
    if (!searchTerm.trim()) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      follower.firstName?.toLowerCase().includes(searchLower) ||
      follower.lastName?.toLowerCase().includes(searchLower) ||
      follower.email?.toLowerCase().includes(searchLower) ||
      follower.university?.toLowerCase().includes(searchLower) ||
      follower.specialization?.toLowerCase().includes(searchLower)
    );
  });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleRemoveFollower = async (followerId: string) => {
    if (!associationId || removingFollowerId) return;

    setRemovingFollowerId(followerId);
    try {
      await dispatch(removeFollowerActionAsync({ associationId, studentId: followerId }));
      // Reload followers after removal
      dispatch(
        getAssociationFollowersActionAsync({
          associationId,
          params: { page: 1, pageSize: 50 },
        }),
      );
    } catch (error) {
      console.error('Error removing follower:', error);
    } finally {
      setRemovingFollowerId(null);
    }
  };

  const formatInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  if (!associationId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You need to be an association to view followers.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 md:px-4 py-4 max-w-7xl">
        {/* Header */}
        <div
          className={`flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-6 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Followers</h1>
              <p className="text-muted-foreground mt-1 text-sm">Manage your community and followers</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="gap-2 h-8 text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 transition-all duration-500 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xl font-semibold">{dateStats.totalFollowers}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
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
                  <p className="text-xl font-semibold">{dateStats.newThisMonth}</p>
                  <p className="text-xs text-muted-foreground">This Month</p>
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
                  <p className="text-xl font-semibold">{dateStats.newThisYear}</p>
                  <p className="text-xs text-muted-foreground">This Year</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Star className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-xl font-semibold">{dateStats.studentsCount}</p>
                  <p className="text-xs text-muted-foreground">Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className={`mb-6 transition-all duration-500 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="relative max-w-md">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3" />
            <Input placeholder="Search followers..." value={searchTerm} onChange={e => handleSearch(e.target.value)} className="pl-8 h-8 text-sm" />
          </div>
        </div>

        {/* Followers List */}
        <div className={`transition-all duration-500 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 text-primary mx-auto mb-4 animate-spin" />
                  <p className="text-muted-foreground">Loading followers...</p>
                </div>
              ) : filteredFollowers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No followers yet</h3>
                  <p className="text-sm text-muted-foreground mb-6">{searchTerm ? 'No followers match your search' : 'Start building your community'}</p>
                  {!searchTerm && (
                    <Button size="sm" onClick={() => navigate('/association/announcements')}>
                      Create Announcement
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredFollowers.map((follower: any) => (
                    <div key={follower.id} className="flex items-center justify-between p-2 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={follower.profilePictureUrl} alt={`${follower.firstName} ${follower.lastName}`} />
                          <AvatarFallback className="text-xs">{formatInitials(follower.firstName, follower.lastName)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-xs">
                              {follower.firstName} {follower.lastName}
                            </h4>
                            <Badge variant="secondary" className="text-[10px] px-1 py-0.5">
                              {typeof follower.educationLevel === 'object' && follower.educationLevel && 'name' in follower.educationLevel
                                ? (follower.educationLevel as any).name
                                : typeof follower.educationLevel === 'string'
                                  ? follower.educationLevel
                                  : ''}
                            </Badge>
                          </div>
                          <p className="text-[10px] text-muted-foreground">{follower.specialization}</p>
                          <p className="text-[10px] text-muted-foreground">{follower.university}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveFollower(follower.id)}
                          disabled={removingFollowerId === follower.id}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                        >
                          {removingFollowerId === follower.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserMinus className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssociationFollows;
