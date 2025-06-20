import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@app/store';
import { getAssociationsPagedActionAsync } from '@app/store/actions/association/association-async-actions';
import { associationAssociationsListSelector, associationIsLoadingSelector } from '@app/store/selectors/association-selectors';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@app/components/ui/select';
import AssociationsGrid from './components/AssociationsGrid';
import Pagination from './components/Pagination';
import { Search, RefreshCw } from 'lucide-react';

const Associations = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [mounted, setMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const itemsPerPage = 12;

  const associationsData = useSelector(associationAssociationsListSelector);
  const isLoading = useSelector(associationIsLoadingSelector);

  const associations = associationsData?.associations || [];

  // All available categories (from create association form)
  const allCategories = ['Academic', 'Cultural', 'Sports', 'Technology', 'Arts', 'Business', 'Science', 'Social', 'Environmental', 'Healthcare', 'Other'];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load associations when component mounts or filters change
  useEffect(() => {
    dispatch(
      getAssociationsPagedActionAsync({
        page: 1, // Always get from page 1 for client-side filtering
        pageSize: 100, // Get more data for better client-side filtering
        category: activeFilter === 'all' ? undefined : activeFilter,
      }),
    );
  }, [dispatch, activeFilter]);

  // Client-side search and filtering
  const filteredAssociations = useMemo(() => {
    let filtered = associations;

    // Apply search filter
    if (debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(
        (association: any) =>
          association.name?.toLowerCase().includes(searchLower) ||
          association.category?.toLowerCase().includes(searchLower) ||
          association.location?.toLowerCase().includes(searchLower) ||
          association.description?.toLowerCase().includes(searchLower) ||
          association.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower)),
      );
    }

    return filtered;
  }, [associations, debouncedSearchTerm]);

  // Pagination for filtered results
  const totalFilteredPages = Math.ceil(filteredAssociations.length / itemsPerPage);
  const paginatedAssociations = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAssociations.slice(startIndex, endIndex);
  }, [filteredAssociations, currentPage, itemsPerPage]);

  const handleFilterChange = (category: string) => {
    setActiveFilter(category);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleRefresh = () => {
    dispatch(
      getAssociationsPagedActionAsync({
        page: 1,
        pageSize: 100,
        category: activeFilter === 'all' ? undefined : activeFilter,
      }),
    );
  };

  const handleFilterReset = () => {
    setActiveFilter('all');
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 md:px-4 py-4 max-w-7xl">
        {/* Header */}
        <div
          className={`flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-6 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Discover Student Associations</h1>
            <p className="text-muted-foreground mt-1 text-sm">Connect with organizations that match your interests</p>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
            className="gap-2 h-8 text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200"
          >
            <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Search and Filter */}
        <div className={`flex flex-col sm:flex-row gap-3 mb-6 transition-all duration-500 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input placeholder="Search associations, categories..." value={searchTerm} onChange={e => handleSearchChange(e.target.value)} className="pl-8 h-8 text-sm" />
          </div>
          <Select value={activeFilter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-full sm:w-48 h-8 text-sm">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-sm">
                All Associations
              </SelectItem>
              {allCategories.map(category => (
                <SelectItem key={category} value={category} className="text-sm">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Results Info */}
        {debouncedSearchTerm && (
          <div
            className={`mb-4 p-3 bg-primary/5 border border-primary/20 rounded-lg transition-all duration-500 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="w-3 h-3 text-primary" />
                <span className="text-xs font-medium">
                  {filteredAssociations.length} association{filteredAssociations.length !== 1 ? 's' : ''} found for "{debouncedSearchTerm}"
                </span>
              </div>
              <button onClick={() => setSearchTerm('')} className="text-xs text-primary hover:text-primary/80 hover:underline transition-colors">
                Clear search
              </button>
            </div>
          </div>
        )}

        {/* Associations Grid */}
        <div className={`transition-all duration-500 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <AssociationsGrid
            associations={paginatedAssociations}
            isLoading={isLoading}
            searchTerm={debouncedSearchTerm}
            activeFilter={activeFilter}
            onFilterReset={handleFilterReset}
          />
        </div>

        {/* Pagination */}
        {totalFilteredPages > 1 && (
          <div className={`mt-6 transition-all duration-500 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Pagination currentPage={currentPage} totalPages={totalFilteredPages} onPageChange={handlePageChange} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Associations;
