
export const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };
  
  export const formatDate = (date, format = 'short') => {
    const options = {
      short: { month: 'short', day: 'numeric', year: 'numeric' },
      long: { month: 'long', day: 'numeric', year: 'numeric' },
      numeric: { month: '2-digit', day: '2-digit', year: 'numeric' },
    };
  
    return new Intl.DateTimeFormat('en-US', options[format]).format(new Date(date));
  };
  
  export const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US').format(number);
  };
  