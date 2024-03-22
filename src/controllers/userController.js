
const userController = ({ app, supabase }) => {

  /**
   * @swagger
   * /users:
   *   get:
   *     summary: Retrieve a list of users
   *     description: Retrieve a list of users.
  */
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

  app.post(`/api/users`, async (req, res) => {
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

  app.get(`/api/users/:userId`, async (req, res) => {
    const userId = req.params.userId ? parseInt(req.params.userId) : undefined;

    if (!userId) {
      res.status(400).send("Missing user Id");
    }


    const { data: users, error } = await supabase.from('users')
      .select('id,createdAt,name,email,pinCode').eq('id', parseInt(userId));

    if (error) {
      res.status(500).send(error);
    }

    return res.status(200).send(users.length ? users[0] : {});
  });

  app.patch(`/api/users/:userId`, async (req, res) => {
    const userId = req.params.userId ? parseInt(req.params.userId) : undefined;
    if (!userId) res.status(400).send({ message: 'Invalid user id.' });

    // user not exist
    const {
      dataUser, getError
    } = await supabase.from('users').select('id').eq('id', parseInt(userId))

    if (!dataUser || getError) return res.status(400).send({ message: 'User not exist.' });

    const { pinCode } = req.body;
    const data = {};

    // invalid pin code format
    if (!pinCode || pinCode && pinCode.toString().length < 6) {
      return res.status(400).send(
        { message: 'PIN Code must have 6 digits.' }
      );
    }

    if (pinCode) {
      data.pinCode = pinCode;
    }

    if (!!Object.keys(data).length) {
      const { error } = await supabase
        .from('users')
        .update(data)
        .eq('id', parseInt(userId))

      if (error) {
        return res.status(500).send(error);
      }

      return res.status(200).send({ message: 'Update success!' });
    }

    return res.status(200).send({ message: 'Nothing to update!' });
  });

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
