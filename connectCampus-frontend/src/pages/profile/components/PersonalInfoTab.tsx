import { TabsContent } from '@app/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@app/components/ui/card';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import { Textarea } from '@app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@app/components/ui/select';
import { Save, X } from 'lucide-react';
import React from 'react';
import { IStudent, EducationLevel } from '@app/types/student';
import { ROMANIAN_UNIVERSITIES, COMMON_FACULTIES, SPECIALIZATIONS } from '@app/data/romanian-universities';

interface PersonalInfoTabProps {
  student: IStudent;
  isEditing: boolean;
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    university: string;
    faculty: string;
    specialization: string;
    studyYear: number;
    educationLevel: EducationLevel;
    bio: string;
    linkedInUrl: string;
    gitHubUrl: string;
    facebookUrl: string;
    interests: string;
  };
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onCancel: () => void;
}

const PersonalInfoTab = ({ student, isEditing, formData, onSubmit, onChange, onCancel }: PersonalInfoTabProps) => {
  const handleSelectChange = (name: string, value: string) => {
    const event = {
      target: { name, value },
    } as React.ChangeEvent<HTMLSelectElement>;
    onChange(event);
  };

  const getEducationLevelDisplay = (level: string) => {
    switch (level) {
      case 'Bachelor':
        return "Bachelor's Degree";
      case 'Master':
        return "Master's Degree";
      case 'PhD':
        return 'PhD';
      default:
        return level;
    }
  };

  const getYearDisplay = (year: number) => {
    const ordinals = ['', '1st', '2nd', '3rd', '4th', '5th', '6th'];
    return ordinals[year] || `${year}th`;
  };

  return (
    <TabsContent value="personal" className="space-y-6 mt-0">
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="px-0 pb-4">
          <CardTitle className="text-xl font-semibold text-foreground">Personal Information</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">Manage your personal details and academic information.</CardDescription>
        </CardHeader>

        <CardContent className="px-0">
          {isEditing ? (
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-foreground">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={onChange}
                    placeholder="Your first name"
                    className="h-10 bg-background border-border/60 focus:border-primary/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-foreground">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={onChange}
                    placeholder="Your last name"
                    className="h-10 bg-background border-border/60 focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  readOnly
                  disabled
                  className="h-10 bg-muted border-border/60 text-muted-foreground cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>

              {/* Academic Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground border-b border-border/40 pb-2">Academic Information</h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="university" className="text-sm font-medium text-foreground">
                      University
                    </Label>
                    <Select value={formData.university} onValueChange={value => handleSelectChange('university', value)}>
                      <SelectTrigger className="h-10 bg-background border-border/60">
                        <SelectValue placeholder="Select university" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {ROMANIAN_UNIVERSITIES.map(university => (
                          <SelectItem key={university.id} value={university.name}>
                            {university.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faculty" className="text-sm font-medium text-foreground">
                      Faculty
                    </Label>
                    <Select value={formData.faculty} onValueChange={value => handleSelectChange('faculty', value)}>
                      <SelectTrigger className="h-10 bg-background border-border/60">
                        <SelectValue placeholder="Select faculty" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {COMMON_FACULTIES.map(faculty => (
                          <SelectItem key={faculty.id} value={faculty.name}>
                            {faculty.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization" className="text-sm font-medium text-foreground">
                    Specialization
                  </Label>
                  <Select value={formData.specialization} onValueChange={value => handleSelectChange('specialization', value)}>
                    <SelectTrigger className="h-10 bg-background border-border/60">
                      <SelectValue placeholder="Select specialization" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {SPECIALIZATIONS.map(specialization => (
                        <SelectItem key={specialization.id} value={specialization.name}>
                          {specialization.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="studyYear" className="text-sm font-medium text-foreground">
                      Study Year
                    </Label>
                    <Select value={formData.studyYear.toString()} onValueChange={value => handleSelectChange('studyYear', value)}>
                      <SelectTrigger className="h-10 bg-background border-border/60">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Year</SelectItem>
                        <SelectItem value="2">2nd Year</SelectItem>
                        <SelectItem value="3">3rd Year</SelectItem>
                        <SelectItem value="4">4th Year</SelectItem>
                        <SelectItem value="5">5th Year</SelectItem>
                        <SelectItem value="6">6th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="educationLevel" className="text-sm font-medium text-foreground">
                      Education Level
                    </Label>
                    <Select value={formData.educationLevel} onValueChange={value => handleSelectChange('educationLevel', value)}>
                      <SelectTrigger className="h-10 bg-background border-border/60">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={EducationLevel.Bachelor}>Bachelor's</SelectItem>
                        <SelectItem value={EducationLevel.Master}>Master's</SelectItem>
                        <SelectItem value={EducationLevel.PhD}>PhD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium text-foreground">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={onChange}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="resize-none bg-background border-border/60 focus:border-primary/50 transition-colors"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
                <Button type="button" variant="outline" onClick={onCancel} className="h-9 px-4">
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
              {/* Personal Details */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-1">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">First Name</h4>
                  <p className="text-sm font-medium text-foreground">{student.firstName}</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Last Name</h4>
                  <p className="text-sm font-medium text-foreground">{student.lastName}</p>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email Address</h4>
                <p className="text-sm font-medium text-foreground">{student.email}</p>
              </div>

              {/* Academic Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground border-b border-border/40 pb-2">Academic Information</h3>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-1">
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">University</h4>
                    <p className="text-sm font-medium text-foreground">{student.university}</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Faculty</h4>
                    <p className="text-sm font-medium text-foreground">{student.faculty}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Specialization</h4>
                  <p className="text-sm font-medium text-foreground">{student.specialization}</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-1">
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Study Year</h4>
                    <p className="text-sm font-medium text-foreground">{getYearDisplay(student.studyYear)} Year</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Education Level</h4>
                    <p className="text-sm font-medium text-foreground">{getEducationLevelDisplay(student.educationLevel)}</p>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {student.bio && (
                <div className="space-y-1">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Bio</h4>
                  <p className="text-sm text-foreground/80 leading-relaxed">{student.bio}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default PersonalInfoTab;
