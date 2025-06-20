import React from 'react';
import ContactForm from './components/ContactForm';
import ContactInfo from './components/ContactInfo';
import LocationMap from './components/LocationMap';

const Contact = () => {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Contact Us</h1>
        <p className="text-xl text-muted-foreground">Have questions or feedback? We'd love to hear from you.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 mb-12">
        <ContactForm />
        <ContactInfo />
      </div>

      <LocationMap />
    </div>
  );
};

export default Contact;
