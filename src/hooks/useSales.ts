
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';

interface CartItem {
  productId: number;
  quantity: number;
  name: string;
  price: number;
  image: string;
  enviado?: boolean;
  operator?: {
    id: string;
    name: string;
  };
  observacao?: string;
  customizations?: Array<{
    phase: string;
    option: string;
    price: number;
  }>;
}

interface Payment {
  id: string;
  method: string;
  amount: number;
  change?: number;
}

interface SaleData {
  total: number;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  serviceFeeAmount: number;
  payments: Payment[];
  customerCpf?: string;
  loyaltyCpf?: string;
  items: CartItem[];
  mesaId?: string;
  comandaId?: string;
  cartId?: string;
}

// Mapeamento entre formas de pagamento do sistema e do banco
const PAYMENT_METHOD_MAPPING: Record<string, string> = {
  'cash': 'Dinheiro',
  'pix': 'PIX', 
  'credit_tef': 'Cartão Crédito',
  'debit_tef': 'Cartão Débito',
  'credit_pos': 'Cartão Crédito',
  'debit_pos': 'Cartão Débito',
  'meal_voucher': 'Vale Alimentação'
};

export const useSales = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { getLoyaltyCpf } = useCart();

  const createSale = async (saleData: SaleData) => {
    setIsLoading(true);
    
    try {
      console.log('🚀 Iniciando criação da venda no banco:', saleData);

      // 1. Buscar formas de pagamento do banco para mapear IDs
      const { data: formasPagamento, error: formasError } = await supabase
        .from('formas_pagamento')
        .select('id, nome');

      if (formasError) {
        console.error('❌ Erro ao buscar formas de pagamento:', formasError);
        throw new Error('Erro ao buscar formas de pagamento');
      }

      // Criar mapa de nome para ID
      const formasMap = new Map(formasPagamento?.map(f => [f.nome, f.id]) || []);
      console.log('📋 Formas de pagamento mapeadas:', Object.fromEntries(formasMap));

      // 2. Criar registro da venda
      // Obter vendedor do localStorage se disponível
      const authUser = JSON.parse(localStorage.getItem('auth-user') || '{}');

      // Obter CPF de fidelidade vinculado ao carrinho, se houver
      const loyaltyCpfFromCart = saleData.cartId ? getLoyaltyCpf(saleData.cartId) : null;
      const finalLoyaltyCpf = saleData.loyaltyCpf || loyaltyCpfFromCart || saleData.customerCpf;

      // Garante existência do cliente de fidelidade, se informado
      if (finalLoyaltyCpf) {
        const cpfDigits = finalLoyaltyCpf.replace(/\D/g, '').slice(0, 11);
        console.log('🔗 Garantindo cliente fidelidade para CPF:', cpfDigits);
        const { error: upsertError } = await supabase
          .from('clientes_fidelidade')
          .upsert({ cpf: cpfDigits, nome: 'Cliente Fidelidade' }, { onConflict: 'cpf' });
        if (upsertError) {
          console.warn('⚠️ Não foi possível garantir o cliente fidelidade:', upsertError);
        }
      }
      
      const vendaData = {
        tipo: saleData.mesaId ? 'mesa' : 'balcao',
        numero_mesa_comanda: saleData.mesaId ? parseInt(saleData.mesaId) : 
                             saleData.comandaId ? parseInt(saleData.comandaId) : null,
        valor_bruto: saleData.subtotal + saleData.taxAmount + saleData.serviceFeeAmount,
        valor_liquido: saleData.total,
        valor_desconto: saleData.discountAmount || 0,
        valor_taxa: (saleData.serviceFeeAmount ?? saleData.taxAmount) || 0,
        valor_troco: saleData.payments.reduce((total, p) => total + (p.change || 0), 0),
        cpf_cliente: saleData.customerCpf || null,
        cpf_fidelidade: finalLoyaltyCpf || null,
        vendedor_id: authUser.id || null,
        status: 'finalizado',
        finalizado_em: new Date().toISOString()
      };

      console.log('🔍 DEBUGGING - Dados da venda antes do insert:', JSON.stringify(vendaData, null, 2));
      console.log('🔍 DEBUGGING - Status value:', vendaData.status, typeof vendaData.status);
      console.log('🔍 DEBUGGING - Tipo value:', vendaData.tipo, typeof vendaData.tipo);
      console.log('🔎 Campos críticos venda:', {
        valor_taxa: vendaData.valor_taxa,
        valor_desconto: vendaData.valor_desconto,
        valor_troco: vendaData.valor_troco,
        cpf_cliente: vendaData.cpf_cliente,
        cpf_fidelidade: vendaData.cpf_fidelidade
      });

      console.log('💾 Criando venda:', vendaData);

      const { data: venda, error: vendaError } = await supabase
        .from('vendas')
        .insert(vendaData)
        .select()
        .single();

      if (vendaError) {
        console.error('❌ Erro ao criar venda:', vendaError);
        throw new Error(`Erro ao criar venda: ${vendaError.message}`);
      }

      console.log('✅ Venda criada:', venda);

      // 3. Como o productId no carrinho é numérico mas no banco é UUID,
      // vamos buscar produtos pelo nome para fazer o mapeamento correto
      const productNames = [...new Set(saleData.items.map(item => item.name))];
      const { data: produtos, error: produtosError } = await supabase
        .from('produtos')
        .select('id, nome')
        .in('nome', productNames);

      if (produtosError) {
        console.error('❌ Erro ao buscar produtos:', produtosError);
      }

      // Criar mapa de nome para UUID
      const produtoMap = new Map(produtos?.map(p => [p.nome, p.id]) || []);
      console.log('🍽️ Produtos mapeados:', Object.fromEntries(produtoMap));

      // 4. Criar itens da venda
      const itensVenda = saleData.items.map(item => {
        const produtoId = produtoMap.get(item.name);
        if (!produtoId) {
          console.warn('⚠️ Produto não encontrado no banco:', item.name);
        }
        
        return {
          venda_id: venda.id,
          produto_id: produtoId || item.productId.toString(), // Fallback para o ID numérico convertido
          quantidade: item.quantity,
          preco_unitario: item.price,
          observacao: item.observacao || null,
          status: item.enviado ? 'enviado' : 'pendente'
        };
      });

      console.log('📦 Criando itens da venda:', itensVenda);

      const { error: itensError } = await supabase
        .from('itens_venda')
        .insert(itensVenda);

      if (itensError) {
        console.error('❌ Erro ao criar itens da venda:', itensError);
        // Continue mesmo se der erro nos itens
      } else {
        console.log('✅ Itens da venda criados com sucesso');
      }

      // 5. Criar pagamentos da venda
      const pagamentosVenda = [];
      
      for (const payment of saleData.payments) {
        const nomeFormaPagamento = PAYMENT_METHOD_MAPPING[payment.method] || payment.method;
        const formaId = formasMap.get(nomeFormaPagamento);
        
        if (formaId) {
          pagamentosVenda.push({
            id_venda: venda.id,
            id_forma_pagamento: formaId,
            valor_pago: payment.amount
          });
        } else {
          console.warn('⚠️ Forma de pagamento não encontrada:', nomeFormaPagamento);
        }
      }

      if (pagamentosVenda.length > 0) {
        console.log('💳 Criando pagamentos:', pagamentosVenda);

        const { error: pagamentosError } = await supabase
          .from('pagamentos_venda')
          .insert(pagamentosVenda);

        if (pagamentosError) {
          console.error('❌ Erro ao criar pagamentos:', pagamentosError);
          // Continue mesmo se der erro nos pagamentos
        } else {
          console.log('✅ Pagamentos criados com sucesso');
        }
      }

      // Manter a funcionalidade existente do localStorage para compatibilidade
      const now = new Date();
      const receipts = JSON.parse(localStorage.getItem('fiscalReceipts') || '[]');
      
      // Usar o número de cupom gerado automaticamente pelo banco (sequence)
      const receiptNumber = venda.numero_cupom;
      
      const receipt = {
        id: `${now.getTime()}-${Math.random().toString(36).substring(2)}`,
        number: receiptNumber,
        timestamp: now.toISOString(),
        date: now.toLocaleDateString('pt-BR'),
        time: now.toLocaleTimeString('pt-BR'),
        grossAmount: saleData.subtotal + saleData.taxAmount + saleData.serviceFeeAmount,
        netAmount: saleData.total,
        discount: saleData.discountAmount,
        tax: saleData.taxAmount,
        serviceFee: saleData.serviceFeeAmount || 0,
        payments: saleData.payments,
        customerCpf: saleData.customerCpf,
        vendaId: venda.id // Adicionar referência ao ID da venda no banco
      };

      receipts.push(receipt);
      localStorage.setItem('fiscalReceipts', JSON.stringify(receipts));

      // Atualizar vendas diárias
      const today = new Date().toDateString();
      const dailySales = JSON.parse(localStorage.getItem('dailySales') || '{}');
      dailySales[today] = (dailySales[today] || 0) + saleData.total;
      localStorage.setItem('dailySales', JSON.stringify(dailySales));

      console.log('✅ Venda completa criada com sucesso no banco e localStorage');
      
      toast({
        title: "Venda criada com sucesso",
        description: `Venda #${venda.numero_cupom} registrada no sistema`,
      });

      return {
        success: true,
        vendaId: venda.id,
        numeroCupom: venda.numero_cupom
      };

    } catch (error) {
      console.error('❌ Erro geral ao criar venda:', error);
      
      toast({
        title: "Erro ao registrar venda",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido"
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createSale,
    isLoading
  };
};
