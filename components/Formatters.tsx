export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'k';
  }
  return Math.floor(num).toString();
};

export const formatCurrency = (num: number) => {
  return new Intl.NumberFormat('en-US').format(Math.floor(num));
};
