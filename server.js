const express = require('express');
const fs = require('fs/promises');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 8080;

app.use(express.json());

const productsRouter = express.Router();
const cartRouter = express.Router();

const PRODUCTS_FILE_PATH = './productos.json';
const CART_FILE_PATH = './carrito.json';

const readDataFromFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath);
    return JSON.parse(data);
  } catch (error) {
    console.log(`Error reading data from file ${filePath}: ${error}`);
    return [];
  }
};

const writeDataToFile = async (filePath, data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    console.log(`Data written to file ${filePath}`);
  } catch (error) {
    console.log(`Error writing data to file ${filePath}: ${error}`);
  }
};

const getProductById = async (productId) => {
  const products = await readDataFromFile(PRODUCTS_FILE_PATH);
  return products.find((product) => product.id === productId);
};

const updateProduct = async (productId, updatedProduct) => {
  const products = await readDataFromFile(PRODUCTS_FILE_PATH);
  const index = products.findIndex((product) => product.id === productId);
  if (index !== -1) {
    products[index] = { ...updatedProduct, id: productId };
    await writeDataToFile(PRODUCTS_FILE_PATH, products);
    return true;
  }
  return false;
};

const deleteProduct = async (productId) => {
  const products = await readDataFromFile(PRODUCTS_FILE_PATH);
  const index = products.findIndex((product) => product.id === productId);
  if (index !== -1) {
    products.splice(index, 1);
    await writeDataToFile(PRODUCTS_FILE_PATH, products);
    return true;
  }
  return false;
};

productsRouter.get('/', async (req, res) => {
  const { limit } = req.query;
  const products = await readDataFromFile(PRODUCTS_FILE_PATH);
  res.json(limit ? products.slice(0, parseInt(limit)) : products);
});

productsRouter.get('/:pid', async (req, res) => {
  const productId = req.params.pid;
  const product = await getProductById(productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

productsRouter.post('/', async (req, res) => {
  const { title, description, code, price, status = true, stock, category, thumbnails } = req.body;
  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const products = await readDataFromFile(PRODUCTS_FILE_PATH);
  const isCodeTaken = products.some((product) => product.code === code);
  if (isCodeTaken) {
    return res.status(409).json({ error: 'Product code already taken' });
  }
  const newProduct = { id: uuidv4(), title, description, code, price, status, stock, category, thumbnails };
  products.push(newProduct);
  await writeDataToFile(PRODUCTS_FILE_PATH, products);
  res.status(201).json(newProduct);
});

productsRouter.put('/:pid', async (req, res) => {
  const productId = req.params.pid;
  const { title, description, code,price, status, stock, category, thumbnails } = req.body;
  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const isCodeTaken = (await getProductById(productId))
    ? false
    : (await readDataFromFile(PRODUCTS_FILE_PATH)).some((product) => product.code === code);
  if (isCodeTaken) {
    return res.status(409).json({ error: 'Product code already taken' });
  }
  const updatedProduct = { title, description, code, price, status, stock, category, thumbnails };
  if (await updateProduct(productId, updatedProduct)) {
    res.json({ id: productId, ...updatedProduct });
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

productsRouter.delete('/:pid', async (req, res) => {
  const productId = req.params.pid;
  if (await deleteProduct(productId)) {
    res.json({ message: `Product with id ${productId} deleted` });
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

cartRouter.get('/', async (req, res) => {
  const cart = await readDataFromFile(CART_FILE_PATH);
  res.json(cart);
});

cartRouter.post('/:pid', async (req, res) => {
  const productId = req.params.pid;
  const product = await getProductById(productId);
  if (product) {
    const cart = await readDataFromFile(CART_FILE_PATH);
    cart.push(product);
    await writeDataToFile(CART_FILE_PATH, cart);
    res.status(201).json({ message: `Product ${product.title} added to cart` });
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

cartRouter.delete('/:pid', async (req, res) => {
  const productId = req.params.pid;
  const cart = await readDataFromFile(CART_FILE_PATH);
  const index = cart.findIndex((product) => product.id === productId);
  if (index !== -1) {
    cart.splice(index, 1);
    await writeDataToFile(CART_FILE_PATH, cart);
    res.json({ message: `Product with id ${productId} removed from cart` });
  } else {
    res.status(404).json({ error: 'Product not found in cart' });
  }
});

app.use('/productos', productsRouter);
app.use('/carrito', cartRouter);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});