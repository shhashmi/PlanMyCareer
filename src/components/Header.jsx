import { useNavigate } from 'react-router-dom'
import { Brain, User, LogOut } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Header() {
  const navigate = useNavigate()
  const { isLoggedIn, user, logout } = useApp()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header style={{
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px'
      }}>
        <div 
          onClick={() => navigate('/')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            cursor: 'pointer'
          }}
        >
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'var(--gradient-1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Brain size={24} color="white" />
          </div>
          <div>
            <h1 style={{ 
              fontSize: '20px', 
              fontWeight: '700',
              background: 'var(--gradient-1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              AI SkillGap
            </h1>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Skill Analysis & Upskilling
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {isLoggedIn ? (
            <>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                color: 'var(--text-secondary)'
              }}>
                <User size={18} />
                <span>{user?.name || 'User'}</span>
              </div>
              <button 
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '14px'
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
  )
}
