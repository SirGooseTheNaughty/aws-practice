const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const formatAsPrice = (price: number) => priceFormatter.format(price);

export const setAuthToken = (token: string) => localStorage.setItem('authorization_token', token);

export const getAuthToken = () => localStorage.getItem('authorization_token');
