import React, { useState } from 'react';
import { X, Check, Shield, Zap, QrCode, CreditCard, Copy, CheckCircle2 } from 'lucide-react';
import { PRICING_PLANS } from '../data/mockData';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlanId?: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  initialPlanId = 'vitalicio',
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(initialPlanId);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [copiedPix, setCopiedPix] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const currentPlan = PRICING_PLANS.find(p => p.id === selectedPlanId) || PRICING_PLANS[1];

  const handleCopyPix = () => {
    navigator.clipboard.writeText('00020126580014br.gov.bcb.pix0136hypeleads-acesso-vitalicio-lote-3-sp5204000053039865406249.905802BR5905HYPELEADS6009SAO PAULO62070503***6304E1D8');
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-2xl md:rounded-3xl bg-[#050309] border border-[#25123A] p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(194,38,85,0.3)] text-[#F4F2F7] overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#0b0716] text-[#98949E] hover:text-white hover:bg-[#140C25] transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-400 mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            
            <h3 className="text-2xl font-bold text-white font-display">
              Acesso Liberado com Sucesso!
            </h3>
            
            <p className="text-xs text-[#98949E] max-w-sm mx-auto leading-relaxed">
              Você já pode começar a prospectar empresas no OpenStreetMap e gerar sites profissionais com inteligência artificial.
            </p>

            <div className="pt-4">
              <button
                onClick={() => {
                  setIsSuccess(false);
                  onClose();
                }}
                className="px-8 py-3 rounded-full text-xs font-semibold bg-gradient-to-r from-[#8126C2] to-[#9436D9] text-white"
              >
                Ir para o Dashboard da HypeLeads
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Header */}
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#B65AF0]">
                Finalizar Assinatura
              </span>
              <h3 className="text-2xl font-extrabold text-[#F4F2F7] font-display mt-0.5">
                {currentPlan.name}
              </h3>
              <p className="text-xs text-[#817D8A] mt-1">
                Acesso imediato às ferramentas de prospecção e criação com IA.
              </p>
            </div>

            {/* Plan Switcher Pills */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#070512] rounded-xl border border-[#130C23]">
              <button
                onClick={() => setSelectedPlanId('vitalicio')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  selectedPlanId === 'vitalicio'
                    ? 'bg-[#1C0D2A] text-white border border-[#8126C2]/60 shadow-sm'
                    : 'text-[#817D8A] hover:text-[#F4F2F7]'
                }`}
              >
                Acesso Pra Sempre (R$ 249,90)
              </button>
              <button
                onClick={() => setSelectedPlanId('mensal')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  selectedPlanId === 'mensal'
                    ? 'bg-[#1C0D2A] text-white border border-[#8126C2]/60 shadow-sm'
                    : 'text-[#817D8A] hover:text-[#F4F2F7]'
                }`}
              >
                Plano Mensal (R$ 169,90)
              </button>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-semibold text-[#817D8A] block">
                Forma de Pagamento
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                    paymentMethod === 'pix'
                      ? 'bg-[#0b0718] border-[#8126C2] text-white'
                      : 'bg-[#08040E] border-[#120C1F] text-[#817D8A]'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-[#8126C2]" />
                  Pix (Liberação Instantânea)
                </button>

                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-[#0b0718] border-[#8126C2] text-white'
                      : 'bg-[#08040E] border-[#120C1F] text-[#817D8A]'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#B65AF0]" />
                  Cartão de Crédito
                </button>
              </div>
            </div>

            {/* Pix View */}
            {paymentMethod === 'pix' && (
              <div className="p-4 rounded-2xl bg-[#080511] border border-[#160C26] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#817D8A]">Valor final com desconto:</span>
                  <span className="font-bold text-base text-emerald-400 font-display">
                    {selectedPlanId === 'vitalicio' ? 'R$ 249,90' : 'R$ 169,90'}
                  </span>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl bg-[#040208] border border-[#0E081A] text-xs">
                  <input
                    readOnly
                    value="00020126580014br.gov.bcb.pix0136hypeleads-acesso-vitalicio-lote-3-sp"
                    className="bg-transparent text-[#817D8A] text-[11px] font-mono flex-1 outline-none truncate"
                  />
                  <button
                    onClick={handleCopyPix}
                    className="px-3 py-1 rounded-lg bg-[#1C0D2A] text-[#B65AF0] text-xs font-semibold hover:bg-[#27123D] transition-colors flex items-center gap-1 shrink-0"
                  >
                    {copiedPix ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copiedPix ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
              </div>
            )}

            {/* Card View */}
            {paymentMethod === 'card' && (
              <div className="space-y-2 text-xs">
                <input
                  type="text"
                  placeholder="Número do cartão"
                  defaultValue="•••• •••• •••• 4242"
                  className="w-full p-3 rounded-xl bg-[#08040E] border border-[#120C1F] text-[#F4F2F7] outline-none focus:border-[#8126C2]"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM/AA"
                    defaultValue="12/28"
                    className="p-3 rounded-xl bg-[#08040E] border border-[#120C1F] text-[#F4F2F7] outline-none focus:border-[#8126C2]"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    defaultValue="892"
                    className="p-3 rounded-xl bg-[#08040E] border border-[#120C1F] text-[#F4F2F7] outline-none focus:border-[#8126C2]"
                  />
                </div>
              </div>
            )}

            {/* Confirm Payment Button */}
            <div className="space-y-2 pt-1">
              <button
                disabled={isProcessing}
                onClick={handleSimulatePayment}
                className="w-full py-4 rounded-xl text-xs font-extrabold tracking-wide uppercase bg-gradient-to-r from-[#8126C2] to-[#9436D9] text-white hover:shadow-[0_0_30px_#B65AF0] transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>Processando ativação...</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Confirmar e Liberar Acesso Imediato</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#817D8A]">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span>Ambiente com criptografia SSL ponta a ponta</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
