import { createClient } from '@supabase/supabase-js';
import express from 'express';
import bodyParser from 'body-parser';
import env from 'dotenv';
import { getPagination, getPaginationData } from './pagination.js';

env.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded());

const userController = ({ app, supabase }) => {

  app.get(`/api/users`, async (req, res) => {

    if (req.query.email) {
      const { data: users, error } = await supabase.from('users')
        .select('*')
        .eq('email', req.query.email);

      if (error) {
        res.status(500).send(error);
      }

      return res.status(200).send(users);
    }

    const { data: users, error } = await supabase.from('users')
      .select('*');

    if (error) {
      res.status(500).send(error);
    }

    return res.status(200).send(users);


  });

  app.post(`/api/user`, async (req, res) => {
    const { name, password, email } = req.body;
    const { data, error } = await supabase.from('users')
      .select('email')
      .eq('email', email || '');

    if (error) {
      return res.status(500).send(error);
    }

    if (data.length !== 0) {
      return res.status(403).send({
        error: true,
        message: 'User already exist!',
      });
    }

    const createUserRes = await supabase.from('users')
      .insert([{ name, password, email }])
      .select();

    if (createUserRes.error) {
      return res.status(500).send(error);
    }

    return res.status(201).send(createUserRes.data);
  });

  // app.put(`/api/user`, async (req, res) => {
  //   const { name, lastName, id } = req.body;

  //   db.get('users')
  //     .find({ id })
  //     .assign({ name, lastName })
  //     .write();

  //   const user = db.get('users')
  //     .find({ id })
  //     .value();

  //   return res.status(202).send({
  //     error: false,
  //     user
  //   });
  // });

  // app.delete(`/api/user/:id`, async (req, res) => {
  //   const { id } = req.params;

  //   db.get('users')
  //     .remove({ id })
  //     .write()

  //   return res.status(202).send({
  //     error: false
  //   })

  // })
};

const profileController = ({app, supabase }) => {
  app.get(`/api/profile`, async (req, res) => {

    const { data: profiles, error } = await supabase.from('profile')
      .select('*');

    if (error) {
      res.status(500).send(error);
    }

    return res.status(200).send(profiles[0]);
  });
}


const projectController = ({app, supabase }) => {
  app.get(`/api/project`, async (req, res) => {

    const { data: projects, error } = await supabase.from('project')
      .select('*');

    if (error) {
      res.status(500).send(error);
    }

    return res.status(200).send(projects);
  });
}

const saleProjectController = ({app, supabase }) => {
  app.get(`/api/sale-project`, async (req, res) => {

    const { data: projects, error } = await supabase.from('saleProject')
      .select('*');

    if (error) {
      res.status(500).send(error);
    }

    return res.status(200).send(projects);
  });
}

const saleAnalyticController = ({app, supabase}) => {
  app.get(`/api/analytics`, async (req, res) => {

    const { data: projects, error } = await supabase.from('analytics')
      .select('*');

    if (error) {
      res.status(500).send(error);
    }

    return res.status(200).send(projects.length ? projects[0]: {});
  });
}

const saleInformationController = ({app, supabase}) => {
  app.get(`/api/sales`, async (req, res) => {

    const { data: projects, error } = await supabase.from('sales')
      .select('*');

    if (error) {
      res.status(500).send(error);
    }

    return res.status(200).send(projects.length ? projects[0]: {});
  });
};

const orderListController = ({app, supabase}) => {
  app.get(`/api/orders`, async (req, res) => {
    const { page, size } = req.query;
    const { from, to } = getPagination(parseInt(page), parseInt(size));
    
    console.log(from, to)
    const { data, count, error } = await supabase.from('orders')
      .select("*", { count: "exact" }).range(from, to);

    if (error) {
      res.status(500).send(error);
    }
    
    return res.status(200).send(getPaginationData(data, count, from, size));
  });
};


const orderDetailController = ({app, supabase }) => {
  app.get(`/api/orders/detail`, async (req, res) => {

    const { data: orders, error } = await supabase.from('orderDetail')
      .select('*');

    if (error) {
      res.status(500).send(error);
    }

    return res.status(200).send(orders.length ? orders[0]: {});
  });
}


// Execute controllers
userController({ app, supabase });
profileController({ app, supabase });
projectController({ app, supabase });
saleProjectController({ app, supabase });
saleAnalyticController({ app, supabase });
saleInformationController({ app, supabase });
orderListController({ app, supabase });
orderDetailController({ app, supabase });

app.get('/', (req, res) => {
  return res.send('Hello');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
