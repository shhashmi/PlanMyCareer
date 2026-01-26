import { Link } from "react-router-dom";

export default function Footer() {
  const footerLinks = [
    { label: "About Us", path: "/about-us" },
    { label: "Terms & Conditions", path: "/terms-of-use" },
    { label: "Privacy Policy", path: "/privacy-policy" },
    { label: "Contact Us", path: "/contact-us" },
    { label: "FAQs", path: "/faq" },
    { label: "Sitemap", path: "/sitemap" },
    { label: "Pricing", path: "/pricing" },
    { label: "Refund Policy", path: "/refund-policy" },
  ];

  return (
    <footer
      style={{
        background: "#0f1e3b",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        padding: "20px 24px",
        marginTop: "auto",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <nav
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {footerLinks.map((link, index) => (
            <span key={link.path} style={{ display: "flex", alignItems: "center" }}>
              <Link
                to={link.path}
                style={{
                  color: "var(--text-muted)",
                  fontSize: "14px",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary-light)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                {link.label}
              </Link>
              {index < footerLinks.length - 1 && (
                <span style={{ color: "var(--text-muted)", margin: "0 8px" }}>|</span>
              )}
            </span>
          ))}
        </nav>
        <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          © {new Date().getFullYear()} AI Fluens. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
