
import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Card, CardBody } from '../common/Card';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import dayjs from 'dayjs';

export const ExpenseList = ({ expenses, onEdit, onDelete, loading }) => {
  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!expenses || expenses.length === 0) {
    return (
      <Card>
        <CardBody>
          <EmptyState
            title="No expenses yet"
            description="Start tracking your expenses by adding your first one"
          />
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <Card key={expense.id}>
          <CardBody className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: expense.category.color + '20' }}
              >
                <span
                  className="text-lg font-semibold"
                  style={{ color: expense.category.color }}
                >
                  {expense.category.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  {expense.title}
                </h3>
                <p className="text-xs text-gray-500">
                  {expense.category.name} • {dayjs(expense.date).format('MMM DD, YYYY')}
                </p>
                {expense.notes && (
                  <p className="text-xs text-gray-600 mt-1">{expense.notes}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-lg font-bold text-gray-900">
                ${parseFloat(expense.amount).toFixed(2)}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(expense)}
                  className="p-2 text-primary-600 hover:bg-primary-50 rounded-md"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(expense.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};