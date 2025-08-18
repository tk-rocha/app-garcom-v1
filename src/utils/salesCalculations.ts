// Utility functions for sales calculations and data validation
import { supabase } from "@/integrations/supabase/client";

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
 * Updated to consider only non-cancelled sales
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
    
    // Update dailySales to match receipts total (only non-cancelled sales)
    dailySales[dateString] = receiptsTotal;
    localStorage.setItem('dailySales', JSON.stringify(dailySales));
    
    return receiptsTotal;
  }
  
  return currentDailyTotal;
};

/**
 * Sync cancelled sales status from Supabase to localStorage
 * This ensures consistency between database and local storage
 */
export const syncCancelledSalesFromDatabase = async (): Promise<void> => {
  try {
    // Get today's date range
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch cancelled sales from today
    const { data: cancelledSales, error } = await supabase
      .from('vendas')
      .select('numero_cupom, status')
      .eq('status', 'cancelado')
      .gte('criado_em', startOfDay.toISOString())
      .lte('criado_em', endOfDay.toISOString());

    if (error) {
      console.error('Erro ao buscar vendas canceladas:', error);
      return;
    }

    if (!cancelledSales || cancelledSales.length === 0) {
      return;
    }

    // Update localStorage fiscal receipts
    const storedReceipts = JSON.parse(localStorage.getItem('fiscalReceipts') || '[]');
    const cancelledNumbers = cancelledSales.map(sale => sale.numero_cupom.toString());
    
    let hasChanges = false;
    const updatedReceipts = storedReceipts.map((receipt: any) => {
      if (cancelledNumbers.includes(receipt.number?.toString()) && !receipt.cancelado) {
        hasChanges = true;
        return { ...receipt, cancelado: true };
      }
      return receipt;
    });

    if (hasChanges) {
      localStorage.setItem('fiscalReceipts', JSON.stringify(updatedReceipts));
      console.log('🔄 Sincronizado status de cancelamento do banco para localStorage');
    }
  } catch (error) {
    console.error('Erro ao sincronizar vendas canceladas:', error);
  }
};

/**
 * Get validated daily sales total for today (synchronous)
 */
export const getValidatedDailySalesTotal = (): number => {
  const today = new Date().toDateString();
  return validateAndCorrectDailySales(today);
};

/**
 * Get validated daily sales total with database sync
 */
export const getValidatedDailySalesTotalWithSync = async (): Promise<number> => {
  await syncCancelledSalesFromDatabase();
  const today = new Date().toDateString();
  return validateAndCorrectDailySales(today);
};