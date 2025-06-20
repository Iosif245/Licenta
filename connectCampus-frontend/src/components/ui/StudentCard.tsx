import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@app/components/ui/button';
import { Badge } from '@app/components/ui/badge';

import { GraduationCap, MapPin, Users, Github, Linkedin, Facebook, UserPlus, UserCheck, Eye } from 'lucide-react';
import { StudentProfile, EducationLevel } from '@app/types/user';

interface StudentCardProps {
  student: StudentProfile;
  onFollowToggle?: (studentId: string) => void;
  isFollowLoading?: boolean;
  currentUserId?: string;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onFollowToggle, isFollowLoading = false, currentUserId }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleFollowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onFollowToggle) {
      onFollowToggle(student.id);
    }
  };

  const getEducationIcon = (level: EducationLevel) => {
    switch (level) {
      case EducationLevel.PhD:
        return '🎓';
      case EducationLevel.Master:
        return '📚';
      case EducationLevel.Bachelor:
        return '🎒';
      default:
        return '📖';
    }
  };

  const getEducationColor = (level: EducationLevel) => {
    switch (level) {
      case EducationLevel.PhD:
        return 'bg-purple-500';
      case EducationLevel.Master:
        return 'bg-blue-500';
      case EducationLevel.Bachelor:
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const isOwnProfile = currentUserId === student.userId;

  return (
    <div
      className={`group relative bg-card rounded-2xl overflow-hidden border border-border 
        transition-all duration-500 ease-out hover:shadow-xl hover:shadow-primary/5 
        hover:border-primary/30 hover:-translate-y-1 ${isHovered ? 'warm-gradient' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with Avatar */}
      <div className="relative p-6 pb-0">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
              <img src={student.avatarUrl || '/placeholder.svg'} alt={`${student.firstName} ${student.lastName}`} className="w-full h-full object-cover" />
            </div>

            {/* Education Level Badge */}
            <div
              className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full 
              ${getEducationColor(student.educationLevel)} flex items-center justify-center 
              text-white text-xs font-bold shadow-lg`}
            >
              {getEducationIcon(student.educationLevel)}
            </div>

            {/* Online Status (could be added later) */}
            <div
              className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full 
              border-2 border-white shadow-sm"
            />
          </div>

          {/* Basic Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-foreground truncate">
              {student.firstName} {student.lastName}
            </h3>
            <p className="text-muted-foreground text-sm truncate">{student.specialization}</p>
            <div className="flex items-center gap-1 mt-1">
              <GraduationCap className="h-3 w-3 text-primary" />
              <span className="text-xs text-muted-foreground">
                Year {student.studyYear} •{' '}
                {typeof student.educationLevel === 'object' && student.educationLevel && 'name' in student.educationLevel
                  ? (student.educationLevel as any).name
                  : typeof student.educationLevel === 'string'
                    ? student.educationLevel
                    : ''}
              </span>
            </div>

            {/* University */}
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3 text-accent" />
              <span className="text-xs text-muted-foreground truncate">{student.university}</span>
            </div>
          </div>

          {/* Follow Button */}
          {!isOwnProfile && (
            <Button
              onClick={handleFollowClick}
              disabled={isFollowLoading}
              size="sm"
              variant={student.isFollowing ? 'secondary' : 'default'}
              className={`${
                student.isFollowing ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90'
              } transition-all duration-300 ${isFollowLoading ? 'animate-pulse' : ''}`}
            >
              {student.isFollowing ? (
                <>
                  <UserCheck className="h-4 w-4 mr-1" />
                  Following
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-1" />
                  Follow
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Bio */}
      <div className="px-6 py-4">
        {student.bio ? (
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{student.bio}</p>
        ) : (
          <p className="text-muted-foreground text-sm italic">No bio available</p>
        )}
      </div>

      {/* Stats */}
      <div className="px-6 py-3 border-t border-border/50">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-lg font-bold text-foreground">{formatNumber(student.followersCount)}</div>
            <div className="text-xs text-muted-foreground">Followers</div>
          </div>

          <div className="space-y-1">
            <div className="text-lg font-bold text-foreground">{formatNumber(student.followingCount)}</div>
            <div className="text-xs text-muted-foreground">Following</div>
          </div>

          <div className="space-y-1">
            <div className="text-lg font-bold text-foreground">{formatNumber(student.eventsAttendedCount)}</div>
            <div className="text-xs text-muted-foreground">Events</div>
          </div>
        </div>
      </div>

      {/* Interests */}
      {student.interests && student.interests.length > 0 && (
        <div className="px-6 py-3 border-t border-border/50">
          <div className="flex flex-wrap gap-1.5">
            {student.interests.slice(0, 3).map((interest, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs px-2 py-1 border-border/50 hover:border-primary/50 
                  transition-colors duration-200"
              >
                {interest}
              </Badge>
            ))}
            {student.interests.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-1 text-muted-foreground border-dashed">
                +{student.interests.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Social Links */}
      {(student.linkedInUrl || student.gitHubUrl || student.facebookUrl) && (
        <div className="px-6 py-3 border-t border-border/50">
          <div className="flex gap-3">
            {student.linkedInUrl && (
              <a
                href={student.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center 
                  text-white hover:bg-blue-600 transition-colors duration-200"
                onClick={e => e.stopPropagation()}
              >
                <Linkedin className="h-4 w-4" />
              </a>
            )}

            {student.gitHubUrl && (
              <a
                href={student.gitHubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center 
                  text-white hover:bg-gray-900 transition-colors duration-200"
                onClick={e => e.stopPropagation()}
              >
                <Github className="h-4 w-4" />
              </a>
            )}

            {student.facebookUrl && (
              <a
                href={student.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center 
                  text-white hover:bg-blue-700 transition-colors duration-200"
                onClick={e => e.stopPropagation()}
              >
                <Facebook className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Mutual Followers */}
      {student.mutualFollowers && student.mutualFollowers > 0 && (
        <div className="px-6 py-2 bg-muted/30">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>{student.mutualFollowers} mutual followers</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="p-6 pt-4">
        <Link to={`/students/${student.id}`} className="block w-full">
          <Button variant="outline" className="w-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300">
            <Eye className="h-4 w-4 mr-2" />
            View Profile
          </Button>
        </Link>
      </div>

      {/* Hover Effect Overlay */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 
        ${isHovered ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/5" />
      </div>
    </div>
  );
};

export default StudentCard;
