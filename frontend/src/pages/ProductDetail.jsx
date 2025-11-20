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
          id: 1,
          name: "Laptop",
          description:
            "High-performance laptop perfect for professionals and gamers. Features the latest processor, ample RAM, and a stunning display.",
          price: 999.99,
          stock: 10,
        },
        2: {
          id: 2,
          name: "Wireless Mouse",
          description:
            "Ergonomic wireless mouse designed for comfort during extended use. Features long battery life and precise tracking.",
          price: 29.99,
          stock: 50,
        },
        3: {
          id: 3,
          name: "Mechanical Keyboard",
          description:
            "Premium RGB backlit mechanical keyboard with customizable keys and superior typing experience.",
          price: 89.99,
          stock: 25,
        },
      };
      setProduct(sampleProducts[id] || null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
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
          <h1>{product.name}</h1>
          <div className="product-price">${product.price.toFixed(2)}</div>
          <div className="product-stock">In stock: {product.stock}</div>
          <p className="product-description">{product.description}</p>

          <button onClick={handleAddToCart} disabled={product.stock === 0}>
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
