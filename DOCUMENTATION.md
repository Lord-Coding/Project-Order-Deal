# Order Deal — Documentation technique

> Application de commande et livraison de plats (Tacos, Burgers, Poulet…) construite avec **React + Vite + TypeScript + Tailwind + shadcn/ui**, pensée pour migration **Capacitor / Ionic**.

---

## 1. Vue d'ensemble

**Order Deal** est une application mono-restaurant à plusieurs rôles :

| Rôle        | Accès           | Authentification               | Dashboard           |
| ----------- | --------------- | ------------------------------ | ------------------- |
| `client`    | Catalogue, panier, commandes, suivi | Téléphone + OTP (démo `123456`) | `/`                 |
| `admin`     | Pilotage global | Email + mot de passe           | `/admin`            |
| `personnel` | Cuisine (kanban)| Email + mot de passe           | `/kitchen`          |
| `livreur`   | Livraisons      | Email + mot de passe           | `/delivery`         |

L'accès staff est **masqué** : il s'ouvre uniquement lorsque l'utilisateur saisit le numéro secret `+242 06 680 34 15` dans le champ téléphone de `/auth`.

Langue de l'interface : **français uniquement**.

---

## 2. Stack technique

- **Framework** : React 18, Vite 5, TypeScript 5
- **UI** : Tailwind CSS v3 + shadcn/ui (Radix) + lucide-react
- **Styles** : Tailwind en priorité ; SCSS legacy isolé dans `src/styles/`
- **Routing** : `react-router-dom` v6
- **State** : Context API (`AuthContext`, `CartContext`, `ThemeContext`)
- **Données** : `@tanstack/react-query` + mocks (`src/data/mockData.ts`)
- **Notifications** : `sonner` (toasts top)
- **Backend prévu** : Firebase (auth/db), Cloudinary (médias) — non actif en démo
- **Mobile** : Capacitor (config dans `capacitor.config.json`) — migration Ionic planifiée

---

## 3. Arborescence

```
src/
├── App.tsx                  # Providers + Router
├── main.tsx                 # Entry point
├── index.css                # Tokens globaux (HSL), couches Tailwind
├── components/
│   ├── ui/                  # shadcn/ui
│   ├── ProtectedRoute.tsx   # Guard rôles + auth
│   ├── BottomNav.tsx        # Tab bar mobile
│   ├── Header.tsx, FoodCard.tsx, HeroBanner.tsx, ...
│   └── skeletons/
├── contexts/
│   ├── AuthContext.tsx      # Session + persistance localStorage
│   ├── CartContext.tsx
│   └── ThemeContext.tsx     # light / dark
├── pages/
│   ├── Welcome.tsx, Auth.tsx, Index.tsx
│   ├── Cart.tsx, Explore.tsx, Orders.tsx, Profile.tsx, FoodDetail.tsx
│   ├── admin/Dashboard.tsx
│   ├── personnel/Kitchen.tsx
│   └── livreur/Delivery.tsx
├── data/mockData.ts         # Plats, restaurants, utilisateurs démo
├── models/                  # Types TS partagés
├── services/                # Firebase, Cloudinary (placeholders)
├── config/                  # Firebase + Cloudinary config
├── hooks/
└── styles/                  # SCSS legacy (en cours de migration)
```

---

## 4. Authentification

### 4.1 Flux client (téléphone + OTP)

1. L'utilisateur saisit son numéro sur `/auth`.
2. `loginWithOTP(phone)` envoie un code (mock).
3. `verifyOTP(phone, code)` valide ; code démo : **`123456`**.
4. Redirection vers `/`.

### 4.2 Flux staff (caché)

- Déclencheur : saisir `+242066803415` (tolérant espaces, tirets, points, parenthèses).
- Un `Sheet` s'ouvre → email + mot de passe.
- Le rôle est **déduit automatiquement** :
  - `admin@…` → `admin`
  - `cuisine@…` → `personnel`
  - `livr…@…` → `livreur`
  - Tout autre email reste `client` et est **refusé** ici.
- Redirection automatique vers le dashboard du rôle.

### 4.3 Persistance

`AuthContext` lit/écrit `localStorage["orderdeal-auth-user"]`. La session survit au reload et à la fermeture du navigateur.

### 4.4 Messages d'erreur

Tous les cas sont distingués (email requis / format invalide / mot de passe court / identifiants incorrects / rôle refusé / numéro secret non reconnu → simple validation numéro). Voir `src/pages/Auth.tsx`.

---

## 5. Protection des routes

Toutes les routes applicatives sont enveloppées dans `<ProtectedRoute>`. Le composant fait une **redirection avant rendu** (`<Navigate replace />`), donc aucune page protégée n'apparaît, même partiellement, avant authentification.

```tsx
<Route path="/food/:id" element={
  <ProtectedRoute><FoodDetail /></ProtectedRoute>
} />
```

Avec `allowedRoles`, un mauvais rôle est redirigé vers son propre dashboard.

| Route                   | Auth requise | Rôles autorisés        |
| ----------------------- | ------------ | ---------------------- |
| `/welcome`, `/auth`     | Non          | —                      |
| `/`, `/cart`, `/explore`, `/favorites`, `/orders` | Oui | `client` |
| `/food/:id`, `/restaurant/:id`, `/tracking/:id`, `/profile`, `/notifications`, `/support`, `/settings`, `/addresses`, `/profile/edit`, `/change-password`, `/reviews` | Oui | Tous |
| `/admin`                | Oui          | `admin`                |
| `/kitchen`              | Oui          | `personnel`            |
| `/delivery`             | Oui          | `livreur`              |

---

## 6. Thème (light / dark)

- Géré par `ThemeContext`, persistance `localStorage["orderdeal-theme"]`.
- Valeurs : `light` | `dark` (**jamais `system`**).
- Toutes les couleurs sont des **tokens HSL** dans `src/index.css` (`--background`, `--foreground`, `--primary`, `--card`, `--border`, …).
- Les composants utilisent des classes sémantiques (`bg-background`, `text-foreground`, `bg-card`, `border-border`). Aucune classe brute (`text-white`, `bg-black`) n'est tolérée.

---

## 7. Responsive

- Mobile-first. Conteneur principal : `max-w-md sm:max-w-2xl lg:max-w-4xl mx-auto px-4`.
- Bottom nav fixe sur mobile, masquée ≥ `lg`.
- Page Auth en **split-screen** ≥ `lg` (panneau visuel + formulaire).
- Grilles : `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4` pour les listes de plats.

---

## 8. Données démo

`src/data/mockData.ts` expose :

- `mockUsers` (un par rôle)
- `mockFoods` (catalogue, +30 plats)
- `mockRestaurants`, `mockOrders`, `mockReviews`, `mockNotifications`
- Types : `UserRole`, `Food`, `Restaurant`, `Order`, …

Aucune API réelle n'est appelée en démo.

---

## 9. Commandes

```bash
npm install        # installation
npm run dev        # serveur de dev (http://localhost:8080)
npm run build      # build de production
npm run preview    # preview du build
npm run lint       # ESLint
```

Capacitor (mobile) :

```bash
npx cap sync
npx cap open ios       # ou android
```

---

## 10. Conventions de code

- **TypeScript strict** sur les nouveaux fichiers.
- Imports absolus via alias `@/` (`vite.config.ts`).
- **Composants UI** : préférer shadcn/ui ; pas de réécriture de primitive.
- **Couleurs** : tokens sémantiques uniquement.
- **i18n** : tout le texte utilisateur en **français**.
- **Toasts** : `sonner`, position top.
- **SCSS legacy** : à migrer progressivement vers Tailwind. Ne pas ré-introduire de surcharges `bg-*` / `text-*` qui écraseraient Tailwind.

---

## 11. Sécurité

- Les rôles ne sont **jamais** stockés en `localStorage` côté client comme source de vérité d'autorisation (la persistance actuelle est une **démo** ; en production, utiliser un backend avec une table `user_roles` séparée et RLS).
- Inputs validés via regex / `zod` quand pertinent.
- Aucun secret commité.

---

## 12. Roadmap

- [ ] Brancher Firebase Auth (téléphone réel + email/password staff)
- [ ] Cloudinary pour les médias produits
- [ ] Migration progressive vers Ionic Components
- [ ] Suppression complète du SCSS legacy
- [ ] Tests E2E (Playwright) sur les parcours critiques

---

_Dernière mise à jour : juin 2026._
