"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LayoutDashboard, Package, Calendar, Users, Settings, LogOut, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

export default function PartnerDashboard() {
    const [partner, setPartner] = useState<any>(null);

    useEffect(() => {
        const storedPartner = localStorage.getItem("partner_session");
        if (!storedPartner) {
            window.location.href = "/devenir_partenaire";
            return;
        }
        setPartner(JSON.parse(storedPartner));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("partner_session");
        window.location.href = "/";
    };

    if (!partner) return null;

    return (
        <div className="min-h-screen bg-muted/30">
            <Navbar />
            <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
                <div className="flex flex-col gap-8">
                    {/* Header */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                Tableau de bord Partenaire
                            </h1>
                            <p className="mt-1 text-muted-foreground">
                                Bienvenue, {partner.business_name}. Gérez vos offres et vos réservations.
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex w-fit items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted transition-colors text-destructive"
                        >
                            <LogOut className="h-4 w-4" />
                            Quitter l'espace
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            { label: "Réservations", value: "0", icon: Calendar, color: "text-blue-600", bg: "bg-blue-100" },
                            { label: "Offres actives", value: "0", icon: Package, color: "text-emerald-600", bg: "bg-emerald-100" },
                            { label: "Revenus (CFA)", value: "0", icon: LayoutDashboard, color: "text-amber-600", bg: "bg-amber-100" },
                            { label: "Clients", value: "0", icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
                        ].map((stat, i) => (
                            <div key={i} className="rounded-2xl border border-border bg-card p-6">
                                <div className="flex items-center justify-between">
                                    <div className={`rounded-xl ${stat.bg} p-2.5 ${stat.color}`}>
                                        <stat.icon className="h-5 w-5" />
                                    </div>
                                    <span className="text-xs font-medium text-emerald-600 flex items-center bg-emerald-50 px-2 py-0.5 rounded-full">
                                        +0% <ArrowUpRight className="h-3 w-3 ml-0.5" />
                                    </span>
                                </div>
                                <div className="mt-4">
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Main Content Area */}
                    <div className="grid gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="rounded-2xl border border-border bg-card p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
                                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                    <Package className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-bold">Aucune offre publiée</h3>
                                <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                                    Commencez par ajouter votre premier service (hôtel, circuit, etc.) pour devenir visible auprès des voyageurs.
                                </p>
                                <button
                                    disabled={Number(partner.validation) === 0}
                                    className={`mt-6 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all ${Number(partner.validation) === 0
                                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                                            : "bg-[#2563eb] text-white hover:bg-[#1d4ed8]"
                                        }`}
                                >
                                    Ajouter une offre
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="rounded-2xl border border-border bg-card p-6">
                                <h3 className="font-bold flex items-center gap-2">
                                    <Settings className="h-4 w-4" /> Profil Partenaire
                                </h3>
                                <div className="mt-6 space-y-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Statut</p>
                                        <div className="mt-1 inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                                            {Number(partner.validation) === 0 ? "En attente de validation" : "Validé"}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Type</p>
                                        <p className="text-sm font-medium capitalize">{partner.activity_type}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Plan</p>
                                        <p className="text-sm font-medium">{partner.selected_plan || 'Débutant'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Email Pro</p>
                                        <p className="text-sm font-medium">{partner.business_email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
