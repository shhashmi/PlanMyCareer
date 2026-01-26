import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, LogIn, ChevronDown } from "lucide-react";
import { useApp } from "../context/AppContext";
import logoImage from "@assets/logo-1_1767800057394.png";

export default function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout, triggerNavigation } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
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
          padding: "4px 24px",
        }}
      >
        <div
          onClick={() => {
            triggerNavigation();
            navigate("/");
          }}
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
              height: "75px",
              width: "auto",
              display: "block",
              maskImage: "linear-gradient(to right, black 90%, transparent 100%), linear-gradient(to bottom, black 90%, transparent 100%)",
              maskComposite: "intersect",
              WebkitMaskImage: "linear-gradient(to right, black 90%, transparent 100%), linear-gradient(to bottom, black 90%, transparent 100%)",
              WebkitMaskComposite: "destination-in",
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {[
              { label: "How it works", path: "/how-it-works", requiresAuth: false },
              { label: "FAQ", path: "/faq", requiresAuth: false },
              { label: "Pricing", path: "/pricing", requiresAuth: false },
              { label: "Your Weekly Plan", path: "/weekly-plan", requiresAuth: true },
            ]
              .filter((item) => !item.requiresAuth || isLoggedIn)
              .map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: "8px 12px",
                    color: "var(--text-secondary)",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    borderRadius: "8px",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--primary-light)";
                    e.currentTarget.style.background = "rgba(20, 184, 166, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-secondary)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {item.label}
                </button>
              ))}
          </nav>
          {isLoggedIn ? (
            <div ref={menuRef} style={{ position: "relative" }}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 12px",
                  background: "var(--surface-light)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                <User size={18} />
                <span>{user?.name || "User"}</span>
                <ChevronDown size={16} style={{ 
                  transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s"
                }} />
              </button>

              {menuOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    marginTop: "8px",
                    minWidth: "160px",
                    background: "#0a1628",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
                    overflow: "hidden",
                    zIndex: 200,
                  }}
                >
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/profile");
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "12px 16px",
                      background: "transparent",
                      border: "none",
                      color: "var(--text-secondary)",
                      fontSize: "14px",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <User size={16} />
                    View Profile
                  </button>
                  <div style={{ height: "1px", background: "var(--border)" }} />
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "12px 16px",
                      background: "transparent",
                      border: "none",
                      color: "#ef4444",
                      fontSize: "14px",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "var(--gradient-1)",
                border: "none",
                borderRadius: "8px",
                padding: "10px 20px",
                color: "white",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              <LogIn size={16} />
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
