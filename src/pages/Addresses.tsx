import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, MapPin, Edit2, Trash2, Home, Briefcase, Star, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import BottomNav from "../components/BottomNav";

interface Address {
  id: string;
  label: string;
  type: "home" | "work" | "other";
  address: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
  instructions?: string;
}

const initialAddresses: Address[] = [
  {
    id: "1",
    label: "Maison",
    type: "home",
    address: "123 Rue de la Paix",
    city: "Paris",
    postalCode: "75001",
    isDefault: true,
    instructions: "Code: 1234, 3ème étage gauche"
  },
  {
    id: "2",
    label: "Bureau",
    type: "work",
    address: "45 Avenue des Champs-Élysées",
    city: "Paris",
    postalCode: "75008",
    isDefault: false,
  },
];

const Addresses = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState<Omit<Address, 'id' | 'isDefault'>>({
    label: "",
    type: "home",
    address: "",
    city: "",
    postalCode: "",
    instructions: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  const getTypeIcon = (type: Address["type"]) => {
    switch (type) {
      case "home": return <Home className="w-5 h-5" />;
      case "work": return <Briefcase className="w-5 h-5" />;
      default: return <MapPin className="w-5 h-5" />;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    
    if (!formData.label.trim()) newErrors.label = "Le nom est requis";
    if (!formData.address.trim()) newErrors.address = "L'adresse est requise";
    if (!formData.city.trim()) newErrors.city = "La ville est requise";
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Le code postal est requis";
    } else if (!/^\d{5}$/.test(formData.postalCode)) {
      newErrors.postalCode = "Code postal invalide (5 chiffres)";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setFormData({
      label: "",
      type: "home",
      address: "",
      city: "",
      postalCode: "",
      instructions: "",
    });
    setErrors({});
  };

  const handleEdit = (address: Address) => {
    setIsEditing(address.id);
    setFormData({
      label: address.label,
      type: address.type,
      address: address.address,
      city: address.city,
      postalCode: address.postalCode,
      instructions: address.instructions || "",
    });
    setErrors({});
  };

  const handleSave = () => {
    if (!validateForm()) return;

    if (isAddingNew) {
      const newAddress: Address = {
        id: Date.now().toString(),
        ...formData,
        isDefault: addresses.length === 0,
      };
      setAddresses([...addresses, newAddress]);
      toast.success("Adresse ajoutée avec succès !");
    } else if (isEditing) {
      setAddresses(addresses.map(addr => 
        addr.id === isEditing 
          ? { ...addr, ...formData }
          : addr
      ));
      toast.success("Adresse modifiée avec succès !");
    }

    setIsAddingNew(false);
    setIsEditing(null);
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setIsEditing(null);
    setErrors({});
  };

  const handleDelete = (id: string) => {
    const addressToDelete = addresses.find(a => a.id === id);
    setAddresses(addresses.filter(addr => addr.id !== id));
    
    if (addressToDelete?.isDefault && addresses.length > 1) {
      setAddresses(prev => {
        const remaining = prev.filter(a => a.id !== id);
        if (remaining.length > 0) {
          remaining[0].isDefault = true;
        }
        return remaining;
      });
    }
    
    toast.success("Adresse supprimée");
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    toast.success("Adresse par défaut mise à jour");
  };

  const renderForm = () => (
    <div className="address-form">
      <div className="address-form__field">
        <label className="address-form__label">Nom de l'adresse</label>
        <input
          type="text"
          value={formData.label}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          className={`address-form__input ${errors.label ? 'address-form__input--error' : ''}`}
          placeholder="Ex: Maison, Bureau..."
        />
        {errors.label && <span className="address-form__error">{errors.label}</span>}
      </div>

      <div className="address-form__field">
        <label className="address-form__label">Type</label>
        <div className="address-form__types">
          {(['home', 'work', 'other'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData({ ...formData, type })}
              className={`address-form__type ${formData.type === type ? 'address-form__type--active' : ''}`}
            >
              {getTypeIcon(type)}
              <span>{type === 'home' ? 'Maison' : type === 'work' ? 'Bureau' : 'Autre'}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="address-form__field">
        <label className="address-form__label">Adresse</label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className={`address-form__input ${errors.address ? 'address-form__input--error' : ''}`}
          placeholder="Numéro et nom de rue"
        />
        {errors.address && <span className="address-form__error">{errors.address}</span>}
      </div>

      <div className="address-form__row">
        <div className="address-form__field">
          <label className="address-form__label">Ville</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className={`address-form__input ${errors.city ? 'address-form__input--error' : ''}`}
            placeholder="Paris"
          />
          {errors.city && <span className="address-form__error">{errors.city}</span>}
        </div>
        <div className="address-form__field">
          <label className="address-form__label">Code postal</label>
          <input
            type="text"
            value={formData.postalCode}
            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
            className={`address-form__input ${errors.postalCode ? 'address-form__input--error' : ''}`}
            placeholder="75001"
            maxLength={5}
          />
          {errors.postalCode && <span className="address-form__error">{errors.postalCode}</span>}
        </div>
      </div>

      <div className="address-form__field">
        <label className="address-form__label">Instructions de livraison (optionnel)</label>
        <textarea
          value={formData.instructions}
          onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
          className="address-form__textarea"
          placeholder="Code d'entrée, étage, instructions particulières..."
          rows={3}
        />
      </div>

      <div className="address-form__actions">
        <Button variant="outline" onClick={handleCancel}>
          Annuler
        </Button>
        <Button onClick={handleSave}>
          <Check className="w-4 h-4 mr-2" />
          Enregistrer
        </Button>
      </div>
    </div>
  );

  return (
    <div className="addresses-page">
      {/* Header */}
      <header className="addresses-header">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="addresses-header__back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="addresses-header__title">Mes Adresses</h1>
        <div className="addresses-header__spacer" />
      </header>

      <div className="addresses-content">
        {/* Add New Button */}
        {!isAddingNew && !isEditing && (
          <Button 
            variant="outline" 
            className="addresses-add-btn"
            onClick={handleAddNew}
          >
            <Plus className="w-5 h-5 mr-2" />
            Ajouter une nouvelle adresse
          </Button>
        )}

        {/* Add/Edit Form */}
        {(isAddingNew || isEditing) && (
          <div className="addresses-form-card">
            <h2 className="addresses-form-card__title">
              {isAddingNew ? "Nouvelle adresse" : "Modifier l'adresse"}
            </h2>
            {renderForm()}
          </div>
        )}

        {/* Address List */}
        {!isAddingNew && !isEditing && (
          <div className="addresses-list">
            {addresses.map((address) => (
              <div key={address.id} className="address-card">
                <div className="address-card__header">
                  <div className="address-card__icon">
                    {getTypeIcon(address.type)}
                  </div>
                  <div className="address-card__info">
                    <div className="address-card__label">
                      {address.label}
                      {address.isDefault && (
                        <span className="address-card__default">
                          <Star className="w-3 h-3" />
                          Par défaut
                        </span>
                      )}
                    </div>
                    <p className="address-card__address">
                      {address.address}
                    </p>
                    <p className="address-card__city">
                      {address.postalCode} {address.city}
                    </p>
                    {address.instructions && (
                      <p className="address-card__instructions">
                        {address.instructions}
                      </p>
                    )}
                  </div>
                </div>
                <div className="address-card__actions">
                  {!address.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                      className="address-card__action"
                    >
                      <Star className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(address)}
                    className="address-card__action"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(address.id)}
                    className="address-card__action address-card__action--danger"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            {addresses.length === 0 && (
              <div className="addresses-empty">
                <MapPin className="addresses-empty__icon" />
                <p className="addresses-empty__text">Aucune adresse enregistrée</p>
                <p className="addresses-empty__hint">Ajoutez votre première adresse de livraison</p>
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Addresses;
