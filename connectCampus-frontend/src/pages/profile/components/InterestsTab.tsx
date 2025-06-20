import { TabsContent } from '@app/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@app/components/ui/card';
import { Button } from '@app/components/ui/button';
import { Label } from '@app/components/ui/label';
import { Badge } from '@app/components/ui/badge';
import { Save, X, Heart, Plus, Check } from 'lucide-react';
import React, { useState, useEffect } from 'react';
// eslint-disable-next-line import/extensions
import interestsData from '@app/data/interests.json';
import { InterestsData, CATEGORY_INFO, InterestCategory } from '@app/types/interests';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '@app/store';
import { profileCurrentProfileSelector } from '@app/store/selectors/profile-selectors';
import { updateStudentInterestsActionAsync } from '@app/store/actions/student/student-async-actions';

interface InterestsTabProps {
  isEditing: boolean;
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    university: string;
    faculty: string;
    specialization: string;
    studyYear: number;
    educationLevel: string;
    bio: string;
    linkedInUrl: string;
    gitHubUrl: string;
    facebookUrl: string;
    interests: string;
  };
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCancel: () => void;
}

const InterestsTab = ({ isEditing, formData, onChange, onCancel }: InterestsTabProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const profile = useSelector(profileCurrentProfileSelector);

  // Store original interests to restore on cancel
  const [originalInterests, setOriginalInterests] = useState('');
  // Store currently selected interests during editing
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // Get current interests as array
  const getCurrentInterests = () => {
    return formData.interests
      .split(',')
      .map(interest => interest.trim())
      .filter(interest => interest.length > 0);
  };

  // Initialize selected interests when editing starts
  useEffect(() => {
    if (isEditing) {
      setOriginalInterests(formData.interests);
      setSelectedInterests(getCurrentInterests());
    }
  }, [isEditing, formData.interests]);

  const toggleInterest = (interest: string) => {
    const newSelected = selectedInterests.includes(interest) ? selectedInterests.filter(i => i !== interest) : [...selectedInterests, interest];

    setSelectedInterests(newSelected);

    // Update form data
    const newInterestsString = newSelected.join(', ');
    const event = {
      target: { name: 'interests', value: newInterestsString },
    } as React.ChangeEvent<HTMLTextAreaElement>;
    onChange(event);
  };

  const handleCancel = () => {
    // Restore original interests
    const event = {
      target: { name: 'interests', value: originalInterests },
    } as React.ChangeEvent<HTMLTextAreaElement>;
    onChange(event);
    setSelectedInterests(
      originalInterests
        .split(',')
        .map(i => i.trim())
        .filter(i => i.length > 0),
    );
    onCancel();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Use separate interests endpoint instead of general profile update
    if (profile?.studentProfile?.id) {
      try {
        onCancel(); // Exit edit mode

        await dispatch(
          updateStudentInterestsActionAsync({
            id: profile.studentProfile.id,
            interests: selectedInterests,
          }),
        ).unwrap();

        console.log('InterestsTab: Interests saved successfully');
      } catch (error) {
        console.error('InterestsTab: Failed to save interests:', error);
      }
    } else {
      console.error('InterestsTab: Student profile ID not found');
    }
  };

  const currentInterests = getCurrentInterests();

  return (
    <TabsContent value="interests" className="space-y-6 mt-0">
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="px-0 pb-4">
          <CardTitle className="text-xl font-semibold text-foreground">Interests & Skills</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Select your interests and skills from the predefined options to connect with like-minded people and relevant opportunities.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-0">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Current Selected Interests */}
              {selectedInterests.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">Selected Interests ({selectedInterests.length})</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedInterests.map((interest, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-primary/10 text-primary border-primary/20 hover:bg-red-100 hover:text-red-700 hover:border-red-300 cursor-pointer transition-colors"
                        onClick={() => toggleInterest(interest)}
                      >
                        <Check className="h-3 w-3 mr-1" />
                        {interest}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">Click on any selected interest to remove it</p>
                </div>
              )}

              {/* Available Interests by Category */}
              <div className="space-y-6">
                <Label className="text-sm font-medium text-foreground">Available Interests by Category</Label>
                {Object.entries(interestsData as InterestsData).map(([categoryKey, categoryInterests]) => {
                  const categoryInfo = CATEGORY_INFO[categoryKey as InterestCategory];
                  const availableInCategory = categoryInterests.filter((interest: string) => !selectedInterests.includes(interest));

                  if (availableInCategory.length === 0) return null;

                  return (
                    <div key={categoryKey} className="space-y-3">
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-foreground">{categoryInfo.label}</h4>
                        <p className="text-xs text-muted-foreground">{categoryInfo.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {availableInCategory.map((interest: string, index: number) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="cursor-pointer hover:bg-primary/10 hover:border-primary/30 transition-colors"
                            onClick={() => toggleInterest(interest)}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground">Click on any interest to add it to your profile. You can only select from these predefined options.</p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
                <Button type="button" variant="outline" onClick={handleCancel} className="h-9 px-4">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit" className="h-9 px-4 bg-primary hover:bg-primary/90">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {currentInterests.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    <h4 className="text-sm font-medium text-foreground">My Interests ({currentInterests.length})</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentInterests.map((interest, index) => (
                      <Badge key={index} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Heart className="h-8 w-8 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No interests selected yet</p>
                  <p className="text-xs mt-1">Select your interests to help others discover you</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default InterestsTab;
