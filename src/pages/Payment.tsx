import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Lock, Check, Shield, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Payment() {
  const navigate = useNavigate()
  const { isLoggedIn, skills } = useApp()
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: ''
  })

  if (!isLoggedIn) {
    navigate('/login')
    return null
  }

  const handleChange = (e) => {
    let { name, value } = e.target
    
    if (name === 'cardNumber') {
      value = value.replace(/\D/g, '').slice(0, 16)
      value = value.replace(/(\d{4})/g, '$1 ').trim()
    }
    if (name === 'expiry') {
      value = value.replace(/\D/g, '').slice(0, 4)
      if (value.length >= 2) value = value.slice(0, 2) + '/' + value.slice(2)
    }
    if (name === 'cvc') {
      value = value.replace(/\D/g, '').slice(0, 4)
    }
    
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsProcessing(false)
    navigate('/advanced-assessment')
  }

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    paddingLeft: '44px',
    background: 'var(--surface-light)',
    border: '2px solid var(--border)',
    borderRadius: '12px',
    color: 'var(--text-primary)',
    fontSize: '16px',
    outline: 'none'
  }

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 80px)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '40px 24px'
    }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '40px',
        maxWidth: '900px',
        width: '100%'
      }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>
            Complete Your Purchase
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
            Unlock your personalized AI skill assessment and upskilling plan
          </p>

          <div style={{
            background: 'var(--surface)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid var(--border)',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '18px', fontWeight: '500' }}>Advanced Assessment</span>
              <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary-light)' }}>$49</span>
            </div>
            
            <ul style={{ listStyle: 'none', display: 'grid', gap: '12px' }}>
              {[
                'AI-powered deep skill analysis',
                'Interactive assignments & case studies',
                'Personalized learning roadmap',
                'Weekly upskilling schedule',
                'Curated resources & exercises'
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                  <Check size={16} color="var(--secondary)" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '14px' }}>
            <Shield size={18} />
            <span>Secure payment powered by Stripe</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              background: 'var(--surface)',
              borderRadius: '24px',
              padding: '32px',
              border: '1px solid var(--border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <Lock size={20} color="var(--secondary)" />
              <span style={{ fontWeight: '500' }}>Secure Checkout</span>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Cardholder Name
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    style={{ ...inputStyle, paddingLeft: '16px' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Card Number
                </label>
                <div style={{ position: 'relative' }}>
                  <CreditCard size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiry"
                    placeholder="MM/YY"
                    value={formData.expiry}
                    onChange={handleChange}
                    style={{ ...inputStyle, paddingLeft: '16px' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    CVC
                  </label>
                  <input
                    type="text"
                    name="cvc"
                    placeholder="123"
                    value={formData.cvc}
                    onChange={handleChange}
                    style={{ ...inputStyle, paddingLeft: '16px' }}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                disabled={isProcessing}
                style={{ 
                  width: '100%', 
                  justifyContent: 'center',
                  opacity: isProcessing ? 0.7 : 1
                }}
              >
                {isProcessing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      style={{ width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }}
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    Pay $49
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                By completing this purchase, you agree to our Terms of Service
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
