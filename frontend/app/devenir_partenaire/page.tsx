"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import {
  Globe,
  Users,
  TrendingUp,
  Shield,
  BarChart3,
  Headphones,
  CreditCard,
  Star,
  ArrowRight,
  Check,
  ChevronDown,
  Building2,
  MapPin,
  Zap,
  Eye,
} from "lucide-react";

const stats = [
  { value: "50K+", label: "Prestataires actifs" },
  { value: "10M+", label: "Voyageurs par mois" },
  { value: "130+", label: "Destinations" },
  { value: "95%", label: "Taux de satisfaction" },
];

const steps = [
  {
    step: "01",
    icon: Building2,
    title: "Créez votre profil",
    description:
      "Inscrivez-vous et présentez votre activité. Ajoutez vos annonces, photos et tarifs en quelques minutes grâce à notre tableau de bord intuitif.",
  },
  {
    step: "02",
    icon: Eye,
    title: "Soyez visible",
    description:
      "Notre plateforme met en avant vos services auprès de millions de voyageurs dans le monde. Notre algorithme vous met en relation avec le bon public.",
  },
  {
    step: "03",
    icon: CreditCard,
    title: "Gagnez et développez-vous",
    description:
      "Recevez des réservations, gérez vos disponibilités et soyez payé en toute sécurité. Suivez vos performances et développez votre activité facilement.",
  },
];

const benefits = [
  {
    icon: Globe,
    title: "Portée mondiale",
    description:
      "Exposez votre activité à plus de 10 millions de voyageurs à la recherche d’expériences uniques.",
  },
  {
    icon: BarChart3,
    title: "Tableau de bord analytique",
    description:
      "Suivi en temps réel des vues, réservations, revenus et comportements des clients pour optimiser vos annonces.",
  },
  {
    icon: Shield,
    title: "Paiements sécurisés",
    description:
      "Soyez payé à temps, à chaque fois. Notre système gère plusieurs devises avec une protection anti-fraude intégrée.",
  },
  {
    icon: Headphones,
    title: "Support 24/7",
    description:
      "Équipe de support dédiée aux prestataires disponible à toute heure pour répondre à vos questions.",
  },
  {
    icon: TrendingUp,
    title: "Outils marketing",
    description:
      "Accédez à des promotions, mises en avant et intégrations réseaux sociaux pour booster votre visibilité.",
  },
  {
    icon: Users,
    title: "Communauté",
    description:
      "Rejoignez un réseau de plus de 50 000 prestataires. Partagez vos astuces, participez à des webinaires et progressez ensemble.",
  },
];

const plans = [
  {
    name: "Débutant",
    price: "Gratuit",
    period: "",
    description:
      "Idéal pour les indépendants qui débutent dans les services touristiques.",
    features: [
      "Jusqu’à 3 annonces",
      "Statistiques de base",
      "Support standard",
      "Messagerie avec voyageurs",
      "Paiements sécurisés",
    ],
    cta: "Commencer gratuitement",
    highlighted: false,
  },
  {
    name: "Professionnel",
    price: "29 $",
    period: "/mois",
    description:
      "Pour les entreprises établies qui souhaitent augmenter leur visibilité et leurs revenus.",
    features: [
      "Annonces illimitées",
      "Statistiques avancées",
      "Support prioritaire",
      "Mise en avant premium",
      "Outils promotionnels",
      "Paiements multi-devises",
      "Page de réservation personnalisée",
    ],
    cta: "Essai gratuit",
    highlighted: true,
  },
  {
    name: "Entreprise",
    price: "99 $",
    period: "/mois",
    description:
      "Pour les grands opérateurs et agences gérant plusieurs établissements.",
    features: [
      "Tout ce qui est dans Professionnel",
      "Gestionnaire de compte dédié",
      "Accès API",
      "Options white-label",
      "Gestion d’équipe",
      "Importation en masse",
      "Intégrations personnalisées",
      "Garantie SLA",
    ],
    cta: "Contacter les ventes",
    highlighted: false,
  },
];

const testimonials = [
  {
    quote:
      "Être prestataire sur cette plateforme a transformé mon agence de circuits locaux. La visibilité est incroyable.",
    name: "Elena Rodriguez",
    role: "Opératrice de circuits locaux",
    rating: 5,
  },
  {
    quote:
      "Le tableau de bord analytique vaut à lui seul l’abonnement. Je vois précisément ce que recherchent les voyageurs et j’adapte mes offres.",
    name: "James Okafor",
    role: "Directeur d’hôtel, Lagos",
    rating: 5,
  },
  {
    quote:
      "Nous sommes passés de 10 réservations par mois à plus de 200 en seulement six mois. La plateforme tient vraiment ses promesses.",
    name: "Aiko Tanaka",
    role: "Hôte d’expériences, Kyoto",
    rating: 5,
  },
];

const faqs = [
  {
    question: "Combien de temps faut-il pour être approuvé ?",
    answer:
      "La plupart des demandes sont examinées sous 24 à 48 heures. Une fois approuvé, vous pouvez commencer à recevoir des réservations immédiatement.",
  },
  {
    question: "Quelle commission prélève Tourisia ?",
    answer:
      "Le plan Débutant est gratuit avec une commission de 15 % par réservation. Le plan Professionnel réduit cette commission à 10 %, et Entreprise à 8 %.",
  },
  {
    question: "Puis-je proposer plusieurs catégories d’activités ?",
    answer:
      "Oui, vous pouvez proposer hébergements, circuits, expériences et locations de voitures depuis un seul compte prestataire.",
  },
  {
    question: "Comment suis-je payé ?",
    answer:
      "Les paiements sont traités de manière sécurisée et versés sur votre compte bancaire sous 3 à 5 jours ouvrés après le départ du client. Nous prenons en charge plusieurs devises.",
  },
  {
    question: "Y a-t-il un contrat ou un engagement ?",
    answer:
      "Aucun contrat longue durée. Vous pouvez passer à un autre plan ou annuler à tout moment sans pénalité.",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export default function BecomeProviderPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* ─── HERO ─── */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/provider-hero.png"
              alt="Prestataire voyage"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 py-24 lg:px-8 lg:py-36">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#2563eb]/20 px-4 py-1.5 text-sm font-medium text-[#93bbfd] backdrop-blur-sm">
                <Zap className="h-3.5 w-3.5" />
                Rejoignez plus de 50 000 prestataires dans le monde
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl text-balance">
                Développez votre activité touristique avec nous
              </h1>
              <p className="mt-6 max-w-lg bg-white text-black leading-relaxed p-5 rounded-2xl shadow-lg">
                Inscrivez vos hébergements, circuits et expériences sur Tourisia
                et touchez des millions de voyageurs en quête d’aventure. Aucun
                frais d’inscription.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/register"
                  className="flex items-center gap-2 rounded-xl bg-[#2563eb] px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#1d4ed8] hover:shadow-lg hover:shadow-[#2563eb]/25"
                >
                  Commencer à publier maintenant
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#how-it-works"
                  className="rounded-xl border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  En savoir plus
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ─── STATS BAR ─── */}
        <section className="border-b border-border bg-card">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px lg:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center px-4 py-8 text-center"
              >
                <p className="text-3xl font-bold text-[#2563eb]">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section
          id="how-it-works"
          className="mx-auto max-w-7xl px-4 py-20 lg:px-8"
        >
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#2563eb]">
              PROCESSUS SIMPLE
            </p>
            <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl text-balance">
              Comment ça marche
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground leading-relaxed">
              Commencez en trois étapes simples. Aucune connaissance technique
              requise — notre plateforme vous guide à chaque étape.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {steps.map((step, i) => (
              <div key={i} className="group relative">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="absolute right-0 top-12 hidden h-px w-full translate-x-1/2 bg-border lg:block" />
                )}
                <div className="relative rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:border-[#2563eb]/30 hover:shadow-lg hover:shadow-[#2563eb]/5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#2563eb]/10 text-[#2563eb] transition-colors group-hover:bg-[#2563eb] group-hover:text-white">
                      <step.icon className="h-6 w-6" />
                    </div>
                    <span className="text-4xl font-bold text-border">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── BENEFITS ─── */}
        <section className="bg-muted/40">
          <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#2563eb]">
                POURQUOI TOURISIA ?
              </p>
              <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl text-balance">
                Tout ce dont vous avez besoin pour réussir
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground leading-relaxed">
                Nous mettons à votre disposition les outils, la visibilité et le
                support nécessaires pour transformer votre passion en une
                activité prospère.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit, i) => (
                <div
                  key={i}
                  className="group rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:border-[#2563eb]/30 hover:shadow-lg hover:shadow-[#2563eb]/5"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2563eb]/10 text-[#2563eb] transition-colors group-hover:bg-[#2563eb] group-hover:text-white">
                    <benefit.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-base font-semibold text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PRICING ─── */}
        <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#2563eb]">
              TARIFS
            </p>
            <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl text-balance">
              Choisissez votre formule
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground leading-relaxed">
              Commencez gratuitement et passez à une formule supérieure au fur
              et à mesure que votre activité se développe. Aucun frais caché,
              résiliation possible à tout moment.
            </p>

            {/* Billing toggle */}
            <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-border bg-card p-1">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${billingCycle === "monthly"
                  ? "bg-[#2563eb] text-white"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors ${billingCycle === "yearly"
                  ? "bg-[#2563eb] text-white"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Annuel
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${billingCycle === "yearly"
                    ? "bg-white/20 text-white"
                    : "bg-emerald-100 text-emerald-700"
                    }`}
                >
                  -20%
                </span>
              </button>
            </div>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {plans.map((plan, i) => {
              const displayPrice =
                plan.price === "Gratuit"
                  ? "Gratuit"
                  : billingCycle === "yearly"
                    ? `$${Math.round(parseInt(plan.price.replace("$", "")) * 0.8)}`
                    : plan.price;

              return (
                <div
                  key={i}
                  className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-300 ${plan.highlighted
                    ? "border-[#2563eb] bg-card shadow-xl shadow-[#2563eb]/10 ring-1 ring-[#2563eb]"
                    : "border-border bg-card hover:border-[#2563eb]/30 hover:shadow-lg"
                    }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#2563eb] px-4 py-1 text-xs font-semibold text-white">
                      Le plus populaire
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-foreground">
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {plan.description}
                  </p>

                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">
                      {displayPrice}
                    </span>
                    {plan.period && (
                      <span className="text-sm text-muted-foreground">
                        {billingCycle === "yearly" ? "/mois" : plan.period}
                      </span>
                    )}
                  </div>
                  {billingCycle === "yearly" && plan.price !== "Gratuit" && (
                    <p className="mt-1 text-xs text-emerald-600">
                      Facturé annuellement. Économisez 20 %.
                    </p>
                  )}

                  <ul className="mt-8 flex flex-1 flex-col gap-3">
                    {plan.features.map((feature, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-3 text-sm text-foreground"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#2563eb]" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/register"
                    className={`mt-8 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-colors ${plan.highlighted
                      ? "bg-[#2563eb] text-white hover:bg-[#1d4ed8]"
                      : "border border-border bg-card text-foreground hover:bg-muted"
                      }`}
                  >
                    {plan.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── TESTIMONIALS ─── */}
        <section className="bg-muted/40">
          <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#2563eb]">
                Témoignages
              </p>
              <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl text-balance">
                Approuvé par des prestataires du monde entier
              </h2>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border bg-card p-7"
                >
                  <StarRating count={t.rating} />
                  <p className="mt-4 text-sm text-foreground leading-relaxed">
                    {`"${t.quote}"`}
                  </p>
                  <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563eb]/10 text-sm font-bold text-[#2563eb]">
                      {t.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {t.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section className="mx-auto max-w-3xl px-4 py-20 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#2563eb]">
              FAQ
            </p>
            <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl text-balance">
              Questions fréquentes
            </h2>
          </div>

          <div className="mt-12 flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-[#2563eb]/20"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                >
                  <span className="text-sm font-semibold text-foreground pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""
                      }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ${openFaq === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section className="mx-auto max-w-7xl px-4 pb-20 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-[#2563eb]">
            <div className="absolute inset-0 opacity-10">
              <Image
                src="/images/hero-mountains.jpg"
                alt=""
                fill
                className="object-cover"
              />
            </div>
            <div className="relative px-6 py-16 text-center sm:px-12 sm:py-20">
              <h2 className="text-3xl font-bold text-white sm:text-4xl text-balance">
                Prêt à toucher des millions de voyageurs ?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-white/80 leading-relaxed">
                Rejoignez notre communauté de plus de 50 000 prestataires et
                développez votre activité touristique dès aujourd’hui. Sans
                frais initiaux, sans engagement.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-[#2563eb] transition-colors hover:bg-white/90"
                >
                  Commencer gratuitement
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#how-it-works"
                  className="rounded-xl border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Voir comment ça marche
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
