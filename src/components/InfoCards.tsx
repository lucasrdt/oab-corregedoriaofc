import { useSite } from "@/contexts/SiteContext";
import { Link } from "react-router-dom";
import { Scale, FileText } from "lucide-react";

const InfoCards = () => {
  const { config } = useSite();
  const caseTypes = config.content.caseTypes || [];

  const card1 = caseTypes.find(c => c.slug === 'recuperacao-judicial') || {
    title: 'Recuperação Judicial',
    description: 'Processo judicial destinado a viabilizar a superação da situação de crise econômico-financeira do devedor.',
    slug: 'recuperacao-judicial'
  };

  const card2 = caseTypes.find(c => c.slug === 'falencia') || {
    title: 'Falência',
    description: 'Processo de execução coletiva em que os bens do devedor são arrecadados e vendidos para pagamento dos credores.',
    slug: 'falencia'
  };

  return (
    <div className="w-full flex justify-center py-8">
      <div className="container-padding grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-7xl">
        {/* Card 1 */}
        <Link 
          to={`/areas-atuacao/${card1.slug}`} 
          className="relative overflow-hidden bg-[#0A3D6B] rounded-xl flex items-center p-6 lg:p-8 hover:shadow-xl transition-all duration-300 group min-h-[160px]"
        >
          {/* Chevron background decorative elements */}
          <div className="absolute right-0 top-0 bottom-0 w-[40%] overflow-hidden pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity">
             <div className="absolute top-1/2 -translate-y-1/2 right-[10%] w-0 h-0 border-t-[100px] border-t-transparent border-b-[100px] border-b-transparent border-l-[60px] border-l-[#041d3b]"></div>
             <div className="absolute top-1/2 -translate-y-1/2 right-[2%] w-0 h-0 border-t-[100px] border-t-transparent border-b-[100px] border-b-transparent border-l-[60px] border-l-[#041d3b]"></div>
             <div className="absolute top-1/2 -translate-y-1/2 -right-[6%] w-0 h-0 border-t-[100px] border-t-transparent border-b-[100px] border-b-transparent border-l-[60px] border-l-[#041d3b]"></div>
          </div>
          
          <div className="z-10 flex items-center gap-6 lg:gap-8 w-full">
            <div className="flex-shrink-0">
               <Scale className="w-16 h-16 lg:w-20 lg:h-20 text-[#6CF0C6] drop-shadow-md" strokeWidth={1} />
            </div>
            <div className="flex flex-col">
              <h3 className="text-[#FFC72C] text-2xl lg:text-3xl font-bold mb-2 font-heading tracking-tight">{card1.title}</h3>
              <p className="text-white text-sm lg:text-base leading-snug">{card1.description}</p>
            </div>
          </div>
        </Link>

        {/* Card 2 */}
        <Link 
          to={`/areas-atuacao/${card2.slug}`} 
          className="relative overflow-hidden bg-[#0A3D6B] rounded-xl flex items-center p-6 lg:p-8 hover:shadow-xl transition-all duration-300 group min-h-[160px]"
        >
          {/* Chevron background decorative elements */}
          <div className="absolute right-0 top-0 bottom-0 w-[40%] overflow-hidden pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity">
             <div className="absolute top-1/2 -translate-y-1/2 right-[10%] w-0 h-0 border-t-[100px] border-t-transparent border-b-[100px] border-b-transparent border-l-[60px] border-l-[#041d3b]"></div>
             <div className="absolute top-1/2 -translate-y-1/2 right-[2%] w-0 h-0 border-t-[100px] border-t-transparent border-b-[100px] border-b-transparent border-l-[60px] border-l-[#041d3b]"></div>
             <div className="absolute top-1/2 -translate-y-1/2 -right-[6%] w-0 h-0 border-t-[100px] border-t-transparent border-b-[100px] border-b-transparent border-l-[60px] border-l-[#041d3b]"></div>
          </div>
          
          <div className="z-10 flex items-center gap-6 lg:gap-8 w-full">
            <div className="flex-shrink-0 relative">
               <FileText className="w-16 h-16 lg:w-20 lg:h-20 text-[#E0E0E0] drop-shadow-md" strokeWidth={1} />
               <div className="absolute bottom-1 right-1 w-5 h-5 bg-[#FFC72C] rounded-full border-2 border-[#0A3D6B]"></div>
            </div>
            <div className="flex flex-col">
              <h3 className="text-[#FFC72C] text-2xl lg:text-3xl font-bold mb-2 font-heading tracking-tight">{card2.title}</h3>
              <p className="text-white text-sm lg:text-base leading-snug">{card2.description}</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default InfoCards;
