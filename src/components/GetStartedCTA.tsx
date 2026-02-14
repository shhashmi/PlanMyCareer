import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useSmartNavigation } from '../hooks/useSmartNavigation';
import { trackCTAClick } from '../lib/analytics';

interface GetStartedButtonProps {
  text?: string;
  showArrow?: boolean;
  subtitle?: string;
}

export function GetStartedButton({
  text = 'Get Started',
  showArrow = true,
  subtitle = 'Get a personalized AI-powered learning plan',
}: GetStartedButtonProps) {
  const { smartNavigate, isNavigating } = useSmartNavigation();

  const handleClick = () => {
    trackCTAClick('get_started', 'button');
    smartNavigate();
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isNavigating}
        className="btn-primary"
        style={{ padding: '14px 32px', fontSize: '16px' }}
      >
        {text} {showArrow && <ArrowRight size={18} />}
      </button>
      {subtitle && (
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '14px',
          marginTop: '12px',
        }}>
          {subtitle}
        </p>
      )}
    </>
  );
}

interface GetStartedCTAProps {
  buttonText?: string;
  showArrow?: boolean;
  subtitle?: string;
  delay?: number;
  style?: React.CSSProperties;
  children?: ReactNode;
}

export function GetStartedCTA({
  buttonText,
  showArrow,
  subtitle,
  delay = 0.5,
  style,
  children
}: GetStartedCTAProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      style={{ textAlign: 'center', ...style }}
    >
      {children}
      <GetStartedButton text={buttonText} showArrow={showArrow} subtitle={subtitle} />
    </motion.div>
  );
}
