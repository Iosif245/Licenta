import { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { CardContent } from '@app/components/ui/card';
import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@app/components/ui/select';
import { SearchableSelect } from '@app/components/ui/searchable-select';
import React from 'react';
import { IStudentRegistration, EducationLevel } from '@app/types/student';
import ImageUpload from './ImageUpload';
import { ROMANIAN_UNIVERSITIES, SPECIALIZATIONS, COMMON_FACULTIES } from '@app/data/romanian-universities';

interface StudentRegistrationFormProps {
  formData: IStudentRegistration;
  confirmPassword: string;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onConfirmPasswordChange: (value: string) => void;
  onImageChange: (file: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const StudentRegistrationForm = ({ formData, confirmPassword, onFormChange, onConfirmPasswordChange, onImageChange, onSubmit, isLoading }: StudentRegistrationFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSelectChange = (name: string, value: string) => {
    const event = {
      target: { name, value },
    } as React.ChangeEvent<HTMLSelectElement>;
    onFormChange(event);
  };

  return (
    <form onSubmit={onSubmit} className="w-full">
      <CardContent className="space-y-3 p-4">
        {/* Profile Picture and Name Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 w-full items-start">
          {/* Profile Picture */}
          <div className="flex justify-center lg:justify-start">
            <ImageUpload label="Profile Picture (Optional)" value={formData.avatar} onChange={onImageChange} type="avatar" disabled={isLoading} />
          </div>

          {/* Name Fields */}
          <div className="lg:col-span-2 grid grid-cols-1 gap-3 w-full">
            <div className="space-y-1 w-full">
              <Label htmlFor="firstName" className="text-foreground font-medium text-sm">
                First Name
              </Label>
              <div className={`relative transition-all duration-300 w-full ${focusedField === 'firstName' ? 'scale-[1.01]' : ''}`}>
                <User className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-200 z-10 ${focusedField === 'firstName' ? 'text-primary' : 'text-muted-foreground'}`} />
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={onFormChange}
                  onFocus={() => setFocusedField('firstName')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full pl-10 h-9 text-sm transition-all duration-300 border rounded-lg ${
                    focusedField === 'firstName' ? 'border-primary/50 shadow-sm shadow-primary/10 bg-primary/5' : 'border-border hover:border-border/80 bg-background'
                  }`}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-1 w-full">
              <Label htmlFor="lastName" className="text-foreground font-medium text-sm">
                Last Name
              </Label>
              <div className={`relative transition-all duration-300 w-full ${focusedField === 'lastName' ? 'scale-[1.01]' : ''}`}>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={onFormChange}
                  onFocus={() => setFocusedField('lastName')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full h-9 text-sm transition-all duration-300 border rounded-lg ${
                    focusedField === 'lastName' ? 'border-primary/50 shadow-sm shadow-primary/10 bg-primary/5' : 'border-border hover:border-border/80 bg-background'
                  }`}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
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
              placeholder="you@university.edu"
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

        {/* Academic Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
          <div className="space-y-1 w-full ">
            <Label htmlFor="university" className="text-foreground font-medium text-sm ">
              University
            </Label>
            <SearchableSelect
              value={formData.university}
              onValueChange={value => handleSelectChange('university', value)}
              placeholder="Select your university"
              searchPlaceholder="Search universities..."
              emptyMessage="No university found."
              options={ROMANIAN_UNIVERSITIES.map(university => ({
                id: university.id.toString(),
                name: university.name,
                value: university.name,
              }))}
              className={`transition-all duration-300 border rounded-lg ${
                focusedField === 'university' ? 'border-primary/50 shadow-sm shadow-primary/10 bg-primary/5' : 'border-border hover:border-border/80 bg-background'
              }`}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1 w-full">
            <Label htmlFor="faculty" className="text-foreground font-medium text-sm">
              Faculty
            </Label>
            <SearchableSelect
              value={formData.faculty}
              onValueChange={value => handleSelectChange('faculty', value)}
              placeholder="Select your faculty"
              searchPlaceholder="Search faculties..."
              emptyMessage="No faculty found."
              options={COMMON_FACULTIES.map(faculty => ({
                id: faculty.id.toString(),
                name: faculty.name,
                value: faculty.name,
              }))}
              className={`transition-all duration-300 border rounded-lg ${
                focusedField === 'faculty' ? 'border-primary/50 shadow-sm shadow-primary/10 bg-primary/5' : 'border-border hover:border-border/80 bg-background'
              }`}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-1 w-full">
          <Label htmlFor="specialization" className="text-foreground font-medium text-sm">
            Specialization
          </Label>
          <SearchableSelect
            value={formData.specialization}
            onValueChange={value => handleSelectChange('specialization', value)}
            placeholder="Select your specialization"
            searchPlaceholder="Search specializations..."
            emptyMessage="No specialization found."
            options={SPECIALIZATIONS.map(specialization => ({
              id: specialization.id.toString(),
              name: specialization.name,
              value: specialization.name,
            }))}
            className={`transition-all duration-300 border rounded-lg ${
              focusedField === 'specialization' ? 'border-primary/50 shadow-sm shadow-primary/10 bg-primary/5' : 'border-border hover:border-border/80 bg-background'
            }`}
            disabled={isLoading}
          />
        </div>

        {/* Study Year and Education Level */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
          <div className="space-y-1 w-full">
            <Label htmlFor="studyYear" className="text-foreground font-medium text-sm">
              Study Year
            </Label>
            <div className={`relative transition-all duration-300 w-full ${focusedField === 'studyYear' ? 'scale-[1.01]' : ''}`}>
              <Input
                id="studyYear"
                name="studyYear"
                type="number"
                min="1"
                max="6"
                placeholder="1-6"
                value={formData.studyYear}
                onChange={onFormChange}
                onFocus={() => setFocusedField('studyYear')}
                onBlur={() => setFocusedField(null)}
                className={`w-full h-9 text-sm transition-all duration-300 border rounded-lg ${
                  focusedField === 'studyYear' ? 'border-primary/50 shadow-sm shadow-primary/10 bg-primary/5' : 'border-border hover:border-border/80 bg-background'
                }`}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-1 w-full">
            <Label htmlFor="educationLevel" className="text-foreground font-medium text-sm">
              Education Level
            </Label>
            <Select value={formData.educationLevel} onValueChange={value => handleSelectChange('educationLevel', value)} disabled={isLoading}>
              <SelectTrigger
                className={`w-full h-9 text-sm transition-all duration-300 border rounded-lg ${
                  focusedField === 'educationLevel' ? 'border-primary/50 shadow-sm shadow-primary/10 bg-primary/5' : 'border-border hover:border-border/80 bg-background'
                }`}
              >
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={EducationLevel.Bachelor}>Bachelor</SelectItem>
                <SelectItem value={EducationLevel.Master}>Master</SelectItem>
                <SelectItem value={EducationLevel.PhD}>PhD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Password Fields */}
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
              Create Student Account
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </>
          )}
        </Button>
      </CardContent>
    </form>
  );
};

export default StudentRegistrationForm;
