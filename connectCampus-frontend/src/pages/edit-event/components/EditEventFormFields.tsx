import React, { useRef, useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import { Textarea } from '@app/components/ui/textarea';
import { Switch } from '@app/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@app/components/ui/select';
import { Calendar as CalendarIcon, Tag, MapPin, X, Image as ImageIcon, Globe, Building, Clock } from 'lucide-react';
import { UpdateEventFormValues } from '@app/schemas/event';
import { Button } from '@app/components/ui/button';
import { Card, CardContent } from '@app/components/ui/card';
import { Calendar } from '@app/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@app/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@app/lib/utils';
// eslint-disable-next-line import/extensions
import interestsData from '@app/data/interests.json';
import { getAllInterests } from '@app/types/interests';
import { ContentImprover } from '@app/components/ui/ContentImprover';

interface EditEventFormFieldsProps {
  form: UseFormReturn<UpdateEventFormValues>;
  currentImageUrl?: string;
  initialLocationType?: 'online' | 'location';
}

const EditEventFormFields = ({ form, currentImageUrl, initialLocationType }: EditEventFormFieldsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string>('');
  const [locationType, setLocationType] = useState<'online' | 'location'>(initialLocationType || 'location');

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  // Watch form values for conditional logic
  const watchIsFree = watch('isFree');
  const watchRegistrationRequired = watch('registrationRequired');
  const watchTags = watch('tags') || [];
  const watchCoverImage = watch('coverImage');
  const watchStatus = watch('status');
  const watchCategory = watch('category');
  const watchType = watch('type');

  // Get all interests for dropdown
  const allInterests = getAllInterests(interestsData);

  // Event categories
  const categories = [
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

  // Event types matching backend enum
  const eventTypes = [
    { value: 'Party', label: 'Party' },
    { value: 'Conference', label: 'Conference' },
    { value: 'Training', label: 'Training' },
    { value: 'Workshop', label: 'Workshop' },
    { value: 'Seminar', label: 'Seminar' },
    { value: 'Networking', label: 'Networking' },
    { value: 'Fundraising', label: 'Fundraising' },
    { value: 'Competition', label: 'Competition' },
    { value: 'Cultural', label: 'Cultural' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Other', label: 'Other' },
  ];

  // Event status options
  const eventStatuses = [
    { value: 'Draft', label: 'Draft' },
    { value: 'Published', label: 'Published' },
  ];

  // Timezone options (shorter list for compactness)
  const timezones = [
    { value: 'Europe/Bucharest', label: 'Bucharest (EET)' },
    { value: 'UTC', label: 'UTC' },
    { value: 'Europe/London', label: 'London (GMT)' },
    { value: 'Europe/Paris', label: 'Paris (CET)' },
    { value: 'America/New_York', label: 'New York (EST)' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (PST)' },
  ];

  // Handle cover image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue('coverImage', file);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Remove cover image
  const removeCoverImage = () => {
    setValue('coverImage', null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Update location type when initialLocationType changes
  useEffect(() => {
    if (initialLocationType) {
      setLocationType(initialLocationType);
    }
  }, [initialLocationType]);

  // Add interest as tag
  const addInterestAsTag = () => {
    if (selectedInterests && !watchTags.includes(selectedInterests) && watchTags.length < 10) {
      setValue('tags', [...watchTags, selectedInterests]);
      setSelectedInterests('');
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setValue(
      'tags',
      watchTags.filter(tag => tag !== tagToRemove),
    );
  };

  // Handle location type change
  const handleLocationTypeChange = (type: 'online' | 'location') => {
    setLocationType(type);
    if (type === 'online') {
      setValue('location', 'Online Event');
    } else {
      // Only clear if it was previously "Online Event"
      const currentLocation = watch('location');
      if (currentLocation === 'Online Event') {
        setValue('location', '');
      }
    }
  };

  // Determine what image to show: new upload preview, current image, or upload placeholder
  const getImageToShow = () => {
    if (previewUrl) {
      // New file selected - show preview
      return { type: 'preview', url: previewUrl };
    } else if (currentImageUrl && !watchCoverImage) {
      // Has current image and no new file selected
      return { type: 'current', url: currentImageUrl };
    } else {
      // No image to show
      return { type: 'none', url: null };
    }
  };

  const imageToShow = getImageToShow();

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
          Basic Information
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-sm font-medium">
              Event Title *
            </Label>
            <Input id="title" {...register('title')} placeholder="e.g., Tech Workshop: Introduction to AI" className="h-9" />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="category" className="text-sm font-medium">
              Category *
            </Label>
            <Select 
              value={watchCategory || ''} 
              onValueChange={value => setValue('category', value as any)}
            >
              <SelectTrigger className="h-9">
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
            {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="type" className="text-sm font-medium">
              Event Type *
            </Label>
            <Select 
              value={watchType || ''} 
              onValueChange={value => setValue('type', value as any)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="status" className="text-sm font-medium">
              Status *
            </Label>
            <Select 
              value={watchStatus || ''}
              onValueChange={value => setValue('status', value as any)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {eventStatuses.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && <p className="text-xs text-destructive">{errors.status.message}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="contactEmail" className="text-sm font-medium">
            Contact Email *
          </Label>
          <Input id="contactEmail" type="email" {...register('contactEmail')} placeholder="contact@association.com" className="h-9" />
          {errors.contactEmail && <p className="text-xs text-destructive">{errors.contactEmail.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description" className="text-sm font-medium">
            Description *
          </Label>
          <Textarea id="description" {...register('description')} placeholder="Provide a detailed description of your event..." className="min-h-[100px] resize-none" />
          {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          
          {/* AI Content Improver */}
          <ContentImprover
            content={watch('description') || ''}
            onImprove={(improvedContent) => setValue('description', improvedContent)}
            type="event"
            className="mt-2"
          />
        </div>
      </div>

      {/* Cover Image Upload */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
          Cover Image
        </h3>

        <div className="space-y-3">
          {imageToShow.type !== 'none' ? (
            <Card>
              <CardContent className="p-3">
                <div className="relative">
                  <img
                    src={imageToShow.url!}
                    alt={imageToShow.type === 'current' ? 'Current cover image' : 'Cover preview'}
                    className="w-full h-32 object-cover rounded-lg"
                    onError={e => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <Button type="button" variant="destructive" size="sm" className="absolute top-1 right-1" onClick={removeCoverImage}>
                    <X className="h-3 w-3" />
                  </Button>
                  {imageToShow.type === 'current' && <div className="absolute bottom-1 left-1 bg-black/50 text-white px-2 py-1 rounded text-xs">Current Image</div>}
                  {imageToShow.type === 'preview' && <div className="absolute bottom-1 left-1 bg-black/50 text-white px-2 py-1 rounded text-xs">New Image</div>}
                </div>
                <div className="mt-2 text-center">
                  <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="w-full">
                    {imageToShow.type === 'current' ? 'Replace Image' : 'Change Image'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div
              className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-1">Click to upload cover image</p>
              <p className="text-xs text-muted-foreground">JPEG, PNG, WebP (max 5MB)</p>
            </div>
          )}

          <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleImageUpload} className="hidden" />

          {errors.coverImage && <p className="text-xs text-destructive">{errors.coverImage.message}</p>}

          {currentImageUrl && imageToShow.type === 'current' && (
            <p className="text-xs text-muted-foreground text-center">This is your current cover image. Upload a new file to replace it.</p>
          )}
        </div>
      </div>

      {/* Date and Location */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
          Date & Location
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Start Date & Time *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('w-full h-9 justify-start text-left font-normal', !watch('startDate') && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watch('startDate') ? format(watch('startDate'), 'PPP p') : 'Pick start date & time'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 max-w-sm" align="start">
                <div className="p-0">
                  <Calendar
                    mode="single"
                    selected={watch('startDate')}
                    onSelect={date => {
                      if (date) {
                        // Keep existing time or set to current time
                        const existingDate = watch('startDate');
                        if (existingDate) {
                          date.setHours(existingDate.getHours());
                          date.setMinutes(existingDate.getMinutes());
                        } else {
                          const now = new Date();
                          date.setHours(now.getHours());
                          date.setMinutes(now.getMinutes());
                        }
                        setValue('startDate', date);
                      }
                    }}
                    disabled={date => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                  />
                  <div className="p-3 border-t">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="time"
                        value={watch('startDate') ? format(watch('startDate'), 'HH:mm') : ''}
                        onChange={e => {
                          const time = e.target.value;
                          const date = watch('startDate') || new Date();
                          const [hours, minutes] = time.split(':').map(Number);
                          date.setHours(hours);
                          date.setMinutes(minutes);
                          setValue('startDate', new Date(date));
                        }}
                        className="h-8 flex-1"
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            {errors.startDate && <p className="text-xs text-destructive">{errors.startDate.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">End Date & Time *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('w-full h-9 justify-start text-left font-normal', !watch('endDate') && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watch('endDate') ? format(watch('endDate'), 'PPP p') : 'Pick end date & time'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 max-w-sm" align="start">
                <div className="p-0">
                  <Calendar
                    mode="single"
                    selected={watch('endDate')}
                    onSelect={date => {
                      if (date) {
                        // Keep existing time or set default
                        const existingDate = watch('endDate');
                        if (existingDate) {
                          date.setHours(existingDate.getHours());
                          date.setMinutes(existingDate.getMinutes());
                        } else {
                          // Default to 2 hours after start date
                          const startDate = watch('startDate');
                          if (startDate) {
                            date.setHours(startDate.getHours() + 2);
                            date.setMinutes(startDate.getMinutes());
                          }
                        }
                        setValue('endDate', date);
                      }
                    }}
                    disabled={date => {
                      const startDate = watch('startDate');
                      return startDate ? date < startDate : date < new Date(new Date().setHours(0, 0, 0, 0));
                    }}
                    initialFocus
                  />
                  <div className="p-3 border-t">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="time"
                        value={watch('endDate') ? format(watch('endDate'), 'HH:mm') : ''}
                        onChange={e => {
                          const time = e.target.value;
                          const date = watch('endDate') || new Date();
                          const [hours, minutes] = time.split(':').map(Number);
                          date.setHours(hours);
                          date.setMinutes(minutes);
                          setValue('endDate', new Date(date));
                        }}
                        className="h-8 flex-1"
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            {errors.endDate && <p className="text-xs text-destructive">{errors.endDate.message}</p>}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="timezone" className="text-sm font-medium">
              Timezone *
            </Label>
            <Select value={watch('timezone') || ''} onValueChange={value => setValue('timezone', value)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                {timezones.map(tz => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.timezone && <p className="text-xs text-destructive">{errors.timezone.message}</p>}
          </div>

          <div className="w-full max-w-xs space-y-1.5">
            <Label className="text-sm font-medium">Registration Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('w-full h-9 justify-start text-left font-normal', !watch('registrationDeadline') && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watch('registrationDeadline') ? format(watch('registrationDeadline'), 'PPP p') : 'Optional deadline'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 max-w-sm" align="start">
                <div className="p-0">
                  <Calendar
                    mode="single"
                    selected={watch('registrationDeadline')}
                    onSelect={date => {
                      if (date) {
                        const existingDate = watch('registrationDeadline');
                        if (existingDate) {
                          date.setHours(existingDate.getHours());
                          date.setMinutes(existingDate.getMinutes());
                        } else {
                          date.setHours(23);
                          date.setMinutes(59);
                        }
                        setValue('registrationDeadline', date);
                      }
                    }}
                    disabled={date => {
                      const startDate = watch('startDate');
                      return startDate ? date > startDate : false;
                    }}
                    initialFocus
                  />
                  <div className="p-3 border-t flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="time"
                        value={watch('registrationDeadline') ? format(watch('registrationDeadline'), 'HH:mm') : ''}
                        onChange={e => {
                          const time = e.target.value;
                          const date = watch('registrationDeadline') || new Date();
                          const [hours, minutes] = time.split(':').map(Number);
                          date.setHours(hours);
                          date.setMinutes(minutes);
                          setValue('registrationDeadline', new Date(date));
                        }}
                        className="h-8 w-20"
                      />
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setValue('registrationDeadline', undefined)}>
                      Clear
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            {errors.registrationDeadline && <p className="text-xs text-destructive">{errors.registrationDeadline.message}</p>}
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Event Format *</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={locationType === 'location' ? 'default' : 'outline'}
                onClick={() => handleLocationTypeChange('location')}
                className="flex-1 h-9"
                size="sm"
              >
                <Building className="h-3 w-3 mr-2" />
                At Location
              </Button>
              <Button type="button" variant={locationType === 'online' ? 'default' : 'outline'} onClick={() => handleLocationTypeChange('online')} className="flex-1 h-9" size="sm">
                <Globe className="h-3 w-3 mr-2" />
                Online
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="location" className="text-sm font-medium">
              {locationType === 'online' ? 'Event Location' : 'Location Details'} *
            </Label>
            <div className="relative">
              <Input
                id="location"
                {...register('location')}
                value={locationType === 'online' ? 'Online Event' : watch('location') || ''}
                onChange={e => {
                  if (locationType === 'location') {
                    setValue('location', e.target.value);
                  }
                }}
                placeholder={locationType === 'online' ? 'Online Event' : 'Engineering Building, Room 101'}
                className="pl-9 h-9"
                disabled={locationType === 'online'}
              />
              {locationType === 'online' ? (
                <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              ) : (
                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              )}
            </div>
            {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
          Tags
        </h3>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="interests" className="text-sm font-medium">
              Add Interests as Tags (Max 10)
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                <Select value={selectedInterests || ''} onValueChange={setSelectedInterests}>
                  <SelectTrigger className="h-9 pl-9">
                    <SelectValue placeholder="Select an interest to add as tag" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {allInterests
                      .filter(interest => !watchTags.includes(interest.name))
                      .map(interest => (
                        <SelectItem key={interest.name} value={interest.name}>
                          <div className="flex flex-col">
                            <span>{interest.name}</span>
                            <span className="text-xs text-muted-foreground">{interest.category.replace('_', ' ')}</span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="button" onClick={addInterestAsTag} disabled={!selectedInterests || watchTags.length >= 10} size="sm" className="h-9">
                Add
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{watchTags.length}/10 tags used</p>
          </div>

          {watchTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {watchTags.map((tag, index) => (
                <div key={index} className="flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs">
                  <span>{tag}</span>
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive">
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Capacity and Attendees */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
          Capacity & Attendees
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="capacity" className="text-sm font-medium">
              Capacity *
            </Label>
            <Input id="capacity" type="number" min="1" max="10000" {...register('capacity', { valueAsNumber: true })} className="h-9" />
            {errors.capacity && <p className="text-xs text-destructive">{errors.capacity.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="maxAttendees" className="text-sm font-medium">
              Max Attendees
            </Label>
            <Input
              id="maxAttendees"
              type="number"
              min="1"
              {...register('maxAttendees', {
                valueAsNumber: true,
                setValueAs: value => (value === '' ? undefined : Number(value)),
              })}
              placeholder="Leave empty for unlimited"
              className="h-9"
            />
            {errors.maxAttendees && <p className="text-xs text-destructive">{errors.maxAttendees.message}</p>}
          </div>
        </div>
      </div>

      {/* Event Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
          Event Settings
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="isPublic" className="text-sm font-medium">
                Public Event
              </Label>
              <p className="text-xs text-muted-foreground">Make this event visible to everyone</p>
            </div>
            <Switch id="isPublic" checked={watch('isPublic') ?? true} onCheckedChange={checked => setValue('isPublic', checked)} />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="isFeatured" className="text-sm font-medium">
                Featured Event
              </Label>
              <p className="text-xs text-muted-foreground">Highlight this event on the platform</p>
            </div>
            <Switch id="isFeatured" checked={watch('isFeatured') ?? false} onCheckedChange={checked => setValue('isFeatured', checked)} />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="registrationRequired" className="text-sm font-medium">
                Registration Required
              </Label>
              <p className="text-xs text-muted-foreground">Require users to register to attend</p>
            </div>
            <Switch id="registrationRequired" checked={watch('registrationRequired') ?? false} onCheckedChange={checked => setValue('registrationRequired', checked)} />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="isFree" className="text-sm font-medium">
                Free Event
              </Label>
              <p className="text-xs text-muted-foreground">This event is free to attend</p>
            </div>
            <Switch id="isFree" checked={watch('isFree') ?? true} onCheckedChange={checked => setValue('isFree', checked)} />
          </div>
        </div>

        {watchRegistrationRequired && (
          <div className="space-y-1.5">
            <Label htmlFor="registrationUrl" className="text-sm font-medium">
              Registration URL
            </Label>
            <Input id="registrationUrl" type="url" {...register('registrationUrl')} placeholder="https://registration.example.com" className="h-9" />
            {errors.registrationUrl && <p className="text-xs text-destructive">{errors.registrationUrl.message}</p>}
          </div>
        )}

        {!watchIsFree && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="price" className="text-sm font-medium">
                Price (RON) *
              </Label>
              <Input id="price" type="number" min="0" step="0.01" {...register('price', { valueAsNumber: true })} placeholder="0.00" className="h-9" />
              {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="paymentMethod" className="text-sm font-medium">
                Payment Method *
              </Label>
              <Select value={watch('paymentMethod') || ''} onValueChange={value => setValue('paymentMethod', value)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online Payment</SelectItem>
                  <SelectItem value="location">Pay at location</SelectItem>
                </SelectContent>
              </Select>
              {errors.paymentMethod && <p className="text-xs text-destructive">{errors.paymentMethod.message}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditEventFormFields; 