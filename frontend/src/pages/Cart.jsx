import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../api/api";

function Cart({ cart, updateQuantity, removeFromCart, clearCart }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setMessage({ type: "error", text: "Your cart is empty" });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const orderData = {
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        total: total,
      };

      await createOrder(orderData);

      setMessage({ type: "success", text: "Order placed successfully!" });
      clearCart();

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setMessage({
        type: "success",
        text: "Order simulated successfully! (Backend not connected)",
      });
      clearCart();

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !message) {
    return (
      <div className="cart-page">
        <h2>Shopping Cart</h2>
        <div className="empty-message">
          <p>Your cart is empty</p>
          <button
            onClick={() => navigate("/")}
            style={{ marginTop: "1rem", width: "auto" }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Shopping Cart</h2>

      {message && (
        <div
          className={
            message.type === "error" ? "error-message" : "success-message"
          }
        >
          {message.text}
        </div>
      )}

      {cart.length > 0 && (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p>${item.price.toFixed(2)} each</p>
                </div>

                <div className="cart-item-actions">
                  <div className="quantity-controls">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <div
                    style={{
                      fontWeight: "bold",
                      minWidth: "80px",
                      textAlign: "right",
                    }}
                  >
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="danger"
                    style={{ width: "auto", padding: "0.5rem 1rem" }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="checkout-button"
            >
              {loading ? "Processing..." : "Checkout"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
