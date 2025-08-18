-- Drop the restrictive check constraint and recreate with proper values
ALTER TABLE public.vendas DROP CONSTRAINT IF EXISTS vendas_status_check;

-- Add a proper check constraint that allows 'finalizado' status
ALTER TABLE public.vendas 
ADD CONSTRAINT vendas_status_check 
CHECK (status IN ('ativo', 'cancelado', 'finalizado'));

-- Now backfill the specific sale to trigger points calculation
UPDATE public.vendas
SET cpf_fidelidade = '22553346824'
WHERE id = 'a6e6edd9-878a-43c0-b148-f371134d8c27'
  AND (cpf_fidelidade IS NULL OR cpf_fidelidade = '');

-- Transition to finalizado to fire the trigger
UPDATE public.vendas
SET status = 'finalizado'
WHERE id = 'a6e6edd9-878a-43c0-b148-f371134d8c27'
  AND status <> 'finalizado';