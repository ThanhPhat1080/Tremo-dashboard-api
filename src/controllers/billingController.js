const billingController = ({app, supabase }) => {
  app.get(`/api/billing`, async (req, res) => {

    const { data: billings, error } = await supabase.from('billing')
      .select('*');

    if (error) {
      res.status(500).send(error);
    }

    return res.status(200).send(billings[0]);
  });
}
  
export default billingController;