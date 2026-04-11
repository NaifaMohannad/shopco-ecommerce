import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { FiSearch, FiShoppingCart, FiUser, FiX, FiMenu } from "react-icons/fi";
import useWindowSize from "../hooks/useWindowSize";
import { getProducts } from "../services/api";

function Navbar() {
  const [showBanner, setShowBanner] = useState(true);
  const [showShopMenu, setShowShopMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const searchInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const cartCount = cart?.items?.length || 0;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".shop-menu")) {
        setShowShopMenu(false);
      }
      if (!e.target.closest(".user-menu")) {
        setShowUserMenu(false);
      }
      if (!e.target.closest(".search-box")) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Live search with debounce
  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim().length > 0) {
        try {
          const response = await getProducts({ search: searchQuery });
          setSearchResults(response.data.slice(0, 6));
          setShowSearchDropdown(true);
        } catch (error) {
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
        setShowSearchDropdown(false);
      }
    };
    const timer = setTimeout(searchProducts, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setShowMobileMenu(false);
    setShowUserMenu(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery}`);
      setSearchQuery("");
      setShowMobileMenu(false);
      setShowSearchBar(false);
      setShowSearchDropdown(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  return (
    <>
      {/* Top Banner */}
      {showBanner && (
        <div
          style={{
            backgroundColor: "#000",
            color: "#fff",
            textAlign: "center",
            padding: "8px",
            fontSize: isMobile ? "12px" : "14px",
            position: "relative",
          }}
        >
          Sign up and get 20% off to your first order.{" "}
          <Link to="/register" style={{ color: "#fff", fontWeight: "bold" }}>
            Sign Up Now
          </Link>
          <button
            onClick={() => setShowBanner(false)}
            style={{
              position: "absolute",
              right: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FiX size={18} />
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isMobile ? "12px 16px" : "16px 40px",
          borderBottom: "1px solid #e5e5e5",
          backgroundColor: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Mobile Hamburger */}
        {isMobile && (
          <button
            onClick={() => setShowMobileMenu(true)}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <FiMenu size={24} />
          </button>
        )}

        {/* Logo */}
        <Link
          to="/"
          style={{
            fontSize: isMobile ? "20px" : "24px",
            fontWeight: "900",
            color: "#000",
            textDecoration: "none",
            letterSpacing: "-1px",
          }}
        >
          SHOP.CO
        </Link>

        {/* Desktop Nav Links */}
        {!isMobile && (
          <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
            <div className="shop-menu" style={{ position: "relative" }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowShopMenu(!showShopMenu);
                }}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                Shop ▾
              </button>
              {showShopMenu && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    backgroundColor: "#fff",
                    border: "1px solid #e5e5e5",
                    borderRadius: "8px",
                    padding: "8px 0",
                    minWidth: "150px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    zIndex: 200,
                  }}
                >
                  {["T-shirts", "Shorts", "Shirts", "Hoodie", "Jeans"].map(
                    (cat) => (
                      <Link
                        key={cat}
                        to={`/shop?category=${cat}`}
                        onClick={() => setShowShopMenu(false)}
                        style={dropdownStyle}
                      >
                        {cat}
                      </Link>
                    ),
                  )}
                </div>
              )}
            </div>
            <Link to="/shop?discount=true" style={navLinkStyle}>
              On Sale
            </Link>
            <Link to="/shop?new=true" style={navLinkStyle}>
              New Arrivals
            </Link>
            <Link
              to="/"
              onClick={(e) => {
                if (window.location.pathname === "/") {
                  e.preventDefault();
                  document
                    .getElementById("brands")
                    ?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              style={navLinkStyle}
            >
              Brands
            </Link>
          </div>
        )}

        {/* Desktop Search Bar with Dropdown */}
        {!isMobile && (
          <div
            className="search-box"
            style={{ position: "relative", width: "300px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#f0f0f0",
                borderRadius: "50px",
                padding: "8px 16px",
                gap: "8px",
              }}
            >
              <FiSearch size={18} color="#666" style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{
                  border: "none",
                  background: "none",
                  outline: "none",
                  fontSize: "14px",
                  width: "100%",
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setShowSearchDropdown(false);
                    setSearchResults([]);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#666",
                    display: "flex",
                  }}
                >
                  <FiX size={16} />
                </button>
              )}
            </div>

            {/* Search Dropdown Results */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "110%",
                  left: 0,
                  right: 0,
                  backgroundColor: "#fff",
                  border: "1px solid #e5e5e5",
                  borderRadius: "16px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  zIndex: 300,
                  overflow: "hidden",
                }}
              >
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    onClick={() => {
                      setSearchQuery("");
                      setShowSearchDropdown(false);
                      setSearchResults([]);
                    }}
                    style={{ textDecoration: "none", color: "#000" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "10px 16px",
                        borderBottom: "1px solid #f0f0f0",
                        cursor: "pointer",
                        backgroundColor: "transparent",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f9f9f9")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      {/* Product Image */}
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "8px",
                          overflow: "hidden",
                          backgroundColor: "#f2f0f1",
                          flexShrink: 0,
                        }}
                      >
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "10px",
                              color: "#999",
                            }}
                          >
                            No img
                          </div>
                        )}
                      </div>
                      {/* Product Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontWeight: "600",
                            fontSize: "13px",
                            marginBottom: "2px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {product.name}
                        </p>
                        <p style={{ color: "#666", fontSize: "12px" }}>
                          ${product.price}
                          {product.discount > 0 && (
                            <span
                              style={{ color: "#ff3333", marginLeft: "6px" }}
                            >
                              -{product.discount}%
                            </span>
                          )}
                        </p>
                      </div>
                      <span style={{ color: "#999" }}>›</span>
                    </div>
                  </Link>
                ))}

                {/* View All Results */}
                <div
                  onClick={() => {
                    navigate(`/shop?search=${searchQuery}`);
                    setSearchQuery("");
                    setShowSearchDropdown(false);
                    setSearchResults([]);
                  }}
                  style={{
                    padding: "12px 16px",
                    textAlign: "center",
                    color: "#000",
                    fontWeight: "600",
                    fontSize: "13px",
                    cursor: "pointer",
                    backgroundColor: "#f9f9f9",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f0f0f0")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f9f9f9")
                  }
                >
                  View all results for "{searchQuery}" →
                </div>
              </div>
            )}

            {/* No Results */}
            {showSearchDropdown &&
              searchQuery.length > 0 &&
              searchResults.length === 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "110%",
                    left: 0,
                    right: 0,
                    backgroundColor: "#fff",
                    border: "1px solid #e5e5e5",
                    borderRadius: "16px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    zIndex: 300,
                    padding: "16px",
                    textAlign: "center",
                    color: "#666",
                    fontSize: "14px",
                  }}
                >
                  No products found for "{searchQuery}"
                </div>
              )}
          </div>
        )}

        {/* Right Icons */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Mobile Search Icon */}
          {isMobile && (
            <button
              onClick={() => setShowSearchBar(!showSearchBar)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#000",
              }}
            >
              <FiSearch size={22} />
            </button>
          )}

          {/* Cart */}
          <Link to="/cart" style={{ position: "relative", color: "#000" }}>
            <FiShoppingCart size={22} />
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  backgroundColor: "#000",
                  color: "#fff",
                  borderRadius: "50%",
                  width: "18px",
                  height: "18px",
                  fontSize: "11px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Avatar */}
          <div style={{ position: "relative" }} className="user-menu">
            {user ? (
              <>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserMenu(!showUserMenu);
                  }}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: "#000",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    fontWeight: "700",
                    cursor: "pointer",
                    textTransform: "uppercase",
                  }}
                >
                  {user.username?.charAt(0)}
                </div>
                {showUserMenu && (
                  <div
                    style={{
                      position: "absolute",
                      top: "45px",
                      right: 0,
                      backgroundColor: "#fff",
                      border: "1px solid #e5e5e5",
                      borderRadius: "12px",
                      padding: "8px",
                      minWidth: "160px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      zIndex: 200,
                    }}
                  >
                    <p
                      style={{
                        padding: "8px 12px",
                        fontSize: "14px",
                        fontWeight: "700",
                        borderBottom: "1px solid #e5e5e5",
                        marginBottom: "4px",
                      }}
                    >
                      {user.username}
                    </p>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: "100%",
                        background: "none",
                        border: "none",
                        padding: "8px 12px",
                        textAlign: "left",
                        cursor: "pointer",
                        fontSize: "14px",
                        color: "#ff3333",
                        borderRadius: "8px",
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login" style={{ color: "#000" }}>
                <FiUser size={22} />
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Search Bar */}
      {isMobile && showSearchBar && (
        <div
          style={{
            position: "sticky",
            top: "57px",
            backgroundColor: "#fff",
            padding: "12px 16px",
            borderBottom: "1px solid #e5e5e5",
            zIndex: 99,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#f0f0f0",
              borderRadius: "50px",
              padding: "10px 16px",
              gap: "8px",
            }}
          >
            <FiSearch size={18} color="#666" />
            <input
              ref={searchInputRef}
              autoFocus
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  navigate(`/shop?search=${searchQuery}`);
                  setSearchQuery("");
                  setShowSearchBar(false);
                }
              }}
              style={{
                border: "none",
                background: "none",
                outline: "none",
                fontSize: "14px",
                width: "100%",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => {
                  navigate(`/shop?search=${searchQuery}`);
                  setSearchQuery("");
                  setShowSearchBar(false);
                }}
                style={{
                  background: "#000",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50px",
                  padding: "4px 12px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Go
              </button>
            )}
            <button
              onClick={() => setShowSearchBar(false)}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Mobile Search Dropdown */}
          {searchResults.length > 0 && (
            <div
              style={{
                backgroundColor: "#fff",
                border: "1px solid #e5e5e5",
                borderRadius: "16px",
                marginTop: "8px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              {searchResults.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  onClick={() => {
                    setSearchQuery("");
                    setShowSearchBar(false);
                    setSearchResults([]);
                  }}
                  style={{ textDecoration: "none", color: "#000" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px 16px",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        backgroundColor: "#f2f0f1",
                        flexShrink: 0,
                      }}
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : null}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontWeight: "600",
                          fontSize: "13px",
                          marginBottom: "2px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {product.name}
                      </p>
                      <p style={{ color: "#666", fontSize: "12px" }}>
                        ${product.price}
                      </p>
                    </div>
                    <span style={{ color: "#999" }}>›</span>
                  </div>
                </Link>
              ))}
              <div
                onClick={() => {
                  navigate(`/shop?search=${searchQuery}`);
                  setSearchQuery("");
                  setShowSearchBar(false);
                  setSearchResults([]);
                }}
                style={{
                  padding: "12px 16px",
                  textAlign: "center",
                  color: "#000",
                  fontWeight: "600",
                  fontSize: "13px",
                  cursor: "pointer",
                  backgroundColor: "#f9f9f9",
                }}
              >
                View all results →
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobile && showMobileMenu && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#fff",
            zIndex: 200,
            padding: "24px",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <Link
              to="/"
              onClick={() => setShowMobileMenu(false)}
              style={{
                fontSize: "20px",
                fontWeight: "900",
                color: "#000",
                textDecoration: "none",
              }}
            >
              SHOP.CO
            </Link>
            <button
              onClick={() => setShowMobileMenu(false)}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <FiX size={24} />
            </button>
          </div>

          {[
            { label: "T-shirts", path: "/shop?category=T-shirts" },
            { label: "Shorts", path: "/shop?category=Shorts" },
            { label: "Shirts", path: "/shop?category=Shirts" },
            { label: "Hoodie", path: "/shop?category=Hoodie" },
            { label: "Jeans", path: "/shop?category=Jeans" },
            { label: "On Sale", path: "/shop?discount=true" },
            { label: "New Arrivals", path: "/shop?new=true" },
            { label: "Brands", path: "/shop" },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => setShowMobileMenu(false)}
              style={{
                display: "block",
                padding: "14px 0",
                fontSize: "16px",
                color: "#000",
                textDecoration: "none",
                borderBottom: "1px solid #e5e5e5",
              }}
            >
              {item.label}
            </Link>
          ))}

          <div style={{ marginTop: "24px" }}>
            {user ? (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor: "#000",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                    }}
                  >
                    {user.username?.charAt(0)}
                  </div>
                  <span style={{ fontSize: "16px", fontWeight: "600" }}>
                    {user.username}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    backgroundColor: "#000",
                    color: "#fff",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "50px",
                    cursor: "pointer",
                    fontSize: "14px",
                    width: "100%",
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <Link
                  to="/login"
                  onClick={() => setShowMobileMenu(false)}
                  style={{
                    display: "block",
                    backgroundColor: "#000",
                    color: "#fff",
                    padding: "12px 24px",
                    borderRadius: "50px",
                    textDecoration: "none",
                    textAlign: "center",
                    fontSize: "14px",
                  }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setShowMobileMenu(false)}
                  style={{
                    display: "block",
                    backgroundColor: "#fff",
                    color: "#000",
                    padding: "12px 24px",
                    borderRadius: "50px",
                    border: "1px solid #000",
                    textDecoration: "none",
                    textAlign: "center",
                    fontSize: "14px",
                  }}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const navLinkStyle = {
  textDecoration: "none",
  color: "#000",
  fontSize: "16px",
};
const dropdownStyle = {
  display: "block",
  padding: "8px 16px",
  textDecoration: "none",
  color: "#000",
  fontSize: "14px",
};

export default Navbar;
