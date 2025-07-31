// Utility functions for sales calculations and data validation

export interface FiscalReceipt {
  id: string;
  number: number;
  timestamp: string;
  grossAmount: number;
  netAmount: number;
  cancelado?: boolean;
}

/**
 * Calculate total sales from valid fiscal receipts for a specific date
 */
export const calculateTotalFromReceipts = (dateString: string): number => {
  const receipts: FiscalReceipt[] = JSON.parse(localStorage.getItem('fiscalReceipts') || '[]');
  
  return receipts
    .filter(receipt => {
      // Skip cancelled receipts
      if (receipt.cancelado) return false;
      
      // Check if receipt is from the specified date
      const receiptDate = new Date(receipt.timestamp);
      if (isNaN(receiptDate.getTime())) return false;
      
      return receiptDate.toDateString() === dateString;
    })
    .reduce((total, receipt) => total + (receipt.netAmount || 0), 0);
};

/**
 * Validate and correct daily sales data using fiscal receipts
 */
export const validateAndCorrectDailySales = (dateString: string): number => {
  const receiptsTotal = calculateTotalFromReceipts(dateString);
  
  // Get current dailySales
  const dailySales = JSON.parse(localStorage.getItem('dailySales') || '{}');
  const currentDailyTotal = dailySales[dateString] || 0;
  
  // If there's a significant difference (more than 1 cent), correct it
  if (Math.abs(currentDailyTotal - receiptsTotal) > 0.01) {
    console.log('🔧 Corrigindo inconsistência no dailySales:', {
      dateString,
      dailySalesValue: currentDailyTotal,
      receiptsTotal,
      difference: currentDailyTotal - receiptsTotal
    });
    
    // Update dailySales to match receipts total
    dailySales[dateString] = receiptsTotal;
    localStorage.setItem('dailySales', JSON.stringify(dailySales));
    
    return receiptsTotal;
  }
  
  return currentDailyTotal;
};

/**
 * Get validated daily sales total for today
 */
export const getValidatedDailySalesTotal = (): number => {
  const today = new Date().toDateString();
  return validateAndCorrectDailySales(today);
};