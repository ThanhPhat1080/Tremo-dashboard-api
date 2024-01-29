const ORDER_LIST_COLUMNS = [
  'id', 
  'createdAt', 
  'status', 
  'customer', 
  'revenue', 
  'products'
]

const ORDER_DETAIL_COLUMNS = [
  'id', 
  'createdAt', 
  'status', 
  'customer', 
  'revenue', 
  'products',

  'status',
  'customer',
  'revenue',
  'orderCode',
  'orderDeliverPrice',
  'orderTax',
  'billingInfo',
  'trackOrderInfo'
]

const ORDER_STATUSES_MAPPING = {
  0: 'Paid',
  1: 'Canceled',
  2: 'Refunded'

}
export const ORDER_LIST_COLUMNS_SELECT = ORDER_LIST_COLUMNS.join(',')
export const ORDER_DETAIL_COLUMNS_SELECT = ORDER_DETAIL_COLUMNS.join(',')
export const ORDER_STATUSES = Object.getOwnPropertyNames(ORDER_STATUSES_MAPPING)