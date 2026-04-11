import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BRAZIL_STATES = [
    { code: "AC", name: "Acre" },
    { code: "AL", name: "Alagoas" },
    { code: "AP", name: "Amapá" },
    { code: "AM", name: "Amazonas" },
    { code: "BA", name: "Bahia" },
    { code: "CE", name: "Ceará" },
    { code: "DF", name: "Distrito Federal" },
    { code: "ES", name: "Espírito Santo" },
    { code: "GO", name: "Goiás" },
    { code: "MA", name: "Maranhão" },
    { code: "MT", name: "Mato Grosso" },
    { code: "MS", name: "Mato Grosso do Sul" },
    { code: "MG", name: "Minas Gerais" },
    { code: "PA", name: "Pará" },
    { code: "PB", name: "Paraíba" },
    { code: "PR", name: "Paraná" },
    { code: "PE", name: "Pernambuco" },
    { code: "PI", name: "Piauí" },
    { code: "RJ", name: "Rio de Janeiro" },
    { code: "RN", name: "Rio Grande do Norte" },
    { code: "RS", name: "Rio Grande do Sul" },
    { code: "RO", name: "Rondônia" },
    { code: "RR", name: "Roraima" },
    { code: "SC", name: "Santa Catarina" },
    { code: "SP", name: "São Paulo" },
    { code: "SE", name: "Sergipe" },
    { code: "TO", name: "Tocantins" },
];

interface StateSelectorProps {
    selectedStates: string[];
    onChange: (states: string[]) => void;
}

export function StateSelector({ selectedStates, onChange }: StateSelectorProps) {
    const toggleState = (code: string) => {
        if (selectedStates.includes(code)) {
            onChange(selectedStates.filter((s) => s !== code));
        } else {
            onChange([...selectedStates, code]);
        }
    };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {BRAZIL_STATES.map((state) => (
                <Button
                    key={state.code}
                    variant={selectedStates.includes(state.code) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleState(state.code)}
                    className={cn(
                        "justify-start",
                        selectedStates.includes(state.code) && "bg-primary text-primary-foreground"
                    )}
                >
                    <span className="font-bold mr-2">{state.code}</span>
                    <span className="truncate text-xs">{state.name}</span>
                </Button>
            ))}
        </div>
    );
}
