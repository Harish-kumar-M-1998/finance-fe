
import React, { useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { useCategoryStore } from '../../store/categoryStore';

export const ExpenseFilters = ({ filters, onFilterChange }) => {
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
      <div className="flex items-center space-x-2 text-gray-700">
        <Filter className="w-5 h-5" />
        <h3 className="font-semibold">Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <Select
          options={[
            { value: '', label: 'All Categories' },
            ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
          ]}
          value={filters.categoryId || ''}
          onChange={(e) => onFilterChange({ categoryId: e.target.value })}
        />

        <Input
          type="date"
          value={filters.startDate || ''}
          onChange={(e) => onFilterChange({ startDate: e.target.value })}
          placeholder="Start Date"
        />

        <Input
          type="date"
          value={filters.endDate || ''}
          onChange={(e) => onFilterChange({ endDate: e.target.value })}
          placeholder="End Date"
        />
      </div>
    </div>
  );
};