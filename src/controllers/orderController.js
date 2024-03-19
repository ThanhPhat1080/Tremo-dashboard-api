import { getPagination, getPaginationData } from '../utils/pagination.js';
import { ORDER_LIST_COLUMNS_SELECT, ORDER_DETAIL_COLUMNS_SELECT, ORDER_STATUSES } from '../constants/index.js';
import { getSortData } from '../utils/sort.js';
import { filterOrders } from '../utils/filter.js';

const orderController = ({app, supabase}) => {
  app.get(`/api/orders`, async (req, res) => {
    const { page, size } = req.query;
    const { ascending, sortField } = getSortData(req.query);
    const filters = filterOrders(req.query);

    // Select orders - apply filters, sort
    const orders = filters.reduce(
      (acc, [filter, ...args]) => {
        return acc[filter](...args)
      },
      supabase
        .from('orders')
        .select('*', {count: 'exact'})
        .order(sortField, {ascending: ascending})
    );

    // Get data by pagination
    if (page && size) {
      const { from, to } = getPagination(parseInt(page), parseInt(size));
      const {data, count, error } = await orders.select('*', {count: 'exact'}).range(from, to);
      if (error) {
        res.status(500).send(error);
      }

      return res.status(200).send(getPaginationData(data, count, from, parseInt(size)));
    }

    // Get all data
    const {data, error } = await orders;
    if (error) {
      res.status(500).send(error);
    }
    return res.status(200).send(data);
  });

  app.get(`/api/orders/detail`, async (req, res) => {

    const { data: orders, error } = await supabase.from('orderDetail')
      .select(ORDER_DETAIL_COLUMNS_SELECT);

    if (error) {
      res.status(500).send(error);
    }

    return res.status(200).send(orders.length ? orders[0]: {});
  });

  app.get(`/api/orders/:orderId`, async (req, res) => {
    const orderId = req.params.orderId;

    if (!orderId) {
      res.status(400).send("Missing order Id");
    }

    const { data: orders, error } = await supabase.from('orders')
      .select('*').eq('id', parseInt(orderId));

    if (error) {
      res.status(500).send(error);
    }

    return res.status(200).send(orders.length ? orders[0]: {});
  });
};

export default orderController;
