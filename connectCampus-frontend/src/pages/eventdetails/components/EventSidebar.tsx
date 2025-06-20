import { Button } from '@app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@app/components/ui/card';
import { MapPin, Users, Calendar, Share2, Heart, Clock, CheckCircle, ExternalLink, AlertCircle, LogIn } from 'lucide-react';
import React from 'react';
import { EventSummary } from '@app/types/event';

interface EventSidebarProps {
  event: EventSummary;
  isRegistering: boolean;
  isSaving?: boolean;
  isSaved: boolean;
  isRegistered: boolean;
  hasEventPassed: boolean;
  isEventStarted: boolean;
  isEventFull: boolean;
  canRegister: boolean;
  canFavorite: boolean;
  attendeesCount: number | null;
  attendeesLoading: boolean;
  onRegister: () => void;
  onShare: () => void;
  onSaveEvent: () => void;
  isLoggedIn: boolean;
}

const EventSidebar = ({
  event,
  isRegistering,
  isSaving = false,
  isSaved,
  isRegistered,
  hasEventPassed,
  isEventFull,
  attendeesCount,
  attendeesLoading,
  onRegister,
  onShare,
  onSaveEvent,
  isLoggedIn,
}: EventSidebarProps) => {
  const eventStartDate = event.startDate ? new Date(event.startDate) : new Date();
  const eventEndDate = event.endDate ? new Date(event.endDate) : new Date();
  const currentAttendeesCount = attendeesCount ?? 0;
  const attendancePercentage = event.maxAttendees ? (currentAttendeesCount / event.maxAttendees) * 100 : 0;

  console.log('EventSidebar props:', { isRegistered, isSaved });

  return (
    <div className="space-y-6">
      {/* Registration Card */}
      <Card className="border-border/40 bg-card/80 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Event Registration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          {/* Price Section */}
          <div className="text-center p-4 rounded-xl bg-gradient-to-r from-muted/30 to-muted/20 border border-border/30">
            <div className="text-3xl font-bold text-foreground mb-1">{event.isFree ? 'Free' : `$${event.price || 0}`}</div>
            <p className="text-sm text-muted-foreground">{event.registrationRequired ? 'External Registration Available' : 'Direct Registration'}</p>
          </div>

          {/* Registration Buttons */}
          <div className="space-y-3">
            {hasEventPassed ? (
              <Button disabled className="w-full h-12" variant="secondary">
                <AlertCircle className="mr-2 h-4 w-4" />
                Event has ended
              </Button>
            ) : isEventFull ? (
              <Button disabled className="w-full h-12" variant="secondary">
                <Users className="mr-2 h-4 w-4" />
                Event is full
              </Button>
            ) : (
              <div className="space-y-2">
                {/* External Registration Button - Conditional */}
                {event.registrationRequired && event.registrationUrl && (
                  <Button
                    onClick={() => window.open(event.registrationUrl, '_blank')}
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg font-semibold"
                    size="lg"
                  >
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Register Externally
                  </Button>
                )}

                {/* Internal Attendance Button - Always shows for local registration/unregistration */}
                {!isLoggedIn ? (
                  <Button
                    onClick={onRegister}
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg font-semibold"
                    size="lg"
                  >
                    <LogIn className="mr-2 h-5 w-5" />
                    Login to Attend
                  </Button>
                ) : isRegistered ? (
                  <Button
                    onClick={onRegister}
                    disabled={isRegistering}
                    variant="outline"
                    className="w-full h-12 bg-gradient-to-r from-rose-50 to-red-50 border-2 border-rose-400/70 text-rose-600 hover:bg-gradient-to-r hover:from-rose-100/60 hover:to-red-100/60 font-semibold transform transition-all"
                    size="lg"
                  >
                    {isRegistering ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-rose-600 mr-2"></div>
                        Unregistering...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5 text-rose-500" />
                        Registered - Click to Unregister
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={onRegister}
                    disabled={isRegistering}
                    className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg font-semibold transform hover:scale-[1.02] transition-all"
                    size="lg"
                  >
                    {isRegistering ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Users className="mr-2 h-5 w-5" />
                        Attend Event
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}

            {/* Action Buttons Row */}
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 h-10 border-border/60 hover:bg-primary hover:text-primary-foreground hover:border-primary font-medium" onClick={onShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>

              <Button
                variant="outline"
                className={`h-10 px-4 border-border/60 hover:border-primary font-medium ${isSaved ? 'bg-red-50/30 text-red-600 border-red-300/50 hover:bg-red-100 hover:text-red-700' : 'hover:bg-primary hover:text-primary-foreground'}`}
                onClick={onSaveEvent}
                disabled={isSaving}
                title={!isLoggedIn ? 'Login to save to favorites' : isSaved ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                ) : (
                  <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Details Card */}
      <Card className="border-border/40 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Event Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Date & Time */}
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium text-foreground">Date & Time</p>
              <p className="text-sm text-muted-foreground">
                {event.startDate
                  ? eventStartDate.toLocaleDateString(undefined, {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Date TBD'}
              </p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  {event.startDate && event.endDate ? (
                    <>
                      {eventStartDate.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })}
                      {' - '}
                      {eventEndDate.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })}
                    </>
                  ) : (
                    'Time TBD'
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-warning mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Location</p>
              <p className="text-sm text-muted-foreground">{event.location || 'Location TBD'}</p>
            </div>
          </div>

          {/* Attendance - Compact */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-accent/10 shrink-0">
              <Users className="h-5 w-5 text-accent" />
            </div>
            <div className="w-full">
              <p className="font-medium text-foreground mb-2">Attendance</p>

              {/* Compact Stats Row */}
              <div className="flex gap-2 mb-3">
                <div className="flex-1 p-2 rounded-md bg-primary/5 border border-primary/20 text-center">
                  <div className="text-lg font-bold text-primary">
                    {attendeesLoading ? <div className="animate-pulse bg-primary/20 h-5 w-6 rounded mx-auto"></div> : currentAttendeesCount}
                  </div>
                  <div className="text-xs text-muted-foreground">Registered</div>
                </div>
                <div className="flex-1 p-2 rounded-md bg-secondary/5 border border-secondary/20 text-center">
                  <div className="text-lg font-bold text-secondary">{event.capacity}</div>
                  <div className="text-xs text-muted-foreground">Capacity</div>
                </div>
                {event.maxAttendees && event.maxAttendees !== event.capacity && (
                  <div className="flex-1 p-2 rounded-md bg-accent/5 border border-accent/20 text-center">
                    <div className="text-lg font-bold text-accent">{event.maxAttendees}</div>
                    <div className="text-xs text-muted-foreground">Max</div>
                  </div>
                )}
              </div>

              {/* Compact Progress Bars */}
              <div className="space-y-3">
                {/* Capacity Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground">Capacity</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-primary/10 text-primary">{Math.round((currentAttendeesCount / event.capacity) * 100)}%</span>
                  </div>
                  <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        currentAttendeesCount > event.capacity ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'
                      }`}
                      style={{ width: `${Math.min((currentAttendeesCount / event.capacity) * 100, 100)}%` }}
                    />
                  </div>
                  {currentAttendeesCount > event.capacity && (
                    <div className="text-xs text-orange-600 bg-orange-50/50 px-2 py-1 rounded">Over capacity by {currentAttendeesCount - event.capacity}</div>
                  )}
                </div>

                {/* Max Attendees Progress */}
                {event.maxAttendees && event.maxAttendees !== event.capacity && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-foreground">Maximum</span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-secondary/10 text-secondary">{Math.round(attendancePercentage)}%</span>
                    </div>
                    <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(attendancePercentage, 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {event.maxAttendees - currentAttendeesCount > 0 ? `${event.maxAttendees - currentAttendeesCount} spots remaining` : 'Maximum limit reached'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventSidebar;
