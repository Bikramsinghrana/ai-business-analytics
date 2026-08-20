export const ORDER_STATUS_COLORS: Record<string, 'success' | 'warning' | 'danger' | 'purple'> = {
  PENDING: 'warning',
  PROCESSING: 'purple',
  SHIPPED: 'info' as any,
  DELIVERED: 'success',
  CANCELLED: 'danger',
};
