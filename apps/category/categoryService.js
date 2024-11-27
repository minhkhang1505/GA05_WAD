const pool = require("../../config/database");
const productsService = require("../product/productService");
const {calculateDiscountedPrice} = require("../Utils/discountedPriceUtils.js");

async function getAllProducts(minPrice, maxPrice, page, limit, sort, brand, search) {
  try {
    // Đảm bảo page không nhỏ hơn 1
    page = Math.max(1, page);

    // product_type is not provided, which means 
    // we want to get all products 
    // and the total number of products 
    const {totalCount, products} = 
      await productsService.getAllProductsOfTypeWithFilterAndCount
      (minPrice, maxPrice, page, limit, sort, brand, search);
    products.forEach((product) => {
      product.price = calculateDiscountedPrice(product.price, product.discount);
    });

    //get all brands of products (product_type is not provided)
    const brandsArray = await productsService.getAllBrandsOfType();
    return { result: products, total: totalCount, brands: brandsArray };
  } catch (error) {
    console.error("Error fetching products:", error.message);
    return { result: [], total: 0, brands: [] };
  }
}




async function getMobilePhoneById(id) {
  try {
    const query = 'SELECT * FROM mobilephones WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching mobile phone:', error.message);
    return null;
  }
}

async function getComputerById(id) {
  try {
    const query = 'SELECT * FROM computers WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching computer:', error.message);
    return null;
  }
}

async function getTelevisionById(id) {
  try {
    const query = 'SELECT * FROM televisions WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching television:', error.message);
    return null;
  }
}

module.exports = {
  getAllProducts,
  getMobilePhoneById,
  getComputerById,
  getTelevisionById,
};


