import { createClient } from '@supabase/supabase-js';
import express from 'express';
import bodyParser from 'body-parser';
import env from 'dotenv';

env.config();

const supabaseUrl = 'https://slpmzxukenigimrfdrly.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded());

const userController = ({ app, supabase }) => {

  app.get(`/api/users`, async (req, res) => {
    const { data: users, error } = await supabase.from('users')
      .select('*')
      .eq('email', req.query.email || '');

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
      return res.status(500).send({
        error: true,
        message: 'User already exist!',
      });
    }

    const createUserRes = await supabase.from('users')
      .insert([{ name, password, email }])
      .select();
    console.log('data', createUserRes);

    if (createUserRes.error) {
      res.status(500).send(error);
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

// Execute controllers
userController({ app, supabase });

app.get('/', (req, res) => {
  return res.send('Hello');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
