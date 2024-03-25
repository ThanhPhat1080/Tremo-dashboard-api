import { getPagination, getPaginationData } from '../utils/pagination.js';
import { getSortData } from '../utils/sort.js';
import { filterProducts } from '../utils/filter.js';
import { valid_create_product } from '../utils/validate_payload.js';


const productController = ({ app, supabase }) => {
  app.get(`/api/products`, async (req, res) => {
    const { page, size } = req.query;
    const { ascending, sortField } = getSortData(req.query);
    const filters = filterProducts(req.query);

    // Select products - apply filters, sort
    const products = filters.reduce(
      (acc, [filter, ...args]) => {
        return acc[filter](...args)
      },
      supabase
        .from('products')
        .select('*', {count: 'exact'})
        .order(sortField, {ascending: ascending})
    );

    // Get data by pagination
    if (page && size) {
      const { from, to } = getPagination(parseInt(page), parseInt(size));
      const {data, count, error } = await products.select('*', {count: 'exact'}).range(from, to);
      if (error) {
        res.status(500).send(error);
      }
      return res.status(200).send(getPaginationData(data, count, from, parseInt(size)));
    }

    // Get all data
    const {data, error } = await products;
    if (error) {
      res.status(500).send(error);
    }
    return res.status(200).send(data);
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

    return res.status(200).send(products.length ? products[0] : {});
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
        productName: payload.productName,
        description: payload.description ? payload.description : '',
        providerName: payload.providerName ? payload.providerName : '',
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

    res.status(201).send({ message: 'Create success!' });
  });

  app.patch(`/api/products/:productId`, async (req, res) => {
    const productId = req.params.productId;
    const payload = req.body;
    const data = {
      productName: payload.productName,
      description: payload.description,
      providerName: payload.providerName,
      weight: payload.weight,
      category: payload.category,
      quantity: payload.quantity,
      price: payload.price,
      currency: payload.currency,
      sku: payload.sku,
      tags: payload.tags,
      image: payload.image,
      shopifyUrl: payload.shopifyUrl,
      facebookUrl: payload.facebookUrl,
      instagramUrl: payload.instagramUrl,
    }
    const { error } = await supabase
      .from('products')
      .update(data)
      .eq('id', parseInt(productId))

    if (error) {
      res.status(500).send(error);
    }

    res.status(200).send({ message: 'Update success!' });
  });
};


export default productController;
