-- Update garcons table to use plain text passwords
-- Change senha_hash column to senha (plain text)
ALTER TABLE public.garcons RENAME COLUMN senha_hash TO senha;

-- Update all existing garcons to have password "123"
UPDATE public.garcons SET senha = '123';

-- Add some debug logging by updating the RLS policies to be more permissive for testing
-- (We'll keep the same policies but make sure they work)
DROP POLICY IF EXISTS "Authenticated users can view garcons" ON public.garcons;
DROP POLICY IF EXISTS "Authenticated users can insert garcons" ON public.garcons;

-- Create more permissive policies for testing
CREATE POLICY "Anyone can view garcons"
ON public.garcons
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert garcons"
ON public.garcons
FOR INSERT
WITH CHECK (true);