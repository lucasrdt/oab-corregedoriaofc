import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react';
import { TemplateIvaldo, fullIvaldoTemplate, templateIvaldo } from '@/config/template-ivaldo';
import { supabase } from '@/lib/supabase';

const OAB_MA_SITE_ID = import.meta.env.VITE_SITE_ID || '870aef8b-6f85-4b59-8729-56dfaf35b6fa';

// -----------------------------------------------------------------------
// DEFINIÇÃO DE TIPOS E INTERFACE
// -----------------------------------------------------------------------

interface SiteContextType {
    config: TemplateIvaldo;
    loading: boolean;
    error: string | null;
    siteId: string | null;
    refreshConfig: () => Promise<void>;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

// -----------------------------------------------------------------------
// UTILS (Outside component to be static)
// -----------------------------------------------------------------------
const isObject = (item: any) => (item && typeof item === 'object' && !Array.isArray(item));

const deepMerge = (target: any, source: any): any => {
    if (!isObject(target)) return source;
    if (!isObject(source)) return source ?? target; // Prioriza source se não for null/undefined, senão target
    
    const output = { ...target };
    Object.keys(source).forEach(key => {
        if (source[key] === null || source[key] === undefined) {
            // Não sobrescrever com null se o target tiver valor
            return;
        }
        
        if (isObject(source[key])) {
            if (!(key in target)) {
                output[key] = source[key];
            } else {
                output[key] = deepMerge(target[key], source[key]);
            }
        } else {
            output[key] = source[key];
        }
    });
    return output;
};

// -----------------------------------------------------------------------
// PROVIDER
// -----------------------------------------------------------------------

export const SiteProvider = ({ children }: { children: ReactNode }) => {
    const [config, setConfig] = useState<TemplateIvaldo>(fullIvaldoTemplate);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [siteId, setSiteId] = useState<string | null>(null);

    // -----------------------------------------------------------------------
    // Single-tenant: buscar configuração salva no Supabase (tabela sites)
    // -----------------------------------------------------------------------
    const fetchConfig = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase
                .from('sites')
                .select('id, config')
                .eq('id', OAB_MA_SITE_ID)
                .single();

            if (error) throw error;

            setSiteId(data.id);

            // Deep merge: template base garante todas as propriedades, banco sobrescreve com dados salvos
            console.log('[SiteProvider] Audit: template content?', !!templateIvaldo.content);
            const mergedConfig = deepMerge(templateIvaldo, data.config) as TemplateIvaldo;
            console.log('[SiteProvider] Audit: merged content?', !!mergedConfig.content);
            
            if (!mergedConfig.content) {
                console.warn('[SiteProvider] AVISO: mergedConfig.content está vazio! Usando template backup.');
                mergedConfig.content = templateIvaldo.content;
            }

            setConfig(mergedConfig);
        } catch (err: any) {
            console.error('[SiteContext] Erro ao buscar configuração:', err);
            // Fallback para template estático se Supabase não estiver configurado
            setConfig(fullIvaldoTemplate);
            setSiteId(null);
            if (err?.code !== 'PGRST116') {
                // PGRST116 = row not found, silently fallback
                setError('Erro ao carregar configurações do site.');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConfig();
    }, [fetchConfig]);

    // Update SEO Metadata
    useEffect(() => {
        if (config.seo) {
            if (config.seo.title) document.title = config.seo.title;
            if (config.seo.description) {
                let metaDescription = document.querySelector('meta[name="description"]');
                if (!metaDescription) {
                    metaDescription = document.createElement('meta');
                    metaDescription.setAttribute('name', 'description');
                    document.head.appendChild(metaDescription);
                }
                metaDescription.setAttribute('content', config.seo.description);
            }
            if (config.seo.favicon) {
                let linkFavicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
                if (!linkFavicon) {
                    linkFavicon = document.createElement('link');
                    linkFavicon.rel = 'icon';
                    document.head.appendChild(linkFavicon);
                }
                linkFavicon.href = config.seo.favicon;
            }
        }
    }, [config]);

    const value = useMemo(() => ({
        config,
        loading,
        error,
        siteId,
        refreshConfig: fetchConfig
    }), [config, loading, error, siteId, fetchConfig]);

    // -----------------------------------------------------------------------
    // RENDERIZAÇÃO SEMPRE ESTÁVEL DO PROVIDER
    // -----------------------------------------------------------------------
    const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

    return (
        <SiteContext.Provider value={value}>
            {loading ? (
                <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
                    <div style={{ width: '48px', height: '48px', border: '4px solid #e5e7eb', borderTop: '4px solid #1A2238', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
            ) : (error && !isAdminRoute) ? (
                <div style={{ padding: '50px', textAlign: 'center' }}>{error}</div>
            ) : (
                children
            )}
        </SiteContext.Provider>
    );
};

export const useSite = () => {
    const context = useContext(SiteContext);
    if (context === undefined) {
        throw new Error('useSite must be used within a SiteProvider');
    }
    return context;
};
