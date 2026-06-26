import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { isDark, setTheme } = useTheme();

  const handleToggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <Button 
      variant="icon" 
      size="icon-sm" 
      className="theme-toggle-button" 
      onClick={handleToggle}
      aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
    >
      <Sun 
        className={`theme-toggle-icon theme-toggle-icon--sun ${isDark ? 'theme-toggle-icon--hidden' : ''}`} 
      />
      <Moon 
        className={`theme-toggle-icon theme-toggle-icon--moon absolute ${!isDark ? 'theme-toggle-icon--hidden' : ''}`} 
      />
    </Button>
  );
};

export default ThemeToggle;
