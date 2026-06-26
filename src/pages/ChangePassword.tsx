import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Eye, EyeOff, Check, X, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';
import { cn } from '../lib/utils';
import BottomNav from '../components/BottomNav';

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  { label: 'Au moins 8 caractères', test: (p) => p.length >= 8 },
  { label: 'Une lettre majuscule', test: (p) => /[A-Z]/.test(p) },
  { label: 'Une lettre minuscule', test: (p) => /[a-z]/.test(p) },
  { label: 'Un chiffre', test: (p) => /\d/.test(p) },
  { label: 'Un caractère spécial (!@#$%^&*)', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

const ChangePassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({ currentPassword: false, newPassword: false, confirmPassword: false });

  const passedCount = passwordRequirements.filter(r => r.test(newPassword)).length;
  const strength =
    passedCount <= 2 ? { label: 'Faible', color: 'bg-destructive', text: 'text-destructive' } :
    passedCount <= 4 ? { label: 'Moyen', color: 'bg-warning', text: 'text-warning' } :
                       { label: 'Fort', color: 'bg-success', text: 'text-success' };

  const allRequirementsMet = passedCount === passwordRequirements.length;
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
  const isFormValid = currentPassword.length > 0 && allRequirementsMet && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      toast({ title: "Erreur de validation", description: "Veuillez corriger les erreurs.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast({ title: "Mot de passe modifié", description: "Votre mot de passe a été mis à jour." });
    navigate('/settings');
  };

  const PasswordInput = ({
    id, value, onChange, show, setShow, placeholder, onBlur,
  }: {
    id: string; value: string; onChange: (v: string) => void; show: boolean;
    setShow: (b: boolean) => void; placeholder: string; onBlur?: () => void;
  }) => (
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className="pl-10 pr-10"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="container max-w-md mx-auto flex items-center gap-3 h-16 px-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display font-bold text-lg flex-1 text-center">Changer le mot de passe</h1>
          <div className="w-9" />
        </div>
      </header>

      <div className="container max-w-md mx-auto px-4 py-6">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-3 shadow-soft">
            <Shield className="w-8 h-8" />
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            Créez un mot de passe fort pour sécuriser votre compte
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="currentPassword">Mot de passe actuel</Label>
            <PasswordInput
              id="currentPassword"
              value={currentPassword}
              onChange={setCurrentPassword}
              show={showCurrent}
              setShow={setShowCurrent}
              placeholder="Entrez votre mot de passe actuel"
              onBlur={() => setTouched({ ...touched, currentPassword: true })}
            />
            {touched.currentPassword && currentPassword.length === 0 && (
              <span className="text-xs text-destructive">Ce champ est requis</span>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="newPassword">Nouveau mot de passe</Label>
            <PasswordInput
              id="newPassword"
              value={newPassword}
              onChange={setNewPassword}
              show={showNew}
              setShow={setShowNew}
              placeholder="Créez un nouveau mot de passe"
              onBlur={() => setTouched({ ...touched, newPassword: true })}
            />

            {newPassword.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn("h-full transition-all", strength.color)}
                    style={{ width: `${(passedCount / passwordRequirements.length) * 100}%` }}
                  />
                </div>
                <span className={cn("text-xs font-semibold", strength.text)}>{strength.label}</span>
              </div>
            )}

            {touched.newPassword && (
              <div className="grid gap-1.5 mt-3 p-3 rounded-lg bg-muted/50">
                {passwordRequirements.map((req, index) => {
                  const passed = req.test(newPassword);
                  return (
                    <div key={index} className={cn("flex items-center gap-2 text-xs", passed ? "text-success" : "text-muted-foreground")}>
                      {passed ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      <span>{req.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <PasswordInput
              id="confirmPassword"
              value={confirmPassword}
              onChange={setConfirmPassword}
              show={showConfirm}
              setShow={setShowConfirm}
              placeholder="Confirmez votre nouveau mot de passe"
              onBlur={() => setTouched({ ...touched, confirmPassword: true })}
            />
            {touched.confirmPassword && confirmPassword.length > 0 && !passwordsMatch && (
              <span className="text-xs text-destructive">Les mots de passe ne correspondent pas</span>
            )}
            {passwordsMatch && (
              <span className="text-xs text-success">Les mots de passe correspondent</span>
            )}
          </div>

          <Button type="submit" disabled={!isFormValid || isLoading} className="w-full">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Modification en cours...
              </span>
            ) : 'Modifier le mot de passe'}
          </Button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
};

export default ChangePassword;
