import { getPagination, getPaginationData } from '../utils/pagination.js';
import { valid_create_product, valid_edit_product } from '../utils/validate_payload.js';

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


  app.post(`/api/products`, async (req, res) => {
    const payload = req.body;
    console.log('payload', payload)
    if (valid_create_product(payload)) {
      res.status(400).send('Missing required fields');
    }

    const { error } = await supabase
      .from('products')
      .insert({
        productName: payload.name,
        description: payload.desc ? payload.desc : '',
        weight: payload.weight,
        category: payload.category,
        quantity: payload.quantity ? payload.quantity : 0,
        price: payload.price ? payload.price : 0,
        currency: payload.currency,
        sku: payload.sku,
        tags: payload.tags ? payload.tags : [],
        image: payload.image ? payload.image : '',
        shopifyUrl: payload.shopifyUrl ? payload.shopifyUrl : '',
        facebookUrl: payload.facebookUrl ? payload.facebookUrl : '',
        instagramUrl: payload.instagramUrl ? payload.instagramUrl : '',
      })

    if (error) {
      res.status(500).send(error);
    }

    res.status(200).send('Create success!');
  });

  // app.put(`/api/product/:id`, async (req, res) => {
  //   const payload = req.body;
  //   if (valid_edit_product(payload)) {
  //     res.status(400).send('Include not allow fields');
  //   }

  //   const { error } = await supabase
  //     .from('products')
  //     .update({
  //       productName: payload.name,
  //       description: payload.desc ? payload.desc : '',
  //       weight: payload.weight,
  //       category: payload.category,
  //       quantity: payload.quantity ? payload.quantity : 0,
  //       price: payload.price ? payload.price : 0,
  //       currency: payload.currency,
  //       sku: payload.sku,
  //       tags: payload.tags ? payload.tags : [],
  //       image: payload.image ? payload.image : '',
  //       shopifyUrl: payload.shopifyUrl ? payload.shopifyUrl : '',
  //       facebookUrl: payload.facebookUrl ? payload.facebookUrl : '',
  //       instagramUrl: payload.instagramUrl ? payload.instagramUrl : '',
  //     })
  //     .eq('id', req.params.id)

  //   if (error) {
  //     res.status(500).send(error);
  //   }

  //   return res.status(200).send('Update success!');
  // });
};
  

export default productController;