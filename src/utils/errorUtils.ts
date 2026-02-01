import type { ApiError } from '../types/api.types';

export function isAuthError(error: ApiError | undefined): boolean {
  return error?.status === 401 || error?.status === 403;
}
