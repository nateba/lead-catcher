import React, { useState } from 'react';
import { 
  Sparkles, 
  Smartphone, 
  Monitor, 
  Palette, 
  Type, 
  Layout, 
  Check, 
  Send, 
  ExternalLink,
  Phone,
  Calendar,
  Star,
  CheckCircle2,
  ChevronRight,
  MousePointer2
} from 'lucide-react';

export const AiWebsiteGeneratorSection: React.FC = () => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTheme, setActiveTheme] = useState<'wine' | 'emerald' | 'minimal'>('wine');
  const [generationStep, setGenerationStep] = useState<number>(3); // 0..3

  const generationStates = [
    { name: 'Analisando negócio...', desc: 'Extraindo dados do OpenStreetMap', done: true },
    { name: 'Gerando conteúdo...', desc: 'Copy persuasiva para odontologia', done: true },
    { name: 'Criando layout...', desc: 'Estrutura visual de alta conversão', done: true },
    { name: 'Otimizando conversão...', desc: 'Gatilhos para WhatsApp e agendamento', done: true, active: true },
  ];

  return (
    <section id="produto" className="relative py-24 md:py-36 lg:py-44 overflow-hidden border-t border-[#0b0716]">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[550px] h-[550px] bg-[#36145A]/18 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Header with generous negative space */}
        <div className="max-w-3xl mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F0A1A] border border-[#27113E] text-xs font-semibold text-[#B65AF0] mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            Criação Automatizada com IA
          </div>
          
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#F4F2F7] leading-[1.08] tracking-[-0.035em]">
            Chegue na reunião com o site pronto.
          </h2>

          <p className="text-base sm:text-lg text-[#98949E] mt-5 leading-relaxed max-w-2xl">
            Em vez de tentar vender uma promessa abstrata, você envia o link do site da própria empresa já criado, com a identidade visual impecável e pronto para publicar.
          </p>
        </div>

        {/* Studio Workspace Showcase (Inverted layout: Studio on Left/Full, with integrated properties) */}
        <div className="relative rounded-2xl md:rounded-[28px] bg-[#040307]/95 backdrop-blur-2xl border border-[#1B0E2B] p-2 md:p-4 shadow-[0_30px_90px_rgba(0,0,0,0.9),0_0_60px_-15px_rgba(90,20,48,0.3)]">
          
          {/* Top Bar of the Studio Editor */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 md:px-5 border-b border-[#0F091A] bg-[#05040A] rounded-xl mb-3">
            
            {/* Context Info */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#1C0D2A] border border-[#36145A]/60 flex items-center justify-center text-[#B65AF0]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#F4F2F7] font-display">
                    Criando site para: OdontoPrime
                  </span>
                  <span className="text-[10px] bg-[#11091E] text-[#B65AF0] border border-[#36145A]/40 px-2 py-0.2 rounded font-medium">
                    Estilo: Premium
                  </span>
                </div>
                <div className="text-[11px] text-[#817D8A]">
                  Clínica Odontológica · São Paulo, SP · 5 seções estruturadas
                </div>
              </div>
            </div>

            {/* Controls: Responsive Viewports & Share */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <div className="flex items-center bg-[#0B0713] p-1 rounded-lg border border-[#150C24]">
                <button
                  onClick={() => setDeviceMode('desktop')}
                  className={`p-1.5 rounded-md transition-all ${
                    deviceMode === 'desktop'
                      ? 'bg-[#1C0D2A] text-[#F4F2F7] shadow-sm'
                      : 'text-[#817D8A] hover:text-[#F4F2F7]'
                  }`}
                  aria-label="Visualização Desktop"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeviceMode('mobile')}
                  className={`p-1.5 rounded-md transition-all ${
                    deviceMode === 'mobile'
                      ? 'bg-[#1C0D2A] text-[#F4F2F7] shadow-sm'
                      : 'text-[#817D8A] hover:text-[#F4F2F7]'
                  }`}
                  aria-label="Visualização Mobile"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#8126C2] to-[#9436D9] text-white text-xs font-semibold shadow-md shadow-[#8126C2]/20 cursor-pointer">
                <Send className="w-3 h-3" />
                <span className="hidden sm:inline">Apresentar ao Cliente</span>
              </div>
            </div>

          </div>

          {/* Main Workspace Area: Sidebar Properties + Live Canvas Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-[500px]">
            
            {/* Left Tools & Generation Progression Panel */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              
              {/* AI Generation Stepper Card */}
              <div className="p-4 rounded-xl bg-[#06040C] border border-[#11091E] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#B65AF0]">
                    Processamento com IA
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Pronto em 12s
                  </span>
                </div>

                <div className="space-y-2 pt-1">
                  {generationStates.map((step, idx) => (
                    <div 
                      key={step.name} 
                      className="flex items-start gap-2.5 p-2 rounded-lg bg-[#090612] border border-[#0F091F] text-xs"
                    >
                      <div className="w-4 h-4 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-[#F4F2F7] text-xs">
                          {step.name}
                        </div>
                        <div className="text-[10px] text-[#817D8A]">
                          {step.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Editor Properties Panel (Páginas, Seções, Cores, Tipografia, CTA) */}
              <div className="p-4 rounded-xl bg-[#06040C] border border-[#11091E] space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#817D8A] block">
                    Painel do Editor Visual
                  </span>

                  {/* Sections List */}
                  <div className="space-y-1 text-xs">
                    {['Início & Hero', 'Serviços Odontológicos', 'Sobre a OdontoPrime', 'Avaliações do Google', 'Agendamento WhatsApp'].map((sec, i) => (
                      <div 
                        key={sec}
                        className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#0A0614] border border-[#10091E] text-[#98949E] hover:text-[#F4F2F7]"
                      >
                        <span className="flex items-center gap-2">
                          <Layout className="w-3 h-3 text-[#8126C2]" />
                          {sec}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono">OK</span>
                      </div>
                    ))}
                  </div>

                  {/* Palette Switcher */}
                  <div className="pt-2">
                    <span className="text-[10px] uppercase font-semibold text-[#817D8A] block mb-1.5 flex items-center gap-1">
                      <Palette className="w-3 h-3" /> Paleta de Cores
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button 
                        onClick={() => setActiveTheme('wine')}
                        className={`px-2 py-1.5 rounded-lg text-[11px] font-medium border flex items-center justify-center gap-1 ${
                          activeTheme === 'wine' 
                            ? 'bg-[#1C0D2A] border-[#8126C2] text-white' 
                            : 'bg-[#090612] border-[#10091C] text-[#817D8A]'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-[#8126C2]" />
                        Vinho Luxo
                      </button>

                      <button 
                        onClick={() => setActiveTheme('emerald')}
                        className={`px-2 py-1.5 rounded-lg text-[11px] font-medium border flex items-center justify-center gap-1 ${
                          activeTheme === 'emerald' 
                            ? 'bg-[#172208] border-emerald-500 text-white' 
                            : 'bg-[#090612] border-[#10091C] text-[#817D8A]'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Odonto Clean
                      </button>

                      <button 
                        onClick={() => setActiveTheme('minimal')}
                        className={`px-2 py-1.5 rounded-lg text-[11px] font-medium border flex items-center justify-center gap-1 ${
                          activeTheme === 'minimal' 
                            ? 'bg-[#18201f] border-zinc-400 text-white' 
                            : 'bg-[#090612] border-[#10091C] text-[#817D8A]'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-zinc-300" />
                        Titanium
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#0E081B] flex items-center justify-between text-[11px] text-[#817D8A]">
                  <span>Status: 100% Responsivo</span>
                  <span className="text-[#B65AF0] font-semibold flex items-center gap-1">
                    Pronto para envio <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

            </div>

            {/* Right: Live Interactive Website Preview (OdontoPrime generated landing page) */}
            <div className="lg:col-span-8 flex items-center justify-center p-2 bg-[#030205] rounded-xl border border-[#0E081B]">
              
              <div 
                className={`transition-all duration-300 overflow-hidden rounded-xl border border-[#1B0E2B] bg-[#06050A] shadow-2xl flex flex-col ${
                  deviceMode === 'desktop' 
                    ? 'w-full h-[520px]' 
                    : 'w-[290px] h-[520px]'
                }`}
              >
                {/* Browser Tab Header inside Mockup */}
                <div className="px-3 py-2 bg-[#09060F] border-b border-[#140B22] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#2F164A]" />
                    <div className="w-2 h-2 rounded-full bg-[#36145A]" />
                    <div className="w-2 h-2 rounded-full bg-[#8126C2]" />
                  </div>
                  <div className="text-[10px] font-mono text-[#817D8A] bg-[#050307] px-3 py-0.5 rounded-full border border-[#0E081A]">
                    odontoprime.com.br
                  </div>
                  <div className="w-4" />
                </div>

                {/* Preview Content (Scrollable dental site) */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-[#F4F2F7] select-none">
                  
                  {/* Dental Clinic Mockup Navbar */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#8126C2] to-[#36145A] flex items-center justify-center text-white text-[10px] font-bold">
                        OP
                      </div>
                      <span className="font-bold text-xs tracking-tight text-white font-display">
                        OdontoPrime
                      </span>
                    </div>
                    <div className="hidden sm:flex items-center gap-3 text-[11px] text-[#817D8A]">
                      <span>Tratamentos</span>
                      <span>Corpo Clínico</span>
                      <span>Contato</span>
                    </div>
                    <div className="text-[10px] font-semibold bg-[#1C0D2A] text-[#B65AF0] px-2.5 py-1 rounded-full border border-[#36145A]">
                      Agendar Consulta
                    </div>
                  </div>

                  {/* Dental Clinic Hero */}
                  <div className="text-center py-4 space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-[10px] text-amber-300">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      4,8 estrelas no Google (182 avaliações)
                    </div>

                    <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight font-display">
                      Transforme seu sorriso na Av. Paulista com tecnologia de ponta.
                    </h3>

                    <p className="text-xs text-[#98949E] max-w-md mx-auto leading-relaxed">
                      Atendimento humanizado, alinhadores invisíveis, implantes e harmonização facial com especialistas premiados em São Paulo.
                    </p>

                    <div className="pt-2 flex items-center justify-center gap-2">
                      <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#8126C2] text-white text-xs font-semibold shadow-md">
                        <Phone className="w-3 h-3" />
                        Falar no WhatsApp
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0b0816] text-[#98949E] text-xs border border-[#1B0E2B]">
                        <Calendar className="w-3 h-3" />
                        Ver Horários
                      </div>
                    </div>
                  </div>

                  {/* Treatments Mini Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                    <div className="p-2.5 rounded-lg bg-[#0A0712] border border-[#120B20] text-left">
                      <div className="text-xs font-bold text-white mb-0.5">Alinhadores Invisíveis</div>
                      <p className="text-[10px] text-[#817D8A]">Correção discreta e confortável sem fios metálicos.</p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#0A0712] border border-[#120B20] text-left">
                      <div className="text-xs font-bold text-white mb-0.5">Implantes Guiados</div>
                      <p className="text-[10px] text-[#817D8A]">Procedimento computadorizado de recuperação rápida.</p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#0A0712] border border-[#120B20] text-left">
                      <div className="text-xs font-bold text-white mb-0.5">Lentes de Resina</div>
                      <p className="text-[10px] text-[#817D8A]">Design estético do sorriso em sessão personalizada.</p>
                    </div>
                  </div>

                  {/* Trust Footer */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-[#817D8A]">
                    <span>Av. Paulista, 1200 · Bela Vista, SP</span>
                    <span className="text-emerald-400 font-medium">● Aberto agora</span>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
