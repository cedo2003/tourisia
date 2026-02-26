"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
    LayoutDashboard,
    Package,
    Calendar,
    Users,
    Settings,
    LogOut,
    ArrowUpRight,
    Building2,
    FileText,
    MapPin,
    Phone,
    Mail,
    Globe,
    CreditCard,
    Save,
    Loader2,
    Eye,
    Download,
    X
} from "lucide-react";
import { toast } from "sonner";

export default function PartnerDashboard() {
    const [partner, setPartner] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<string>("dashboard");
    const [settingsSubTab, setSettingsSubTab] = useState("profile");
    const [isLoading, setIsLoading] = useState(false);
    const [showContractModal, setShowContractModal] = useState(false);
    const [contractHtml, setContractHtml] = useState("");

    // Form states
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        const storedPartner = localStorage.getItem("partner_session");
        if (!storedPartner) {
            window.location.href = "/devenir_partenaire";
            return;
        }
        const data = JSON.parse(storedPartner);
        setPartner(data);
        setFormData(data);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("partner_session");
        window.location.href = "/";
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch("http://localhost:8000/backend/partners/update_partner.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, partner_id: partner.id })
            });
            const result = await res.json();
            if (res.ok) {
                toast.success("Profil mis à jour !");
                setPartner(result.partner);
                localStorage.setItem("partner_session", JSON.stringify(result.partner));
            } else {
                toast.error(result.message || "Erreur de mise à jour");
            }
        } catch (err) {
            toast.error("Erreur serveur");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchContract = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`http://localhost:8000/backend/partners/generate_contract.php?partner_id=${partner.id}`);
            const result = await res.json();
            if (res.ok) {
                setContractHtml(result.contract_html);
                setShowContractModal(true);
            } else {
                toast.error("Impossible de générer le contrat.");
            }
        } catch (err) {
            toast.error("Erreur serveur.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadPdf = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Contrat de prestation - ${partner.business_name}</title>
                        <style>
                            body { margin: 0; padding: 20px; font-family: sans-serif; }
                            @media print {
                                @page { margin: 1cm; }
                            }
                        </style>
                    </head>
                    <body>
                        ${contractHtml}
                        <script>
                            window.onload = function() {
                                window.print();
                                setTimeout(() => window.close(), 500);
                            };
                        </script>
                    </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    if (!partner) return null;

    const navItems = [
        { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
        { id: "publications", label: "Publications", icon: Package },
        { id: "settings", label: "Paramètres", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-muted/30">
            <Navbar />
            <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                <div className="flex flex-col gap-8">
                    {/* Header */}
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-border pb-6">
                        <div className="space-y-1">
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                                <Building2 className="h-7 w-7 md:h-8 md:w-8 text-[#2563eb] shrink-0" />
                                <span className="break-words line-clamp-1">{partner.business_name}</span>
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Espace professionnel · {partner.activity_type}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase ${Number(partner.validation) === 0 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                                {Number(partner.validation) === 0 ? "Validation en attente" : "Compte Validé"}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium hover:bg-muted transition-colors text-destructive ml-auto md:ml-0"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="hidden sm:inline">Déconnexion</span>
                            </button>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-border">
                        <div className="flex items-center gap-1 min-w-max">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative whitespace-nowrap ${activeTab === item.id
                                        ? "text-[#2563eb]"
                                        : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                    {activeTab === item.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563eb] rounded-t-full" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {activeTab === "dashboard" && (
                        <>
                            {/* Stats Grid */}
                            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                                {[
                                    { label: "Réservations", value: "0", icon: Calendar, color: "text-blue-600", bg: "bg-blue-100" },
                                    { label: "Offres actives", value: "0", icon: Package, color: "text-emerald-600", bg: "bg-emerald-100" },
                                    { label: "Revenus (CFA)", value: "0", icon: LayoutDashboard, color: "text-amber-600", bg: "bg-amber-100" },
                                    { label: "Clients", value: "0", icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
                                ].map((stat, i) => (
                                    <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
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
                                    <div className="rounded-2xl border border-border bg-card p-8 text-center flex flex-col items-center justify-center min-h-[400px] shadow-sm">
                                        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
                                            <Package className="h-10 w-10 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-xl font-bold">Aucune offre publiée</h3>
                                        <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                                            Commencez par ajouter votre premier service (hôtel, circuit, etc.) pour devenir visible auprès des voyageurs.
                                        </p>
                                        <button
                                            disabled={Number(partner.validation) === 0}
                                            className={`mt-8 rounded-xl px-8 py-3 text-sm font-bold transition-all shadow-lg ${Number(partner.validation) === 0
                                                ? "bg-muted text-muted-foreground cursor-not-allowed"
                                                : "bg-[#2563eb] text-white hover:bg-[#1d4ed8] shadow-[#2563eb]/20"
                                                }`}
                                        >
                                            Ajouter ma première offre
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                                        <h3 className="font-bold flex items-center gap-2 mb-6">
                                            <FileText className="h-4 w-4 text-[#2563eb]" /> Résumé du compte
                                        </h3>
                                        <div className="space-y-5">
                                            <div>
                                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Abonnement</p>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-bold">{partner.selected_plan || 'Débutant'}</p>
                                                    <button className="text-[10px] text-[#2563eb] font-bold hover:underline">Modifier</button>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Contact Pro</p>
                                                <p className="text-sm font-medium">{partner.business_email}</p>
                                                <p className="text-xs text-muted-foreground">{partner.business_phone}</p>
                                            </div>
                                            <button
                                                onClick={fetchContract}
                                                className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#2563eb]/10 py-3 text-xs font-bold text-[#2563eb] hover:bg-[#2563eb]/20 transition-all"
                                            >
                                                <FileText className="h-3.5 w-3.5" />
                                                Contrat de prestation
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === "publications" && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground">Mes Publications</h2>
                                    <p className="text-muted-foreground mt-1">Gérez vos offres et services publiés sur la plateforme.</p>
                                </div>
                                <button
                                    disabled={Number(partner.validation) === 0}
                                    className={`rounded-xl px-6 py-2.5 text-sm font-bold transition-all shadow-lg flex items-center gap-2 ${Number(partner.validation) === 0
                                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                                        : "bg-[#2563eb] text-white hover:bg-[#1d4ed8] shadow-[#2563eb]/20"
                                        }`}
                                >
                                    <Package className="h-4 w-4" />
                                    Nouvelle Publication
                                </button>
                            </div>

                            <div className="rounded-3xl border border-border bg-card p-12 text-center flex flex-col items-center justify-center min-h-[400px] shadow-sm">
                                <div className="h-24 w-24 rounded-full bg-muted/50 flex items-center justify-center mb-6 animate-pulse">
                                    <Package className="h-12 w-12 text-muted-foreground" />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground">Prêt à publier votre première offre ?</h3>
                                <p className="text-sm text-muted-foreground mt-3 max-w-md mx-auto leading-relaxed">
                                    Bientôt, vous pourrez ajouter vos hôtels, circuits et expériences directement ici pour attirer des voyageurs du monde entier.
                                </p>
                                <div className="mt-8 flex items-center gap-4">
                                    <div className="h-1 w-12 rounded-full bg-border" />
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Section en développement</p>
                                    <div className="h-1 w-12 rounded-full bg-border" />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "settings" && (
                        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8 animate-in fade-in duration-500">
                            {/* Settings Tab List - Mobile Friendly */}
                            <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-border pb-4 lg:pb-0 lg:pr-6">
                                <nav className="flex lg:flex-col gap-1 overflow-x-auto scrollbar-hide">
                                    <button
                                        onClick={() => setSettingsSubTab("profile")}
                                        className={`whitespace-nowrap flex-shrink-0 px-4 py-2 rounded-lg transition-colors text-sm font-bold flex items-center gap-2 ${settingsSubTab === "profile" ? "bg-[#2563eb]/10 text-[#2563eb]" : "text-muted-foreground hover:bg-muted"
                                            }`}
                                    >
                                        <Building2 className="h-4 w-4" /> Profil Entreprise
                                    </button>
                                    <button
                                        onClick={() => setSettingsSubTab("banking")}
                                        className={`whitespace-nowrap flex-shrink-0 px-4 py-2 rounded-lg transition-colors text-sm font-bold flex items-center gap-2 ${settingsSubTab === "banking" ? "bg-[#2563eb]/10 text-[#2563eb]" : "text-muted-foreground hover:bg-muted"
                                            }`}
                                    >
                                        <CreditCard className="h-4 w-4" /> Infos Bancaires
                                    </button>
                                    <button
                                        onClick={fetchContract}
                                        className="whitespace-nowrap flex-shrink-0 px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted text-sm font-medium flex items-center gap-2"
                                    >
                                        <FileText className="h-4 w-4" /> Contrat
                                    </button>
                                </nav>
                            </div>

                            {/* Settings Content Area */}
                            <div className="lg:col-span-3">
                                {settingsSubTab === "profile" ? (
                                    <form onSubmit={handleUpdateProfile} className="bg-card rounded-2xl border border-border p-8 shadow-sm animate-in fade-in duration-300">
                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <h2 className="text-xl font-bold text-foreground">Profil Entreprise</h2>
                                                <p className="text-sm text-muted-foreground mt-1">Gérez vos informations publiques et de contact.</p>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="flex items-center gap-2 rounded-xl bg-[#2563eb] px-6 py-2 text-sm font-bold text-white hover:bg-[#1d4ed8] shadow-lg shadow-[#2563eb]/20 transition-all disabled:opacity-50"
                                            >
                                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                                Enregistrer
                                            </button>
                                        </div>

                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-xs font-bold text-muted-foreground uppercase mb-1.5 block">Nom de l'entreprise</label>
                                                    <input
                                                        type="text"
                                                        value={formData.business_name || ""}
                                                        onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                                                        className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm focus:border-[#2563eb] focus:outline-none focus:ring-1 focus:ring-[#2563eb]/20 transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-muted-foreground uppercase mb-1.5 block">Type d'activité</label>
                                                    <select
                                                        value={formData.activity_type || ""}
                                                        onChange={(e) => setFormData({ ...formData, activity_type: e.target.value })}
                                                        className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm focus:border-[#2563eb] focus:outline-none transition-all"
                                                    >
                                                        <option value="Hôtel">Hôtel / Hébergement</option>
                                                        <option value="Agence">Agence de voyage</option>
                                                        <option value="Circuit">Circuit touristique</option>
                                                        <option value="Location">Location de voiture</option>
                                                        <option value="Expérience">Expériences / Activités</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-muted-foreground uppercase mb-1.5 block">Description</label>
                                                    <textarea
                                                        rows={4}
                                                        value={formData.description || ""}
                                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                        className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm focus:border-[#2563eb] focus:outline-none transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-xs font-bold text-muted-foreground uppercase mb-1.5 block">Email Professionnel</label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <input
                                                            type="email"
                                                            value={formData.business_email || ""}
                                                            onChange={(e) => setFormData({ ...formData, business_email: e.target.value })}
                                                            className="w-full pl-10 rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm focus:border-[#2563eb] focus:outline-none transition-all"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-muted-foreground uppercase mb-1.5 block">Téléphone Pro</label>
                                                    <div className="relative">
                                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <input
                                                            type="tel"
                                                            value={formData.business_phone || ""}
                                                            onChange={(e) => setFormData({ ...formData, business_phone: e.target.value })}
                                                            className="w-full pl-10 rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm focus:border-[#2563eb] focus:outline-none transition-all"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-muted-foreground uppercase mb-1.5 block">Site Web</label>
                                                    <div className="relative">
                                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <input
                                                            type="text"
                                                            value={formData.website || ""}
                                                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                                            placeholder="https://..."
                                                            className="w-full pl-10 rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm focus:border-[#2563eb] focus:outline-none transition-all"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-muted-foreground uppercase mb-1.5 block">Adresse</label>
                                                    <div className="relative">
                                                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                        <textarea
                                                            rows={2}
                                                            value={formData.address || ""}
                                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                            className="w-full pl-10 rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm focus:border-[#2563eb] focus:outline-none transition-all"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                ) : (
                                    <form onSubmit={handleUpdateProfile} className="bg-card rounded-2xl border border-border p-8 shadow-sm animate-in fade-in duration-300">
                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <h2 className="text-xl font-bold text-foreground">Informations Bancaires</h2>
                                                <p className="text-sm text-muted-foreground mt-1">Gérez vos coordonnées pour les reversements.</p>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="flex items-center gap-2 rounded-xl bg-[#2563eb] px-6 py-2 text-sm font-bold text-white hover:bg-[#1d4ed8] shadow-lg shadow-[#2563eb]/20 transition-all disabled:opacity-50"
                                            >
                                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                                Enregistrer
                                            </button>
                                        </div>

                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-xs font-bold text-muted-foreground uppercase mb-1.5 block">Titulaire du compte</label>
                                                    <input
                                                        type="text"
                                                        value={formData.account_holder || ""}
                                                        onChange={(e) => setFormData({ ...formData, account_holder: e.target.value })}
                                                        placeholder="Nom complet ou société"
                                                        className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm focus:border-[#2563eb] focus:outline-none transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-muted-foreground uppercase mb-1.5 block">Nom de la banque</label>
                                                    <input
                                                        type="text"
                                                        value={formData.bank_name || ""}
                                                        onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                                                        className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm focus:border-[#2563eb] focus:outline-none transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-muted-foreground uppercase mb-1.5 block">IBAN / RIB</label>
                                                    <input
                                                        type="text"
                                                        value={formData.iban || ""}
                                                        onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                                                        placeholder="BJ00 0000 0000 0000 0000"
                                                        className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm font-mono focus:border-[#2563eb] focus:outline-none transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-xs font-bold text-muted-foreground uppercase mb-1.5 block">Numéro Mobile Money</label>
                                                    <input
                                                        type="text"
                                                        value={formData.mobile_money_number || ""}
                                                        onChange={(e) => setFormData({ ...formData, mobile_money_number: e.target.value })}
                                                        placeholder="+229 00 00 00 00"
                                                        className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm focus:border-[#2563eb] focus:outline-none transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-muted-foreground uppercase mb-1.5 block">Devise de paiement</label>
                                                    <select
                                                        value={formData.currency || "XOF"}
                                                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                                        className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm focus:border-[#2563eb] focus:outline-none transition-all"
                                                    >
                                                        <option value="XOF">FCFA (XOF)</option>
                                                        <option value="EUR">Euro (EUR)</option>
                                                        <option value="USD">Dollar (USD)</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-muted-foreground uppercase mb-1.5 block">Adresse de facturation</label>
                                                    <textarea
                                                        rows={2}
                                                        value={formData.billing_address || ""}
                                                        onChange={(e) => setFormData({ ...formData, billing_address: e.target.value })}
                                                        className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm focus:border-[#2563eb] focus:outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />

            {/* Contract Modal */}
            {showContractModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-0 sm:p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full sm:max-w-4xl h-full sm:h-[85vh] sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl">
                        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border bg-white sticky top-0">
                            <div>
                                <h3 className="text-xl font-bold text-foreground">Contrat de prestation de services</h3>
                                <p className="text-xs text-muted-foreground">Document officiel généré pour {partner.business_name}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleDownloadPdf}
                                    className="flex items-center gap-2 rounded-xl bg-[#2563eb] px-4 py-2 text-xs font-bold text-white hover:bg-[#1d4ed8] shadow-lg shadow-[#2563eb]/20 transition-all"
                                >
                                    <Download className="h-4 w-4" />
                                    Télécharger PDF
                                </button>
                                <button
                                    onClick={() => setShowContractModal(false)}
                                    className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-12 bg-gray-50">
                            <div
                                className="bg-white p-6 sm:p-12 shadow-sm mx-auto"
                                dangerouslySetInnerHTML={{ __html: contractHtml }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
