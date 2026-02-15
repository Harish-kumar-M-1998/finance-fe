// frontend/src/components/dashboard/BalanceCard.jsx
import React from 'react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Card, CardBody } from '../common/Card';

export const BalanceCard = ({ balance, todaySpending, monthlySpending }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Balance</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ${parseFloat(balance || 0).toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-primary-100 rounded-full">
              <Wallet className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Spending</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ${parseFloat(todaySpending || 0).toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <TrendingDown className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Spending</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ${parseFloat(monthlySpending || 0).toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};