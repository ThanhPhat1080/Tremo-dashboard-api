import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import supabase from './services/supabase.js';
import userController from './controllers/userController.js';
import orderController from './controllers/orderController.js';
import productController from './controllers/productController.js';
import profileController from './controllers/profileController.js';
import saleController from './controllers/saleController.js';
import invoiceController from './controllers/invoiceController.js';
import { projectController, saleProjectController } from './controllers/projectController.js';


const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded());
app.use(cors())

// Execute controllers
// User controller
// - GET /api/users
// - POST /api/user
userController({ app, supabase });

// Profile controller
// - GET /api/profile
profileController({ app, supabase });

// Project controller
// - GET /api/project
// - GET /api/sale-project
projectController({ app, supabase });
saleProjectController({ app, supabase });

// Sale controller
// - GET /api/analytics
// - GET /api/sales
saleController({ app, supabase });

// Order controller
// - GET /api/orders
// - GET /api/orders/detail
// - GET /api/orders/:orderId
orderController({ app, supabase });

// Product controller
// - GET /api/products
// - GET /api/products/:productId
// - POST /api/products/
productController({ app, supabase });

// Invoice controller
// - GET /api/invoices
// - GET /api/invoices/:invoiceId
invoiceController({ app, supabase });

app.get('/', (req, res) => {
  return res.send('Hello');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
