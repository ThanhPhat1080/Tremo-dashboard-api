import { getPagination, getPaginationData } from '../utils/pagination.js';

const orderController = ({app, supabase}) => {
  app.get(`/api/orders`, async (req, res) => {
    const COLUMNS_LIST_SELECT = [
      'id', 
      'createdAt', 
      'status', 
      'customer', 
      'revenue', 
      'products'
    ]

    const { page, size } = req.query;

    // without pagination
    if (!page || !size) {
      const { data: orders, error } = await supabase.from('orders')
        .select(COLUMNS_LIST_SELECT.join(','));

      if (error) {
        res.status(500).send(error);
      }
      
      return res.status(200).send(orders);
    }

    // with pagination
    const { from, to } = getPagination(parseInt(page), parseInt(size));
    const { data, count, error } = await supabase.from('orders')
      .select(COLUMNS_LIST_SELECT.join(','), { count: "exact" }).range(from, to);

    if (error) {
      res.status(500).send(error);
    }
    
    return res.status(200).send(getPaginationData(data, count, from, parseInt(size)));
  });

  app.get(`/api/orders/detail`, async (req, res) => {

    const { data: orders, error } = await supabase.from('orderDetail')
      .select('*');

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