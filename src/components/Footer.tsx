import { Link } from "react-router-dom";
import { buildUrlWithParams } from "../utils/queryParamStore";

const productLinks = [
  { label: "How It Works", path: "/how-it-works" },
  { label: "Pricing", path: "/pricing" },
  { label: "FAQ", path: "/faq" },
];

const companyLinks = [
  { label: "About", path: "/about" },
  { label: "Contact Us", path: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policy", path: "/privacy-policy" },
  { label: "Terms of Use", path: "/terms-of-use" },
  { label: "Refund Policy", path: "/refund-policy" },
];

export default function Footer() {
  const linkStyle = {
    color: "var(--text-muted)",
    fontSize: "14px",
    textDecoration: "none",
    transition: "color 0.2s",
  };

  const headingStyle = {
    color: "var(--text-primary)",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "16px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  };

  return (
    <footer
      style={{
        background: "#0a1628",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        marginTop: "auto",
      }}
    >
      {/* Main Footer */}
      <div
        className="container"
        style={{
          padding: "48px 24px 32px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "40px",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {/* Product Column */}
        <div>
          <h4 style={headingStyle}>Product</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {productLinks.map((link) => (
              <Link
                key={link.path}
                to={buildUrlWithParams(link.path)}
                style={linkStyle}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Company Column */}
        <div>
          <h4 style={headingStyle}>Company</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {companyLinks.map((link) => (
              <Link
                key={link.path}
                to={buildUrlWithParams(link.path)}
                style={linkStyle}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          padding: "20px 24px",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>
            © {new Date().getFullYear()} AI Fluens. All rights reserved.
          </span>
          <div style={{ display: "flex", gap: "24px" }}>
            {legalLinks.map((link) => (
              <Link
                key={link.path}
                to={buildUrlWithParams(link.path)}
                style={{ ...linkStyle, fontSize: "13px" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
