import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { useApp } from "../context/AppContext";
import logoImage from "@assets/Gemini_Generated_Image_1j8i461j8i461j8i_1767740297706.png";

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
        background: "linear-gradient(90deg, #071220 0%, #0d1f30 25%, #1a2540 50%, #1e1e45 75%, #2A1B54 100%)",
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
              filter: "drop-shadow(0 0 18px rgba(32, 224, 213, 0.35))",
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
