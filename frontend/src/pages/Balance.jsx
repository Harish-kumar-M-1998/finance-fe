
import React, { useEffect, useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { useBalanceStore } from '../store/balanceStore';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

export const Balance = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState('CREDIT');
  const { balance, transactions, fetchBalance, fetchHistory, addCredit, addDebit } = useBalanceStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    fetchBalance();
    fetchHistory({ limit: 50 });
  }, [fetchBalance, fetchHistory]);

  const onSubmit = async (data) => {
    try {
      if (transactionType === 'CREDIT') {
        await addCredit(data.amount, data.description);
        toast.success('Balance added successfully');
      } else {
        await addDebit(data.amount, data.description);
        toast.success('Expense recorded successfully');
      }
      setIsModalOpen(false);
      reset();
      fetchHistory({ limit: 50 });
    } catch (error) {
      toast.error('Failed to save transaction');
    }
  };

  const openModal = (type) => {
    setTransactionType(type);
    reset();
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Balance</h1>
          <p className="text-gray-600 mt-1">Manage your account balance</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={() => openModal('CREDIT')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Balance
          </Button>
          <Button variant="secondary" onClick={() => openModal('DEBIT')}>
            <Minus className="w-4 h-4 mr-2" />
            Record Expense
          </Button>
        </div>
      </div>

      <Card>
        <CardBody className="text-center py-8">
          <p className="text-sm text-gray-600 mb-2">Current Balance</p>
          <p className="text-5xl font-bold text-gray-900">
            ${parseFloat(balance || 0).toFixed(2)}
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {transactions && transactions.length > 0 ? (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-full ${
                        transaction.type === 'CREDIT' ? 'bg-green-100' : 'bg-red-100'
                      }`}
                    >
                      {transaction.type === 'CREDIT' ? (
                        <Plus className="w-4 h-4 text-green-600" />
                      ) : (
                        <Minus className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.description || 'Transaction'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {dayjs(transaction.createdAt).format('MMM DD, YYYY HH:mm')}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'CREDIT' ? '+' : '-'}$
                    {parseFloat(transaction.amount).toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No transactions yet
              </p>
            )}
          </div>
        </CardBody>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          reset();
        }}
        title={transactionType === 'CREDIT' ? 'Add Balance' : 'Record Expense'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Optional description..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="submit">
              {transactionType === 'CREDIT' ? 'Add Balance' : 'Record Expense'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};