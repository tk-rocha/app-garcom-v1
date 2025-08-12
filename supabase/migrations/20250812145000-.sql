-- Create garcons table
CREATE TABLE public.garcons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    usuario TEXT NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL,
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.garcons ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can view garcons"
ON public.garcons
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert garcons"
ON public.garcons
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Insert initial waiters with password "123" (hash: $2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi)
INSERT INTO public.garcons (nome, usuario, senha_hash) VALUES
('João Silva', 'joao', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Maria Santos', 'maria', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Pedro Costa', 'pedro', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Ana Oliveira', 'ana', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');