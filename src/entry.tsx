import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { SiteProvider } from "./contexts/SiteContext"; 

// -----------------------------------------------------------------------
// GLOBAL ERROR BOUNDARY (Para capturar falhas na árvore React)
// -----------------------------------------------------------------------
class GlobalErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: any) {
        return { hasError: true, error };
    }

    componentDidCatch(error: any, errorInfo: any) {
        console.error("[CRITICAL ERROR] React Tree Crash:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
                    <h1>Algo deu errado na renderização.</h1>
                    <pre style={{ textAlign: 'left', background: '#f0f0f0', padding: '10px' }}>
                        {this.state.error?.toString()}
                    </pre>
                    <button onClick={() => window.location.reload()}>Recarregar Página</button>
                </div>
            );
        }
        return this.props.children;
    }
}

// -----------------------------------------------------------------------
// BOOTSTRAP
// -----------------------------------------------------------------------
console.log('[Entry] Iniciando Bootstrap...');

const container = document.getElementById("root");
if (!container) {
    document.body.innerHTML = '<h1 style="color: red">ERRO CRÍTICO: #root não encontrado no index.html</h1>';
} else {
    createRoot(container).render(
        <GlobalErrorBoundary>
            <SiteProvider>
                <App />
            </SiteProvider>
        </GlobalErrorBoundary>
    );
    console.log('[Entry] Bootstrap concluído com sucesso.');
}