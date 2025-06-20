import React, { useState, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { getStudentFollowsActionAsync } from '@app/store/actions/follow/follow-async-actions';
import { getEventsByAssociationActionAsync } from '@app/store/actions/events/events-async-actions';
import { getAssociationFollowersActionAsync } from '@app/store/actions/follow/follow-async-actions';
import { followingAssociationsSelector, followIsLoadingSelector } from '@app/store/selectors/follow-selectors';
import { currentStudentSelector } from '@app/store/selectors/student-selectors';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Search, Heart, Users, Loader2, ChevronLeft, ChevronRight, RefreshCw, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { IFollowedAssociationResponse } from '@app/types/follow/IFollowResponse';
import FollowedAssociationCard from './components/FollowedAssociationCard';

interface AssociationStats {
  [associationId: string]: {
    eventsCount: number;
    followersCount: number;
  };
}

const FollowedAssociations = () => {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [associationStats, setAssociationStats] = useState<AssociationStats>({});
  const [, setStatsLoading] = useState(false);
  const itemsPerPage = 12;

  // Redux state
  const associations = useAppSelector(followingAssociationsSelector) as IFollowedAssociationResponse[];
  const isLoading = useAppSelector(followIsLoadingSelector);
  const currentStudent = useAppSelector(currentStudentSelector);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load followed associations when component mounts
  useEffect(() => {
    setMounted(true);
    if (currentStudent?.id) {
      dispatch(
        getStudentFollowsActionAsync({
          studentId: currentStudent.id,
          params: { page: 1, pageSize: 100 }, // Get more associations for better client-side filtering
        }),
      );
    }
  }, [dispatch, currentStudent?.id]);

  // Fetch stats for all associations when they are loaded
  useEffect(() => {
    const fetchAssociationStats = async () => {
      if (associations.length === 0) return;

      setStatsLoading(true);
      const stats: AssociationStats = {};

      try {
        // Fetch stats for all associations in parallel
        const promises = associations.map(async association => {
          try {
            // Fetch events count
            const eventsResult = await dispatch(
              getEventsByAssociationActionAsync({
                associationId: association.id,
                params: { upcomingOnly: false },
              }),
            ).unwrap();

            // Fetch followers count
            const followersResult = await dispatch(
              getAssociationFollowersActionAsync({
                associationId: association.id,
              }),
            ).unwrap();

            stats[association.id] = {
              eventsCount: eventsResult?.events?.length || 0,
              followersCount: followersResult?.followers?.length || followersResult?.length || 0,
            };
          } catch (error) {
            console.error(`Error fetching stats for association ${association.id}:`, error);
            stats[association.id] = {
              eventsCount: 0,
              followersCount: 0,
            };
          }
        });

        await Promise.all(promises);
        setAssociationStats(stats);
      } catch (error) {
        console.error('Error fetching association stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchAssociationStats();
  }, [associations, dispatch]);

  // Client-side search and filtering
  const filteredAssociations = useMemo(() => {
    let filtered = associations;

    // Apply search filter
    if (debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(
        association =>
          association.name.toLowerCase().includes(searchLower) ||
          association.category.toLowerCase().includes(searchLower) ||
          association.location?.toLowerCase().includes(searchLower),
      );
    }

    return filtered;
  }, [associations, debouncedSearchTerm]);

  // Pagination for filtered results
  const totalFilteredPages = Math.ceil(filteredAssociations.length / itemsPerPage);
  const paginatedAssociations = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAssociations.slice(startIndex, endIndex);
  }, [filteredAssociations, currentPage, itemsPerPage]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefreshList = () => {
    if (currentStudent?.id) {
      dispatch(
        getStudentFollowsActionAsync({
          studentId: currentStudent.id,
          params: { page: 1, pageSize: 100 },
        }),
      );
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setCurrentPage(1);
  };

  if (!currentStudent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You need to be logged in as a student to view followed associations.</p>
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
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Followed Associations</h1>
            <p className="text-muted-foreground mt-1 text-sm">Manage your followed associations and stay updated with their activities</p>
          </div>
          <Button
            variant="outline"
            onClick={handleRefreshList}
            disabled={isLoading}
            className="gap-2 h-8 text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200"
          >
            <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input type="text" placeholder="Search followed associations..." value={searchTerm} onChange={handleSearch} className="pl-8 h-8 text-sm" />
          {searchTerm && (
            <Button variant="ghost" size="sm" onClick={handleClearSearch} className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0">
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Associations Grid */}
        <div className={`transition-all duration-500 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 text-primary mx-auto mb-4 animate-spin" />
              <p className="text-muted-foreground">Loading followed associations...</p>
            </div>
          ) : filteredAssociations.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{searchTerm ? 'No associations match your search' : 'No followed associations'}</h3>
              <p className="text-muted-foreground mb-6">{searchTerm ? 'Try adjusting your search terms' : 'Start following associations to see them here'}</p>
              {!searchTerm && (
                <Link to="/associations">
                  <Button>
                    <Users className="w-4 h-4 mr-2" />
                    Browse Associations
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {paginatedAssociations.map((association, index) => (
                <FollowedAssociationCard
                  key={association.id}
                  association={association}
                  studentId={currentStudent.id}
                  onUnfollow={handleRefreshList}
                  delayAnimation={index * 50}
                  eventsCount={associationStats[association.id]?.eventsCount || 0}
                  followersCount={associationStats[association.id]?.followersCount || 0}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalFilteredPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalFilteredPages }, (_, i) => i + 1).map(page => (
                <Button key={page} variant={currentPage === page ? 'default' : 'outline'} size="sm" onClick={() => handlePageChange(page)} className="w-8 h-8 p-0">
                  {page}
                </Button>
              ))}
            </div>

            <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalFilteredPages}>
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowedAssociations;
