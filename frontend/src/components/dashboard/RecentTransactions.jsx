
import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../common/Card';
import dayjs from 'dayjs';

export const RecentTransactions = ({ transactions }) => {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {transactions && transactions.length > 0 ? (
            transactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-full ${
                      transaction.type === 'CREDIT'
                        ? 'bg-green-100'
                        : 'bg-red-100'
                    }`}
                  >
                    {transaction.type === 'CREDIT' ? (
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {transaction.description || 'Transaction'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {dayjs(transaction.createdAt).format('MMM DD, YYYY')}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    transaction.type === 'CREDIT'
                      ? 'text-green-600'
                      : 'text-red-600'
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
  );
};