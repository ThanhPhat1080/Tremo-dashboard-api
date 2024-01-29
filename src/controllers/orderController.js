import { getPagination, getPaginationData } from '../utils/pagination.js';
import { ORDER_LIST_COLUMNS_SELECT, ORDER_DETAIL_COLUMNS_SELECT, ORDER_STATUSES } from '../constants/index.js';

const orderController = ({app, supabase}) => {
  app.get(`/api/orders`, async (req, res) => {
    const { page, size, status, query } = req.query;
    const queryId = parseInt(query);

    // without pagination
    if (!page || !size) {
      if (status && queryId) {
        const { data: orders, error } = await supabase.from('orders')
          .match({ id: queryId, status: status })
          .select(ORDER_LIST_COLUMNS_SELECT);
        
        if (error) {
          res.status(500).send(error);
        }
        
        return res.status(200).send(orders);
      }

      if (status) {
        const { data: orders, error } = await supabase.from('orders')
          .eq('status', status)
          .select(ORDER_LIST_COLUMNS_SELECT);
        
        if (error) {
          res.status(500).send(error);
        }
        
        return res.status(200).send(orders);
      }

      if (query) {
        const { data: orders, error } = await supabase.from('orders')
          .eq('id', query)
          .select(ORDER_LIST_COLUMNS_SELECT);
        
        if (error) {
          res.status(500).send(error);
        }
        
        return res.status(200).send(orders);
      }

      const { data: orders, error } = await supabase.from('orders')
          .select(ORDER_LIST_COLUMNS_SELECT);

      if (error) {
        res.status(500).send(error);
      }
      
      return res.status(200).send(orders);
    }

    const { from, to } = getPagination(parseInt(page), parseInt(size));

    if (status && parseInt(status) in ORDER_STATUSES && queryId) {
      const { data, count, error } = await supabase.from('orders')
        .select(ORDER_LIST_COLUMNS_SELECT, { count: "exact" })
        .match({ id: queryId, status: parseInt(status) })
        .range(from, to);
      
      if (error) {
        res.status(500).send(error);
      }
      return res.status(200).send(getPaginationData(data, count, from, parseInt(size)));
    }

    if (status && parseInt(status) in ORDER_STATUSES) {
      const { data, count, error } = await supabase.from('orders')
        .select(ORDER_LIST_COLUMNS_SELECT, { count: "exact" })
        .eq('status', parseInt(status))
        .range(from, to);

      if (error) {
        res.status(500).send(error);
      }
      return res.status(200).send(getPaginationData(data, count, from, parseInt(size)));
    }

    if (query) {
      const { data, count, error } = await supabase.from('orders')
        .select(ORDER_LIST_COLUMNS_SELECT, { count: "exact" })
        .eq('id', queryId)
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