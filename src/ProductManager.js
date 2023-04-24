import { promises as fs } from 'fs';

class ProductManager {
  constructor() {
    this.filePath = './src/products.json';
  }

  async getProducts() {
    try {
      const products = await fs.readFile(this.filePath);
      return JSON.parse(products);
    } catch (err) {
      return [];
    }
  }

  async addProduct(product) {
    const products = await this.getProducts();
    let id = Math.floor(Math.random() * 1000);
    while (products.find((p) => p.id === id)) {
      id = Math.floor(Math.random() * 1000);
    }
    const newProduct = { ...product, id };
    products.push(newProduct);
    await fs.writeFile(this.filePath, JSON.stringify(products));
    return newProduct;
  }

  async getProductById(id) {
    const products = await this.getProducts();
    const product = products.find(p => p.id === parseInt(id));
    return product;
}


  async updateProduct(id, fieldsToUpdate) {
    const products = await this.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index < 0) {
      throw new Error(`Product with id ${id} not found`);
    }
    const updatedProduct = { ...products[index], ...fieldsToUpdate, id };
    products[index] = updatedProduct;
    await fs.writeFile(this.filePath, JSON.stringify(products));
    return updatedProduct;
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index < 0) {
      throw new Error(`Product with id ${id} not found`);
    }
    products.splice(index, 1);
    await fs.writeFile(this.filePath, JSON.stringify(products));
  }
}

async function testProductManager() {
  const manager = new ProductManager();
  console.log(await manager.getProducts());

  const productToAdd = {
    title: 'producto prueba',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 25,
  };
  const newProduct = await manager.addProduct(productToAdd);
  console.log(newProduct);
  console.log(await manager.getProducts());

  const productById = await manager.getProductById(newProduct.id);
  console.log(productById);

  const updatedProduct = await manager.updateProduct(newProduct.id, { price: 300 });
  console.log(updatedProduct);

  await manager.deleteProduct(newProduct.id);
}

testProductManager();

export default ProductManager;
