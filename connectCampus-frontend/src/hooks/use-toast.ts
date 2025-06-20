import { useState } from 'react';

type ToastType = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive';
};

export function useToast() {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const toast = ({ title, description, variant = 'default' }: Omit<ToastType, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { id, title, description, variant };
    setToasts(prev => [...prev, newToast]);

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      dismiss(id);
    }, 3000);

    return { id };
  };

  const dismiss = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return {
    toasts,
    toast,
    dismiss,
  };
}
