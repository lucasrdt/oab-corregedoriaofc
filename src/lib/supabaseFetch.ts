// NOTA: Este arquivo assume que o seu cliente Supabase foi
// inicializado e exportado em '@/lib/supabase' (ou 'lib/supabase.ts').
import { supabase } from '@/lib/supabase'; // Ajuste o caminho se necessário

/**
 * Busca dados de uma tabela específica, garantindo que o filtro de multitenancy (site_id) seja aplicado.
 *
 * Esta função é crucial para a segurança, pois a Policy de RLS na tabela 'leads'
 * exige que o filtro site_id seja aplicado.
 *
 * @param tableName O nome da tabela (ex: 'leads', 'posts', 'usuarios_do_site').
 * @param siteId O UUID do site atualmente carregado (obtido via SiteContext).
 * @returns Os dados filtrados, tipados como um array de T.
 */
export async function fetchSiteContent<T>(tableName: string, siteId: string): Promise<T[]> {
    if (!siteId) {
        console.error(`fetchSiteContent: O siteId é nulo. Não é possível buscar dados da tabela ${tableName}.`);
        return [];
    }

    try {
        // A chave da segurança multitenancy:
        // A Policy de RLS no Supabase só permite a leitura se este filtro .eq() for aplicado.
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .eq('site_id', siteId); // ⬅️ O FILTRO DE MULTITENANCY OBRIGATÓRIO

        if (error) {
            console.error(`Erro ao carregar conteúdo da tabela ${tableName}:`, error.message);
            return [];
        }

        return (data as T[]) || []; 
    } catch (err) {
        console.error(`Exceção durante a busca na tabela ${tableName}:`, err);
        return [];
    }
}