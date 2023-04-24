import express from 'express';
import ProductManager from './ProductManager.js';

const app = express();
const port = 8080;

app.get('/products', async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : null;
  const productManager = new ProductManager();
  const products = await productManager.getProducts();
  if (limit) {
    res.send({ products: products.slice(0, limit) });
  } else {
    res.send({ products });
  }
});

app.get('/products/:pid', async (req, res) => {
  const pid = parseInt(req.params.pid);
  const productManager = new ProductManager();
  const product = await productManager.getProductById(pid);
  if (product) {
    res.send({ product });
  } else {
    res.status(404).send({ error: 'Product not found' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
