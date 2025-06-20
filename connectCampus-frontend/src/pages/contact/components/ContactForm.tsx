import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Textarea } from '@app/components/ui/textarea';
import { Label } from '@radix-ui/react-dropdown-menu';

const ContactForm = () => {
  //const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // e.preventDefault();
    // setIsSubmitting(true);
    // try {
    //   // In a real app, this would be an API call
    //   await new Promise(resolve => setTimeout(resolve, 1500));
    //   dispatch(
    //     addNotification({
    //       type: 'success',
    //       message: 'Your message has been sent successfully!',
    //     }),
    //   );
    //   // Reset form
    //   setFormData({
    //     name: '',
    //     email: '',
    //     subject: '',
    //     message: '',
    //   });
    // } catch (error) {
    //   dispatch(
    //     addNotification({
    //       type: 'error',
    //       message: 'Failed to send message. Please try again.',
    //     }),
    //   );
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Us a Message</CardTitle>
        <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" required />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="your.email@example.com" required />
          </div>
          <div className="space-y-2">
            <Label>Subject</Label>
            <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="What is this regarding?" required />
          </div>
          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Your message..." rows={5} required />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
