import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useAdvancedAssessment() {
  const navigate = useNavigate();
  const [showComingSoon, setShowComingSoon] = useState(false);
  const isProduction = import.meta.env.PROD;

  const handleGetAdvancedAssessment = () => {
    if (isProduction) {
      setShowComingSoon(true);
    } else {
      navigate('/payment');
    }
  };

  const closeComingSoon = () => {
    setShowComingSoon(false);
  };

  return {
    showComingSoon,
    handleGetAdvancedAssessment,
    closeComingSoon
  };
}
