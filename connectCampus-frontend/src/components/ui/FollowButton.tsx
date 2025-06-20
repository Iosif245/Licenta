import React, { useEffect } from 'react';
import { Button } from '@app/components/ui/button';
import { UserPlus, UserCheck, Loader2 } from 'lucide-react';
import { useFollow } from '@app/hooks/useFollow';
import { useAppSelector } from '@app/store/hooks';
import { currentStudentSelector } from '@app/store/selectors/student-selectors';

interface FollowButtonProps {
  associationId: string;
  association?: any;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
  showText?: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
}

const FollowButton: React.FC<FollowButtonProps> = ({ associationId, association, size = 'sm', variant = 'default', className = '', showText = true, onFollowChange }) => {
  const currentStudent = useAppSelector(currentStudentSelector);
  const { isFollowing, loading, follow, unfollow } = useFollow({
    associationId,
    autoCheck: true,
  });

  useEffect(() => {
    if (onFollowChange) {
      onFollowChange(isFollowing);
    }
  }, [isFollowing, onFollowChange]);

  const handleFollow = async () => {
    if (!currentStudent?.id) {
      return;
    }

    try {
      if (isFollowing) {
        await unfollow();
      } else {
        await follow(association);
      }
    } catch (error) {
      console.error('Error in handleFollow:', error);
    }
  };

  // Don't show follow button if not a student
  if (!currentStudent?.id) {
    return null;
  }

  return (
    <Button size={size} variant={variant} onClick={handleFollow} disabled={loading} className={`${isFollowing ? 'bg-green-600 hover:bg-green-700 text-white' : ''} ${className}`}>
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
          {showText && 'Loading...'}
        </>
      ) : isFollowing ? (
        <>
          <UserCheck className="w-4 h-4 mr-1" />
          {showText && 'Following'}
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4 mr-1" />
          {showText && 'Follow'}
        </>
      )}
    </Button>
  );
};

export default FollowButton;
