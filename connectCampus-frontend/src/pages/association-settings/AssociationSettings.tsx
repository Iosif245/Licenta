import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@app/components/ui/card';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import { Textarea } from '@app/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@app/components/ui/tabs';
import { Badge } from '@app/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@app/components/ui/select';
import {
  User,
  Shield,
  Upload,
  Save,
  ArrowLeft,
  Camera,
  Globe,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  X,
  Image as ImageIcon,
  Building,
  FileCheck,
  Clock,
  Star,
  CheckCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IAssociationUpdate } from '@app/types/association';
import { AppDispatch } from '@app/store';
import { updateAssociationActionAsync } from '@app/store/actions/association/association-async-actions';
import { fetchUserAndProfileActionAsync } from '@app/store/actions/user/user-async-actions';
import { profileCurrentProfileSelector } from '@app/store/selectors/profile-selectors';
import { userIsLoadingSelector } from '@app/store/selectors/user-selectors';
import { Avatar, AvatarFallback, AvatarImage } from '@app/components/ui/avatar';
import { useToast } from '@app/hooks/use-toast';

const AssociationSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const { toast } = useToast();

  // Redux state
  const profile = useSelector(profileCurrentProfileSelector);
  const isProfileLoading = useSelector(userIsLoadingSelector);

  // Upload refs and previews
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [forceImageRefresh, setForceImageRefresh] = useState(false);

  useEffect(() => {
    setMounted(true);
    dispatch(fetchUserAndProfileActionAsync());
  }, [dispatch]);

  // Get association data from profile
  const associationProfile = profile?.associationProfile;

  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: '',
    foundedYear: new Date().getFullYear(),
    description: '',
    phone: '',
    website: '',
    address: '',
    location: '',
    facebook: '',
    twitter: '',
    instagram: '',
    linkedIn: '',
    email: '',
    logo: null as File | null,
    coverImage: null as File | null,
  });

  // Initialize form data when profile loads
  useEffect(() => {
    if (associationProfile) {
      setFormData({
        name: associationProfile.name || '',
        slug: associationProfile.slug || '',
        category: associationProfile.category || '',
        foundedYear: associationProfile.foundedYear || new Date().getFullYear(),
        description: associationProfile.description || '',
        phone: associationProfile.phone || '',
        website: associationProfile.website || '',
        address: associationProfile.address || '',
        location: associationProfile.location || '',
        facebook: associationProfile.facebook || '',
        twitter: associationProfile.twitter || '',
        instagram: associationProfile.instagram || '',
        linkedIn: associationProfile.linkedIn || '',
        email: profile?.email || '',
        logo: null,
        coverImage: null,
      });
    }
  }, [associationProfile, profile?.email]);

  // Handle input changes
  const handleInputChange = (field: string, value: string | number | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission (general settings only)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!associationProfile?.id) return;

    setIsLoading(true);
    try {
      const updateData: IAssociationUpdate = {
        name: formData.name,
        email: profile.email, // Use user email instead of association email
        slug: formData.slug,
        category: formData.category,
        foundedYear: formData.foundedYear,
        description: formData.description,
        location: formData.location,
        phone: formData.phone,
        website: formData.website,
        address: formData.address,
        facebook: formData.facebook,
        twitter: formData.twitter,
        instagram: formData.instagram,
        linkedIn: formData.linkedIn,
      };

      await dispatch(
        updateAssociationActionAsync({
          id: associationProfile.id,
          data: updateData,
        }),
      ).unwrap();
      await dispatch(fetchUserAndProfileActionAsync());

      toast({
        title: 'Settings Updated',
        description: 'Your association settings have been saved successfully.',
      });
    } catch (error) {
      console.error('Failed to update association:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update association settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle media upload (logo and cover image)
  const handleMediaSave = async () => {
    if (!associationProfile?.id) return;
    if (!formData.logo && !formData.coverImage) {
      toast({
        title: 'No Changes',
        description: 'Please select a logo or cover image to upload.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploadingMedia(true);
    try {
      const mediaData: IAssociationUpdate = {
        name: associationProfile.name,
        email: profile.email,
        slug: associationProfile.slug,
        category: associationProfile.category,
        foundedYear: associationProfile.foundedYear,
        description: associationProfile.description,
        location: associationProfile.location,
        phone: associationProfile.phone,
        website: associationProfile.website,
        address: associationProfile.address,
        facebook: associationProfile.facebook,
        twitter: associationProfile.twitter,
        instagram: associationProfile.instagram,
        linkedIn: associationProfile.linkedIn,
      };

      // Add files if they exist
      if (formData.logo) {
        mediaData.logo = formData.logo;
      }
      if (formData.coverImage) {
        mediaData.coverImage = formData.coverImage;
      }

      await dispatch(
        updateAssociationActionAsync({
          id: associationProfile.id,
          data: mediaData,
        }),
      ).unwrap();

      // Clear previews first to show loading state
      setLogoPreview(null);
      setCoverPreview(null);

      // Refetch profile to get updated image URLs
      await dispatch(fetchUserAndProfileActionAsync());

      setForceImageRefresh(true);
      setTimeout(() => setForceImageRefresh(false), 50);

      setFormData(prev => ({ ...prev, logo: null, coverImage: null }));

      toast({
        title: 'Media Updated',
        description: 'Your association logo and cover image have been saved successfully.',
      });
    } catch (error) {
      console.error('Failed to update media:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload media files. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Logo file must be less than 2MB.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File Type',
        description: 'Please select an image file (JPG, PNG, etc.).',
        variant: 'destructive',
      });
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = e => setLogoPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Store file in form data - will be uploaded when form is submitted
    setFormData(prev => ({ ...prev, logo: file }));

    toast({
      title: 'Logo Selected',
      description: 'Logo will be uploaded when you save changes.',
    });

    // Clear input
    event.target.value = '';
  };

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Cover image file must be less than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File Type',
        description: 'Please select an image file (JPG, PNG, etc.).',
        variant: 'destructive',
      });
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = e => setCoverPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Store file in form data - will be uploaded when form is submitted
    setFormData(prev => ({ ...prev, coverImage: file }));

    toast({
      title: 'Cover Image Selected',
      description: 'Cover image will be uploaded when you save changes.',
    });

    // Clear input
    event.target.value = '';
  };

  if (!mounted || isProfileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!associationProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Association profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="h-10 w-10 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Association Settings</h1>
              <p className="text-muted-foreground">Manage your association profile</p>
            </div>
          </div>
          {associationProfile.isVerified && (
            <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">
              <Shield className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>

        {/* Main Content */}
        <Card className="border-border/40">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="general" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  General
                </TabsTrigger>
                <TabsTrigger value="media" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Media
                </TabsTrigger>
                <TabsTrigger value="verification" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Verification
                </TabsTrigger>
                <TabsTrigger value="contact" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Contact & Social
                </TabsTrigger>
              </TabsList>

              {/* General Tab */}
              <TabsContent value="general" className="space-y-8 mt-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-foreground">
                          Association Name <span className="text-red-500">*</span>
                        </Label>
                        <Input id="name" name="name" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className="h-11" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="slug" className="text-sm font-medium text-foreground">
                          URL Slug <span className="text-red-500">*</span>
                        </Label>
                        <Input id="slug" name="slug" value={formData.slug} onChange={e => handleInputChange('slug', e.target.value)} className="h-11" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-sm font-medium text-foreground">
                          Category <span className="text-red-500">*</span>
                        </Label>
                        <Select value={formData.category} onValueChange={value => handleInputChange('category', value)}>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Academic">Academic</SelectItem>
                            <SelectItem value="Cultural">Cultural</SelectItem>
                            <SelectItem value="Sports">Sports</SelectItem>
                            <SelectItem value="Technology">Technology</SelectItem>
                            <SelectItem value="Social">Social</SelectItem>
                            <SelectItem value="Environmental">Environmental</SelectItem>
                            <SelectItem value="Business">Business</SelectItem>
                            <SelectItem value="Arts">Arts</SelectItem>
                            <SelectItem value="Healthcare">Healthcare</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="foundedYear" className="text-sm font-medium text-foreground">
                          Founded Year <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="foundedYear"
                          name="foundedYear"
                          type="number"
                          value={formData.foundedYear}
                          onChange={e => handleInputChange('foundedYear', parseInt(e.target.value))}
                          className="h-11"
                          min="1800"
                          max={new Date().getFullYear()}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium text-foreground">
                        Description <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={e => handleInputChange('description', e.target.value)}
                        className="min-h-32 resize-y"
                        placeholder="Describe your association, its mission, and activities..."
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading} className="px-8">
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              {/* Media Tab */}
              <TabsContent value="media" className="space-y-8 mt-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Media & Branding</h3>

                  {/* Logo Upload */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-foreground">Association Logo</Label>
                    <div className="flex items-center gap-6">
                      <Avatar className="w-20 h-20 border-2 border-dashed border-muted-foreground/25">
                        <AvatarImage key={forceImageRefresh ? 'refreshed' : 'normal'} src={logoPreview || associationProfile.logo || '/placeholder.svg'} />
                        <AvatarFallback>
                          <Camera className="w-8 h-8 text-muted-foreground" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-3">
                        <div className="flex gap-3">
                          <Button type="button" variant="outline" size="sm" onClick={() => logoInputRef.current?.click()} disabled={isLoading}>
                            <Upload className="h-4 w-4 mr-2" />
                            Choose Logo
                          </Button>
                          {logoPreview && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setLogoPreview(null);
                                setFormData(prev => ({ ...prev, logo: null }));
                              }}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">Recommended: Square image (1:1 ratio), max 2MB, JPG or PNG format</p>
                      </div>
                      <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                    </div>
                  </div>

                  {/* Cover Image Upload */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-foreground">Cover Image</Label>
                    <div className="space-y-4">
                      <div className="relative h-48 rounded-lg border-2 border-dashed border-muted-foreground/25 overflow-hidden bg-muted/30">
                        {coverPreview || associationProfile.coverImage ? (
                          <img
                            key={forceImageRefresh ? 'refreshed' : 'normal'}
                            src={coverPreview || associationProfile.coverImage || '/placeholder.svg'}
                            alt="Cover preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                              <p className="text-sm text-muted-foreground">No cover image uploaded</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <Button type="button" variant="outline" onClick={() => coverInputRef.current?.click()} disabled={isLoading}>
                          <Upload className="h-4 w-4 mr-2" />
                          Choose Cover Image
                        </Button>
                        {coverPreview && (
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              setCoverPreview(null);
                              setFormData(prev => ({ ...prev, coverImage: null }));
                            }}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">Recommended: 16:9 aspect ratio (e.g., 1920x1080), max 5MB, JPG or PNG format</p>
                      <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
                    </div>
                  </div>

                  {/* Media Save Button */}
                  {(logoPreview || coverPreview || formData.logo || formData.coverImage) && (
                    <div className="flex justify-end pt-6 border-t border-border">
                      <Button onClick={handleMediaSave} disabled={isUploadingMedia} className="px-8">
                        {isUploadingMedia ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Save Media Changes
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              {/* Verification Tab */}
              <TabsContent value="verification" className="space-y-8 mt-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Verification Status</h3>
                    <p className="text-sm text-muted-foreground mb-6">Get your association verified to build trust and credibility with members.</p>
                  </div>

                  {/* Verification Status Display */}
                  <div className="flex items-center gap-4 p-4 rounded-lg border border-border/40 bg-muted/20">
                    {associationProfile.isVerified ? (
                      <>
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900">
                          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-foreground">Verified Association</h4>
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          </div>
                          <p className="text-sm text-muted-foreground">Your association has been verified by our team.</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900">
                          <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">Not Verified</h4>
                          <p className="text-sm text-muted-foreground">Submit verification documents to get verified.</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Certificate Upload for Non-Verified */}
                  {!associationProfile.isVerified && (
                    <div className="space-y-4 p-6 border border-border/40 rounded-lg">
                      <h4 className="font-medium text-foreground">Submit Verification Documents</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Upload official documents (registration certificate, university recognition, etc.) to verify your association.
                      </p>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                        <FileCheck className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground mb-4">Upload PDF, JPEG, or PNG files (max 5MB)</p>
                        <Button variant="outline" className="h-10">
                          <Upload className="h-4 w-4 mr-2" />
                          Choose Files
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              {/* Contact & Social Tab */}
              <TabsContent value="contact" className="space-y-8 mt-8">
                <div className="space-y-8">
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium text-foreground flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={e => handleInputChange('phone', e.target.value)}
                          className="h-11"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website" className="text-sm font-medium text-foreground flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Website
                        </Label>
                        <Input
                          id="website"
                          name="website"
                          type="url"
                          value={formData.website}
                          onChange={e => handleInputChange('website', e.target.value)}
                          className="h-11"
                          placeholder="https://www.yoursite.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-sm font-medium text-foreground flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Location/City
                        </Label>
                        <Input
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={e => handleInputChange('location', e.target.value)}
                          className="h-11"
                          placeholder="New York, NY"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-sm font-medium text-foreground flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Full Address
                        </Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={e => handleInputChange('address', e.target.value)}
                          className="h-11"
                          placeholder="123 Main St, New York, NY 10001"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4">Social Media Links</h3>
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="facebook" className="text-sm font-medium text-foreground flex items-center gap-2">
                          <Facebook className="h-4 w-4 text-blue-600" />
                          Facebook
                        </Label>
                        <Input
                          id="facebook"
                          name="facebook"
                          type="url"
                          value={formData.facebook}
                          onChange={e => handleInputChange('facebook', e.target.value)}
                          className="h-11"
                          placeholder="https://facebook.com/yourassociation"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="twitter" className="text-sm font-medium text-foreground flex items-center gap-2">
                          <Twitter className="h-4 w-4 text-sky-500" />
                          Twitter
                        </Label>
                        <Input
                          id="twitter"
                          name="twitter"
                          type="url"
                          value={formData.twitter}
                          onChange={e => handleInputChange('twitter', e.target.value)}
                          className="h-11"
                          placeholder="https://twitter.com/yourassociation"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instagram" className="text-sm font-medium text-foreground flex items-center gap-2">
                          <Instagram className="h-4 w-4 text-pink-600" />
                          Instagram
                        </Label>
                        <Input
                          id="instagram"
                          name="instagram"
                          type="url"
                          value={formData.instagram}
                          onChange={e => handleInputChange('instagram', e.target.value)}
                          className="h-11"
                          placeholder="https://instagram.com/yourassociation"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkedIn" className="text-sm font-medium text-foreground flex items-center gap-2">
                          <Linkedin className="h-4 w-4 text-blue-700" />
                          LinkedIn
                        </Label>
                        <Input
                          id="linkedIn"
                          name="linkedIn"
                          type="url"
                          value={formData.linkedIn}
                          onChange={e => handleInputChange('linkedIn', e.target.value)}
                          className="h-11"
                          placeholder="https://linkedin.com/company/yourassociation"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSubmit} disabled={isLoading} className="px-8">
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssociationSettings;
