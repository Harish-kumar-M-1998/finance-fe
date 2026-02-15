
// frontend/src/components/expenses/ExpenseForm.jsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { useCategoryStore } from '../../store/categoryStore';

export const ExpenseForm = ({ onSubmit, initialData, loading }) => {
  const { categories, fetchCategories } = useCategoryStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: initialData || {
      title: '',
      amount: '',
      categoryId: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    },
  });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
      <Input
        label="Title"
        {...register('title', { required: 'Title is required' })}
        error={errors.title?.message}
        placeholder="e.g., Groceries"
      />

      <Input
        label="Amount"
        type="number"
        step="0.01"
        {...register('amount', {
          required: 'Amount is required',
          min: { value: 0.01, message: 'Amount must be greater than 0' },
        })}
        error={errors.amount?.message}
        placeholder="0.00"
      />

      <Select
        label="Category"
        {...register('categoryId', { required: 'Category is required' })}
        error={errors.categoryId?.message}
        options={[
          { value: '', label: 'Select a category' },
          ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
        ]}
      />

      <Input
        label="Date"
        type="date"
        {...register('date', { required: 'Date is required' })}
        error={errors.date?.message}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          {...register('notes')}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Optional notes..."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="submit" loading={loading}>
          {initialData ? 'Update Expense' : 'Add Expense'}
        </Button>
      </div>
    </form>
  );
};