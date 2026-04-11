import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, fetchCategories } from "../redux/slices/productSlice";
import { FiFilter, FiX } from "react-icons/fi";
import useWindowSize from "../hooks/useWindowSize";

function ProductListPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { products, categories, loading } = useSelector(
    (state) => state.products,
  );
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    dress_style: "",
    min_price: "",
    max_price: "",
    size: "",
    color: "",
  });

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [priceRange, setPriceRange] = useState(500);

  const sizes = [
    "XX-Small",
    "X-Small",
    "Small",
    "Medium",
    "Large",
    "X-Large",
    "XX-Large",
    "3X-Large",
    "4X-Large",
  ];
  const colors = [
    "green",
    "red",
    "yellow",
    "orange",
    "cyan",
    "blue",
    "purple",
    "pink",
    "white",
    "black",
  ];
  const dressStyles = ["Casual", "Formal", "Party", "Gym"];

  useEffect(() => {
    dispatch(fetchCategories());
    const params = new URLSearchParams(location.search);
    const category = params.get("category") || "";
    const dress_style = params.get("dress_style") || "";
    const search = params.get("search") || "";
    setFilters((prev) => ({ ...prev, category, dress_style }));
    dispatch(fetchProducts({ category, dress_style, search }));
  }, [location.search, dispatch]);

  // Auto filter when filters change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search") || "";
    const dress_style = params.get("dress_style") || filters.dress_style || "";
    const category = params.get("category") || filters.category || "";
    dispatch(
      fetchProducts({
        category,
        dress_style,
        size: selectedSize,
        color: selectedColor,
        max_price: priceRange < 500 ? priceRange : "",
        search: search,
      }),
    );
  }, [filters, selectedSize, selectedColor, priceRange]);
  const handleCategoryClick = (catName) => {
    setFilters({
      ...filters,
      category: filters.category === catName ? "" : catName,
    });
  };

  const handleDressStyleClick = (style) => {
    setFilters({
      ...filters,
      dress_style: filters.dress_style === style ? "" : style,
    });
  };

  const handleSizeClick = (size) => {
    setSelectedSize(selectedSize === size ? "" : size);
  };

  const handleColorClick = (color) => {
    setSelectedColor(selectedColor === color ? "" : color);
  };

  const FilterContent = () => (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h3 style={{ fontWeight: "700", fontSize: "18px" }}>Filters</h3>
        {isMobile ? (
          <button
            onClick={() => setShowFilterDrawer(false)}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <FiX size={24} />
          </button>
        ) : (
          <span>⚙️</span>
        )}
      </div>

      {/* Categories */}
      <div
        style={{
          borderTop: "1px solid #e5e5e5",
          paddingTop: "16px",
          marginBottom: "16px",
        }}
      >
        <h4 style={{ fontWeight: "700", marginBottom: "12px" }}>Categories</h4>
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => handleCategoryClick(cat.name)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 0",
              cursor: "pointer",
              color: filters.category === cat.name ? "#000" : "#666",
              fontWeight: filters.category === cat.name ? "700" : "400",
            }}
          >
            <span>{cat.name}</span>
            <span>›</span>
          </div>
        ))}
      </div>

      {/* Price Range */}
      <div
        style={{
          borderTop: "1px solid #e5e5e5",
          paddingTop: "16px",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <h4 style={{ fontWeight: "700" }}>Price</h4>
          <span>▲</span>
        </div>
        <input
          type="range"
          min="0"
          max="500"
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          style={{ width: "100%", accentColor: "#000" }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "14px",
          }}
        >
          <span>$0</span>
          <span>${priceRange}</span>
        </div>
      </div>

      {/* Colors */}
      <div
        style={{
          borderTop: "1px solid #e5e5e5",
          paddingTop: "16px",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <h4 style={{ fontWeight: "700" }}>Colors</h4>
          <span>▲</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {colors.map((color) => (
            <div
              key={color}
              onClick={() => handleColorClick(color)}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: color,
                cursor: "pointer",
                border:
                  selectedColor === color
                    ? "3px solid #000"
                    : "2px solid #e5e5e5",
              }}
            />
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div
        style={{
          borderTop: "1px solid #e5e5e5",
          paddingTop: "16px",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <h4 style={{ fontWeight: "700" }}>Size</h4>
          <span>▲</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeClick(size)}
              style={{
                padding: "6px 14px",
                borderRadius: "50px",
                border: "1px solid #e5e5e5",
                backgroundColor: selectedSize === size ? "#000" : "#f0f0f0",
                color: selectedSize === size ? "#fff" : "#000",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Dress Style */}
      <div
        style={{
          borderTop: "1px solid #e5e5e5",
          paddingTop: "16px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <h4 style={{ fontWeight: "700" }}>Dress Style</h4>
          <span>▲</span>
        </div>
        {dressStyles.map((style) => (
          <div
            key={style}
            onClick={() => handleDressStyleClick(style)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 0",
              cursor: "pointer",
              color: filters.dress_style === style ? "#000" : "#666",
              fontWeight: filters.dress_style === style ? "700" : "400",
            }}
          >
            <span>{style}</span>
            <span>›</span>
          </div>
        ))}
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => {
          setFilters({
            category: "",
            dress_style: "",
            min_price: "",
            max_price: "",
            size: "",
            color: "",
          });
          setSelectedSize("");
          setSelectedColor("");
          setPriceRange(500);
          if (isMobile) setShowFilterDrawer(false);
        }}
        style={{
          width: "100%",
          backgroundColor: "#000",
          color: "#fff",
          border: "none",
          borderRadius: "50px",
          padding: "14px",
          fontSize: "16px",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        Clear Filters
      </button>
    </div>
  );

  return (
    <div style={{ padding: isMobile ? "16px" : "24px 40px" }}>
      {/* Mobile Header */}
      {isMobile && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "700" }}>
              {filters.category || filters.dress_style || "All Products"}
            </h2>
            <p style={{ color: "#666", fontSize: "13px" }}>
              {products.length} Products
            </p>
          </div>
          <button
            onClick={() => setShowFilterDrawer(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#000",
              color: "#fff",
              border: "none",
              borderRadius: "50px",
              padding: "10px 20px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            <FiFilter size={16} />
            Filters
          </button>
        </div>
      )}

      <div style={{ display: "flex", gap: "32px" }}>
        {/* Desktop Sidebar */}
        {!isMobile && (
          <div
            style={{
              width: "260px",
              flexShrink: 0,
              border: "1px solid #e5e5e5",
              borderRadius: "16px",
              padding: "24px",
              height: "fit-content",
              position: "sticky",
              top: "80px",
            }}
          >
            <FilterContent />
          </div>
        )}

        {/* Mobile Filter Drawer */}
        {isMobile && (
          <>
            {/* Dark Overlay */}
            {showFilterDrawer && (
              <div
                onClick={() => setShowFilterDrawer(false)}
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  zIndex: 199,
                }}
              />
            )}

            {/* Sidebar Drawer */}
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "80%",
                maxWidth: "320px",
                height: "100%",
                backgroundColor: "#fff",
                zIndex: 200,
                padding: "24px",
                overflowY: "auto",
                transform: showFilterDrawer
                  ? "translateX(0)"
                  : "translateX(-100%)",
                transition: "transform 0.3s ease",
                boxShadow: showFilterDrawer
                  ? "4px 0 20px rgba(0,0,0,0.15)"
                  : "none",
              }}
            >
              <FilterContent />
            </div>
          </>
        )}

        {/* Products */}
        <div style={{ flex: 1 }}>
          {/* Desktop Header */}
          {!isMobile && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <div>
                <h2 style={{ fontSize: "24px", fontWeight: "700" }}>
                  {filters.category || filters.dress_style || "All Products"}
                </h2>
                <p style={{ color: "#666", fontSize: "14px" }}>
                  Showing {products.length} Products
                </p>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span style={{ fontSize: "14px", color: "#666" }}>
                  Sort by:
                </span>
                <select
                  style={{
                    border: "1px solid #e5e5e5",
                    borderRadius: "8px",
                    padding: "6px 12px",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  <option>Most Popular</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>
          )}

          {/* Active Filters Tags */}
          {(filters.category ||
            filters.dress_style ||
            selectedSize ||
            selectedColor) && (
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                marginBottom: "16px",
              }}
            >
              {filters.category && (
                <span
                  onClick={() => setFilters({ ...filters, category: "" })}
                  style={{
                    backgroundColor: "#f0f0f0",
                    padding: "4px 12px",
                    borderRadius: "50px",
                    fontSize: "13px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {filters.category} <FiX size={12} />
                </span>
              )}
              {filters.dress_style && (
                <span
                  onClick={() => setFilters({ ...filters, dress_style: "" })}
                  style={{
                    backgroundColor: "#f0f0f0",
                    padding: "4px 12px",
                    borderRadius: "50px",
                    fontSize: "13px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {filters.dress_style} <FiX size={12} />
                </span>
              )}
              {selectedSize && (
                <span
                  onClick={() => setSelectedSize("")}
                  style={{
                    backgroundColor: "#f0f0f0",
                    padding: "4px 12px",
                    borderRadius: "50px",
                    fontSize: "13px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {selectedSize} <FiX size={12} />
                </span>
              )}
              {selectedColor && (
                <span
                  onClick={() => setSelectedColor("")}
                  style={{
                    backgroundColor: "#f0f0f0",
                    padding: "4px 12px",
                    borderRadius: "50px",
                    fontSize: "13px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {selectedColor} <FiX size={12} />
                </span>
              )}
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <p style={{ textAlign: "center", padding: "40px" }}>Loading...</p>
          ) : products.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px" }}>
              <p style={{ fontSize: "18px", color: "#666" }}>
                No products found!
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "repeat(2, 1fr)"
                  : "repeat(3, 1fr)",
                gap: isMobile ? "12px" : "24px",
              }}
            >
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  style={{ textDecoration: "none", color: "#000" }}
                >
                  <div
                    style={{
                      backgroundColor: "#f2f0f1",
                      borderRadius: "16px",
                      overflow: "hidden",
                      height: isMobile ? "180px" : "250px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "12px",
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
                      <div style={{ color: "#999" }}>No Image</div>
                    )}
                  </div>
                  <h3
                    style={{
                      fontSize: isMobile ? "13px" : "16px",
                      fontWeight: "700",
                      marginBottom: "6px",
                    }}
                  >
                    {product.name}
                  </h3>
                  <div
                    style={{
                      color: "#FFC633",
                      fontSize: "13px",
                      marginBottom: "6px",
                    }}
                  >
                    {"★".repeat(Math.floor(product.rating))}
                    <span
                      style={{
                        color: "#666",
                        marginLeft: "4px",
                        fontSize: "12px",
                      }}
                    >
                      {product.rating}/5
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: isMobile ? "14px" : "18px",
                        fontWeight: "700",
                      }}
                    >
                      ${product.price}
                    </span>
                    {product.discount > 0 && (
                      <>
                        <span
                          style={{
                            color: "#999",
                            textDecoration: "line-through",
                            fontSize: "12px",
                          }}
                        >
                          ${product.original_price}
                        </span>
                        <span
                          style={{
                            backgroundColor: "#ffe5e5",
                            color: "#ff3333",
                            padding: "2px 6px",
                            borderRadius: "50px",
                            fontSize: "11px",
                            fontWeight: "600",
                          }}
                        >
                          -{product.discount}%
                        </span>
                      </>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductListPage;
