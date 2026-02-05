import { useCallback } from 'react';
import { useNavigate, type NavigateOptions, type To } from 'react-router-dom';
import { buildUrlWithParams } from '../utils/queryParamStore';

/**
 * Drop-in replacement for useNavigate that appends stored query params
 * to every string path navigation. Numeric args (e.g. -1) pass through unchanged.
 */
export function useNavigateWithParams() {
  const navigate = useNavigate();

  return useCallback(
    (to: To | number, options?: NavigateOptions) => {
      if (typeof to === 'number') {
        navigate(to);
      } else if (typeof to === 'string') {
        navigate(buildUrlWithParams(to), options);
      } else {
        // To object — append params to pathname
        navigate(
          { ...to, pathname: to.pathname ? buildUrlWithParams(to.pathname) : to.pathname },
          options,
        );
      }
    },
    [navigate],
  );
}
