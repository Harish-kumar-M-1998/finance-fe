
import React, { useEffect } from 'react';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import { useForm } from 'react-hook-form';
import { settingsService } from '../services/settingsService';
import toast from 'react-hot-toast';

export const Settings = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await settingsService.get();
        reset(settings);
      } catch (error) {
        console.error('Failed to load settings');
      }
    };
    loadSettings();
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      await settingsService.update(data);
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account preferences</p>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Select
              label="Currency"
              {...register('currency')}
              options={[
                { value: 'USD', label: 'USD ($)' },
                { value: 'EUR', label: 'EUR (€)' },
                { value: 'GBP', label: 'GBP (£)' },
                { value: 'INR', label: 'INR (₹)' },
              ]}
            />

            <Input
              label="Daily Spending Limit"
              type="number"
              step="0.01"
              {...register('dailyLimit')}
              placeholder="Optional"
            />

            <Input
              label="Monthly Spending Limit"
              type="number"
              step="0.01"
              {...register('monthlyLimit')}
              placeholder="Optional"
            />

            <div className="flex justify-end">
              <Button type="submit">Save Settings</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};