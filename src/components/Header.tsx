import { useNavigate } from "react-router-dom";
import { User, LogOut, TrendingUp } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useApp();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header
      style={{
        background: "rgba(15, 23, 42, 0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 24px",
        }}
      >
        <div
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
        >
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <span
              style={{
                fontSize: "28px",
                fontWeight: "800",
                color: "#0d9488",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "-1px",
              }}
            >
              A
            </span>
            <TrendingUp
              size={14}
              style={{
                position: "absolute",
                top: "4px",
                left: "8px",
                color: "#14b8a6",
                strokeWidth: 3,
              }}
            />
            <span
              style={{
                fontSize: "28px",
                fontWeight: "800",
                color: "#0d9488",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "-1px",
                marginLeft: "-2px",
              }}
            >
              I
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginLeft: "4px" }}>
            <span
              style={{
                fontSize: "24px",
                fontWeight: "600",
                background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #2dd4bf 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "-0.5px",
              }}
            >
              Fluens
            </span>
            <span
              style={{
                fontSize: "10px",
                color: "#64748b",
                fontWeight: "500",
                letterSpacing: "0.5px",
                marginTop: "-4px",
              }}
            >
              Be AI Fluent
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {isLoggedIn ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "var(--text-secondary)",
                }}
              >
                <User size={18} />
                <span>{user?.name || "User"}</span>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "14px",
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
