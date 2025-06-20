import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@app/components/ui/tabs';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { registerStudentActionAsync, registerAssociationActionAsync } from '@app/store/actions/auth/auth-async-actions';
import { authIsLoadingSelector, authStateSelector } from '@app/store/selectors/auth-selectors';
import { userRoleSelector } from '@app/store/selectors/user-selectors';
import { AuthState } from '@app/types/auth/IAuthState';
import { Roles } from '@app/types/user/Role';
import { StudentRegistrationFormValues, AssociationRegistrationFormValues } from '@app/schemas';
import { EducationLevel } from '@app/types/student';
import React from 'react';
import StudentRegistrationForm from './components/StudentRegistrationForm';
import AssociationRegistrationForm from './components/AssociationRegistrationForm';

const Register = () => {
  const [activeTab, setActiveTab] = useState('student');
  const [mounted, setMounted] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(authIsLoadingSelector);
  const authState = useAppSelector(authStateSelector);
  const userRole = useAppSelector(userRoleSelector);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (authState === AuthState.LoggedIn && userRole) {
      if (userRole === Roles.STUDENT) {
        navigate('/events');
      } else if (userRole === Roles.ASSOCIATION) {
        navigate('/association/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [authState, userRole, navigate]);

  const [studentForm, setStudentForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    university: '',
    faculty: '',
    specialization: '',
    studyYear: 1,
    educationLevel: EducationLevel.Bachelor,
    avatar: null as File | null,
  });

  const [associationForm, setAssociationForm] = useState({
    name: '',
    email: '',
    password: '',
    description: '',
    category: 'Academic' as 'Academic' | 'Cultural' | 'Sports' | 'Technology' | 'Arts' | 'Business' | 'Science' | 'Social' | 'Environmental' | 'Healthcare' | 'Other',
    foundedYear: new Date().getFullYear(),
    website: '',
    logo: null as File | null,
    coverImage: null as File | null,
    location: '',
    phone: '',
    address: '',
    facebook: '',
    twitter: '',
    instagram: '',
    linkedIn: '',
  });

  const [confirmPasswords, setConfirmPasswords] = useState({
    student: '',
    association: '',
  });

  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStudentForm(prev => ({
      ...prev,
      [name]: name === 'studyYear' ? Number(value) : name === 'educationLevel' ? (value as EducationLevel) : value,
    }));
  };

  const handleAssociationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAssociationForm(prev => ({
      ...prev,
      [name]: name === 'foundedYear' ? Number(value) : value,
    }));
  };

  const handleStudentImageChange = (file: File | null) => {
    setStudentForm(prev => ({ ...prev, avatar: file }));
  };

  const handleAssociationImageChange = (field: 'logo' | 'coverImage', file: File | null) => {
    setAssociationForm(prev => ({ ...prev, [field]: file }));
  };

  const handleConfirmPasswordChange = (type: 'student' | 'association', value: string) => {
    setConfirmPasswords(prev => ({ ...prev, [type]: value }));
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (studentForm.password !== confirmPasswords.student) {
      alert('Passwords do not match');
      return;
    }

    // Validate required fields
    if (
      !studentForm.firstName ||
      !studentForm.lastName ||
      !studentForm.email ||
      !studentForm.password ||
      !studentForm.university ||
      !studentForm.faculty ||
      !studentForm.specialization
    ) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(studentForm.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Validate password strength
    if (studentForm.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    try {
      // Convert form data to match the schema
      const registrationData: StudentRegistrationFormValues = {
        firstName: studentForm.firstName,
        lastName: studentForm.lastName,
        email: studentForm.email,
        password: studentForm.password,
        confirmPassword: confirmPasswords.student,
        university: studentForm.university,
        faculty: studentForm.faculty,
        specialization: studentForm.specialization,
        studyYear: studentForm.studyYear,
        educationLevel: studentForm.educationLevel,
        avatar: studentForm.avatar,
      };

      await dispatch(registerStudentActionAsync(registrationData)).unwrap();
      // Success message and navigation are handled by the action
    } catch (error: any) {
      console.error('Student registration failed:', error);
      // Error is already shown by the action via ApiException
    }
  };

  const handleAssociationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (associationForm.password !== confirmPasswords.association) {
      alert('Passwords do not match');
      return;
    }

    // Validate required fields
    if (!associationForm.name || !associationForm.email || !associationForm.password || !associationForm.description || !associationForm.category) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(associationForm.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Validate password strength
    if (associationForm.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    try {
      // Convert form data to match the schema
      const registrationData: AssociationRegistrationFormValues = {
        name: associationForm.name,
        email: associationForm.email,
        password: associationForm.password,
        confirmPassword: confirmPasswords.association,
        description: associationForm.description,
        category: associationForm.category,
        foundedYear: associationForm.foundedYear,
        website: associationForm.website || undefined,
        logo: associationForm.logo,
        coverImage: associationForm.coverImage,
        location: associationForm.location || undefined,
        phone: associationForm.phone || undefined,
        address: associationForm.address || undefined,
        facebook: associationForm.facebook || undefined,
        twitter: associationForm.twitter || undefined,
        instagram: associationForm.instagram || undefined,
        linkedIn: associationForm.linkedIn || undefined,
      };

      await dispatch(registerAssociationActionAsync(registrationData)).unwrap();
      // Success message and navigation are handled by the action
    } catch (error: any) {
      console.error('Association registration failed:', error);
      // Error is already shown by the action via ApiException
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 
      flex flex-col items-center justify-center p-2 relative overflow-hidden"
    >
      {/* Animated background patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/3 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/10 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className={`relative z-10 w-full max-w-xl transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Main card */}
        <Card
          className={`backdrop-blur-lg bg-card/95 border-border/50 shadow-2xl shadow-primary/5 
          transition-all duration-700 delay-300 hover:shadow-3xl hover:shadow-primary/10 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <CardHeader className="space-y-3 pb-4">
            <CardTitle
              className="text-2xl font-bold text-center bg-gradient-to-r from-primary 
              to-secondary bg-clip-text text-transparent"
            >
              Join CampusConnect
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground text-xs leading-relaxed">Create your account to connect with campus life</CardDescription>
          </CardHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full px-4">
            <TabsList className="grid w-full grid-cols-2 mb-4 h-8">
              <TabsTrigger value="student" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs">
                Student
              </TabsTrigger>
              <TabsTrigger value="association" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs">
                Association
              </TabsTrigger>
            </TabsList>

            <TabsContent value="student" className="mt-0">
              <StudentRegistrationForm
                formData={studentForm}
                confirmPassword={confirmPasswords.student}
                isLoading={isLoading}
                onFormChange={handleStudentChange}
                onImageChange={handleStudentImageChange}
                onConfirmPasswordChange={value => handleConfirmPasswordChange('student', value)}
                onSubmit={handleStudentSubmit}
              />
            </TabsContent>

            <TabsContent value="association" className="mt-0">
              <AssociationRegistrationForm
                formData={associationForm}
                confirmPassword={confirmPasswords.association}
                isLoading={isLoading}
                onFormChange={handleAssociationChange}
                onImageChange={handleAssociationImageChange}
                onConfirmPasswordChange={value => handleConfirmPasswordChange('association', value)}
                onSubmit={handleAssociationSubmit}
              />
            </TabsContent>
          </Tabs>

          <CardFooter className="flex flex-col space-y-3 pt-4">
            <div className="text-xs text-center text-muted-foreground">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary font-semibold hover:text-primary/80 transition-colors duration-200 
                  hover:underline decoration-primary/50 underline-offset-4"
              >
                Sign in
              </Link>
            </div>

            <div className="text-xs text-center text-muted-foreground max-w-md">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-primary hover:text-primary/80 transition-colors duration-200">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary hover:text-primary/80 transition-colors duration-200">
                Privacy Policy
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
