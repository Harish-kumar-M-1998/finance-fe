// frontend/src/pages/Plans.jsx
import React, { useEffect, useState } from 'react';
import { Plus, Target } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { usePlanStore } from '../store/planStore';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

export const Plans = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const { plans, loading, fetchPlans, createPlan, updatePlan, deletePlan } = usePlanStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const onSubmit = async (data) => {
    try {
      if (editingPlan) {
        await updatePlan(editingPlan.id, data);
        toast.success('Plan updated successfully');
      } else {
        await createPlan(data);
        toast.success('Plan created successfully');
      }
      setIsModalOpen(false);
      setEditingPlan(null);
      reset();
    } catch (error) {
      toast.error('Failed to save plan');
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    reset({
      name: plan.name,
      budgetAmount: plan.budgetAmount,
      startDate: dayjs(plan.startDate).format('YYYY-MM-DD'),
      endDate: dayjs(plan.endDate).format('YYYY-MM-DD'),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        await deletePlan(id);
        toast.success('Plan deleted successfully');
      } catch (error) {
        toast.error('Failed to delete plan');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Plans</h1>
          <p className="text-gray-600 mt-1">Create and track your financial goals</p>
        </div>
        <Button
          onClick={() => {
            setEditingPlan(null);
            reset({});
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Plan
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : plans.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No plans yet</h3>
            <p className="text-sm text-gray-500 mb-6">Create your first financial plan to start tracking</p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                  <Target className="w-5 h-5 text-primary-600" />
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{plan.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${Math.min(plan.progress, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budget:</span>
                    <span className="font-medium">${parseFloat(plan.budgetAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Spent:</span>
                    <span className="font-medium text-red-600">${plan.spent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Remaining:</span>
                    <span className="font-medium text-green-600">${plan.remaining}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    {dayjs(plan.startDate).format('MMM DD')} - {dayjs(plan.endDate).format('MMM DD, YYYY')}
                  </p>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(plan)} className="flex-1">
                    Edit
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(plan.id)} className="flex-1">
                    Delete
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPlan(null);
          reset();
        }}
        title={editingPlan ? 'Edit Plan' : 'Create Plan'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
          <Input
            label="Plan Name"
            {...register('name', { required: 'Plan name is required' })}
            error={errors.name?.message}
            placeholder="e.g., Monthly Budget"
          />

          <Input
            label="Budget Amount"
            type="number"
            step="0.01"
            {...register('budgetAmount', {
              required: 'Budget amount is required',
              min: { value: 0.01, message: 'Amount must be greater than 0' },
            })}
            error={errors.budgetAmount?.message}
            placeholder="0.00"
          />

          <Input
            label="Start Date"
            type="date"
            {...register('startDate', { required: 'Start date is required' })}
            error={errors.startDate?.message}
          />

          <Input
            label="End Date"
            type="date"
            {...register('endDate', { required: 'End date is required' })}
            error={errors.endDate?.message}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="submit" loading={loading}>
              {editingPlan ? 'Update Plan' : 'Create Plan'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};