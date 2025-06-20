import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@app/components/ui/card';
import { Button } from '@app/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@app/components/ui/avatar';
import { Edit, Building, Calendar, Heart, Camera, Upload } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { IStudent } from '@app/types/student';

import { AppDispatch } from '@app/store';
import { updateProfileActionAsync, fetchProfileActionAsync } from '@app/store/actions/profile/profile-async-actions';

interface ProfileHeaderProps {
  student: IStudent;
  onEditClick: () => void;
}

const ProfileHeader = ({ student, onEditClick }: ProfileHeaderProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [forceImageRefresh, setForceImageRefresh] = useState(false);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      console.log('ProfileHeader: Starting avatar upload for student ID:', student.id);

      // Use the main profile update action with all current data + new avatar
      const updateData = {
        firstName: student.firstName,
        lastName: student.lastName,
        university: student.university,
        faculty: student.faculty,
        specialization: student.specialization,
        studyYear: student.studyYear,
        educationLevel: student.educationLevel,
        bio: student.bio || '',
        linkedInUrl: student.linkedInUrl || '',
        gitHubUrl: student.gitHubUrl || '',
        facebookUrl: student.facebookUrl || '',
        interests: student.interests || [],
        avatar: file, // Add the new avatar file
      };

      const result = await dispatch(
        updateProfileActionAsync({
          id: student.id,
          data: updateData,
        }),
      ).unwrap();

      console.log('ProfileHeader: Avatar upload successful, result:', result);

      // Refetch profile to get updated avatar URL
      console.log('ProfileHeader: Refetching profile data...');
      await dispatch(fetchProfileActionAsync());
      console.log('ProfileHeader: Profile refetch completed');

      // Force image component to re-render with fresh data
      setForceImageRefresh(true);
      setTimeout(() => setForceImageRefresh(false), 50);
    } catch (error) {
      console.error('ProfileHeader: Failed to upload avatar:', error);
      alert('Failed to upload avatar. Please try again.');
    } finally {
      setIsUploading(false);
      // Clear file input to allow re-uploading the same file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAvatarClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-6">
      {/* Avatar and Edit Button */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="relative group">
              <Avatar className="h-32 w-32 border-4 border-background shadow-md cursor-pointer" onClick={handleAvatarClick}>
                <AvatarImage key={forceImageRefresh ? 'refreshed' : 'normal'} src={student.avatarUrl || '/placeholder.svg'} alt={`${student.firstName} ${student.lastName}`} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">{getInitials(student.firstName, student.lastName)}</AvatarFallback>
              </Avatar>

              {/* Upload Overlay */}
              <div
                className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                onClick={handleAvatarClick}
              >
                {isUploading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Camera className="h-6 w-6 text-white" />}
              </div>

              {/* Upload Button */}
              <div className="absolute -bottom-2 -right-2">
                <Button size="sm" className="h-8 w-8 rounded-full bg-primary hover:bg-primary/80 shadow-lg" onClick={handleAvatarClick} disabled={isUploading}>
                  {isUploading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Upload className="h-4 w-4" />}
                </Button>
              </div>

              {/* Hidden File Input */}
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleAvatarUpload} className="hidden" />
            </div>
          </div>
        </CardHeader>

        <CardFooter>
          <Button variant="outline" className="w-full" onClick={onEditClick}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </CardFooter>
      </Card>

      <Card className="border border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">8 Events</p>
              <p className="text-sm text-muted-foreground">Registered</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">5 Events</p>
              <p className="text-sm text-muted-foreground">Favorited</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Building className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{student.interests.length} Interests</p>
              <p className="text-sm text-muted-foreground">Selected</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileHeader;
