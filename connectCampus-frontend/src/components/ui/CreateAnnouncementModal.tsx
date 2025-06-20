import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@app/components/ui/dialog';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Textarea } from '@app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@app/components/ui/select';
import { Label } from '@app/components/ui/label';
import { IEventSummaryResponse } from '@app/types/event/IEventResponse';
import { FileText } from 'lucide-react';
import ImageUpload from '@app/pages/register/components/ImageUpload';
import { ContentImprover } from '@app/components/ui/ContentImprover';

interface CreateAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    content: string;
    type: 'general' | 'event';
    eventId?: string;
    image?: File;
  }) => void;
  events?: IEventSummaryResponse[];
  isLoading?: boolean;
  preSelectedEventId?: string;
}

export const CreateAnnouncementModal: React.FC<CreateAnnouncementModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  events = [],
  isLoading = false,
  preSelectedEventId,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'general' | 'event'>('general');
  const [eventId, setEventId] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Initialize form with pre-selected event if provided
  React.useEffect(() => {
    if (preSelectedEventId && events.some(event => event.id === preSelectedEventId)) {
      setType('event');
      setEventId(preSelectedEventId);
    }
  }, [preSelectedEventId, events]);

  // Reset form when modal opens/closes but preserve pre-selection
  React.useEffect(() => {
    if (isOpen && preSelectedEventId && events.some(event => event.id === preSelectedEventId)) {
      // When opening with pre-selected event, set it up
      setType('event');
      setEventId(preSelectedEventId);
    } else if (!isOpen) {
      // Only reset when modal is closed
      resetForm();
    }
  }, [isOpen, preSelectedEventId, events]);

  const handleImageChange = (file: File | null) => {
    setSelectedImage(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    if (type === 'event' && !eventId) {
      alert('Please select an event');
      return;
    }

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      type,
      eventId: type === 'event' ? eventId : undefined,
      image: selectedImage || undefined,
    });

    // Reset form after submission
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setType('general');
    setEventId('');
    setSelectedImage(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && !isLoading) {
        handleClose();
      }
    }}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto z-[100]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Create Announcement
          </DialogTitle>
          <DialogDescription>
            Create a new announcement to share with your community. You can add images and link to events.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Announcement Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Announcement Type</Label>
            <Select 
              value={type} 
              onValueChange={(value: string) => {
                const newType = value as 'general' | 'event';
                setType(newType);
                if (newType === 'general') {
                  setEventId('');
                }
              }}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full h-10 cursor-pointer">
                <SelectValue placeholder="Select announcement type" />
              </SelectTrigger>
              <SelectContent className="z-[110]">
                <SelectItem value="general" className="cursor-pointer hover:bg-accent focus:bg-accent">
                  General Announcement
                </SelectItem>
                <SelectItem value="event" className="cursor-pointer hover:bg-accent focus:bg-accent">
                  Event Announcement
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Event Selection (only if type is 'event') */}
          {type === 'event' && (
            <div className="space-y-2">
              <Label htmlFor="event">Select Event</Label>
              {events.length === 0 ? (
                <div className="w-full h-10 px-3 py-2 border border-border rounded-md bg-muted text-muted-foreground text-sm flex items-center">
                  No events available
                </div>
              ) : (
                <Select 
                  value={eventId} 
                  onValueChange={setEventId}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full h-10 cursor-pointer">
                    <SelectValue placeholder="Choose an event" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] z-[110]">
                    {events.map((event) => (
                      <SelectItem 
                        key={event.id} 
                        value={event.id} 
                        className="cursor-pointer hover:bg-accent focus:bg-accent"
                      >
                        <div className="flex flex-col items-start py-1">
                          <div className="font-medium text-sm leading-tight">
                            {event.title || 'Untitled Event'}
                          </div>
                          {event.startDate && (
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {new Date(event.startDate).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter announcement title"
              required
              disabled={isLoading}
              className="cursor-text disabled:cursor-not-allowed"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your announcement content here..."
              rows={6}
              required
              disabled={isLoading}
              className="cursor-text disabled:cursor-not-allowed resize-y min-h-[120px]"
            />
            
            {/* AI Content Improver */}
            <ContentImprover
              content={content}
              onImprove={(improvedContent) => setContent(improvedContent)}
              type="announcement"
              disabled={isLoading}
              className="mt-2"
            />
          </div>

          {/* Image Upload */}
          <ImageUpload
            label="Image (Optional)"
            value={selectedImage}
            onChange={handleImageChange}
            type="cover"
            disabled={isLoading}
          />

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose} 
              disabled={isLoading}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !title.trim() || !content.trim()}
              className="cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Announcement'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 