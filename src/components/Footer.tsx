import { Link } from "react-router-dom";

export default function Footer() {
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
          justifyContent: "center",
          alignItems: "center",
          gap: "24px",
        }}
      >
        <Link
          to="/privacy-policy"
          style={{
            color: "var(--text-muted)",
            fontSize: "14px",
            textDecoration: "none",
          }}
        >
          Privacy Policy
        </Link>
        <Link
          to="/terms-of-use"
          style={{
            color: "var(--text-muted)",
            fontSize: "14px",
            textDecoration: "none",
          }}
        >
          Terms of Use
        </Link>
        <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          © {new Date().getFullYear()} AI Fluens. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
