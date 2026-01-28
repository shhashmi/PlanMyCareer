import api from './api';
import { wrapVoidApiCall } from '../utils/apiWrapper';
import type { ApiResponse } from '../types/api.types';

export interface SendEmailRequest {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

class EmailService {
  async sendEmail(data: SendEmailRequest): Promise<ApiResponse<void>> {
    return wrapVoidApiCall(
      () => api.post('/v1/email/send', data),
      'Failed to send email'
    );
  }
}

export const emailService = new EmailService();
