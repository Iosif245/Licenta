import { Button } from '@app/components/ui/button';
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <nav className="flex items-center space-x-2">
            <Button variant="outline" className="text-muted-foreground" onClick={handlePrevious} disabled={currentPage === 1}>
              Previous
            </Button>
            <Button variant={currentPage === 1 ? 'default' : 'outline'} onClick={() => onPageChange(1)}>
              1
            </Button>
            <Button variant={currentPage === 2 ? 'default' : 'outline'} onClick={() => onPageChange(2)}>
              2
            </Button>
            <Button variant={currentPage === 3 ? 'default' : 'outline'} onClick={() => onPageChange(3)}>
              3
            </Button>
            <span className="px-3 py-2 text-muted-foreground">...</span>
            <Button variant={currentPage === totalPages ? 'default' : 'outline'} onClick={() => onPageChange(totalPages)}>
              {totalPages}
            </Button>
            <Button variant="outline" className="text-muted-foreground" onClick={handleNext} disabled={currentPage === totalPages}>
              Next
            </Button>
          </nav>
        </div>
      </div>
    </section>
  );
};

export default Pagination;
