import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@app/components/ui/card';
import { FileText } from 'lucide-react';

interface EventDescriptionProps {
  description: string;
}

const EventDescription = ({ description }: EventDescriptionProps) => {
  return (
    <Card className="border-border/40 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          About this event
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <p className="text-foreground/90 leading-relaxed text-base">{description || 'No description available.'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventDescription;
