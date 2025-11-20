import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/api";

function Products({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError("Failed to load products. Using sample data.");
      // Sample data for demo purposes
      setProducts([
        {
          product_id: 1,
          user_id: 1,
          product_name: "Laptop",
          product_price: 999.99,
          product_quantity: 10,
          product_category: "Electronics",
        },
        {
          product_id: 2,
          user_id: 1,
          product_name: "Wireless Mouse",
          product_price: 29.99,
          product_quantity: 50,
          product_category: "Electronics",
        },
        {
          product_id: 3,
          user_id: 1,
          product_name: "Mechanical Keyboard",
          product_price: 89.99,
          product_quantity: 25,
          product_category: "Electronics",
        },
        {
          product_id: 4,
          user_id: 1,
          product_name: "USB-C Hub",
          product_price: 49.99,
          product_quantity: 30,
          product_category: "Accessories",
        },
        {
          product_id: 5,
          user_id: 1,
          product_name: "Webcam HD",
          product_price: 79.99,
          product_quantity: 15,
          product_category: "Electronics",
        },
        {
          product_id: 6,
          user_id: 1,
          product_name: "Headphones",
          product_price: 149.99,
          product_quantity: 20,
          product_category: "Audio",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.product_name} added to cart!`);
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div>
      <h2>Products</h2>
      {error && <div className="error-message">{error}</div>}

      {products.length === 0 ? (
        <div className="empty-message">No products available</div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.product_id} className="product-card">
              <Link
                to={`/product/${product.product_id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="product-image">📦</div>
                <div className="product-info">
                  <h3 className="product-name">{product.product_name}</h3>
                  <p
                    className="product-description"
                    style={{ fontSize: "0.85rem", color: "#888" }}
                  >
                    {product.product_category}
                  </p>
                  <div className="product-price">
                    ${product.product_price.toFixed(2)}
                  </div>
                  <div className="product-stock">
                    In stock: {product.product_quantity}
                  </div>
                </div>
              </Link>
              <div style={{ padding: "0 1rem 1rem" }}>
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.product_quantity === 0}
                >
                  {product.product_quantity === 0
                    ? "Out of Stock"
                    : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;
