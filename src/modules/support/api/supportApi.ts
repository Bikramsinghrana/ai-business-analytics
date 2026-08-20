import { apiClient } from '../../../services/apiClient';
import { TicketStatus, TicketPriority } from '../../../types/enums';

export interface SupportTicket {
  id: string;
  ticket_number: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  customer_id: string;
}

export const supportApi = {
  getTickets: (params?: { status?: string }) => 
    apiClient.get<SupportTicket[]>('/support/tickets', { params }),
};
