const saleController = ({app, supabase}) => {
  app.get(`/api/analytics`, async (req, res) => {

    const { data: projects, error } = await supabase.from('analytics')
      .select('*');

    if (error) {
      res.status(500).send(error);
    }

    return res.status(200).send(projects.length ? projects[0]: {});
  });

  app.get(`/api/sales`, async (req, res) => {

    const { data: projects, error } = await supabase.from('sales')
      .select('*');

    if (error) {
      res.status(500).send(error);
    }

    return res.status(200).send(projects.length ? projects[0]: {});
  });
};
  
export default saleController;