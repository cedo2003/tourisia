"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  MapPin,
  Calendar,
  Star,
  Heart,
  Settings,
  Camera,
  Globe,
  Mail,
  Phone,
  Edit3,
  Check,
  X,
  Plane,
  Hotel,
  Compass,
  Award,
  TrendingUp,
  Bookmark,
  Clock,
  ChevronRight,
  LogOut,
  User,
  Shield,
  Bell,
  CreditCard,
  Share2,
} from "lucide-react";

/* ─── DONNÉES MOCK (exemples) ─── */
const badges = [
  { icon: Award, label: "Explorateur Élite", color: "bg-amber-500" },
  { icon: Compass, label: "28 Pays visités", color: "bg-emerald-500" },
  { icon: TrendingUp, label: "Top Critique", color: "bg-[#2563eb]" },
  { icon: Star, label: "Voyageur 5 étoiles", color: "bg-rose-500" },
];

const upcomingTrips = [
  {
    id: 1,
    destination: "Kyoto, Japon",
    image: "/images/kyoto.jpg",
    dates: "15 - 24 mars 2026",
    status: "Confirmé",
    statusColor: "bg-emerald-500",
  },
  {
    id: 2,
    destination: "Santorin, Grèce",
    image: "/images/santorini.jpg",
    dates: "8 - 16 juin 2026",
    status: "En attente",
    statusColor: "bg-amber-500",
  },
];

const pastTrips = [
  {
    id: 1,
    destination: "Maldive Paradise Resort",
    location: "Maafushi, Maldives",
    image: "/images/maldives.jpg",
    date: "Déc. 2025",
    rating: 5,
    reviewed: true,
  },
  {
    id: 2,
    destination: "City of Lights Explorer",
    location: "Paris, France",
    image: "/images/paris.jpg",
    date: "Oct. 2025",
    rating: 4,
    reviewed: true,
  },
  {
    id: 3,
    destination: "Alpine Chalet Escape",
    location: "Zermatt, Suisse",
    image: "/images/alpine.jpg",
    date: "Août 2025",
    rating: 5,
    reviewed: false,
  },
  {
    id: 4,
    destination: "Tokyo Night Tour",
    location: "Shibuya, Tokyo",
    image: "/images/tokyo.jpg",
    date: "Juin 2025",
    rating: 5,
    reviewed: true,
  },
];

const wishlist = [
  {
    id: 1,
    name: "Northern Lights Lodge",
    location: "Reykjavik, Islande",
    image: "/images/iceland.jpg",
    price: 342,
    unit: "/nuit",
  },
  {
    id: 2,
    name: "Venice Gondola Experience",
    location: "Venise, Italie",
    image: "/images/venice.jpg",
    price: 60,
    unit: "/personne",
  },
  {
    id: 3,
    name: "Bali Serenity Villa",
    location: "Ubud, Bali",
    image: "/images/bali.jpg",
    price: 150,
    unit: "/nuit",
  },
  {
    id: 4,
    name: "Dubai Desert Safari",
    location: "Dubaï, Émirats arabes unis",
    image: "/images/dubai.jpg",
    price: 108,
    unit: "/personne",
  },
];

const settingsSections = [
  {
    icon: User,
    label: "Informations personnelles",
    desc: "Modifiez votre nom, email et photo de profil",
  },
  {
    icon: Shield,
    label: "Sécurité",
    desc: "Mot de passe, authentification à deux facteurs",
  },
  {
    icon: Bell,
    label: "Notifications",
    desc: "Préférences pour les emails et notifications push",
  },
  {
    icon: CreditCard,
    label: "Moyens de paiement",
    desc: "Gérez vos cartes et facturation",
  },
  { icon: Globe, label: "Langue & Devise", desc: "Français (FR), EUR" },
];

/* ─── ONGLETS ─── */
const tabs = [
  { id: "overview", label: "Aperçu" },
  { id: "trips", label: "Mes voyages" },
  { id: "wishlist", label: "Favoris" },
  { id: "reviews", label: "Avis" },
  { id: "settings", label: "Paramètres" },
];

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-3.5 w-3.5 ${s <= rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`}
        />
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [editedBio, setEditedBio] = useState("");
  const [loading, setLoading] = useState(true);

  // Edit Profile Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editLocation, setEditLocation] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          window.location.href = "/login";
          return;
        }

        const userData = JSON.parse(storedUser);

        // Refresh data from API
        const response = await fetch(
          `http://localhost:8000/backend/profile/get_profile.php?id=${userData.id}`,
        );
        if (response.ok) {
          const freshData = await response.json();
          setUser(freshData);
          setEditedBio(freshData.bio || "");
          setEditName(freshData.fullname || "");
          setEditPhone(freshData.phone || "");
          setEditLocation(freshData.location || "");
          localStorage.setItem("user", JSON.stringify(freshData));
        } else {
          // If API fails, fallback to stored data
          setUser(userData);
          setEditedBio(userData.bio || "");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Erreur lors de la récupération du profil.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveBio = async () => {
    if (!user) return;

    try {
      const response = await fetch(
        "http://localhost:8000/backend/profile/update_profile.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: user.id,
            bio: editedBio,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Profil mis à jour !");
        setUser({ ...user, bio: editedBio });
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, bio: editedBio }),
        );
        setIsEditing(false);
      } else {
        toast.error(data.message || "Erreur lors de la mise à jour.");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error("Erreur lors de la connexion au serveur.");
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      const response = await fetch(
        "http://localhost:8000/backend/profile/update_profile.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: user.id,
            fullname: editName,
            phone: editPhone,
            location: editLocation,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Profil mis à jour !");
        const updatedUser = {
          ...user,
          fullname: editName,
          phone: editPhone,
          location: editLocation,
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setShowEditModal(false);
      } else {
        toast.error(data.message || "Erreur lors de la mise à jour.");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error("Erreur lors de la connexion au serveur.");
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "cover_image",
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("id", user.id);
    formData.append("type", type);

    try {
      const response = await fetch(
        "http://localhost:8000/backend/profile/upload_image.php",
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(
          type === "avatar"
            ? "Photo de profil mise à jour !"
            : "Bannière mise à jour !",
        );
        const updatedUser = { ...user, [type]: data.path };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        toast.error(data.message || "Erreur lors de l'upload.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Erreur lors de l'upload de l'image.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2563eb] border-t-transparent"></div>
      </div>
    );
  }

  if (!user) return null;

  // Date formatting
  const memberSinceDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    })
    : "Inconnu";

  // Statistics from DB
  const currentStats = [
    { icon: Plane, label: "Voyages", value: user.trips_count || "0" },
    { icon: Globe, label: "Pays", value: user.countries_count || "0" },
    { icon: Star, label: "Avis", value: user.reviews_count || "0" },
    { icon: Heart, label: "Favoris", value: user.wishlist_count || "0" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* ─── BANNIÈRE + AVATAR ─── */}
        <section className="relative">
          {/* Image de couverture */}
          <div className="relative h-48 sm:h-64 lg:h-80">
            <Image
              src={user.cover_image || "/images/profile-cover.jpg"}
              alt="Bannière de profil"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-foreground/20" />

            <input
              type="file"
              id="cover-upload"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "cover_image")}
            />
            <button
              onClick={() => document.getElementById("cover-upload")?.click()}
              className="absolute right-4 bottom-4 flex items-center gap-2 rounded-lg bg-card/80 px-3 py-2 text-xs font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-card"
              aria-label="Changer la photo de couverture"
            >
              <Camera className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Changer la bannière</span>
            </button>
          </div>

          {/* Avatar + infos principales */}
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="relative flex flex-col items-start gap-5 pb-6 sm:flex-row sm:items-end sm:gap-6">
              {/* Avatar */}
              <div className="relative -mt-16 sm:-mt-20">
                <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-4 border-card bg-[#2563eb] shadow-lg sm:h-36 sm:w-36 overflow-hidden">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.fullname}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-white sm:text-4xl text-center uppercase">
                      {user.fullname
                        ? user.fullname
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .slice(0, 2)
                        : "SJ"}
                    </span>
                  )}
                </div>
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "avatar")}
                />
                <button
                  onClick={() =>
                    document.getElementById("avatar-upload")?.click()
                  }
                  className="absolute -right-1 -bottom-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-[#2563eb] text-white shadow-md transition-colors hover:bg-[#1d4ed8]"
                  aria-label="Changer l'avatar"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Nom + infos */}
              <div className="flex-1 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-foreground">
                    {user.fullname}
                  </h1>
                  {user.verified && (
                    <div
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2563eb]"
                      title="Vérifié"
                    >
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {user.location || "Non spécifié"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Membre depuis {memberSinceDate}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 sm:pb-1">
                <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                  <Share2 className="h-4 w-4" />
                  Partager
                </button>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center gap-2 rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1d4ed8]"
                >
                  <Edit3 className="h-4 w-4" />
                  Modifier le profil
                </button>
              </div>
            </div>

            {/* Cartes statistiques */}
            <div className="grid grid-cols-2 gap-3 border-t border-border pt-6 sm:grid-cols-4">
              {currentStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-[#2563eb]/30"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2563eb]/10 text-[#2563eb]">
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── ONGLETS ─── */}
        <section className="sticky top-16 z-30 border-b border-border bg-card/95 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative whitespace-nowrap px-5 py-4 text-sm font-medium transition-colors ${activeTab === tab.id
                    ? "text-[#2563eb]"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#2563eb]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CONTENU DES ONGLETS ─── */}
        <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          {/* ══════════════════ APERÇU ══════════════════ */}
          {activeTab === "overview" && (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Colonne gauche */}
              <div className="flex flex-col gap-6 lg:col-span-2">
                {/* Bio */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">
                      À propos
                    </h2>
                    <button
                      onClick={() => {
                        if (isEditing) setEditedBio(user.bio || "");
                        setIsEditing(!isEditing);
                      }}
                      className="flex items-center gap-1.5 text-xs font-medium text-[#2563eb] hover:text-[#1d4ed8]"
                    >
                      {isEditing ? (
                        <>
                          <X className="h-3.5 w-3.5" /> Annuler
                        </>
                      ) : (
                        <>
                          <Edit3 className="h-3.5 w-3.5" /> Modifier
                        </>
                      )}
                    </button>
                  </div>
                  {isEditing ? (
                    <div className="mt-3">
                      <textarea
                        value={editedBio}
                        onChange={(e) => setEditedBio(e.target.value)}
                        rows={3}
                        className="w-full resize-none rounded-lg border border-border bg-background p-3 text-sm text-foreground leading-relaxed focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20"
                      />
                      <div className="mt-2 flex justify-end gap-2">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="rounded-lg border border-border px-4 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={handleSaveBio}
                          className="rounded-lg bg-[#2563eb] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#1d4ed8]"
                        >
                          Enregistrer
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {editedBio || "Aucune bio renseignée."}
                    </p>
                  )}

                  {/* Infos contact */}
                  <div className="mt-5 flex flex-wrap gap-4 border-t border-border pt-5">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4 text-[#2563eb]" />
                      {user.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4 text-[#2563eb]" />
                      {user.phone || "Non spécifié"}
                    </div>
                  </div>
                </div>

                {/* Voyages à venir */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">
                      Voyages à venir
                    </h2>
                    <button
                      onClick={() => setActiveTab("trips")}
                      className="flex items-center gap-1 text-xs font-medium text-[#2563eb] hover:text-[#1d4ed8]"
                    >
                      Voir tous <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="mt-4 flex flex-col gap-3">
                    {upcomingTrips.map((trip) => (
                      <div
                        key={trip.id}
                        className="flex items-center gap-4 rounded-xl border border-border p-3 transition-colors hover:bg-muted/50"
                      >
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                          <Image
                            src={trip.image}
                            alt={trip.destination}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-foreground">
                            {trip.destination}
                          </h3>
                          <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {trip.dates}
                          </div>
                        </div>
                        <span
                          className={`rounded-full ${trip.statusColor} px-2.5 py-1 text-xs font-medium text-white`}
                        >
                          {trip.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Aperçu voyages passés */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">
                      Voyages récents
                    </h2>
                    <button
                      onClick={() => setActiveTab("trips")}
                      className="flex items-center gap-1 text-xs font-medium text-[#2563eb] hover:text-[#1d4ed8]"
                    >
                      Voir tous <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {pastTrips.slice(0, 2).map((trip) => (
                      <div
                        key={trip.id}
                        className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-md"
                      >
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <Image
                            src={trip.image}
                            alt={trip.destination}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                          <div className="absolute bottom-3 left-3">
                            <h3 className="text-sm font-semibold text-white">
                              {trip.destination}
                            </h3>
                            <p className="text-xs text-white/80">
                              {trip.location}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3">
                          <StarDisplay rating={trip.rating} />
                          {trip.reviewed ? (
                            <span className="text-xs text-emerald-600 font-medium">
                              Avis publié
                            </span>
                          ) : (
                            <button className="text-xs font-medium text-[#2563eb] hover:text-[#1d4ed8]">
                              Publier un avis
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Colonne droite */}
              <div className="flex flex-col gap-6">
                {/* Badges */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="text-lg font-semibold text-foreground">
                    Badges
                  </h2>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {badges.map((badge) => (
                      <div
                        key={badge.label}
                        className="flex flex-col items-center gap-2 rounded-xl border border-border p-4 text-center transition-colors hover:border-[#2563eb]/30"
                      >
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${badge.color} text-white`}
                        >
                          <badge.icon className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-medium text-foreground leading-tight">
                          {badge.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Aperçu favoris */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">
                      Favoris
                    </h2>
                    <button
                      onClick={() => setActiveTab("wishlist")}
                      className="flex items-center gap-1 text-xs font-medium text-[#2563eb] hover:text-[#1d4ed8]"
                    >
                      Voir tous <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="mt-4 flex flex-col gap-3">
                    {wishlist.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="truncate text-sm font-medium text-foreground">
                            {item.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {item.location}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-[#2563eb]">
                          {item.price}€
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Carte voyage placeholder */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="text-lg font-semibold text-foreground">
                    Carte de mes voyages
                  </h2>
                  <div className="mt-4 flex aspect-square items-center justify-center rounded-xl bg-muted">
                    <div className="text-center">
                      <Globe className="mx-auto h-12 w-12 text-[#2563eb]/30" />
                      <p className="mt-2 text-sm font-medium text-muted-foreground">
                        28 pays visités
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Continuez à explorer pour remplir la carte !
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════ MES VOYAGES ══════════════════ */}
          {activeTab === "trips" && (
            <div className="flex flex-col gap-8">
              {/* Voyages à venir */}
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Voyages à venir
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Vos réservations confirmées et en attente.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {upcomingTrips.map((trip) => (
                    <div
                      key={trip.id}
                      className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg hover:-translate-y-1"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={trip.image}
                          alt={trip.destination}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span
                          className={`absolute top-3 right-3 rounded-full ${trip.statusColor} px-2.5 py-1 text-xs font-medium text-white`}
                        >
                          {trip.status}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground">
                          {trip.destination}
                        </h3>
                        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {trip.dates}
                        </div>
                        <button className="mt-3 w-full rounded-lg bg-[#2563eb] py-2 text-sm font-medium text-white transition-colors hover:bg-[#1d4ed8]">
                          Voir les détails
                        </button>
                      </div>
                    </div>
                  ))}
                  <Link
                    href="/destinations"
                    className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-8 text-center transition-colors hover:border-[#2563eb]/40 hover:bg-muted/50"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2563eb]/10 text-[#2563eb]">
                      <Compass className="h-6 w-6" />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-foreground">
                      Planifier un nouveau voyage
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Parcourir les destinations
                    </p>
                  </Link>
                </div>
              </div>

              {/* Voyages passés */}
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Voyages passés
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Vos souvenirs de voyage et avis.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {pastTrips.map((trip) => (
                    <div
                      key={trip.id}
                      className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-md"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={trip.image}
                          alt={trip.destination}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="text-sm font-semibold text-white">
                            {trip.destination}
                          </h3>
                          <p className="text-xs text-white/80">
                            {trip.location}
                          </p>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <StarDisplay rating={trip.rating} />
                            <span className="text-xs text-muted-foreground">
                              {trip.date}
                            </span>
                          </div>
                        </div>
                        {!trip.reviewed && (
                          <button className="mt-2 w-full rounded-lg border border-[#2563eb] py-1.5 text-xs font-medium text-[#2563eb] transition-colors hover:bg-[#2563eb] hover:text-white">
                            Publier un avis
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════ FAVORIS ══════════════════ */}
          {activeTab === "wishlist" && (
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Mes favoris
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {wishlist.length} destinations et expériences sauvegardées.
                  </p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {wishlist.map((item) => (
                  <div
                    key={item.id}
                    className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <button
                        className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-md"
                        aria-label={`Retirer ${item.name} des favoris`}
                      >
                        <Heart className="h-4 w-4 fill-current" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground">
                        {item.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {item.location}
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-bold text-[#2563eb]">
                            {item.price}€
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {item.unit}
                          </span>
                        </div>
                        <button className="rounded-lg bg-[#2563eb] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#1d4ed8]">
                          Réserver maintenant
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════ AVIS ══════════════════ */}
          {activeTab === "reviews" && (
            <div>
              <h2 className="text-xl font-bold text-foreground">Mes avis</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Les avis que vous avez publiés sur vos voyages passés.
              </p>
              <div className="mt-6 flex flex-col gap-4">
                {pastTrips
                  .filter((t) => t.reviewed)
                  .map((trip) => (
                    <div
                      key={trip.id}
                      className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row"
                    >
                      <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-lg sm:w-32">
                        <Image
                          src={trip.image}
                          alt={trip.destination}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {trip.destination}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {trip.location} · {trip.date}
                            </p>
                          </div>
                          <StarDisplay rating={trip.rating} />
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                          Une expérience absolument merveilleuse ! Le service
                          était impeccable, l’emplacement à couper le souffle,
                          et je le recommande à tous ceux qui cherchent un
                          voyage inoubliable. Je reviendrai sans hésiter.
                        </p>
                        <div className="mt-3 flex items-center gap-3">
                          <button className="text-xs font-medium text-[#2563eb] hover:text-[#1d4ed8]">
                            Modifier l'avis
                          </button>
                          <span className="text-xs text-muted-foreground">
                            ·
                          </span>
                          <button className="text-xs font-medium text-destructive hover:text-destructive/80">
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ══════════════════ PARAMÈTRES ══════════════════ */}
          {activeTab === "settings" && (
            <div className="mx-auto max-w-2xl">
              <h2 className="text-xl font-bold text-foreground">
                Paramètres du compte
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Gérez vos préférences et informations personnelles.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                {settingsSections.map((section) => (
                  <button
                    key={section.label}
                    className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 text-left transition-all hover:border-[#2563eb]/30 hover:shadow-md"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2563eb]/10 text-[#2563eb]">
                      <section.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">
                        {section.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {section.desc}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </button>
                ))}
              </div>

              <div className="mt-8 rounded-xl border border-destructive/20 bg-destructive/5 p-6">
                <h3 className="text-sm font-semibold text-destructive">
                  Zone de danger
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Supprimer définitivement votre compte et toutes les données
                  associées. Cette action est irréversible.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <button className="rounded-lg border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive hover:text-white">
                    Supprimer mon compte
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem("user");
                      window.location.href = "/login";
                    }}
                    className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <LogOut className="h-4 w-4" />
                    Se déconnecter
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />

      {/* Modal de modification de profil */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-border p-6">
              <h2 className="text-xl font-bold text-foreground">
                Modifier le profil
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-border bg-background p-2.5 text-sm text-foreground focus:border-[#2563eb] focus:outline-none"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Email (non modifiable)
                  </label>
                  <input
                    type="email"
                    disabled
                    className="w-full rounded-lg border border-border bg-muted p-2.5 text-sm text-muted-foreground cursor-not-allowed"
                    value={user.email}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    className="w-full rounded-lg border border-border bg-background p-2.5 text-sm text-foreground focus:border-[#2563eb] focus:outline-none"
                    value={editPhone}
                    placeholder="+33 6 00 00 00 00"
                    onChange={(e) => setEditPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Localisation
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-border bg-background p-2.5 text-sm text-foreground focus:border-[#2563eb] focus:outline-none"
                    value={editLocation}
                    placeholder="Ville, Pays"
                    onChange={(e) => setEditLocation(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 rounded-lg bg-[#2563eb] py-2.5 text-sm font-medium text-white hover:bg-[#1d4ed8]"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
