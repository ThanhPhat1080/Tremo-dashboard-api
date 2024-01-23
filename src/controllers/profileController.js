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

export default profileController;