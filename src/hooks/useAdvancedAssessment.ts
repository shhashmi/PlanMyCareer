import { useState } from 'react';

export function useAdvancedAssessment() {
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleGetAdvancedAssessment = () => {
    setShowComingSoon(true);
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
