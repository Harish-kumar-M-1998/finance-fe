
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardBody } from '../common/Card';

export const SpendingChart = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">Spending Trend</h3>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#0ea5e9"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};
