import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Camera, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Edit3, 
  Check,
  X,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { mockCurrentUser } from "../lib/data/mockData";
import BottomNav from "../components/BottomNav";

interface ProfileFormData {
  name: string;
  phone: string;
  email: string;
  address: string;
}

const ProfileEdit = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(mockCurrentUser.avatar || null);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: mockCurrentUser.name || "",
    phone: mockCurrentUser.phone || "",
    email: mockCurrentUser.email || "",
    address: mockCurrentUser.addresses?.[0]?.address || "",
  });
  const [errors, setErrors] = useState<Partial<ProfileFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ProfileFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Le nom doit contenir au moins 2 caractères";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Le téléphone est requis";
    } else if (!/^(\+33|0)[1-9](\s?\d{2}){4}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Format de téléphone invalide";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("L'image ne doit pas dépasser 5 Mo");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target?.result as string);
        toast.success("Photo mise à jour !");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (validateForm()) {
      // Simulate API call
      setIsEditing(false);
      toast.success("Profil mis à jour avec succès !");
    }
  };

  const handleCancel = () => {
    setFormData({
      name: mockCurrentUser.name || "",
      phone: mockCurrentUser.phone || "",
      email: mockCurrentUser.email || "",
      address: mockCurrentUser.addresses?.[0]?.address || "",
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="profile-edit-page">
      {/* Header */}
      <header className="profile-edit-header">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="profile-edit-header__back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="profile-edit-header__title">Mon Profil</h1>
        <div className="profile-edit-header__actions">
          {isEditing ? (
            <>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleCancel}
                className="profile-edit-header__cancel"
              >
                <X className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleSave}
                className="profile-edit-header__save"
              >
                <Check className="w-5 h-5" />
              </Button>
            </>
          ) : (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsEditing(true)}
            >
              <Edit3 className="w-5 h-5" />
            </Button>
          )}
        </div>
      </header>

      <div className="profile-edit-content">
        {/* Avatar Section */}
        <section className="profile-avatar-section">
          <div className="profile-avatar" onClick={handleAvatarClick}>
            {avatar ? (
              <img src={avatar} alt="Avatar" className="profile-avatar__image" />
            ) : (
              <div className="profile-avatar__placeholder">
                <User className="w-12 h-12" />
              </div>
            )}
            <div className="profile-avatar__overlay">
              <Camera className="w-6 h-6" />
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="profile-avatar__input"
          />
          <p className="profile-avatar__hint">Appuyez pour changer la photo</p>
        </section>

        {/* Form Section */}
        <section className="profile-form-section">
          <div className="profile-form-card">
            {/* Name Field */}
            <div className="profile-form-field">
              <label className="profile-form-field__label">
                <User className="w-4 h-4" />
                Nom complet
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={!isEditing}
                className={`profile-form-field__input ${errors.name ? 'profile-form-field__input--error' : ''}`}
                placeholder="Votre nom complet"
              />
              {errors.name && <span className="profile-form-field__error">{errors.name}</span>}
            </div>

            {/* Phone Field */}
            <div className="profile-form-field">
              <label className="profile-form-field__label">
                <Phone className="w-4 h-4" />
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={!isEditing}
                className={`profile-form-field__input ${errors.phone ? 'profile-form-field__input--error' : ''}`}
                placeholder="+33 6 12 34 56 78"
              />
              {errors.phone && <span className="profile-form-field__error">{errors.phone}</span>}
            </div>

            {/* Email Field */}
            <div className="profile-form-field">
              <label className="profile-form-field__label">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={!isEditing}
                className={`profile-form-field__input ${errors.email ? 'profile-form-field__input--error' : ''}`}
                placeholder="votre@email.com"
              />
              {errors.email && <span className="profile-form-field__error">{errors.email}</span>}
            </div>

            {/* Address Field */}
            <div className="profile-form-field">
              <label className="profile-form-field__label">
                <MapPin className="w-4 h-4" />
                Adresse principale
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                disabled={!isEditing}
                className="profile-form-field__input"
                placeholder="Votre adresse"
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="profile-stats-section">
          <h2 className="profile-stats-section__title">Statistiques</h2>
          <div className="profile-stats-grid">
            <div className="profile-stat-card">
              <span className="profile-stat-card__value">12</span>
              <span className="profile-stat-card__label">Commandes</span>
            </div>
            <div className="profile-stat-card">
              <span className="profile-stat-card__value">156€</span>
              <span className="profile-stat-card__label">Total dépensé</span>
            </div>
            <div className="profile-stat-card">
              <span className="profile-stat-card__value">4.8</span>
              <span className="profile-stat-card__label">Note moyenne</span>
            </div>
          </div>
        </section>

        {/* Actions Section */}
        <section className="profile-actions-section">
          <Button 
            variant="outline" 
            className="profile-action-btn"
            onClick={() => navigate("/change-password")}
          >
            Changer le mot de passe
          </Button>
          <Button 
            variant="outline" 
            className="profile-action-btn profile-action-btn--danger"
            onClick={() => toast.info("Fonctionnalité à venir")}
          >
            Supprimer mon compte
          </Button>
        </section>
      </div>

      <BottomNav />
    </div>
  );
};

export default ProfileEdit;
