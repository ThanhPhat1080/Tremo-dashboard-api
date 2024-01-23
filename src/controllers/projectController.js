export const projectController = ({app, supabase }) => {
  app.get(`/api/project`, async (req, res) => {

    const { data: projects, error } = await supabase.from('project')
      .select('*');

    if (error) {
      res.status(500).send(error);
    }

    return res.status(200).send(projects);
  });
}

export const saleProjectController = ({app, supabase }) => {
  app.get(`/api/sale-project`, async (req, res) => {

    const { data: projects, error } = await supabase.from('saleProject')
      .select('*');

    if (error) {
      res.status(500).send(error);
    }

    return res.status(200).send(projects);
  });
}