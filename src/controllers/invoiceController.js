import { getPagination, getPaginationData } from '../utils/pagination.js';
import { INVOICE_LIST_COLUMNS_SELECT } from '../constants/index.js';

const invoiceController = ({app, supabase}) => {
  app.get(`/api/invoices`, async (req, res) => {
    const { page, size } = req.query;

    // without pagination
    if (!page || !size) {
      // all
      const { data: invoices, error } = await supabase.from('invoices').select(INVOICE_LIST_COLUMNS_SELECT);
      if (error) {
        res.status(500).send(error);
      }
      return res.status(200).send(invoices);
    }

    // with pagination
    const { from, to } = getPagination(parseInt(page), parseInt(size));
    // all
    const { data, count, error } = await supabase
      .from('invoices')
      .select(INVOICE_LIST_COLUMNS_SELECT, { count: "exact" })
      .range(from, to);

    if (error) {
      res.status(500).send(error);
    }
    return res.status(200).send(getPaginationData(data, count, from, parseInt(size)));
  });


  app.get(`/api/invoices/:invoiceId`, async (req, res) => {
    const invoiceId = req.params.invoiceId;

    if (!invoiceId) {
      res.status(400).send("Missing invoice Id");
    }

    const { data: invoices, error } = await supabase.from('invoices')
      .select('*').eq('id', parseInt(invoiceId));

    if (error) {
      res.status(500).send(error);
    }

    return res.status(200).send(invoices.length ? invoices[0]: {});
  });
};

  
export default invoiceController;
