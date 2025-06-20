import React, { useEffect, useState, useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@app/components/ui/avatar';
import { Badge } from '@app/components/ui/badge';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Users, Calendar, MapPin, GraduationCap, Mail, Search } from 'lucide-react';
import { IFollowerResponse } from '@app/types/follow/IFollowResponse';
import Pagination from '@app/pages/associations/components/Pagination';

interface FollowersTabProps {
  followers: IFollowerResponse[];
}

const FollowersTab: React.FC<FollowersTabProps> = ({ followers }) => {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter followers based on search
  const filteredFollowers = useMemo(() => {
    if (!searchTerm.trim()) return followers;

    const searchLower = searchTerm.toLowerCase();
    return followers.filter(
      follower =>
        `${follower.firstName} ${follower.lastName}`.toLowerCase().includes(searchLower) ||
        follower.university?.toLowerCase().includes(searchLower) ||
        follower.faculty?.toLowerCase().includes(searchLower) ||
        follower.specialization?.toLowerCase().includes(searchLower) ||
        (typeof follower.educationLevel === 'object' && follower.educationLevel && 'name' in follower.educationLevel
          ? (follower.educationLevel as any).name?.toLowerCase().includes(searchLower)
          : typeof follower.educationLevel === 'string' && follower.educationLevel.toLowerCase().includes(searchLower)),
    );
  }, [followers, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredFollowers.length / itemsPerPage);
  const paginatedFollowers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredFollowers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredFollowers, currentPage, itemsPerPage]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  if (!followers || followers.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold mb-2">No followers yet</h3>
        <p className="text-muted-foreground text-sm">Be the first to follow this association!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Followers ({followers.length})
        </h3>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input type="text" placeholder="Search followers..." value={searchTerm} onChange={e => handleSearchChange(e.target.value)} className="pl-10 h-9" />
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <div className="text-sm text-muted-foreground">
          {filteredFollowers.length} of {followers.length} followers found
          {filteredFollowers.length !== followers.length && (
            <button onClick={() => handleSearchChange('')} className="ml-2 text-primary hover:underline">
              Clear search
            </button>
          )}
        </div>
      )}

      {filteredFollowers.length === 0 ? (
        <div className="text-center py-8">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No followers found</h3>
          <p className="text-muted-foreground text-sm">Try adjusting your search terms</p>
          <Button variant="outline" size="sm" onClick={() => handleSearchChange('')} className="mt-4">
            Clear search
          </Button>
        </div>
      ) : (
        <>
          {/* Followers List */}
          <div className="space-y-2">
            {paginatedFollowers.map((follower: IFollowerResponse, index: number) => (
              <div
                key={follower.id}
                className={`flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-all duration-200 hover:shadow-sm
                  ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {/* Avatar */}
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarImage src={follower.profilePictureUrl || '/placeholder.svg'} alt={`${follower.firstName} ${follower.lastName}`} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                    {follower.firstName?.charAt(0)?.toUpperCase()}
                    {follower.lastName?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Student Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm">
                      {follower.firstName} {follower.lastName}
                    </h4>
                    <Badge variant="outline" className="text-xs px-1.5 py-0">
                      Student
                    </Badge>
                    {follower.educationLevel && (
                      <Badge variant="secondary" className="text-xs px-1.5 py-0">
                        {typeof follower.educationLevel === 'object' && follower.educationLevel && 'name' in follower.educationLevel
                          ? (follower.educationLevel as any).name
                          : typeof follower.educationLevel === 'string'
                            ? follower.educationLevel
                            : ''}
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    {/* University */}
                    {follower.university && (
                      <div className="flex items-center gap-1">
                        <GraduationCap className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{follower.university}</span>
                      </div>
                    )}

                    {/* Faculty */}
                    {follower.faculty && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{follower.faculty}</span>
                      </div>
                    )}

                    {/* Specialization & Study Year */}
                    {follower.specialization && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">
                          {follower.specialization}, Year {follower.studyYear}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Button */}
                <div className="flex-shrink-0">
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    <Mail className="h-3 w-3 mr-1" />
                    Contact
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pt-4 flex justify-center">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FollowersTab;
