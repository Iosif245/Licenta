import { useState } from 'react';
import { Eye, EyeOff, Building, Mail, Lock, ArrowRight, Globe, Calendar, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { CardContent } from '@app/components/ui/card';
import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import { Textarea } from '@app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@app/components/ui/select';
import React from 'react';
import { IAssociationRegistration } from '@app/types/association';
import ImageUpload from './ImageUpload';

interface AssociationRegistrationFormProps {
  formData: IAssociationRegistration;
  confirmPassword: string;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onConfirmPasswordChange: (value: string) => void;
  onImageChange: (field: 'logo' | 'coverImage', file: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const AssociationRegistrationForm = ({
  formData,
  confirmPassword,
  onFormChange,
  onConfirmPasswordChange,
  onImageChange,
  onSubmit,
  isLoading,
}: AssociationRegistrationFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSelectChange = (name: string, value: string) => {
    const event = {
      target: { name, value },
    } as React.ChangeEvent<HTMLSelectElement>;
    onFormChange(event);
  };

  const categories = ['Academic', 'Cultural', 'Sports', 'Technology', 'Arts', 'Business', 'Science', 'Social', 'Environmental', 'Healthcare', 'Other'];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <form onSubmit={onSubmit} className="w-full">
      <CardContent className="space-y-4 p-4">
        {/* Image Uploads */}
        <div className="space-y-3 w-full">
          <h3 className="text-lg font-semibold text-foreground border-b pb-2">Media & Branding</h3>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 w-full">
            <ImageUpload label="Logo / Avatar" value={formData.logo} onChange={file => onImageChange('logo', file)} type="cover" disabled={isLoading} />
            <ImageUpload label="Cover Image" value={formData.coverImage} onChange={file => onImageChange('coverImage', file)} type="cover" disabled={isLoading} />
          </div>
        </div>

        {/* Basic Information */}
        <div className="space-y-3 w-full">
          <h3 className="text-lg font-semibold text-foreground border-b pb-2">Basic Information</h3>

          {/* Association Name */}
          <div className="space-y-1 w-full">
            <Label htmlFor="name" className="text-foreground font-medium text-sm">
              Association Name
            </Label>
            <div className={`relative transition-all duration-300 w-full ${focusedField === 'name' ? 'scale-[1.01]' : ''}`}>
              <Building className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-200 z-10 ${focusedField === 'name' ? 'text-primary' : 'text-muted-foreground'}`} />
              <Input
                id="name"
                name="name"
                placeholder="Your Association Name"
                value={formData.name}
                onChange={onFormChange}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                className={`w-full pl-10 h-9 text-sm transition-all duration-300 border rounded-lg ${
                  focusedField === 'name' ? 'border-primary/50 shadow-sm shadow-primary/10 bg-primary/5' : 'border-border hover:border-border/80 bg-background'
                }`}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1 w-full">
            <Label htmlFor="email" className="text-foreground font-medium text-sm">
              Email Address
            </Label>
            <div className={`relative transition-all duration-300 w-full ${focusedField === 'email' ? 'scale-[1.01]' : ''}`}>
              <Mail className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-200 z-10 ${focusedField === 'email' ? 'text-primary' : 'text-muted-foreground'}`} />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="association@example.com"
                value={formData.email}
                onChange={onFormChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className={`w-full pl-10 h-9 text-sm transition-all duration-300 border rounded-lg ${
                  focusedField === 'email' ? 'border-primary/50 shadow-sm shadow-primary/10 bg-primary/5' : 'border-border hover:border-border/80 bg-background'
                }`}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Category and Founded Year */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
            <div className="space-y-1 w-full">
              <Label htmlFor="category" className="text-foreground font-medium text-sm">
                Category
              </Label>
              <Select value={formData.category} onValueChange={value => handleSelectChange('category', value)} disabled={isLoading}>
                <SelectTrigger className="w-full h-9 text-sm border rounded-lg border-border hover:border-border/80 bg-background">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 w-full">
              <Label htmlFor="foundedYear" className="text-foreground font-medium text-sm">
                Founded Year
              </Label>
              <div className={`relative transition-all duration-300 w-full ${focusedField === 'foundedYear' ? 'scale-[1.01]' : ''}`}>
                <Calendar
                  className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-200 z-10 ${focusedField === 'foundedYear' ? 'text-primary' : 'text-muted-foreground'}`}
                />
                <Select value={formData.foundedYear.toString()} onValueChange={value => handleSelectChange('foundedYear', value)} disabled={isLoading}>
                  <SelectTrigger className="w-full h-9 text-sm pl-10 border rounded-lg border-border hover:border-border/80 bg-background">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1 w-full">
            <Label htmlFor="description" className="text-foreground font-medium text-sm">
              Description
            </Label>
            <div className={`transition-all duration-300 w-full ${focusedField === 'description' ? 'scale-[1.01]' : ''}`}>
              <Textarea
                id="description"
                name="description"
                placeholder="Tell us about your association, its mission, and activities..."
                value={formData.description}
                onChange={onFormChange}
                onFocus={() => setFocusedField('description')}
                onBlur={() => setFocusedField(null)}
                className={`w-full min-h-[60px] text-sm transition-all duration-300 border rounded-lg resize-none ${
                  focusedField === 'description' ? 'border-primary/50 shadow-sm shadow-primary/10 bg-primary/5' : 'border-border hover:border-border/80 bg-background'
                }`}
                required
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-3 w-full">
          <h3 className="text-lg font-semibold text-foreground border-b pb-2">Contact Information (Optional)</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
            {/* Website */}
            <div className="space-y-1 w-full">
              <Label htmlFor="website" className="text-foreground font-medium text-sm">
                Website
              </Label>
              <div className={`relative transition-all duration-300 w-full ${focusedField === 'website' ? 'scale-[1.01]' : ''}`}>
                <Globe className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-200 z-10 ${focusedField === 'website' ? 'text-primary' : 'text-muted-foreground'}`} />
                <Input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="https://yoursite.com"
                  value={formData.website || ''}
                  onChange={onFormChange}
                  onFocus={() => setFocusedField('website')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full pl-10 h-9 text-sm transition-all duration-300 border rounded-lg ${
                    focusedField === 'website' ? 'border-primary/50 shadow-sm shadow-primary/10 bg-primary/5' : 'border-border hover:border-border/80 bg-background'
                  }`}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1 w-full">
              <Label htmlFor="phone" className="text-foreground font-medium text-sm">
                Phone
              </Label>
              <div className={`relative transition-all duration-300 w-full ${focusedField === 'phone' ? 'scale-[1.01]' : ''}`}>
                <Phone className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-200 z-10 ${focusedField === 'phone' ? 'text-primary' : 'text-muted-foreground'}`} />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone || ''}
                  onChange={onFormChange}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full pl-10 h-9 text-sm transition-all duration-300 border rounded-lg ${
                    focusedField === 'phone' ? 'border-primary/50 shadow-sm shadow-primary/10 bg-primary/5' : 'border-border hover:border-border/80 bg-background'
                  }`}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1 w-full">
            <Label htmlFor="location" className="text-foreground font-medium text-sm">
              Location
            </Label>
            <div className={`relative transition-all duration-300 w-full ${focusedField === 'location' ? 'scale-[1.01]' : ''}`}>
              <MapPin className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-200 z-10 ${focusedField === 'location' ? 'text-primary' : 'text-muted-foreground'}`} />
              <Input
                id="location"
                name="location"
                placeholder="City, Country"
                value={formData.location || ''}
                onChange={onFormChange}
                onFocus={() => setFocusedField('location')}
                onBlur={() => setFocusedField(null)}
                className={`w-full pl-10 h-9 text-sm transition-all duration-300 border rounded-lg ${
                  focusedField === 'location' ? 'border-primary/50 shadow-sm shadow-primary/10 bg-primary/5' : 'border-border hover:border-border/80 bg-background'
                }`}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1 w-full">
            <Label htmlFor="address" className="text-foreground font-medium text-sm">
              Address
            </Label>
            <div className={`transition-all duration-300 w-full ${focusedField === 'address' ? 'scale-[1.01]' : ''}`}>
              <Textarea
                id="address"
                name="address"
                placeholder="Full address of your organization"
                value={formData.address || ''}
                onChange={onFormChange}
                onFocus={() => setFocusedField('address')}
                onBlur={() => setFocusedField(null)}
                className={`w-full min-h-[50px] text-sm transition-all duration-300 border rounded-lg resize-none ${
                  focusedField === 'address' ? 'border-primary/50 shadow-sm shadow-primary/10 bg-primary/5' : 'border-border hover:border-border/80 bg-background'
                }`}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="space-y-3 w-full">
          <h3 className="text-lg font-semibold text-foreground border-b pb-2">Social Media (Optional)</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
            {/* Facebook */}
            <div className="space-y-1 w-full">
              <Label htmlFor="facebook" className="text-foreground font-medium text-sm flex items-center gap-2">
                <Facebook className="w-4 h-4 text-blue-600" />
                Facebook
              </Label>
              <Input
                id="facebook"
                name="facebook"
                placeholder="https://facebook.com/yourpage"
                value={formData.facebook || ''}
                onChange={onFormChange}
                className="w-full h-9 text-sm border rounded-lg border-border hover:border-border/80 bg-background"
                disabled={isLoading}
              />
            </div>

            {/* Twitter */}
            <div className="space-y-1 w-full">
              <Label htmlFor="twitter" className="text-foreground font-medium text-sm flex items-center gap-2">
                <Twitter className="w-4 h-4 text-blue-400" />
                Twitter
              </Label>
              <Input
                id="twitter"
                name="twitter"
                placeholder="https://twitter.com/yourhandle"
                value={formData.twitter || ''}
                onChange={onFormChange}
                className="w-full h-9 text-sm border rounded-lg border-border hover:border-border/80 bg-background"
                disabled={isLoading}
              />
            </div>

            {/* Instagram */}
            <div className="space-y-1 w-full">
              <Label htmlFor="instagram" className="text-foreground font-medium text-sm flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-500" />
                Instagram
              </Label>
              <Input
                id="instagram"
                name="instagram"
                placeholder="https://instagram.com/yourhandle"
                value={formData.instagram || ''}
                onChange={onFormChange}
                className="w-full h-9 text-sm border rounded-lg border-border hover:border-border/80 bg-background"
                disabled={isLoading}
              />
            </div>

            {/* LinkedIn */}
            <div className="space-y-1 w-full">
              <Label htmlFor="linkedIn" className="text-foreground font-medium text-sm flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-blue-700" />
                LinkedIn
              </Label>
              <Input
                id="linkedIn"
                name="linkedIn"
                placeholder="https://linkedin.com/company/yourorg"
                value={formData.linkedIn || ''}
                onChange={onFormChange}
                className="w-full h-9 text-sm border rounded-lg border-border hover:border-border/80 bg-background"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Password Fields */}
        <div className="space-y-3 w-full">
          <h3 className="text-lg font-semibold text-foreground border-b pb-2">Security</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
            <div className="space-y-1 w-full">
              <Label htmlFor="password" className="text-foreground font-medium text-sm">
                Password
              </Label>
              <div className={`relative transition-all duration-300 w-full ${focusedField === 'password' ? 'scale-[1.01]' : ''}`}>
                <Lock className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-200 z-10 ${focusedField === 'password' ? 'text-primary' : 'text-muted-foreground'}`} />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your password"
                  value={formData.password}
                  onChange={onFormChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full pl-10 pr-10 h-9 text-sm transition-all duration-300 border rounded-lg ${
                    focusedField === 'password' ? 'border-primary/50 shadow-sm shadow-primary/10 bg-primary/5' : 'border-border hover:border-border/80 bg-background'
                  }`}
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-7 w-7 p-0 hover:bg-muted/50"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
              </div>
            </div>

            <div className="space-y-1 w-full">
              <Label htmlFor="confirmPassword" className="text-foreground font-medium text-sm">
                Confirm Password
              </Label>
              <div className={`relative transition-all duration-300 w-full ${focusedField === 'confirmPassword' ? 'scale-[1.01]' : ''}`}>
                <Lock
                  className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-200 z-10 ${focusedField === 'confirmPassword' ? 'text-primary' : 'text-muted-foreground'}`}
                />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={e => onConfirmPasswordChange(e.target.value)}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full pl-10 h-9 text-sm transition-all duration-300 border rounded-lg ${
                    focusedField === 'confirmPassword' ? 'border-primary/50 shadow-sm shadow-primary/10 bg-primary/5' : 'border-border hover:border-border/80 bg-background'
                  }`}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-9 text-sm bg-gradient-to-r from-primary to-secondary hover:from-primary/90 
            hover:to-secondary/90 text-white font-semibold transition-all duration-300 
            hover:shadow-md hover:shadow-primary/20 hover:scale-[1.01] group mt-4 rounded-lg"
          disabled={isLoading}
        >
          {isLoading ? (
            'Creating Account...'
          ) : (
            <>
              Create Association Account
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </>
          )}
        </Button>
      </CardContent>
    </form>
  );
};

export default AssociationRegistrationForm;
