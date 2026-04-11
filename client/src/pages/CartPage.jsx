import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeItemFromCart, updateCartItem } from "../redux/slices/cartSlice";
import { placeOrderAction } from "../redux/slices/orderSlice";
import { FiTrash2, FiShoppingBag } from "react-icons/fi";
import useWindowSize from "../hooks/useWindowSize";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";

const VALID_COUPONS = {
  SHOP20: 20,
  SAVE10: 10,
  FLAT15: 15,
};

function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [promoCode, setPromoCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [dispatch, user]);

  const handleRemove = (itemId) => {
    dispatch(removeItemFromCart({ item_id: itemId }));
    showToast('Item removed from cart!', 'info');
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      cart.items.forEach((item) => {
        dispatch(removeItemFromCart({ item_id: item.id }));
      });
      showToast('Cart cleared!', 'info');
    }
  };

  const handleApplyCoupon = () => {
    const code = promoCode.trim().toUpperCase();
    if (VALID_COUPONS[code]) {
      setAppliedCoupon({ code, discount: VALID_COUPONS[code] });
      setCouponError("");
      setPromoCode("");
      showToast(`Coupon ${code} applied! ${VALID_COUPONS[code]}% off!`, 'success');
    } else {
      setCouponError("Invalid coupon code!");
      setAppliedCoupon(null);
      showToast('Invalid coupon code!', 'error');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
    showToast('Coupon removed!', 'info');
  };

  const handleCheckout = async () => {
    if (!user) {
      showToast('Please login to checkout!', 'warning');
      navigate("/login");
      return;
    }
    try {
      const result = await dispatch(
        placeOrderAction({
          discount: couponDiscount.toFixed(2),
        })
      );
      if (placeOrderAction.fulfilled.match(result)) {
        showToast('Order placed successfully! 🎉', 'success');
        dispatch(fetchCart());
        setAppliedCoupon(null);
        setTimeout(() => navigate("/"), 1500);
      } else {
        showToast('Something went wrong!', 'error');
      }
    } catch (error) {
      showToast('Something went wrong! Please try again.', 'error');
    }
  };

  const subtotal =
    cart?.items?.reduce(
      (acc, item) => acc + parseFloat(item.product.price) * item.quantity,
      0
    ) || 0;
  const couponDiscount = appliedCoupon
    ? (subtotal * appliedCoupon.discount) / 100
    : subtotal * 0.2;
  const deliveryFee = 15;
  const total = subtotal - couponDiscount + deliveryFee;

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "80px 40px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "16px" }}>
          Please login to view your cart!
        </h2>
        <Link to="/login" style={{
            backgroundColor: "#000", color: "#fff",
            padding: "12px 32px", borderRadius: "50px",
            textDecoration: "none", fontSize: "16px",
          }}>
          Login
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: isMobile ? "16px" : "24px 40px" }}>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      {/* Breadcrumb */}
      <p style={{ color: "#666", fontSize: "14px", marginBottom: "16px" }}>
        Home › Cart
      </p>

      <h1 style={{
          fontSize: isMobile ? "24px" : "32px",
          fontWeight: "900",
          textTransform: "uppercase",
          marginBottom: "24px",
          fontFamily: "'Bebas Neue', sans-serif",
          letterSpacing: "2px",
        }}>
        Your Cart
      </h1>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : cart?.items?.length === 0 || !cart ? (
        <div style={{ textAlign: "center", padding: "60px" }}>
          <div style={{ fontSize: "60px", marginBottom: "16px" }}>🛒</div>
          <p style={{ fontSize: "18px", color: "#666", marginBottom: "24px" }}>
            Your cart is empty!
          </p>
          <Link to="/shop" style={{
              backgroundColor: "#000", color: "#fff",
              padding: "12px 32px", borderRadius: "50px",
              textDecoration: "none", fontSize: "16px",
              display: "inline-flex", alignItems: "center", gap: "8px"
            }}>
            <FiShoppingBag size={18} />
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div style={{
            display: "flex",
            gap: "24px",
            flexDirection: isMobile ? "column" : "row",
          }}>
          {/* Left - Cart Items */}
          <div style={{ flex: 1 }}>
            <div style={{
                border: "1px solid #e5e5e5",
                borderRadius: "16px",
                padding: isMobile ? "16px" : "24px",
                marginBottom: "16px",
              }}>
              {cart.items.map((item, index) => (
                <div key={item.id}>
                  <div style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                      padding: "16px 0",
                    }}>
                    {/* Product Image - Clickable */}
                    <Link to={`/products/${item.product.id}`} style={{ flexShrink: 0 }}>
                      <div style={{
                          width: isMobile ? "80px" : "100px",
                          height: isMobile ? "80px" : "100px",
                          backgroundColor: "#f2f0f1",
                          borderRadius: "12px",
                          overflow: "hidden",
                        }}>
                        {item.product.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          <div style={{
                              width: "100%", height: "100%",
                              display: "flex", alignItems: "center",
                              justifyContent: "center",
                              color: "#999", fontSize: "12px"
                            }}>
                            No Image
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Link to={`/products/${item.product.id}`} style={{ textDecoration: "none", color: "#000" }}>
                          <h3 style={{
                              fontSize: isMobile ? "14px" : "16px",
                              fontWeight: "700",
                              marginBottom: "4px",
                              paddingRight: "8px",
                            }}>
                            {item.product.name}
                          </h3>
                        </Link>
                        <button onClick={() => handleRemove(item.id)} style={{
                            background: "none", border: "none",
                            color: "#ff3333", cursor: "pointer",
                            display: "flex", alignItems: "center", flexShrink: 0,
                          }}>
                          <FiTrash2 size={16} />
                        </button>
                      </div>

                      {/* Size & Color */}
                      <div style={{ marginBottom: "8px" }}>
                        {item.variant ? (
                          <>
                            <p style={{ color: "#666", fontSize: "13px" }}>
                              <span style={{ fontWeight: "600" }}>Size:</span> {item.variant.size}
                            </p>
                            <p style={{ color: "#666", fontSize: "13px" }}>
                              <span style={{ fontWeight: "600" }}>Color:</span> {item.variant.color}
                            </p>
                          </>
                        ) : (
                          <p style={{ color: "#999", fontSize: "13px" }}>No variant selected</p>
                        )}
                      </div>

                      <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: "8px",
                        }}>
                        <span style={{ fontSize: isMobile ? "16px" : "18px", fontWeight: "700" }}>
                          ${parseFloat(item.product.price).toFixed(2)}
                        </span>

                        {/* Quantity */}
                        <div style={{
                            display: "flex", alignItems: "center", gap: "10px",
                            backgroundColor: "#f0f0f0", borderRadius: "50px",
                            padding: "4px 12px",
                          }}>
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                dispatch(updateCartItem({ item_id: item.id, quantity: item.quantity - 1 }));
                              } else {
                                handleRemove(item.id);
                              }
                            }}
                            style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", lineHeight: 1 }}>−</button>
                          <span style={{ fontSize: "14px", fontWeight: "600", minWidth: "20px", textAlign: "center" }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => dispatch(updateCartItem({ item_id: item.id, quantity: item.quantity + 1 }))}
                            style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", lineHeight: 1 }}>+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < cart.items.length - 1 && (
                    <hr style={{ borderColor: "#e5e5e5" }} />
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Buttons */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link to="/shop" style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  border: "1px solid #000", borderRadius: "50px",
                  padding: "10px 24px", textDecoration: "none",
                  color: "#000", fontSize: "14px", fontWeight: "600"
                }}>
                <FiShoppingBag size={16} />
                Continue Shopping
              </Link>
              <button onClick={handleClearCart} style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  border: "1px solid #ff3333", borderRadius: "50px",
                  padding: "10px 24px", background: "none",
                  color: "#ff3333", fontSize: "14px",
                  fontWeight: "600", cursor: "pointer"
                }}>
                <FiTrash2 size={16} />
                Clear Cart
              </button>
            </div>
          </div>

          {/* Right - Order Summary */}
          <div style={{
              width: isMobile ? "100%" : "360px",
              flexShrink: 0,
              border: "1px solid #e5e5e5",
              borderRadius: "16px",
              padding: isMobile ? "16px" : "24px",
              height: "fit-content",
            }}>
            <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "24px" }}>
              Order Summary
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Subtotal</span>
                <span style={{ fontWeight: "600" }}>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>
                  Discount {appliedCoupon ? `(${appliedCoupon.code} -${appliedCoupon.discount}%)` : "(-20%)"}
                </span>
                <span style={{ fontWeight: "600", color: "#ff3333" }}>
                  -${couponDiscount.toFixed(2)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Delivery Fee</span>
                <span style={{ fontWeight: "600" }}>${deliveryFee}</span>
              </div>
              <hr style={{ borderColor: "#e5e5e5" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "700", fontSize: "18px" }}>Total</span>
                <span style={{ fontWeight: "700", fontSize: "18px" }}>
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Promo Code */}
            {appliedCoupon ? (
              <div style={{
                  backgroundColor: "#f0fff4",
                  border: "1px solid #00c853",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  marginBottom: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#00c853", fontSize: "18px" }}>✅</span>
                  <div>
                    <p style={{ fontWeight: "700", fontSize: "14px", color: "#000" }}>
                      {appliedCoupon.code}
                    </p>
                    <p style={{ fontSize: "12px", color: "#666" }}>
                      {appliedCoupon.discount}% discount applied!
                    </p>
                  </div>
                </div>
                <button onClick={handleRemoveCoupon} style={{
                    background: "none", border: "none",
                    color: "#ff3333", cursor: "pointer",
                    fontSize: "18px", fontWeight: "700"
                  }}>✕</button>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
                  <div style={{
                      display: "flex", alignItems: "center",
                      backgroundColor: "#f0f0f0", borderRadius: "50px",
                      padding: "10px 16px", flex: 1, gap: "8px",
                    }}>
                    <span>🏷️</span>
                    <input
                      type="text"
                      placeholder="Add promo code (e.g. SHOP20)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      onKeyPress={(e) => { if (e.key === "Enter") handleApplyCoupon(); }}
                      style={{
                        border: "none", background: "none",
                        outline: "none", fontSize: "13px", width: "100%",
                      }}
                    />
                  </div>
                  <button onClick={handleApplyCoupon} style={{
                      backgroundColor: "#000", color: "#fff", border: "none",
                      borderRadius: "50px", padding: "10px 16px",
                      cursor: "pointer", fontSize: "13px", fontWeight: "600",
                    }}>
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p style={{ color: "#ff3333", fontSize: "12px", marginBottom: "4px", paddingLeft: "8px" }}>
                    ❌ {couponError}
                  </p>
                )}
                <p style={{ color: "#999", fontSize: "11px", paddingLeft: "8px", marginBottom: "16px" }}>
                  Try: SHOP20, SAVE10, FLAT15
                </p>
              </div>
            )}

            {/* Checkout Button */}
            <button onClick={handleCheckout} style={{
                width: "100%", backgroundColor: "#000", color: "#fff",
                border: "none", borderRadius: "50px", padding: "16px",
                fontSize: "16px", fontWeight: "600", cursor: "pointer",
                display: "flex", alignItems: "center",
                justifyContent: "center", gap: "8px",
              }}>
              Go to Checkout →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;