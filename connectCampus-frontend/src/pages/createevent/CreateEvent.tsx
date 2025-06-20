import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@app/components/ui/card';
import { CalendarPlus } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { createEventSchema, CreateEventFormValues } from '@app/schemas/event';
import { useEventManagement } from '@app/hooks/use-events';
// Remove unused imports
import alertService from '@app/services/alert';
import EventFormFields from './components/EventFormFields';
import { useSelector } from 'react-redux';
import { profileCurrentProfileSelector } from '@app/store/selectors/profile-selectors';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  // Get profile data instead of just currentUser
  const currentProfile = useSelector(profileCurrentProfileSelector);

  // Use custom hook for event management
  const { createEvent, loading: isCreating, error } = useEventManagement();

  // Form setup with Zod validation
  const form = useForm<CreateEventFormValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'Technology',
      type: 'Workshop',
      startDate: new Date(),
      endDate: new Date(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      location: '',
      capacity: 50,
      maxAttendees: undefined, // Optional field
      isPublic: true,
      isFeatured: false,
      registrationRequired: false,
      registrationDeadline: undefined, // Optional field
      registrationUrl: '', // Optional field
      isFree: true,
      price: undefined, // Optional when isFree is true
      paymentMethod: '', // Optional field
      contactEmail: currentProfile?.email || '',
      status: 'Draft',
      tags: [],
      coverImage: null,
    },
  });

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = form;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update contact email when user data is available
  useEffect(() => {
    if (currentProfile?.email) {
      setValue('contactEmail', currentProfile.email);
    }
  }, [currentProfile, setValue]);

  // Show errors if any
  useEffect(() => {
    if (error) {
      alertService.errorAlert({
        title: 'Error',
        message: error,
      });
    }
  }, [error]);

  // Watch form values for conditional logic
  const watchIsFree = watch('isFree');
  const watchStartDate = watch('startDate');
  const watchEndDate = watch('endDate');
  const watchStatus = watch('status');

  // Auto-adjust end date if it's before start date
  useEffect(() => {
    if (watchStartDate && watchEndDate && watchEndDate <= watchStartDate) {
      const newEndDate = new Date(watchStartDate);
      newEndDate.setHours(newEndDate.getHours() + 2); // Default 2-hour duration
      setValue('endDate', newEndDate);
    }
  }, [watchStartDate, watchEndDate, setValue]);

  // Clear price if event is free
  useEffect(() => {
    if (watchIsFree) {
      setValue('price', 0);
    }
  }, [watchIsFree, setValue]);

  const onSubmit = async (values: CreateEventFormValues) => {
    if (!currentProfile?.associationProfile) {
      alertService.errorAlert({
        title: 'Authentication Required',
        message: 'You must be logged in as an association to create an event',
      });
      navigate('/login');
      return;
    }

    try {
      // Get association ID from profile
      const associationId = currentProfile.associationProfile.id;

      if (!associationId) {
        alertService.errorAlert({
          title: 'Missing Association',
          message: 'Unable to determine your association ID. Please ensure your profile is complete.',
        });
        return;
      }

      await createEvent(values, associationId);

      // Success - navigate to events page
      alertService.successAlert('Event created successfully!');
      navigate('/association/events');
    } catch (createError) {
      // Error handling is managed by the hook and alertService
      console.error('Failed to create event:', createError);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSaveDraft = async () => {
    if (!currentProfile?.associationProfile) {
      alertService.errorAlert({
        title: 'Authentication Required',
        message: 'You must be logged in as an association to save a draft',
      });
      navigate('/login');
      return;
    }

    try {
      // Get association ID from profile
      const associationId = currentProfile.associationProfile.id;

      if (!associationId) {
        alertService.errorAlert({
          title: 'Missing Association',
          message: 'Unable to determine your association ID. Please ensure your profile is complete.',
        });
        return;
      }

      // Get current form data and set status to Draft
      const formData = form.getValues();
      formData.status = 'Draft';

      // For drafts, we allow incomplete forms, so we bypass validation
      await createEvent(formData, associationId);

      // Success - navigate to events page
      alertService.successAlert('Event draft saved successfully!');
      navigate('/association/events');
    } catch (createError) {
      // Error handling is managed by the hook and alertService
      console.error('Failed to save draft:', createError);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/3 rounded-full blur-3xl" />
      </div>

      <div className={`container py-4 max-w-3xl mx-auto px-3 md:px-4 relative z-10 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Page Header */}
        <div className={`mb-4 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary 
              flex items-center justify-center shadow-md"
            >
              <CalendarPlus className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1
                className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary 
                to-secondary bg-clip-text text-transparent"
              >
                Create Event
              </h1>
              <p className="text-muted-foreground text-sm">Create a new event for your association and engage with your community</p>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className={`transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Card
            className="border-border/40 shadow-2xl bg-card/80 backdrop-blur-sm 
            hover:shadow-3xl transition-all duration-300"
          >
            <CardHeader className="space-y-2 pb-4">
              <CardTitle
                className="text-xl font-bold bg-gradient-to-r from-primary 
                to-secondary bg-clip-text text-transparent"
              >
                Event Details
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm">
                Fill in the details for your new event. Make sure to provide clear and engaging information to attract attendees.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
                              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className={`transition-all duration-500 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <EventFormFields form={form} />
                  </div>

                  <div className={`transition-all duration-500 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-border/40">
                      <Button type="button" variant="outline" onClick={handleCancel} disabled={isCreating} className="flex-1 h-8 text-xs">
                        Cancel
                      </Button>

                                          {watchStatus === 'Draft' ? (
                      <Button type="button" variant="secondary" onClick={handleSaveDraft} disabled={isCreating} className="flex-1 h-8 text-xs">
                          {isCreating ? (
                            <>
                              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
                              Saving Draft...
                            </>
                          ) : (
                            'Save as Draft'
                          )}
                      </Button>
                      ) : (
                        <Button type="submit" disabled={isCreating} className="flex-1 h-8 text-xs bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                          {isCreating ? (
                            <>
                              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
                              Publishing...
                            </>
                          ) : (
                            'Publish Event'
                          )}
                        </Button>
                      )}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Form Validation Summary */}
        {Object.keys(errors).length > 0 && (
          <div className={`mt-6 transition-all duration-500 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="p-4">
                <h3 className="font-semibold text-destructive mb-2">Please fix the following errors:</h3>
                <ul className="space-y-1 text-sm text-destructive">
                  {Object.entries(errors).map(([field, fieldError]) => (
                    <li key={field} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-destructive rounded-full" />
                      <span className="capitalize">{field}:</span>
                      <span>{fieldError?.message}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateEvent;
