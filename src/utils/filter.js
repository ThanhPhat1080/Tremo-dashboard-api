import { ORDER_STATUSES } from '../constants/index.js';

export const filterProducts = (reqQuery) => {
  const { query, isAvailable } = reqQuery;
  const filters = [];

  if (query) {
    filters.push(['ilike', 'productName', `%${query}%`]);
  }
  if (isAvailable == "true") {
    filters.push(['gt', 'quantity', 0]);
  }
  if (isAvailable == "false") {
    filters.push(['eq', 'quantity', 0]);
  }

  return filters;
}

export const filterOrders = (reqQuery) => {
  const { query, status } = reqQuery;
  const orderId = query;
  const filters = [];

  if (orderId) {
    filters.push(['eq', 'id', orderId]);
  }

  if (status && parseInt(status) in ORDER_STATUSES) {
    filters.push(['eq', 'status', parseInt(status)]);
  }

  return filters;
}
