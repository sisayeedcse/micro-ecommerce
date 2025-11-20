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
          id: 1,
          name: "Laptop",
          description: "High-performance laptop for professionals",
          price: 999.99,
          stock: 10,
        },
        {
          id: 2,
          name: "Wireless Mouse",
          description: "Ergonomic wireless mouse with long battery life",
          price: 29.99,
          stock: 50,
        },
        {
          id: 3,
          name: "Mechanical Keyboard",
          description: "RGB backlit mechanical keyboard",
          price: 89.99,
          stock: 25,
        },
        {
          id: 4,
          name: "USB-C Hub",
          description: "Multi-port USB-C hub with HDMI and USB 3.0",
          price: 49.99,
          stock: 30,
        },
        {
          id: 5,
          name: "Webcam HD",
          description: "1080p HD webcam with built-in microphone",
          price: 79.99,
          stock: 15,
        },
        {
          id: 6,
          name: "Headphones",
          description: "Noise-cancelling wireless headphones",
          price: 149.99,
          stock: 20,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
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
            <div key={product.id} className="product-card">
              <Link
                to={`/product/${product.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="product-image">📦</div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-price">
                    ${product.price.toFixed(2)}
                  </div>
                  <div className="product-stock">In stock: {product.stock}</div>
                </div>
              </Link>
              <div style={{ padding: "0 1rem 1rem" }}>
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
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
