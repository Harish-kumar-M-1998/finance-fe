
export const CURRENCIES = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  ];
  
  export const EXPENSE_CATEGORIES = [
    { name: 'Food & Dining', color: '#FF6B6B', icon: '🍔' },
    { name: 'Transportation', color: '#4ECDC4', icon: '🚗' },
    { name: 'Shopping', color: '#45B7D1', icon: '🛍️' },
    { name: 'Entertainment', color: '#FFA07A', icon: '🎬' },
    { name: 'Bills & Utilities', color: '#98D8C8', icon: '💡' },
    { name: 'Healthcare', color: '#F06292', icon: '🏥' },
    { name: 'Education', color: '#BA68C8', icon: '📚' },
    { name: 'Travel', color: '#4DB6AC', icon: '✈️' },
    { name: 'Other', color: '#9E9E9E', icon: '📦' },
  ];
  
  export const RECURRING_FREQUENCIES = [
    { value: 'DAILY', label: 'Daily' },
    { value: 'WEEKLY', label: 'Weekly' },
    { value: 'MONTHLY', label: 'Monthly' },
    { value: 'YEARLY', label: 'Yearly' },
  ];
  
  export const DATE_RANGES = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'Last 7 Days', value: 'last7days' },
    { label: 'Last 30 Days', value: 'last30days' },
    { label: 'This Month', value: 'thisMonth' },
    { label: 'Last Month', value: 'lastMonth' },
    { label: 'This Year', value: 'thisYear' },
    { label: 'Custom', value: 'custom' },
  ];