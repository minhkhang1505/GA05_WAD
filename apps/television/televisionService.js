const pool = require('../../config/database');
const productService = require('../product/productService');

/**
 * Get all mobilphones with filters applied and the total number of televisions.
 * Each record in the result set contains the following fields:
 * - id
 * - name
 * - brand
 * - price
 * - imageurl
 * - detail
 * - discount
 * - numberofpro (number of products)
 * - type_name (type of product)
 * - total_count (total number of products matching the filters)
 * 
 * @param {number} minPrice - Minimum price filter.
 * @param {number} maxPrice - Maximum price filter.
 * @param {number} page - Page number for pagination, expected to be greater than 0.
 * @param {number} limit - Number of items per page.
 * @param {string} sort - Sort order (column, direction). e.g. "id,ASC". If not provided, by default is random order.
 * @param {string} brand - Brand filter.
 * @param {string} search - Search keyword.
 * @returns {Promise<Object>} - An object containing the total count of televisions and the list of televisions.
 * @returns {number} return.totalCount - Total number of televisions matching the filters.
 * @returns {Array} return.products - Array of televisions.
 * @example
 * const { totalCount, products } = await getAllComputersWithFilterAndCount(0, 1000, 1, 10, "price,ASC", "Apple", "macbook");
 */
async function getAllTelevisionsWithFilterAndCount(minPrice, maxPrice, page, limit, sort, brand, search) {
  try {
      page = Math.max(1, page);
      const { totalCount, products } = await productService.getAllProductsOfTypeWithFilterAndCount(
          minPrice, maxPrice, page, limit, sort, brand, search, 'televisions'
      );
      
      return { totalCount, products };
  } catch (error) {
      console.error('Error fetching all televisions', error);
      return { totalCount: 0, products: [] };
  }
}

/**
 * Get a television by its ID.
 * 
 * @param {number} id - The ID of the television.
 * @returns {Promise<Object>} - The television object if found, otherwise an empty array.
 * @example
 * const television = await getComputerByID(1);
 */
async function getTelevisionByID(id) {
  try {
      const query = `
      SELECT * 
      FROM products 
      WHERE id = $1
      `;
      const result = await pool.query(query, [id]);
      return result.rows[0];
  } catch (error) {
      console.error('Error fetching television by ID', error);
      return [];
  }
}

/**
* Get related televisions, excluding the current television.
* 
* @param {number} currentId - The ID of the current television.
* @param {number} [limit=3] - The maximum number of related televisions to fetch. If not provided, by default is 3.
* @returns {Promise<Array>} - A list of related televisions.
* @example
* const relatedComputers = await getRelatedComputers(1, 3);
*/
async function getRelatedTelevisions(currentId, limit = 3) {
  try {
      const query = `
      SELECT p.id, p.name, p.brand, p.price, p.imageurl, p.discount, p.numberofpro, t.type_name
      FROM products p JOIN types t ON p.type_id = t.id
      WHERE type_id = (SELECT id from types where type_name = 'televisions')
      AND p.id <> $1
      ORDER BY RANDOM() 
      LIMIT $2
      `;
      const result = await pool.query(query, [currentId, limit]);
      return result.rows;
  } catch (error) {
      console.error('Error fetching related televisions', error);
      return [];
  }
}

async function getAllTelevisionBrands() {
  const brands = productService.getAllBrandsOfType('televisions');
  return brands;
}

module.exports = {
  getAllTelevisionsWithFilterAndCount,
  getTelevisionByID,
  getRelatedTelevisions,
  getAllTelevisionBrands,
};
    