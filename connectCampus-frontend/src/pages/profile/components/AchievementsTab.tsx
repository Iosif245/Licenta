import { TabsContent } from '@app/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@app/components/ui/card';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import { Save, X, ExternalLink, Github, Linkedin, Facebook } from 'lucide-react';
import React from 'react';

interface AchievementsTabProps {
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

const AchievementsTab = ({ isEditing, formData, onSubmit, onChange, onCancel }: AchievementsTabProps) => {
  const socialLinks = [
    {
      key: 'linkedInUrl' as keyof typeof formData,
      label: 'LinkedIn Profile',
      placeholder: 'https://linkedin.com/in/yourprofile',
      icon: Linkedin,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      value: formData.linkedInUrl,
    },
    {
      key: 'gitHubUrl' as keyof typeof formData,
      label: 'GitHub Profile',
      placeholder: 'https://github.com/yourprofile',
      icon: Github,
      color: 'text-gray-700',
      bgColor: 'bg-gray-50',
      value: formData.gitHubUrl,
    },
    {
      key: 'facebookUrl' as keyof typeof formData,
      label: 'Facebook Profile',
      placeholder: 'https://facebook.com/yourprofile',
      icon: Facebook,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      value: formData.facebookUrl,
    },
  ];

  const activeSocialLinks = socialLinks.filter(link => link.value && link.value.trim().length > 0);

  const isValidUrl = (url: string) => {
    try {
      return Boolean(new URL(url));
    } catch {
      return false;
    }
  };

  return (
    <TabsContent value="achievements" className="space-y-6 mt-0">
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="px-0 pb-4">
          <CardTitle className="text-xl font-semibold text-foreground">Social Links</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">Connect your social profiles to showcase your professional presence and projects.</CardDescription>
        </CardHeader>

        <CardContent className="px-0">
          {isEditing ? (
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Social Links */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground border-b border-border/40 pb-2">Professional & Social Profiles</h3>

                {socialLinks.map(link => {
                  const IconComponent = link.icon;
                  return (
                    <div key={link.key} className="space-y-2">
                      <Label htmlFor={link.key} className="text-sm font-medium text-foreground flex items-center gap-2">
                        <IconComponent className={`h-4 w-4 ${link.color}`} />
                        {link.label}
                      </Label>
                      <Input
                        id={link.key}
                        name={link.key}
                        type="url"
                        value={link.value}
                        onChange={onChange}
                        placeholder={link.placeholder}
                        className="h-10 bg-background border-border/60 focus:border-primary/50 transition-colors"
                      />
                    </div>
                  );
                })}

                <p className="text-xs text-muted-foreground">These links will be displayed on your profile and help others connect with you professionally.</p>
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
              {activeSocialLinks.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-primary" />
                    <h4 className="text-sm font-medium text-foreground">My Social Profiles</h4>
                  </div>

                  <div className="grid gap-3">
                    {activeSocialLinks.map(link => {
                      const IconComponent = link.icon;
                      const isValid = isValidUrl(link.value);

                      return (
                        <div key={link.key} className="flex items-center gap-3 p-3 rounded-lg border border-border/40 bg-background/50">
                          <div className={`p-2 rounded-md ${link.bgColor}`}>
                            <IconComponent className={`h-4 w-4 ${link.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">{link.label}</p>
                            {isValid ? (
                              <a
                                href={link.value}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:text-primary/80 transition-colors truncate block"
                              >
                                {link.value}
                              </a>
                            ) : (
                              <p className="text-xs text-muted-foreground truncate">{link.value}</p>
                            )}
                          </div>
                          {isValid && <ExternalLink className="h-4 w-4 text-muted-foreground" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ExternalLink className="h-8 w-8 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No social links added yet</p>
                  <p className="text-xs mt-1">Add your professional profiles to expand your network</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default AchievementsTab;
