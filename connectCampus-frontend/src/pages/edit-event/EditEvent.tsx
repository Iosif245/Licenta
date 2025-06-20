import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@app/components/ui/card';
import { Edit3, ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { updateEventSchema, UpdateEventFormValues } from '@app/schemas/event';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { getEventByIdActionAsync, updateEventActionAsync } from '@app/store/actions/events/events-async-actions';
import { selectedEventSelector, eventDetailStateSelector } from '@app/store/selectors/events-selectors';
import EventFormFields from '@app/pages/createevent/components/EventFormFields';
import alertService from '@app/services/alert';

const EditEvent: React.FC = () => {
  // React Router hooks
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();

  // Redux hooks
  const dispatch = useAppDispatch();
  const event = useAppSelector(selectedEventSelector);
  const eventDetailState = useAppSelector(eventDetailStateSelector);

  // Local state - declare all hooks first
  const [mounted, setMounted] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [initialLocationType, setInitialLocationType] = useState<'online' | 'location'>('location');

  // Extract state variables - avoid conditional hooks
  const isLoadingEvent = eventDetailState.loading;
  const eventError = eventDetailState.error;

  // React Hook Form setup - must be before any conditional logic
  const form = useForm<UpdateEventFormValues>({
    resolver: zodResolver(updateEventSchema),
    defaultValues: {
      title: '',
      description: '',
      category: undefined,
      type: undefined,
      status: 'Draft',
      startDate: undefined,
      endDate: undefined,
      timezone: 'Europe/Bucharest',
      location: '',
      capacity: undefined,
      maxAttendees: undefined,
      isPublic: true,
      isFeatured: false,
      registrationRequired: false,
      registrationDeadline: undefined,
      registrationUrl: '',
      isFree: true,
      price: undefined,
      paymentMethod: '',
      contactEmail: '',
      tags: [],
      coverImage: null,
    },
  });

  // Handle mounting animation
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Form methods - destructure after form initialization
  const { setValue } = form;

  // Fetch event data on component mount
  useEffect(() => {
    if (eventId) {
      dispatch(getEventByIdActionAsync(eventId));
    }
  }, [dispatch, eventId]);

  // Populate form when event data is available
  useEffect(() => {
    if (event) {
      // Helper function to safely parse date strings
      const parseDate = (dateString: string | Date | null | undefined): Date | undefined => {
        if (!dateString) return undefined;
        if (dateString instanceof Date) return dateString;

        try {
          const parsed = new Date(dateString);
          return isNaN(parsed.getTime()) ? undefined : parsed;
        } catch {
          return undefined;
        }
      };

      // Type guards for enum values
      const isValidCategory = (category: any): category is UpdateEventFormValues['category'] => {
        const validCategories = [
          'Academic',
          'Workshop',
          'Conference',
          'Cultural',
          'Sports',
          'Technology',
          'Arts',
          'Business',
          'Science',
          'Social',
          'Environmental',
          'Healthcare',
          'Career',
          'Competition',
          'Other',
        ];
        return typeof category === 'string' && validCategories.includes(category);
      };

      const isValidType = (type: any): type is UpdateEventFormValues['type'] => {
        const validTypes = ['Workshop', 'Conference', 'Cultural', 'Sports', 'Competition', 'Other', 'Party', 'Training', 'Seminar', 'Networking', 'Fundraising'];
        return typeof type === 'string' && validTypes.includes(type);
      };

      const isValidStatus = (status: any): status is UpdateEventFormValues['status'] => {
        const validStatuses = ['Draft', 'Published', 'Cancelled', 'Completed'];
        return typeof status === 'string' && validStatuses.includes(status);
      };

      // Populate form with event data
      const formData: Partial<UpdateEventFormValues> = {
        title: event.title || '',
        description: event.description || '',
        category: isValidCategory(event.category) ? event.category : undefined,
        type: isValidType(event.type) ? event.type : undefined,
        status: isValidStatus(event.status) ? event.status : 'Draft',
        startDate: parseDate(event.startDate),
        endDate: parseDate(event.endDate),
        timezone: event.timezone || 'Europe/Bucharest',
        location: event.location || '',
        capacity: event.capacity || undefined,
        maxAttendees: event.maxAttendees || undefined,
        isPublic: event.isPublic !== undefined ? event.isPublic : true,
        isFeatured: event.isFeatured || false,
        registrationRequired: event.registrationRequired || false,
        registrationDeadline: parseDate(event.registrationDeadline),
        registrationUrl: event.registrationUrl || '',
        isFree: event.isFree !== false, // Default to true if undefined
        price: event.price || undefined,
        paymentMethod: event.paymentMethod || '',
        contactEmail: event.contactEmail || '',
        tags: Array.isArray(event.tags) ? event.tags : [],
        coverImage: null, // Don't set existing file, just show as preview
      };

      // Determine initial location type based on event location
      const initialLocationTypeValue: 'online' | 'location' =
        event.location === 'Online Event' ||
        event.location?.toLowerCase().includes('online') ||
        event.location?.toLowerCase().includes('virtual') ||
        event.location?.toLowerCase().includes('zoom') ||
        event.location?.toLowerCase().includes('teams') ||
        event.location?.toLowerCase().includes('meet')
          ? 'online'
          : 'location';

      // Set the initial location type state
      setInitialLocationType(initialLocationTypeValue);

      // Update form values
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined) {
          setValue(key as keyof UpdateEventFormValues, value as any);
        }
      });
    }
  }, [event, setValue]);

  // Handle form submission
  const onSubmit = useCallback(
    async (data: UpdateEventFormValues) => {
      if (!eventId) {
        alertService.errorAlert({
          title: 'Error',
          message: 'Event ID is missing',
        });
        return;
      }

      // Ensure the ID field is set
      data.id = eventId;

      setIsUpdating(true);

      try {
        // Dispatch update action
        await dispatch(updateEventActionAsync({ eventId, eventData: data })).unwrap();
        alertService.successAlert('Event updated successfully!');

        // Redirect to the events page
        navigate('/association/events');
      } catch (error: any) {
        alertService.errorAlert({
          title: 'Update Failed',
          message: error?.message || 'Failed to update event. Please try again.',
        });
      } finally {
        setIsUpdating(false);
      }
    },
    [dispatch, eventId, navigate],
  );

  // Handle cancel action
  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  // Handle update action
  const handleUpdate = () => {
    // Get current form values
    const formValues = form.getValues();

    // Add the event ID to the form values
    if (eventId) {
      formValues.id = eventId;
    } else {
      alertService.errorAlert({
        title: 'Error',
        message: 'Event ID is missing',
      });
      return;
    }

    setIsUpdating(true);

    // Directly submit using the onSubmit handler
    onSubmit(formValues)
      .catch(error => {
        console.error('Error updating event:', error);
      })
      .finally(() => {
        setIsUpdating(false);
      });
  };

  // Loading, error and not found states (unchanged)
  if (isLoadingEvent) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-muted animate-pulse rounded"></div>
          <div className="w-32 h-6 bg-muted animate-pulse rounded"></div>
        </div>

        <Card>
          <CardHeader>
            <div className="w-48 h-7 bg-muted animate-pulse rounded"></div>
            <div className="w-64 h-4 bg-muted animate-pulse rounded"></div>
          </CardHeader>
          <CardContent className="space-y-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="w-24 h-4 bg-muted animate-pulse rounded"></div>
                <div className="w-full h-9 bg-muted animate-pulse rounded"></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (eventError) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-destructive mb-4">Failed to load event: {eventError}</p>
            <Button onClick={() => eventId && dispatch(getEventByIdActionAsync(eventId))}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!event && !isLoadingEvent) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">Event not found</p>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main render
  return (
    <div className="container max-w-4xl mx-auto py-4 px-3 md:px-4 space-y-4">
      {/* Header */}
      <div className={`transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center gap-2 mb-1">
          <Button variant="ghost" size="sm" onClick={handleCancel} className="text-muted-foreground hover:text-foreground h-8 w-8 p-0">
            <ArrowLeft className="h-3 w-3" />
          </Button>
          <div className="flex items-center gap-1.5">
            <Edit3 className="h-4 w-4 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Edit Event</h1>
          </div>
        </div>
        <p className="text-muted-foreground text-sm pl-10">Update your event details and settings</p>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-500 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Form wrapper without onSubmit */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Event Details</CardTitle>
              <CardDescription className="text-sm">Update the information and settings for your event.</CardDescription>
            </CardHeader>
            <CardContent>
              <EventFormFields form={form} currentImageUrl={event?.coverImageUrl || undefined} initialLocationType={initialLocationType} />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-border/40">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isUpdating} className="flex-1 h-8 text-xs">
              Cancel
            </Button>

            {/* Update button */}
            <Button
              type="button"
              onClick={handleUpdate}
              disabled={isUpdating}
              className="flex-1 h-8 text-xs bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Updating Event...
                </>
              ) : (
                <>
                  <Edit3 className="h-3 w-3 mr-1" />
                  Update Event
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
