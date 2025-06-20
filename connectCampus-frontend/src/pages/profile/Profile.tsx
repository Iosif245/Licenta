import { Tabs, TabsContent, TabsList, TabsTrigger } from '@app/components/ui/tabs';
import { User, Heart, Award } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent } from '@app/components/ui/card';
import AchievementsTab from './components/AchievementsTab';
import InterestsTab from './components/InterestsTab';
import PersonalInfoTab from './components/PersonalInfoTab';
import ProfileHeader from './components/ProfileHeader';
import { AppDispatch } from '@app/store';
import { fetchProfileActionAsync, updateProfileActionAsync } from '@app/store/actions/profile/profile-async-actions';
import { profileCurrentProfileSelector, profileIsLoadingSelector } from '@app/store/selectors/profile-selectors';

import { EducationLevel } from '@app/types/student';

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);

  const profile = useSelector(profileCurrentProfileSelector);
  const isLoading = useSelector(profileIsLoadingSelector);

  useEffect(() => {
    if (!profile) {
      dispatch(fetchProfileActionAsync());
    }
  }, [dispatch, profile]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    university: '',
    faculty: '',
    specialization: '',
    studyYear: 1,
    educationLevel: EducationLevel.Bachelor,
    bio: '',
    linkedInUrl: '',
    gitHubUrl: '',
    facebookUrl: '',
    interests: '',
  });

  useEffect(() => {
    if (profile?.studentProfile) {
      setFormData({
        firstName: profile.studentProfile.firstName || '',
        lastName: profile.studentProfile.lastName || '',
        email: profile.email || '',
        university: profile.studentProfile.university || '',
        faculty: profile.studentProfile.faculty || '',
        specialization: profile.studentProfile.specialization || '',
        studyYear: profile.studentProfile.studyYear || 1,
        educationLevel: (profile.studentProfile.educationLevel as EducationLevel) || EducationLevel.Bachelor,
        bio: profile.studentProfile.bio || '',
        linkedInUrl: profile.studentProfile.linkedInUrl || '',
        gitHubUrl: profile.studentProfile.gitHubUrl || '',
        facebookUrl: profile.studentProfile.facebookUrl || '',
        interests: profile.studentProfile.interests?.join(', ') || '',
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Profile: handleSubmit called from tab:', activeTab);
    console.log('Profile: current formData.interests:', formData.interests);

    if (!profile?.studentProfile?.id) {
      console.error('Student profile ID not found');
      return;
    }

    try {
      const interestsArray = formData.interests
        .split(',')
        .map(interest => interest.trim())
        .filter(interest => interest.length > 0);

      console.log('Profile: processed interests array:', interestsArray);

      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        university: formData.university,
        faculty: formData.faculty,
        specialization: formData.specialization,
        studyYear: Number(formData.studyYear),
        educationLevel: formData.educationLevel,
        bio: formData.bio,
        linkedInUrl: formData.linkedInUrl,
        gitHubUrl: formData.gitHubUrl,
        facebookUrl: formData.facebookUrl,
        interests: interestsArray,
      };

      console.log('Profile: sending update data:', updateData);

      await dispatch(
        updateProfileActionAsync({
          id: profile.studentProfile.id,
          data: updateData,
        }),
      ).unwrap();

      setIsEditing(false);
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancel = () => {
    if (profile?.studentProfile) {
      setFormData({
        firstName: profile.studentProfile.firstName || '',
        lastName: profile.studentProfile.lastName || '',
        email: profile.email || '',
        university: profile.studentProfile.university || '',
        faculty: profile.studentProfile.faculty || '',
        specialization: profile.studentProfile.specialization || '',
        studyYear: profile.studentProfile.studyYear || 1,
        educationLevel: (profile.studentProfile.educationLevel as EducationLevel) || EducationLevel.Bachelor,
        bio: profile.studentProfile.bio || '',
        linkedInUrl: profile.studentProfile.linkedInUrl || '',
        gitHubUrl: profile.studentProfile.gitHubUrl || '',
        facebookUrl: profile.studentProfile.facebookUrl || '',
        interests: profile.studentProfile.interests?.join(', ') || '',
      });
    }
    setIsEditing(false);
  };

  const studentForComponents = profile?.studentProfile
    ? {
        id: profile.studentProfile.id,
        userId: profile.userId,
        email: profile.email,
        firstName: profile.studentProfile.firstName,
        lastName: profile.studentProfile.lastName,
        bio: profile.studentProfile.bio || '',
        avatarUrl: profile.studentProfile.avatarUrl,
        university: profile.studentProfile.university,
        faculty: profile.studentProfile.faculty,
        specialization: profile.studentProfile.specialization,
        studyYear: profile.studentProfile.studyYear,
        educationLevel: profile.studentProfile.educationLevel as EducationLevel,
        linkedInUrl: profile.studentProfile.linkedInUrl,
        gitHubUrl: profile.studentProfile.gitHubUrl,
        facebookUrl: profile.studentProfile.facebookUrl,
        interests: profile.studentProfile.interests || [],
        joinedDate: profile.studentProfile.joinedDate,
        createdAt: profile.studentProfile.createdAt,
        updatedAt: profile.studentProfile.updatedAt,
      }
    : null;

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-border border-t-foreground rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Render different content based on user role
  if (profile.role === 'Student' && profile.studentProfile) {
    const student = studentForComponents!;

    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto p-3 md:p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Profile Header - Left Sidebar */}
            <div className="lg:col-span-1">
              <ProfileHeader student={student} onEditClick={() => setIsEditing(!isEditing)} />
            </div>

            {/* Main Content - Right Side */}
            <div className="lg:col-span-2">
              <Card>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="border-b border-border">
                    <TabsList className="w-full bg-transparent p-0 h-auto">
                      <TabsTrigger
                        value="personal"
                        className="flex-1 py-3 px-4 border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent rounded-none text-sm"
                      >
                        <User className="w-3 h-3 mr-1.5" />
                        Personal Info
                      </TabsTrigger>
                      <TabsTrigger
                        value="interests"
                        className="flex-1 py-3 px-4 border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent rounded-none text-sm"
                      >
                        <Heart className="w-3 h-3 mr-1.5" />
                        Interests
                      </TabsTrigger>
                      <TabsTrigger
                        value="achievements"
                        className="flex-1 py-3 px-4 border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent rounded-none text-sm"
                      >
                        <Award className="w-3 h-3 mr-1.5" />
                        Social Links
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <CardContent className="p-4">
                    <TabsContent value="personal" className="mt-0">
                      <PersonalInfoTab student={student} isEditing={isEditing} formData={formData} onSubmit={handleSubmit} onChange={handleInputChange} onCancel={handleCancel} />
                    </TabsContent>

                    <TabsContent value="interests" className="mt-0">
                      <InterestsTab isEditing={isEditing} formData={formData} onSubmit={handleSubmit} onChange={handleInputChange} onCancel={handleCancel} />
                    </TabsContent>

                    <TabsContent value="achievements" className="mt-0">
                      <AchievementsTab isEditing={isEditing} formData={formData} onSubmit={handleSubmit} onChange={handleInputChange} onCancel={handleCancel} />
                    </TabsContent>
                  </CardContent>
                </Tabs>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Association profile - redirect to association dashboard
  if (profile.role === 'Association' && profile.associationProfile) {
    // For associations, redirect to their dashboard instead of showing a profile page
    window.location.href = '/association/dashboard';
    return null;
  }

  // Fallback for unknown role or missing profile data
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-semibold text-foreground mb-2">Profile Not Available</h1>
        <p className="text-muted-foreground">Profile data not found for this user type.</p>
      </div>
    </div>
  );
};

export default Profile;
