
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

export default userController;