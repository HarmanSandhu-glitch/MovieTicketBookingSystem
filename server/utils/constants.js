/**
 * Application constants
 */

// Seat types
export const SEAT_TYPES = {
  REGULAR: 'Regular',
  VIP: 'VIP',
  PREMIUM: 'Premium'
};

// Ticket statuses
export const TICKET_STATUS = {
  BOOKED: 'booked',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
};

// Show statuses
export const SHOW_STATUS = {
  SCHEDULED: 'scheduled',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// User roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

// API response status
export const API_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  TIME: 'hh:mm A',
  DATETIME: 'MMM DD, YYYY hh:mm A',
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ'
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};
