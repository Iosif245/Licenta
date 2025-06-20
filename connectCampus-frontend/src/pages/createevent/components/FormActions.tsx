import React from 'react';
import { Button } from '@app/components/ui/button';

interface FormActionsProps {
  loading: boolean;
  onCancel: () => void;
}

const FormActions = ({ loading, onCancel }: FormActionsProps) => {
  return (
    <div className="flex justify-end gap-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating Event...' : 'Create Event'}
      </Button>
    </div>
  );
};

export default FormActions;
