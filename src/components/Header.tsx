import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { useApp } from "../context/AppContext";
import logoImage from "@assets/Logo_1767799527170.png";

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
        background: "#0f1e3b",
        backdropFilter: "blur(12px)",
        borderBottom: "none",
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
          padding: "20px 24px",
        }}
      >
        <div
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <img
            src={logoImage}
            alt="AI Fluens"
            style={{
              height: "100px",
              width: "auto",
              display: "block",
              maskImage: "linear-gradient(to right, black 90%, transparent 100%), linear-gradient(to bottom, black 90%, transparent 100%)",
              maskComposite: "intersect",
              WebkitMaskImage: "linear-gradient(to right, black 90%, transparent 100%), linear-gradient(to bottom, black 90%, transparent 100%)",
              WebkitMaskComposite: "destination-in",
            }}
          />
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
