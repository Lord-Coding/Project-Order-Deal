import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Sun, Moon, Bell, BellOff, Globe,
  Lock, Trash2, Info, ChevronRight, Smartphone,
  Eye, EyeOff, Volume2, VolumeX,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { Card } from "../components/ui/card";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import BottomNav from "../components/BottomNav";

const sectionVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

interface SettingRowProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}

const SettingRow = ({ icon, title, description, action, onClick, danger }: SettingRowProps) => (
  <motion.div
    variants={itemVariants}
    whileHover={onClick ? { backgroundColor: "hsl(var(--muted)/0.5)" } : undefined}
    whileTap={onClick ? { scale: 0.99 } : undefined}
    onClick={onClick}
    className={`flex items-center gap-3 p-3 sm:p-4 transition-colors ${onClick ? "cursor-pointer" : ""}`}
  >
    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${
      danger ? "bg-destructive/10 text-destructive" : "bg-muted text-foreground/70"
    }`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className={`font-semibold text-sm ${danger ? "text-destructive" : ""}`}>{title}</p>
      {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
    {onClick && !action && <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
  </motion.div>
);

const Settings = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [notifications,    setNotifications]    = useState(true);
  const [soundEnabled,     setSoundEnabled]      = useState(true);
  const [locationEnabled,  setLocationEnabled]   = useState(true);
  const [biometricEnabled, setBiometricEnabled]  = useState(false);

  return (
    <div className="settings-page min-h-screen bg-background pb-28">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border"
      >
        <div className="w-full max-w-md sm:max-w-2xl lg:max-w-4xl mx-auto flex items-center gap-3 h-14 sm:h-16 px-4 sm:px-6">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-display font-bold text-lg flex-1">Paramètres</h1>
        </div>
      </motion.header>

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="show"
        className="w-full max-w-md sm:max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 py-5 space-y-5"
      >
        {/* Theme */}
        <motion.section variants={itemVariants}>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-1">
            Apparence
          </p>
          <Card className="p-4 sm:p-5">
            <p className="text-sm font-semibold mb-3">Thème de l'application</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "light" as const, icon: Sun,  label: "Clair" },
                { value: "dark"  as const, icon: Moon, label: "Sombre" },
              ].map((opt) => (
                <motion.button
                  key={opt.value}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setTheme(opt.value)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                    theme === opt.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted/40 text-foreground/70 hover:border-primary/40"
                  }`}
                >
                  <opt.icon className="w-4 h-4 shrink-0" />
                  {opt.label}
                </motion.button>
              ))}
            </div>
          </Card>
        </motion.section>

        {/* Notifications */}
        <motion.section variants={itemVariants}>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-1">
            Notifications
          </p>
          <Card className="divide-y divide-border overflow-hidden">
            <SettingRow
              icon={notifications ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
              title="Notifications push"
              description="Recevoir des alertes sur vos commandes"
              action={<Switch checked={notifications} onCheckedChange={setNotifications} />}
            />
            <SettingRow
              icon={soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              title="Sons"
              description="Activer les sons de notification"
              action={<Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />}
            />
          </Card>
        </motion.section>

        {/* Privacy */}
        <motion.section variants={itemVariants}>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-1">
            Confidentialité & Sécurité
          </p>
          <Card className="divide-y divide-border overflow-hidden">
            <SettingRow
              icon={locationEnabled ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              title="Localisation"
              description="Permettre l'accès à votre position"
              action={<Switch checked={locationEnabled} onCheckedChange={setLocationEnabled} />}
            />
            <SettingRow
              icon={<Smartphone className="w-5 h-5" />}
              title="Authentification biométrique"
              description="Face ID ou empreinte digitale"
              action={<Switch checked={biometricEnabled} onCheckedChange={setBiometricEnabled} />}
            />
            <SettingRow
              icon={<Lock className="w-5 h-5" />}
              title="Changer le mot de passe"
              onClick={() => navigate("/change-password")}
            />
          </Card>
        </motion.section>

        {/* Language */}
        <motion.section variants={itemVariants}>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-1">
            Langue & Région
          </p>
          <Card className="divide-y divide-border overflow-hidden">
            <SettingRow
              icon={<Globe className="w-5 h-5" />}
              title="Langue"
              description="Français"
              onClick={() => {}}
            />
          </Card>
        </motion.section>

        {/* About */}
        <motion.section variants={itemVariants}>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-1">
            À propos
          </p>
          <Card className="divide-y divide-border overflow-hidden">
            <SettingRow
              icon={<Info className="w-5 h-5" />}
              title="Version de l'application"
              description="1.0.0"
            />
          </Card>
        </motion.section>

        {/* Danger zone */}
        <motion.section variants={itemVariants}>
          <p className="text-xs font-bold text-destructive/70 uppercase tracking-wider mb-3 px-1">
            Zone de danger
          </p>
          <Card className="divide-y divide-border overflow-hidden border-destructive/20">
            <SettingRow
              icon={<Trash2 className="w-5 h-5" />}
              title="Supprimer mon compte"
              description="Cette action est irréversible"
              onClick={() => {}}
              danger
            />
          </Card>
        </motion.section>
      </motion.div>

      <BottomNav />
    </div>
  );
};

export default Settings;
