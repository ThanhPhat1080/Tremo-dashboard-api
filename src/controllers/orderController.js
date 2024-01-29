import { getPagination, getPaginationData } from '../utils/pagination.js';
import { ORDER_LIST_COLUMNS_SELECT, ORDER_DETAIL_COLUMNS_SELECT } from '../constants/index.js';

const orderController = ({app, supabase}) => {
  app.get(`/api/orders`, async (req, res) => {
    const { page, size, status } = req.query;

    // without pagination
    if (!page || !size) {
      const { data: orders, error } = await supabase.from('orders')
        .select(ORDER_LIST_COLUMNS_SELECT);

      if (error) {
        res.status(500).send(error);
      }
      
      return res.status(200).send(orders);
    }

    const { from, to } = getPagination(parseInt(page), parseInt(size));

    // with pagination and filter by status
    if (status && parseInt(status) in [0, 1, 2]) {
      const { data, count, error } = await supabase.from('orders')
        .select(ORDER_LIST_COLUMNS_SELECT, { count: "exact" })
        .eq('status', status)
        .range(from, to);

      if (error) {
        res.status(500).send(error);
      }
      return res.status(200).send(getPaginationData(data, count, from, parseInt(size)));
    }

    // with pagination
    const { data, count, error } = await supabase.from('orders')
      .select(ORDER_LIST_COLUMNS_SELECT, { count: "exact" }).range(from, to);

    if (error) {
      res.status(500).send(error);
    }
    
    return res.status(200).send(getPaginationData(data, count, from, parseInt(size)));
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