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
  Loader2,
  Play,
  ArrowRight,
  ChevronLeft,
  Trash2,
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
  { id: "reservations", label: "Mes enregistrements" },
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
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loadingReservations, setLoadingReservations] = useState(false);

  // Edit Profile Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editLocation, setEditLocation] = useState("");

  // Detail Modal State
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);

  // Delete Confirmation Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setEditName(parsedUser.fullname || "");
        setEditPhone(parsedUser.phone || "");
        setEditLocation(parsedUser.location || "");
        fetchFavorites(parsedUser.id);
        fetchReservations(parsedUser.id);

        // Refresh data from API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}profile/get_profile.php?id=${parsedUser.id} `);
        if (response.ok) {
          const freshData = await response.json();
          setUser(freshData);
          setEditedBio(freshData.bio || "");
          setEditName(freshData.fullname || "");
          setEditPhone(freshData.phone || "");
          setEditLocation(freshData.location || "");
          localStorage.setItem("user", JSON.stringify(freshData));
        }
      } else {
        window.location.href = "/login";
      }
    } catch (err) {
      console.error("Error fetching user data", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async (userId: number) => {
    setLoadingFavorites(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}offers/get_user_favorites.php?user_id=${userId}`);
      const data = await res.json();
      if (res.ok) {
        setFavorites(data);
      }
    } catch (err) {
      console.error("Error fetching favorites", err);
    } finally {
      setLoadingFavorites(false);
    }
  };

  const fetchReservations = async (userId: number) => {
    setLoadingReservations(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}offers/get_user_reservations.php?user_id=${userId}`);
      const data = await res.json();
      if (res.ok) {
        setReservations(data);
      }
    } catch (err) {
      console.error("Error fetching reservations", err);
    } finally {
      setLoadingReservations(false);
    }
  };

  const handleBooking = async (offerId: number) => {
    if (!user) {
      toast.error("Veuillez vous connecter pour réserver.");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}offers/book_offer.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, offer_id: offerId }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        fetchReservations(user.id); // Refresh reservations list
      } else {
        toast.error(data.message || "Erreur lors de la réservation.");
      }
    } catch (err) {
      toast.error("Erreur de connexion au serveur.");
    }
  };

  const confirmDelete = (reservationId: number) => {
    setReservationToDelete(reservationId);
    setShowDeleteModal(true);
  };

  const handleDeleteReservation = async () => {
    if (!user || reservationToDelete === null) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}offers/delete_reservation.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, reservation_id: reservationToDelete }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        fetchReservations(user.id);
        setShowDeleteModal(false);
        setReservationToDelete(null);
      } else {
        toast.error(data.message || "Erreur lors de la suppression.");
      }
    } catch (err) {
      toast.error("Erreur de connexion au serveur.");
    }
  };

  const removeFromFavorites = async (offerId: number) => {
    if (!user) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}offers/toggle_favorite.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, offer_id: offerId }),
      });
      if (res.ok) {
        setFavorites((prev) => prev.filter((item) => item.id !== offerId));
        toast.success("Retiré des favoris.");
      }
    } catch (err) {
      toast.error("Erreur lors de la suppression.");
    }
  };

  const getFileUrl = (path: string) => {
    if (!path) return "";
    return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
  };

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-[#2563eb]" />
      </div>
    );
  }

  const memberSinceDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    })
    : "janvier 2024";

  const currentStats = [
    { icon: Calendar, label: "Réservations", value: reservations.length },
    { icon: Compass, label: "Pays", value: user.countries_count || 0 },
    { icon: Heart, label: "Favoris", value: favorites.length },
    { icon: Star, label: "Avis", value: user.reviews_count || 0 },
  ];

  const handleSaveBio = async () => {
    if (!user) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}profile/update_profile.php`,
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
        `${process.env.NEXT_PUBLIC_API_URL}profile/update_profile.php`,
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
        `${process.env.NEXT_PUBLIC_API_URL}profile/upload_image.php`,
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

          {/* ══════════════════ MES RESERVATIONS ══════════════════ */}
          {activeTab === "reservations" && (
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Mes réservations
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Vos réservations confirmées et en attente auprès des partenaires.
                </p>

                {loadingReservations ? (
                  <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-[#2563eb]" />
                  </div>
                ) : reservations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <Calendar className="h-8 w-8" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-foreground">Aucune réservation</h3>
                    <p className="mt-1 text-sm text-muted-foreground max-w-xs">
                      Vous n'avez pas encore effectué de réservation.
                    </p>
                    <Link href="/offers" className="mt-6 rounded-xl bg-[#2563eb] px-6 py-2 text-sm font-bold text-white hover:bg-[#1d4ed8] transition-all">
                      Découvrir les offres
                    </Link>
                  </div>
                ) : (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {reservations.map((res) => (
                      <div
                        key={res.id}
                        onClick={() => {
                          setSelectedOffer(res);
                          setShowDetailModal(true);
                        }}
                        className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg cursor-pointer"
                      >
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <Image
                            src={res.images && res.images.length > 0 ? getFileUrl(res.images[0]) : "/images/placeholder.jpg"}
                            alt={res.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <span
                            className={`absolute top-3 right-3 rounded-full px-2.5 py-1 text-xs font-medium text-white ${res.status === 'confirmed' ? 'bg-green-500' : res.status === 'cancelled' ? 'bg-red-500' : 'bg-amber-500'
                              }`}
                          >
                            {res.status === 'confirmed' ? 'Confirmé' : res.status === 'cancelled' ? 'Annulé' : 'En attente'}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmDelete(res.id);
                            }}
                            className="absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-destructive shadow-md hover:bg-white hover:scale-110 transition-all"
                            aria-label="Supprimer la réservation"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-foreground truncate">
                            {res.title}
                          </h3>
                          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {res.location}
                          </div>
                          <div className="mt-2 flex items-center justify-between border-t border-border pt-3">
                            <div className="flex items-baseline gap-1">
                              <span className="text-lg font-bold text-[#2563eb]">{res.price}</span>
                              <span className="text-xs font-medium text-muted-foreground uppercase">{res.currency}</span>
                            </div>
                            <button className="text-[10px] sm:text-xs font-bold text-[#2563eb] hover:underline">
                              Voir détails
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                    {favorites.length} destinations et expériences sauvegardées.
                  </p>
                </div>
              </div>

              {loadingFavorites ? (
                <div className="flex h-64 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-[#2563eb]" />
                </div>
              ) : favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Heart className="h-8 w-8" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">Aucun favori pour le moment</h3>
                  <p className="mt-1 text-sm text-muted-foreground max-w-xs">
                    Explorez nos offres et cliquez sur le cœur pour les retrouver ici.
                  </p>
                  <Link href="/offers" className="mt-6 rounded-xl bg-[#2563eb] px-6 py-2 text-sm font-bold text-white hover:bg-[#1d4ed8] transition-all">
                    Découvrir les offres
                  </Link>
                </div>
              ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {favorites.map((item) => (
                    <div
                      key={item.id}
                      className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg hover:-translate-y-1"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={item.images && item.images.length > 0 ? getFileUrl(item.images[0]) : "/images/placeholder.jpg"}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <button
                          onClick={() => removeFromFavorites(item.id)}
                          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:scale-110 active:scale-95 transition-all"
                          aria-label={`Retirer ${item.title} des favoris`}
                        >
                          <Heart className="h-4 w-4 fill-current" />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground truncate">
                          {item.title}
                        </h3>
                        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {item.location}
                        </div>
                        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg font-bold text-[#2563eb]">
                              {item.price}
                            </span>
                            <span className="text-xs text-muted-foreground font-bold uppercase">
                              {item.currency}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedOffer(item);
                              setShowDetailModal(true);
                            }}
                            className="rounded-lg bg-[#2563eb] px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#1d4ed8]"
                          >
                            Voir plus
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

      {/* Offer Detail Modal */}
      {showDetailModal && selectedOffer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 overflow-hidden">
          <div className="w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-card shadow-2xl border border-border animate-in zoom-in-95 duration-200">
            {/* Header Sticky */}
            <div className="sticky top-0 z-30 flex items-center justify-between p-4 sm:p-6 border-b border-border bg-card/95 backdrop-blur-sm">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="hidden sm:flex h-12 w-12 rounded-xl bg-[#2563eb]/10 items-center justify-center text-[#2563eb]">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-base sm:text-xl font-bold truncate max-w-[150px] xs:max-w-[200px] sm:max-w-md">
                    {selectedOffer.title}
                  </h2>
                  <p className="text-[10px] sm:text-sm text-muted-foreground capitalize">
                    {selectedOffer.location} • {selectedOffer.type}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const isAlreadyFavorite = favorites.some((fav: any) => fav.id === selectedOffer.id);
                    if (isAlreadyFavorite) {
                      removeFromFavorites(selectedOffer.id);
                    } else {
                      toast.error("Veuillez utiliser la page des offres pour ajouter aux favoris.");
                    }
                  }}
                  className={`h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-xl transition-colors ${favorites.some((fav: any) => fav.id === selectedOffer.id)
                    ? "bg-red-50 text-red-500"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${favorites.some((fav: any) => fav.id === selectedOffer.id) ? "fill-current" : ""}`} />
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-xl hover:bg-muted text-muted-foreground transition-colors"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
              {/* Media Gallery (Preview) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
                <div className="space-y-4">
                  <div className="relative aspect-[16/9] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border border-border group">
                    <img
                      src={selectedOffer.images && selectedOffer.images.length > 0 ? getFileUrl(selectedOffer.images[0]) : "/images/placeholder.jpg"}
                      alt={selectedOffer.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-black/60 backdrop-blur-sm text-white text-[9px] sm:text-[10px] font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full uppercase tracking-wider">
                      {selectedOffer.images?.length || 0} Photos
                    </div>
                  </div>

                  {/* Thumbnail row */}
                  {selectedOffer.images && selectedOffer.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2 sm:gap-3">
                      {selectedOffer.images.slice(1, 5).map((img: string, idx: number) => (
                        <div key={idx} className="aspect-square rounded-lg sm:rounded-xl overflow-hidden border border-border ring-2 ring-transparent hover:ring-[#2563eb] transition-all cursor-pointer">
                          <img
                            src={getFileUrl(img)}
                            className="w-full h-full object-cover"
                            alt="thumb"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedOffer.video && (
                    <div className="rounded-xl sm:rounded-2xl border border-[#2563eb]/20 bg-[#2563eb]/5 p-4 sm:p-6 flex flex-col items-center gap-3 sm:gap-4 text-center">
                      <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-full bg-[#2563eb] text-white flex items-center justify-center shadow-lg shadow-[#2563eb]/30">
                        <Play className="h-4 w-4 sm:h-6 sm:w-6 fill-current" />
                      </div>
                      <div>
                        <p className="text-sm sm:text-base font-bold">Vidéo disponible</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">Découvrez l'offre en mouvement</p>
                      </div>
                      <a
                        href={getFileUrl(selectedOffer.video)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-2 sm:px-6 sm:py-2.5 rounded-lg sm:rounded-xl bg-[#2563eb] text-white text-[11px] sm:text-xs font-bold hover:bg-[#1d4ed8] transition-all"
                      >
                        Regarder la vidéo
                      </a>
                    </div>
                  )}
                </div>

                <div className="space-y-6 sm:space-y-8">
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                      A propos de l'offre
                    </h3>
                    <div className="prose prose-sm text-muted-foreground leading-relaxed text-xs sm:text-sm">
                      {selectedOffer.description || "Aucune description disponible pour le moment."}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-muted/30 border border-border">
                      <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase mb-0.5 sm:mb-1">Prix de base</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base sm:text-xl font-bold text-[#2563eb]">{selectedOffer.price}</span>
                        <span className="text-[10px] sm:text-xs font-bold">{selectedOffer.currency}</span>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-green-500/5 border border-green-500/10">
                      <p className="text-[9px] sm:text-[10px] font-bold text-green-600 uppercase mb-0.5 sm:mb-1">Disponibilité</p>
                      <p className="text-xs sm:text-sm font-bold text-green-700">Immédiate</p>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 rounded-xl sm:rounded-2xl bg-[#2563eb] text-white space-y-4 shadow-xl shadow-[#2563eb]/20">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-white/20 flex items-center justify-center">
                        <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs text-white/70 font-bold uppercase">Réservation</p>
                        <p className="text-xs sm:text-sm font-bold">Planifiez votre visite</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleBooking(selectedOffer.offer_id || selectedOffer.id)}
                      disabled={reservations.some(r => (r.offer_id === (selectedOffer.offer_id || selectedOffer.id)) && r.status !== 'cancelled')}
                      className={`w-full py-3 sm:py-4 rounded-lg sm:rounded-xl text-[12px] sm:text-sm font-bold transition-all flex items-center justify-center gap-2 group ${reservations.some(r => (r.offer_id === (selectedOffer.offer_id || selectedOffer.id)) && r.status !== 'cancelled')
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-white text-[#2563eb] hover:bg-white/90"
                        }`}
                    >
                      {reservations.some(r => (r.offer_id === (selectedOffer.offer_id || selectedOffer.id)) && r.status !== 'cancelled') ? "Déjà réservé" : "Réserver"}
                      {!reservations.some(r => (r.offer_id === (selectedOffer.offer_id || selectedOffer.id)) && r.status !== 'cancelled') && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                    </button>
                    <p className="text-[9px] sm:text-[10px] text-center text-white/60">
                      En cliquant sur le bouton, vous enregistrez votre réservation auprès du partenaire.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 p-4 sm:p-6 border-t border-border bg-card/95 backdrop-blur-sm flex items-center justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full sm:w-auto px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-[12px] sm:text-sm font-bold border border-border hover:bg-muted transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-card shadow-2xl border border-border animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <Trash2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Confirmation de suppression</h3>
              <p className="text-muted-foreground text-sm">
                Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action est irréversible.
              </p>
            </div>
            <div className="flex gap-3 p-6 bg-muted/30 border-t border-border">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setReservationToDelete(null);
                }}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-bold hover:bg-muted transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteReservation}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
