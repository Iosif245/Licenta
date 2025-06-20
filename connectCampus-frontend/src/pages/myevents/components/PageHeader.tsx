import React from 'react';

const PageHeader = () => {
  return (
    <div className="flex flex-col space-y-2 mb-6">
      <h1 className="text-3xl font-bold tracking-tight">My Registrations</h1>
      <p className="text-muted-foreground">Events you've registered for and are attending.</p>
    </div>
  );
};

export default PageHeader;
