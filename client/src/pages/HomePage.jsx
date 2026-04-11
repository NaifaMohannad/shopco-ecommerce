import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import useWindowSize from "../hooks/useWindowSize";

function HomePage() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  const { width } = useWindowSize();
  const isMobile = width < 768;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const newArrivals = products.slice(0, 4);
  const topSelling = products.slice(4, 8);

  return (
    <div>
      {/* Hero Section */}
      <div
        style={{
          backgroundColor: "#f2f0f1",
          padding: isMobile ? "32px 16px" : "0px 0px 0px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: isMobile ? "auto" : "520px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Left Text */}
        <div
          style={{
            maxWidth: isMobile ? "55%" : "500px",
            zIndex: 1,
            paddingTop: isMobile ? "0" : "60px",
            paddingBottom: isMobile ? "0" : "60px",
          }}
        >
          <h1
            style={{
              fontSize: isMobile ? "36px" : "64px",
              fontWeight: "700",
              lineHeight: "1.0",
              textTransform: "uppercase",
              marginBottom: isMobile ? "12px" : "24px",
              fontFamily: "'Bebas Neue', sans-serif",
            }}
          >
            Find Clothes That Matches Your Style
          </h1>

          <p
            style={{
              color: "#666",
              fontSize: isMobile ? "12px" : "14px",
              marginBottom: isMobile ? "16px" : "32px",
              lineHeight: "1.6",
              maxWidth: "350px",
            }}
          >
            Browse through our diverse range of meticulously crafted garments,
            designed to bring out your individuality and cater to your sense of
            style.
          </p>

          <Link
            to="/shop"
            style={{
              backgroundColor: "#000",
              color: "#fff",
              padding: isMobile ? "12px 32px" : "16px 52px",
              borderRadius: "50px",
              textDecoration: "none",
              fontSize: isMobile ? "14px" : "16px",
              fontWeight: "600",
              display: "inline-block",
            }}
          >
            Shop Now
          </Link>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              marginTop: isMobile ? "24px" : "48px",
              paddingTop: isMobile ? "16px" : "32px",
              borderTop: "1px solid #e5e5e5",
            }}
          >
            {[
              { number: "200+", label: "International\nBrands" },
              { number: "2,000+", label: "High-Quality\nProducts" },
              { number: "30,000+", label: "Happy\nCustomers" },
            ].map((stat, index) => (
              <div
                key={stat.label}
                style={{
                  flex: 1,
                  paddingLeft: index > 0 ? "24px" : "0",
                  borderLeft: index > 0 ? "1px solid #e5e5e5" : "none",
                  paddingRight: "24px",
                }}
              >
                <h3
                  style={{
                    fontSize: isMobile ? "20px" : "40px",
                    fontWeight: "900",
                    marginBottom: "4px",
                  }}
                >
                  {stat.number}
                </h3>
                <p
                  style={{
                    color: "#666",
                    fontSize: isMobile ? "10px" : "13px",
                    whiteSpace: "pre-line",
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stars */}
        {!isMobile && (
          <>
            <img
              src={require("../assets/star-big .png")}
              alt="star"
              style={{
                position: "absolute",
                top: "40px",
                right: "430px",
                width: "60px",
                height: "60px",
                zIndex: 2,
              }}
            />
            <img
              src={require("../assets/star-small.png")}
              alt="star"
              style={{
                position: "absolute",
                bottom: "100px",
                left: "600px",
                width: "35px",
                height: "35px",
                zIndex: 2,
              }}
            />
          </>
        )}

        {/* Hero Image */}
        <div
          style={{
            width: isMobile ? "42%" : "45%",
            height: isMobile ? "280px" : "520px",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          <img
            src={require("../assets/hero1.jpg")}
            alt="Hero"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
            }}
          />
        </div>
      </div>

      {/* Brands Bar */}
      <div style={{
          backgroundColor: "#000",
          padding: isMobile ? "20px 16px" : "28px 40px",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        {[
          { name: "versace", file: require("../assets/versace.png") },
          { name: "zara", file: require("../assets/zara.png") },
          { name: "gucci", file: require("../assets/gucci.png") },
          { name: "prada", file: require("../assets/prada.png") },
          { name: "calvin-klein", file: require("../assets/calvin-klein.png") },
        ].map((brand) => (
          <img
            key={brand.name}
            src={brand.file}
            alt={brand.name}
            style={{
              height: isMobile ? "20px" : "28px",
              objectFit: "contain",
              filter: "brightness(0) invert(1)",
            }}
          />
        ))}
      </div>

      {/* New Arrivals */}
      <div style={{ padding: isMobile ? "40px 16px" : "60px 40px" }}>
        <h2
          style={{
            textAlign: "center",
            fontSize: isMobile ? "28px" : "40px",
            fontWeight: "900",
            textTransform: "uppercase",
            marginBottom: "40px",
            fontFamily: "'Bebas Neue', sans-serif",
            letterSpacing: "2px",
          }}
        >
          New Arrivals
        </h2>
        {loading ? (
          <p style={{ textAlign: "center" }}>Loading...</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "repeat(2, 1fr)"
                : "repeat(4, 1fr)",
              gap: isMobile ? "16px" : "24px",
            }}
          >
            {newArrivals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isMobile={isMobile}
              />
            ))}
          </div>
        )}
        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <Link to="/shop" style={viewAllStyle}>
            View All
          </Link>
        </div>
      </div>

      {/* Top Selling - NO divider */}
      <div style={{ padding: isMobile ? "40px 16px" : "60px 40px" }}>
        <h2
          style={{
            textAlign: "center",
            fontSize: isMobile ? "28px" : "40px",
            fontWeight: "900",
            textTransform: "uppercase",
            marginBottom: "40px",
            fontFamily: "'Bebas Neue', sans-serif",
            letterSpacing: "2px",
          }}
        >
          Top Selling
        </h2>
        {loading ? (
          <p style={{ textAlign: "center" }}>Loading...</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "repeat(2, 1fr)"
                : "repeat(4, 1fr)",
              gap: isMobile ? "16px" : "24px",
            }}
          >
            {topSelling.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isMobile={isMobile}
              />
            ))}
          </div>
        )}
        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <Link to="/shop" style={viewAllStyle}>
            View All
          </Link>
        </div>
      </div>

      {/* Browse by Dress Style */}
      <div id="brands" style={{
          margin: isMobile ? "0 16px 40px" : "0 40px 60px",
          backgroundColor: "#f2f0f1",
          borderRadius: "20px",
          padding: isMobile ? "32px 16px" : "60px 40px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: isMobile ? "28px" : "40px",
            fontWeight: "900",
            textTransform: "uppercase",
            marginBottom: "32px",
            fontFamily: "'Bebas Neue', sans-serif",
            letterSpacing: "2px",
          }}
        >
          Browse by Dress Style
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: isMobile ? "12px" : "20px",
          }}
        >
          {[
            { name: "Casual", image: require("../assets/casual.png") },
            { name: "Formal", image: require("../assets/formal.png") },
            { name: "Party", image: require("../assets/party.png") },
            { name: "Gym", image: require("../assets/gym.png") },
          ].map((style) => (
            <Link
              key={style.name}
              to={`/shop?dress_style=${style.name}`}
              style={{
                borderRadius: "16px",
                textDecoration: "none",
                color: "#000",
                display: "block",
                height: isMobile ? "130px" : "200px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <img
                src={style.image}
                alt={style.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "16px",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  bottom: "16px",
                  left: "16px",
                  fontSize: isMobile ? "16px" : "20px",
                  fontWeight: "700",
                  color: "#fff",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  padding: "6px 16px",
                  borderRadius: "50px",
                  backdropFilter: "blur(4px)",
                }}
              >
                {style.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Happy Customers */}
      <div style={{ padding: isMobile ? "0 16px 40px" : "0 40px 60px" }}>
        <h2
          style={{
            fontSize: isMobile ? "28px" : "40px",
            fontWeight: "900",
            textTransform: "uppercase",
            marginBottom: "32px",
            fontFamily: "'Bebas Neue', sans-serif",
            letterSpacing: "2px",
          }}
        >
          Our Happy Customers
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: "24px",
          }}
        >
          {[
            {
              name: "Sarah M.",
              review:
                "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
              rating: 5,
            },
            {
              name: "Alex K.",
              review:
                "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes.",
              rating: 5,
            },
            {
              name: "James L.",
              review:
                "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection is not only diverse but also on-point with the latest trends!",
              rating: 5,
            },
          ].map((review) => (
            <div
              key={review.name}
              style={{
                border: "1px solid #e5e5e5",
                borderRadius: "16px",
                padding: "24px",
              }}
            >
              <div
                style={{
                  color: "#FFC633",
                  fontSize: "18px",
                  marginBottom: "8px",
                }}
              >
                {"★".repeat(review.rating)}
              </div>
              <h4
                style={{
                  fontWeight: "700",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {review.name}
                <span style={{ color: "#01AB31", fontSize: "16px" }}>✔</span>
              </h4>
              <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.6" }}>
                "{review.review}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Product Card Component
function ProductCard({ product, isMobile }) {
  return (
    <Link
      to={`/products/${product.id}`}
      style={{ textDecoration: "none", color: "#000" }}
    >
      <div
        style={{
          backgroundColor: "#f2f0f1",
          borderRadius: "16px",
          overflow: "hidden",
          marginBottom: "12px",
          height: isMobile ? "180px" : "250px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{ color: "#999", fontSize: "14px" }}>No Image</div>
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
      <div style={{ color: "#FFC633", fontSize: "13px", marginBottom: "6px" }}>
        {"★".repeat(Math.floor(product.rating))}
        <span style={{ color: "#666", marginLeft: "4px", fontSize: "12px" }}>
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
          style={{ fontSize: isMobile ? "14px" : "18px", fontWeight: "700" }}
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
  );
}

const viewAllStyle = {
  display: "inline-block",
  border: "1px solid #000",
  borderRadius: "50px",
  padding: "12px 40px",
  textDecoration: "none",
  color: "#000",
  fontSize: "16px",
  fontWeight: "600",
};

export default HomePage;
