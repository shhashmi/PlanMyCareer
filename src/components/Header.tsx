import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, LogOut, LogIn, ChevronDown, Menu, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useSmartNavigation } from "../hooks/useSmartNavigation";
import logoImage from "@assets/logo-1_1767800057394.png";

const navLinks = [
  { path: '/how-it-works', label: 'How It Works' },
  { path: '/pricing', label: 'Pricing' },
  { path: '/faq', label: 'FAQ' },
  { path: '/about', label: 'About' }
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user, logout } = useApp();
  const { smartNavigate, isNavigating } = useSmartNavigation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    // Navigate first to avoid race condition where ProtectedRoute
    // redirects to /login before navigation to home completes
    navigate("/");
    logout();
  };

  const isActivePath = (path: string) => location.pathname === path;

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
        {/* Logo */}
        <div
          onClick={() => {
            if (isLoggedIn) {
              smartNavigate();
            } else {
              navigate("/");
            }
          }}
          style={{
            display: "flex",
            alignItems: "center",
            cursor: isNavigating ? "wait" : "pointer",
            opacity: isNavigating ? 0.7 : 1,
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

        {/* Desktop Navigation */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          className="desktop-nav"
        >
          {navLinks.map(link => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              style={{
                padding: "8px 16px",
                background: "transparent",
                border: "none",
                borderRadius: "8px",
                color: isActivePath(link.path) ? "var(--primary-light)" : "var(--text-secondary)",
                fontSize: "14px",
                fontWeight: isActivePath(link.path) ? "600" : "400",
                cursor: "pointer",
                transition: "all 0.2s",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                if (!isActivePath(link.path)) {
                  e.currentTarget.style.color = "var(--text-primary)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActivePath(link.path)) {
                  e.currentTarget.style.color = "var(--text-secondary)";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {link.label}
              {isActivePath(link.path) && (
                <span
                  style={{
                    position: "absolute",
                    bottom: "2px",
                    left: "16px",
                    right: "16px",
                    height: "2px",
                    background: "var(--primary-light)",
                    borderRadius: "1px",
                  }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Right side: Mobile menu button + User menu/Login */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-toggle"
            style={{
              display: "none",
              padding: "8px",
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "var(--text-secondary)",
              cursor: "pointer",
            }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* User Menu / Login Button */}
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
                <span className="user-name">{user?.name || "User"}</span>
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

      {/* Mobile Navigation Menu */}
      <div
        className="mobile-nav"
        style={{
          display: mobileMenuOpen ? "flex" : "none",
          flexDirection: "column",
          background: "#0a1628",
          borderTop: "1px solid var(--border)",
          padding: "8px 0",
        }}
      >
        {navLinks.map(link => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            style={{
              padding: "14px 24px",
              background: isActivePath(link.path) ? "rgba(20, 184, 166, 0.1)" : "transparent",
              border: "none",
              borderLeft: isActivePath(link.path) ? "3px solid var(--primary-light)" : "3px solid transparent",
              color: isActivePath(link.path) ? "var(--primary-light)" : "var(--text-secondary)",
              fontSize: "15px",
              fontWeight: isActivePath(link.path) ? "600" : "400",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.2s",
            }}
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* CSS for responsive behavior */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-toggle {
            display: none !important;
          }
          .mobile-nav {
            display: none !important;
          }
        }
        @media (max-width: 767px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-toggle {
            display: flex !important;
          }
          .user-name {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
