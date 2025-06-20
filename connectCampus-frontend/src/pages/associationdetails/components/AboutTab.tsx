import { Card, CardContent, CardHeader, CardTitle } from '@app/components/ui/card';
import { Badge } from '@app/components/ui/badge';
import { Button } from '@app/components/ui/button';
import { Mail, Globe, MapPin, Clock, Phone, Building, Facebook, Twitter, Instagram, Linkedin, Shield, ExternalLink, Copy } from 'lucide-react';
import React from 'react';

interface AboutTabProps {
  association: {
    name: string;
    description: string;
    email?: string;
    website?: string;
    location?: string;
    foundedYear: number;
    followers?: number;
    phone?: string;
    address?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedIn?: string;
    tags?: string[];
    category?: string;
    isVerified?: boolean;
  };
}

const AboutTab = ({ association }: AboutTabProps) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-4">
      {/* About Section */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">About {association.name}</CardTitle>
              {association.isVerified && (
                <Badge variant="default" className="text-xs bg-blue-600 hover:bg-blue-700">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            {association.category && (
              <Badge variant="secondary" className="text-xs">
                {association.category}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="prose max-w-none dark:prose-invert text-sm">
            <p className="text-muted-foreground leading-relaxed">{association.description}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Contact Information */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {association.email && (
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Email</p>
                    <p className="text-xs text-muted-foreground">{association.email}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => copyToClipboard(association.email!)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
                    <a href={`mailto:${association.email}`}>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
            )}

            {association.phone && (
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <Phone className="h-3 w-3 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Phone</p>
                    <p className="text-xs text-muted-foreground">{association.phone}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => copyToClipboard(association.phone!)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
                    <a href={`tel:${association.phone}`}>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
            )}

            {association.website && (
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Globe className="h-3 w-3 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Website</p>
                    <p className="text-xs text-muted-foreground truncate max-w-32">{association.website}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
                  <a href={association.website} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Location & Details */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Location & Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {association.location && (
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                    <MapPin className="h-3 w-3 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Location</p>
                    <p className="text-xs text-muted-foreground">{association.location}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => copyToClipboard(association.location!)}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            )}

            {association.address && (
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Building className="h-3 w-3 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Address</p>
                    <p className="text-xs text-muted-foreground">{association.address}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => copyToClipboard(association.address!)}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            )}

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Clock className="h-3 w-3 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Founded</p>
                  <p className="text-xs text-muted-foreground">Established in {association.foundedYear}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Social Media Section */}
      {(association.facebook || association.twitter || association.instagram || association.linkedIn) && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-3">
              {/* Uncomment and provide logo if available */}
              {/* {association.logo && (
                <img src={association.logo} alt={association.name} className="w-6 h-6 rounded-full" />
              )} */}
              <span className="font-semibold">{association.name}</span>
              <span className="text-muted-foreground font-normal">Social Media & Links</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {association.facebook && (
                <Button variant="outline" size="sm" className="flex items-center h-10 justify-center w-full" asChild>
                  <a
                    href={association.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200"
                  >
                    <Facebook className="w-4 h-4 mr-2 text-blue-600 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200" />
                    <span className="text-xs">Facebook</span>
                  </a>
                </Button>
              )}
              {association.twitter && (
                <Button variant="outline" size="sm" className="flex items-center h-10 justify-center w-full" asChild>
                  <a
                    href={association.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200"
                  >
                    <Twitter className="w-4 h-4 mr-2 text-sky-500" />
                    <span className="text-xs">Twitter</span>
                  </a>
                </Button>
              )}
              {association.instagram && (
                <Button variant="outline" size="sm" className="flex items-center h-10 justify-center w-full" asChild>
                  <a
                    href={association.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200"
                  >
                    <Instagram className="w-4 h-4 mr-2 text-pink-600" />
                    <span className="text-xs">Instagram</span>
                  </a>
                </Button>
              )}
              {association.linkedIn && (
                <Button variant="outline" size="sm" className="flex items-center h-10 justify-center w-full" asChild>
                  <a
                    href={association.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200"
                  >
                    <Linkedin className="w-4 h-4 mr-2 text-blue-700" />
                    <span className="text-xs">LinkedIn</span>
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AboutTab;
