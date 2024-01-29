import { getPagination, getPaginationData } from '../utils/pagination.js';
import { valid_create_product } from '../utils/validate_payload.js';

const productController = ({app, supabase}) => {
  app.get(`/api/products`, async (req, res) => {
    const { page, size, query, isAvailable } = req.query;

    // without pagination
    if (!page || !size) {
      // list apply search query, isAvailable true
      if (query && isAvailable === "true") {
        const { data: products, error } = await supabase
          .from('products')
          .select('*')
          .gt('quantity', 0)
          .textSearch('productName', query, { config: 'english' });

        if (error) {
          res.status(500).send(error);
        }
        return res.status(200).send(products);  
      }
      
      // list apply search query, isAvailable false
      if (query && isAvailable === "false") {
        const { data: products, error } = await supabase
          .from('products')
          .select('*')
          .eq('quantity', 0)
          .textSearch('productName', query, { config: 'english' });

        if (error) {
          res.status(500).send(error);
        }
        return res.status(200).send(products);  
      }
      
      // list apply search isAvailable true
      if (isAvailable === "true") {
        const { data: products, error } = await supabase
          .from('products')
          .select('*')
          .gt('quantity', 0);

        if (error) {
          res.status(500).send(error);
        }
        return res.status(200).send(products);  
      }

      // list apply search isAvailable false
      if (isAvailable === "false") {
        console.log('GO THIS')
        const { data: products, error } = await supabase
          .from('products')
          .select('*')
          .eq('quantity', 0);

        if (error) {
          res.status(500).send(error);
        }
        return res.status(200).send(products);  
      }
      
      // list apply search query
      if (query) {
        const { data: products, error } = await supabase
          .from('products')
          .select('*')
          .textSearch('productName', query, { config: 'english' });

        if (error) {
          res.status(500).send(error);
        }
        return res.status(200).send(products);  
      }

      // all
      const { data: products, error } = await supabase.from('products').select('*');
      if (error) {
        res.status(500).send(error);
      }
      return res.status(200).send(products);
    }

    // with pagination
    const { from, to } = getPagination(parseInt(page), parseInt(size));
    // list apply search query, isAvailable true
    if (query && isAvailable === "true") {
      const { data, count, error } = await supabase
        .from('products')
        .select('*', { count: "exact" })
        .gt('quantity', 0)
        .textSearch('productName', query, { config: 'english' })
        .range(from, to);

      if (error) {
        res.status(500).send(error);
      }
      return res.status(200).send(getPaginationData(data, count, from, parseInt(size))); 
    }
    
    // list apply search query, isAvailable false
    if (query && isAvailable === "false") {
      const { data, count, error } = await supabase
        .from('products')
        .select('*', { count: "exact" })
        .eq('quantity', 0)
        .textSearch('productName', query, { config: 'english' })
        .range(from, to);

      if (error) {
        res.status(500).send(error);
      }
      return res.status(200).send(getPaginationData(data, count, from, parseInt(size))); 
    }
    
    // list apply search isAvailable true
    if (isAvailable === "true") {
      const { data, count, error } = await supabase
        .from('products')
        .select('*', { count: "exact" })
        .gt('quantity', 0)
        .range(from, to);

      if (error) {
        res.status(500).send(error);
      }
      return res.status(200).send(getPaginationData(data, count, from, parseInt(size))); 
    }

    // list apply search isAvailable false
    if (isAvailable === "false") {
      console.log('GO THIS')
      const { data, count, error } = await supabase
        .from('products')
        .select('*', { count: "exact" })
        .eq('quantity', 0)
        .range(from, to);

      if (error) {
        res.status(500).send(error);
      }
      return res.status(200).send(getPaginationData(data, count, from, parseInt(size))); 
    }
    
    // list apply search query
    if (query) {
      const { data, count, error } = await supabase
        .from('products')
        .select('*', { count: "exact" })
        .textSearch('productName', query, { config: 'english' })
        .range(from, to);

      if (error) {
        res.status(500).send(error);
      }
      return res.status(200).send(getPaginationData(data, count, from, parseInt(size))); 
    }

    // all
    const { data, count, error } = await supabase
      .from('products')
      .select('*', { count: "exact" })
      .range(from, to);

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

    res.status(201).send('Create success!');
  });

  app.patch(`/api/products/:productId`, async (req, res) => {
    const productId = req.params.productId;
    const payload = req.body;
    const data = {
      productName: payload.name,
      description: payload.desc,
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

    res.status(200).send('Update success!');
  });
};

  
export default productController;