"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Users,
  CreditCard,
  Activity,
  Calendar,
  Building2,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function PartnerActivities() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, [id]);

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/admin/get_partner_activities.php?partner_id=${id}`,
      );
      const result = await res.json();
      if (res.ok) {
        setData(result);
      } else {
        toast.error(result.message || "Erreur lors de la récupération.");
        router.push("/admin/partners");
      }
    } catch (err) {
      toast.error("Erreur serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-[#2563eb]" />
      </div>
    );
  }

  if (!data) return null;

  const { partner, activities } = data;

  return (
    <div className="flex h-screen bg-muted/30">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 ">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour aux partenaires
            </button>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-lg bg-[#2563eb]/10 flex items-center justify-center text-[#2563eb]">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <h1 className="text-3xl font-bold">
                    {partner.business_name}
                  </h1>
                </div>
                <p className="text-muted-foreground">
                  Monitoring des activités et performances en temps réel.
                </p>
              </div>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold uppercase text-muted-foreground">
                  Vues totales
                </p>
              </div>
              <p className="text-2xl font-bold">
                {activities.stats.total_views}
              </p>
              <div className="mt-2 flex items-center gap-1 text-xs text-green-600 font-medium">
                <TrendingUp className="h-3 w-3" />
                +12% ce mois
              </div>
            </div>

            <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
                  <Calendar className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold uppercase text-muted-foreground">
                  Réservations
                </p>
              </div>
              <p className="text-2xl font-bold">
                {activities.stats.total_bookings}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">Confirmées</p>
            </div>

            <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center">
                  <CreditCard className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold uppercase text-muted-foreground">
                  Chiffre d'affaires
                </p>
              </div>
              <p className="text-2xl font-bold">{activities.stats.revenue}</p>
              <p className="mt-2 text-xs text-muted-foreground">Total généré</p>
            </div>

            <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                  <Activity className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold uppercase text-muted-foreground">
                  Offres actives
                </p>
              </div>
              <p className="text-2xl font-bold">
                {activities.stats.active_offers}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                En ligne actuellement
              </p>
            </div>
          </div>

          {/* Activity Log */}
          <section className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden mb-10">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Journal d'activités</h2>
                <p className="text-sm text-muted-foreground">
                  Historique des interactions récentes du partenaire.
                </p>
              </div>
              <button className="text-xs text-[#2563eb] font-bold hover:underline">
                Voir tout l'historique
              </button>
            </div>
            <div className="divide-y divide-border">
              {activities.recent_actions.map((action: any, idx: number) => (
                <div
                  key={idx}
                  className="p-6 flex items-start gap-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="mt-1 h-2 w-2 rounded-full bg-[#2563eb]" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-bold text-sm">{action.action}</p>
                      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                        {new Date(action.date).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {action.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Info & Plan */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-card p-8 rounded-2xl border border-border shadow-sm">
              <h3 className="text-lg font-bold mb-6">Résumé du compte</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase mb-1">
                      Responsable
                    </p>
                    <p className="font-medium">{partner.manager_name}</p>
                    <p className="text-muted-foreground text-xs">
                      {partner.manager_email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase mb-1">
                      Localisation
                    </p>
                    <p className="text-muted-foreground">
                      {partner.city}, {partner.country}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase mb-1">
                      Date d'inscription
                    </p>
                    <p className="text-muted-foreground">
                      {new Date(partner.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase mb-1">
                      Type d'activité
                    </p>
                    <span className="inline-block px-2 py-1 rounded bg-muted text-xs font-medium capitalize">
                      {partner.activity_type}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#2563eb] to-[#123e9c] p-8 rounded-2xl text-white shadow-xl shadow-blue-500/20 flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold uppercase opacity-80 mb-2">
                  Abonnement
                </p>
                <h3 className="text-2xl font-bold mb-4">
                  {partner.selected_plan}
                </h3>
                <div className="space-y-3 opacity-90 text-sm">
                  <p className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    Accès aux statistiques détaillées
                  </p>
                  <p className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    Support prioritaire 24/7
                  </p>
                  <p className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    Visibilité accrue
                  </p>
                </div>
              </div>
              <button className="mt-8 w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold border border-white/20 transition-all">
                Ajuster le plan
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
