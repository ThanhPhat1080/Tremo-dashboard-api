import { getPagination, getPaginationData } from '../utils/pagination.js';

const productController = ({app, supabase}) => {
  app.get(`/api/products`, async (req, res) => {
    const { page, size } = req.query;

    // without pagination
    if (!page || !size) {
      const { data: orders, error } = await supabase.from('products').select('*');

      if (error) {
        res.status(500).send(error);
      }
      
      return res.status(200).send(orders);
    }

    // with pagination
    const { from, to } = getPagination(parseInt(page), parseInt(size));
    const { data, count, error } = await supabase.from('products')
      .select('*', { count: "exact" }).range(from, to);

    if (error) {
      res.status(500).send(error);
    }
    
    return res.status(200).send(getPaginationData(data, count, from, parseInt(size)));
  });


  app.get(`/api/products/:productId`, async (req, res) => {
    const productId = req.params.productId;

    if (!productId) {
      res.status(400).send("Missing product Id");
    }

    const { data: products, error } = await supabase.from('products')
      .select('*').eq('id', parseInt(productId));

    if (error) {
      res.status(500).send(error);
    }

    return res.status(200).send(products.length ? products[0]: {});
  });
};
  

export default productController;