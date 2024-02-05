import { getPagination, getPaginationData } from '../utils/pagination.js';

const transactionController = ({app, supabase}) => {
  app.get(`/api/transactions`, async (req, res) => {
    const { page, size } = req.query;

    // without pagination
    if (!page || !size) {
      // all
      const { data: transactions, error } = await supabase.from('transactions').select('*');
      if (error) {
        res.status(500).send(error);
      }
      return res.status(200).send(transactions);
    }

    // with pagination
    const { from, to } = getPagination(parseInt(page), parseInt(size));
    // all
    const { data, count, error } = await supabase
      .from('transactions')
      .select('*', { count: "exact" })
      .range(from, to);

    if (error) {
      res.status(500).send(error);
    }
    return res.status(200).send(getPaginationData(data, count, from, parseInt(size)));
  });


  app.get(`/api/transactions/:transactionId`, async (req, res) => {
    const invoiceId = req.params.transactionId;

    if (!invoiceId) {
      res.status(400).send("Missing transaction Id");
    }

    const { data: transactions, error } = await supabase.from('transactions')
      .select('*').eq('id', parseInt(invoiceId));

    if (error) {
      res.status(500).send(error);
    }

    return res.status(200).send(transactions.length ? transactions[0]: {});
  });
};

  
export default transactionController;
