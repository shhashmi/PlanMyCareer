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
        background: "linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 27, 55, 0.98) 50%, rgba(20, 25, 45, 0.98) 100%)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(45, 212, 191, 0.15)",
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
            cursor: "pointer",
          }}
        >
          <img
            src={logoImage}
            alt="AI Fluens"
            style={{
              height: "50px",
              width: "auto",
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
