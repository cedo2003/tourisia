"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CreditCard,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  Lock,
  ArrowRight,
  Smartphone,
  ChevronDown,
  Mail,
  User,
  Eye,
  EyeOff
} from "lucide-react";

interface PaymentSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: string;
  currency: string;
  offerTitle: string;
}

type PaymentMethod = "mobile" | "card";

const countries = [
  { name: "Bénin", code: "+229", flag: "🇧🇯" },
  { name: "Sénégal", code: "+221", flag: "🇸🇳" },
  { name: "Côte d'Ivoire", code: "+225", flag: "🇨🇮" },
  { name: "France", code: "+33", flag: "🇫🇷" },
  { name: "Cameroun", code: "+237", flag: "🇨🇲" },
  { name: "Togo", code: "+228", flag: "🇹🇬" },
];

export function PaymentSimulationModal({
  isOpen,
  onClose,
  onSuccess,
  amount,
  currency,
  offerTitle
}: PaymentSimulationModalProps) {
  const [step, setStep] = useState<"input" | "processing" | "success">("input");
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [mounted, setMounted] = useState(false);

  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Card Specific
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [showCvv, setShowCvv] = useState(false);

  // Mobile Specific
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setStep("input");
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const u = JSON.parse(storedUser);
        setName(u.fullname || u.username || "");
        setEmail(u.email || "");
        if (u.phone) setPhone(u.phone.replace(/^\+\d+/, ''));
      }
    }
  }, [isOpen]);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("processing");

    setTimeout(() => {
      setStep("success");
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }, 2500);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const parts = [];
    for (let i = 0; i < v.length; i += 4) {
      parts.push(v.substring(i, i + 4));
    }
    return parts.join(' ');
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 40 }}
        className="relative w-full max-w-lg flex flex-col bg-card border border-border shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] rounded-[2.5rem] overflow-hidden max-h-[90vh]"
      >
        {/* Header */}
        <div className="relative shrink-0 border-b border-border bg-card/80 px-8 py-5 backdrop-blur-md z-10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">Finaliser la réservation</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{offerTitle}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-2xl p-2.5 hover:bg-muted text-muted-foreground transition-all active:scale-90"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-8 space-y-8">

            {/* Amount Info */}
            <div className="flex items-center justify-between rounded-3xl bg-primary/10 border border-primary/20 p-5 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Total à payer</span>
                  <span className="text-[10px] font-bold text-primary opacity-60">Paiement sécurisé</span>
                </div>
              </div>
              <div className="flex items-baseline gap-1.5 bg-card px-4 py-2 rounded-2xl border border-border/50 shadow-sm">
                <span className="text-2xl font-black text-primary">{amount}</span>
                <span className="text-xs font-black text-primary/80 uppercase">{currency}</span>
              </div>
            </div>

            {step === "input" && (
              <form onSubmit={handlePayment} className="space-y-8">

                {/* Method Picker */}
                <div className="grid grid-cols-2 gap-3 p-1.5 rounded-[2rem] bg-muted/40 border border-border/50">
                  <button
                    type="button"
                    onClick={() => setMethod("mobile")}
                    className={`flex flex-col items-center gap-2 py-4 rounded-3xl transition-all duration-300 ${method === "mobile"
                      ? "bg-card text-primary shadow-xl shadow-black/5 ring-1 ring-border"
                      : "text-muted-foreground hover:bg-muted/50"}`}
                  >
                    <Smartphone className="h-5 w-5" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Mobile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod("card")}
                    className={`flex flex-col items-center gap-2 py-4 rounded-3xl transition-all duration-300 ${method === "card"
                      ? "bg-card text-primary shadow-xl shadow-black/5 ring-1 ring-border"
                      : "text-muted-foreground hover:bg-muted/50"}`}
                  >
                    <CreditCard className="h-5 w-5" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Carte</span>
                  </button>
                </div>

                <div className="min-h-[320px]">
                  <AnimatePresence mode="wait">

                    {/* MOBILE */}
                    {method === "mobile" && (
                      <motion.div
                        key="mobile"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                      >
                        <div className="space-y-4">
                          <div className="relative">
                            <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Numéro de téléphone</label>
                            <div className="flex gap-2">
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() => setShowCountryPicker(!showCountryPicker)}
                                  className="flex h-[52px] items-center gap-2 rounded-2xl border border-border bg-background px-4 transition-all hover:bg-muted/30 text-foreground"
                                >
                                  <span className="text-xl">{selectedCountry.flag}</span>
                                  <span className="text-sm font-bold">{selectedCountry.code}</span>
                                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showCountryPicker ? 'rotate-180' : ''}`} />
                                </button>

                                {showCountryPicker && (
                                  <div className="absolute top-full left-0 z-[60] mt-2 w-48 rounded-2xl border border-border bg-card p-1 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                                    <div className="max-h-56 overflow-y-auto custom-scrollbar">
                                      {countries.map((c) => (
                                        <button
                                          key={c.code}
                                          type="button"
                                          onClick={() => {
                                            setSelectedCountry(c);
                                            setShowCountryPicker(false);
                                          }}
                                          className="flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-muted transition-colors text-foreground"
                                        >
                                          <span className="text-xl">{c.flag}</span>
                                          <div className="flex flex-col">
                                            <span className="text-xs font-bold">{c.name}</span>
                                            <span className="text-[10px] text-muted-foreground">{c.code}</span>
                                          </div>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <input
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                                placeholder="00 00 00 00"
                                className="flex-1 rounded-2xl border border-border bg-background px-5 py-3 text-sm font-bold text-foreground transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Nom complet</label>
                              <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                                <input
                                  type="text"
                                  required
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  className="w-full rounded-2xl border border-border bg-background pl-11 pr-5 py-3.5 text-sm font-bold text-foreground transition-all focus:ring-4 focus:ring-primary/10"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">E-mail</label>
                              <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                                <input
                                  type="email"
                                  required
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  className="w-full rounded-2xl border border-border bg-background pl-11 pr-5 py-3.5 text-sm font-bold text-foreground transition-all focus:ring-4 focus:ring-primary/10"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-2xl bg-orange-50/50 dark:bg-orange-500/5 border border-orange-200/50 dark:border-orange-500/20 p-4 flex items-start gap-4 shadow-sm">
                          <div className="bg-orange-100 dark:bg-orange-500/20 p-2 rounded-xl text-orange-600 shrink-0">
                            <Smartphone className="h-5 w-5" />
                          </div>
                          <p className="text-[11px] text-orange-800 dark:text-orange-200 leading-relaxed font-medium">
                            Un message de confirmation sera envoyé sur votre téléphone pour valider le paiement après avoir cliqué sur le bouton ci-dessous.
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* CARD */}
                    {method === "card" && (
                      <motion.div
                        key="card"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-8"
                      >
                        {/* Virtual Card Preview */}
                        <div className="group relative aspect-[1.586/1] w-full max-w-[320px] mx-auto overflow-hidden rounded-[2rem] bg-slate-900 p-7 text-white shadow-2xl transition-transform hover:scale-[1.02] duration-500">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-transparent to-purple-600/30" />
                          <div className="absolute top-0 right-0 h-40 w-40 bg-blue-500/10 blur-[80px]" />
                          <div className="absolute bottom-0 left-0 h-40 w-40 bg-purple-500/10 blur-[80px]" />

                          <div className="relative h-full flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                              <div className="h-8 w-12 rounded-lg bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center">
                                <div className="h-5 w-8 rounded-sm bg-gradient-to-br from-amber-300 to-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
                              </div>
                              <CreditCard className="h-7 w-7 opacity-30 group-hover:opacity-60 transition-opacity" />
                            </div>
                            <div className="space-y-4">
                              <div className="text-xl font-mono tracking-[0.25em] drop-shadow-md">
                                {showCardNumber ? (cardNumber || "**** **** **** ****") : (cardNumber.replace(/\d/g, '*') || "**** **** **** ****")}
                              </div>
                              <div className="flex justify-between items-end">
                                <div className="space-y-0.5">
                                  <p className="text-[8px] uppercase tracking-widest opacity-40 font-black">Titulaire</p>
                                  <p className="text-[11px] font-black uppercase truncate max-w-[150px]">{name || "Nom du porteur"}</p>
                                </div>
                                <div className="text-right space-y-0.5">
                                  <p className="text-[8px] uppercase tracking-widest opacity-40 font-black">Expire</p>
                                  <p className="text-[11px] font-black">{expiry || "MM/AA"}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-5">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Numéro de carte</label>
                            <div className="relative">
                              <input
                                type={showCardNumber ? "text" : "password"}
                                required
                                maxLength={19}
                                value={cardNumber}
                                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                placeholder="0000 0000 0000 0000"
                                className="w-full rounded-2xl border border-border bg-background px-5 py-3.5 text-sm font-bold text-foreground transition-all focus:ring-4 focus:ring-primary/10"
                              />
                              <button
                                type="button"
                                onClick={() => setShowCardNumber(!showCardNumber)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                              >
                                {showCardNumber ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Expiration</label>
                              <input
                                type="text"
                                required
                                maxLength={5}
                                placeholder="MM/AA"
                                value={expiry}
                                onChange={(e) => {
                                  let v = e.target.value.replace(/[^0-9/]/g, '');
                                  if (v.length === 2 && !v.includes('/') && expiry.length === 1) v += '/';
                                  setExpiry(v);
                                }}
                                className="w-full rounded-2xl border border-border bg-background px-5 py-3.5 text-sm font-bold text-foreground transition-all focus:ring-4 focus:ring-primary/10"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">CVV</label>
                              <div className="relative">
                                <input
                                  type={showCvv ? "text" : "password"}
                                  required
                                  maxLength={3}
                                  placeholder="***"
                                  value={cvv}
                                  onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                                  className="w-full rounded-2xl border border-border bg-background px-5 py-3.5 text-sm font-bold text-foreground transition-all focus:ring-4 focus:ring-primary/10"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowCvv(!showCvv)}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                                >
                                  {showCvv ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  type="submit"
                  className="group relative w-full overflow-hidden rounded-[1.25rem] bg-primary py-4 text-sm font-black text-white shadow-2xl shadow-primary/30 transition-all hover:scale-[1.01] active:scale-95 mt-4"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <span className="relative flex items-center justify-center gap-2">
                    Confirmer le paiement
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>

                <div className="flex items-center justify-center gap-8 opacity-30 pt-4">
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                    <Lock className="h-3 w-3" />
                    SSL Secured
                  </div>
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                    <ShieldCheck className="h-4 w-4" />
                    Anti-fraud
                  </div>
                </div>
              </form>
            )}

            {step === "processing" && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="relative mb-8">
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl animate-pulse" />
                  <Loader2 className="relative h-16 w-16 animate-spin text-primary stroke-[3]" />
                </div>
                <h3 className="text-2xl font-black mb-2 italic tracking-tight text-foreground">Traitement Sécurisé</h3>
                <p className="text-sm text-muted-foreground max-w-[280px] mx-auto leading-relaxed font-medium">
                  Nous vérifions vos informations de paiement auprès de votre banque...
                </p>
              </div>
            )}

            {step === "success" && (
              <div className="flex flex-col items-center justify-center py-20 text-center text-foreground">
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 12, stiffness: 200 }}
                  className="relative mb-8"
                >
                  <div className="absolute inset-0 rounded-full bg-green-500/20 blur-3xl" />
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] bg-green-500 text-white shadow-2xl shadow-green-500/40">
                    <CheckCircle2 className="h-12 w-12 stroke-[3]" />
                  </div>
                </motion.div>
                <h3 className="text-[2.5rem] font-black mb-2 leading-none tracking-tighter">Félicitations !</h3>
                <p className="text-base font-semibold text-muted-foreground mb-12">
                  Votre réservation pour <span className="text-foreground decoration-primary decoration-wavy underline-offset-4 underline">{offerTitle}</span> est confirmée.
                </p>
                <div className="flex items-center gap-3 text-[10px] font-black text-green-600 bg-green-500/10 px-6 py-3 rounded-2xl uppercase tracking-[0.2em] border border-green-500/20 shadow-inner">
                  <ShieldCheck className="h-4 w-4" />
                  Paiement 100% Validé
                </div>
              </div>
            )}
          </div>
        </div>

        <style jsx global>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 5px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(0, 0, 0, 0.05);
              border-radius: 20px;
            }
            .dark .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.05);
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(0, 0, 0, 0.1);
            }
          `}</style>
      </motion.div>
    </div>
  );

  return createPortal(
    <AnimatePresence>
      {isOpen && modalContent}
    </AnimatePresence>,
    document.body
  );
}
