import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

interface UseAssociationNavigationReturn {
  navigateToAssociation: (associationId: string, slug?: string) => void;
  navigateToAssociationBySlug: (slug: string) => void;
}

export const useAssociationNavigation = (): UseAssociationNavigationReturn => {
  const navigate = useNavigate();

  const navigateToAssociation = useCallback(
    (associationId: string, slug?: string) => {
      if (slug) {
        navigate(`/associations/${slug}`);
      } else {
        navigate(`/associations/${associationId}`);
      }
    },
    [navigate],
  );

  const navigateToAssociationBySlug = useCallback(
    (slug: string) => {
      navigate(`/associations/${slug}`);
    },
    [navigate],
  );

  return {
    navigateToAssociation,
    navigateToAssociationBySlug,
  };
};
