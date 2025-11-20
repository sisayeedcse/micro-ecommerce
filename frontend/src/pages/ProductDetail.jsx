import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct } from "../api/api";

function ProductDetail({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await getProduct(id);
      setProduct(data);
      setError(null);
    } catch (err) {
      setError("Failed to load product. Using sample data.");
      // Sample data for demo
      const sampleProducts = {
        1: {
          product_id: 1,
          user_id: 1,
          product_name: "Laptop",
          product_price: 999.99,
          product_quantity: 10,
          product_category: "Electronics",
        },
        2: {
          product_id: 2,
          user_id: 1,
          product_name: "Wireless Mouse",
          product_price: 29.99,
          product_quantity: 50,
          product_category: "Electronics",
        },
        3: {
          product_id: 3,
          user_id: 1,
          product_name: "Mechanical Keyboard",
          product_price: 89.99,
          product_quantity: 25,
          product_category: "Electronics",
        },
      };
      setProduct(sampleProducts[id] || null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
    alert(`${product.product_name} added to cart!`);
  };

  if (loading) {
    return <div className="loading">Loading product...</div>;
  }

  if (!product) {
    return <div className="empty-message">Product not found</div>;
  }

  return (
    <div className="product-detail">
      <button onClick={() => navigate("/")} className="back-button secondary">
        ← Back to Products
      </button>

      {error && <div className="error-message">{error}</div>}

      <div className="product-detail-content">
        <div className="product-detail-image">📦</div>

        <div className="product-detail-info">
          <h1>{product.product_name}</h1>
          <div className="product-price">
            ${product.product_price.toFixed(2)}
          </div>
          <div className="product-stock">
            In stock: {product.product_quantity}
          </div>
          <p
            className="product-description"
            style={{ fontSize: "1rem", color: "#666", marginBottom: "0.5rem" }}
          >
            <strong>Category:</strong> {product.product_category}
          </p>

          <button
            onClick={handleAddToCart}
            disabled={product.product_quantity === 0}
          >
            {product.product_quantity === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
