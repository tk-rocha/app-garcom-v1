/**
 * Utility for clearing system data for complete reset
 */

export const clearAllLocalStorageData = () => {
  console.log('🧹 Iniciando limpeza completa do sistema local');
  
  // Dados de vendas
  localStorage.removeItem('fiscalReceipts');
  localStorage.removeItem('dailySales');
  
  // Caixa
  localStorage.removeItem('lastOpeningDate');
  localStorage.removeItem('currentOpening');
  localStorage.removeItem('pdvClosed');
  localStorage.removeItem('lastClosingDate');
  localStorage.removeItem('fundoCaixaFechamento');
  localStorage.removeItem('pdvClosings');
  localStorage.removeItem('currentShiftStarted');
  
  // Sangrias e Suprimentos
  localStorage.removeItem('sangrias');
  localStorage.removeItem('suprimentos');
  
  // Cart data
  localStorage.removeItem('restaurant-carts');
  localStorage.removeItem('restaurant-discounts');
  localStorage.removeItem('restaurant-taxes');
  localStorage.removeItem('restaurant-service-fees');
  localStorage.removeItem('restaurant-loyalty-cpfs');
  localStorage.removeItem('cartData');
  
  // Mesa and Comanda data - clear all
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (
      key.startsWith('mesa-') || 
      key.startsWith('comanda-')
    )) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => {
    console.log('🧹 Removendo chave:', key);
    localStorage.removeItem(key);
  });
  
  console.log('✅ Limpeza completa do sistema local finalizada');
  
  // Trigger storage events to update all screens
  window.dispatchEvent(new Event('storage'));
  
  // Force page reload to ensure clean state
  window.location.reload();
};

// Function to be called once automatically after migration
export const performSystemReset = () => {
  const resetKey = 'system-reset-completed';
  const hasReset = localStorage.getItem(resetKey);
  
  if (!hasReset) {
    console.log('🔄 Primeira inicialização após reset do sistema');
    clearAllLocalStorageData();
    localStorage.setItem(resetKey, 'true');
  }
};