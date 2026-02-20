# Portfolio Automatisé — PAKOU Komi Juste

Portfolio moderne et dynamique conçu avec **Angular 19**, doté d'effets de particules **Antigravity** et d'une automatisation complète pour la récupération des projets et certifications.

![Aperçu du Portfolio](src/assets/images/preview.png)

## 🚀 Fonctionnalités

-   **Automatisation Totale** : Synchronisation quotidienne des dépôts **GitHub**, projets **GitLab** et badges **Credly**.
-   **Design Moderne** : Palette de couleurs inspirée par "Fundamentals of Software Engineering", effets de glassmorphisme et animations fluides.
-   **Effet Antigravity** : Arrière-plan de particules interactives propulsé par `tsParticles`.
-   **Architecture Modulaire** : Composants standalone, services réactifs et typage TypeScript strict.
-   **Performance & SEO** : Score Lighthouse optimisé, méta-tags dynamiques et chargement différé (Lazy-loading).
-   **Déploiement Continu** : CI/CD via **GitHub Actions** vers **Vercel**.

## 🛠️ Stack Technique

-   **Frontend** : Angular 19 (Signals, Standalone Components)
-   **Styles** : SCSS (Variables, Mixins, Animations)
-   **Effets** : tsParticles
-   **Automation** : Node.js Scripts (GitHub/GitLab/Credly APIs)
-   **Déploiement** : GitHub Actions, Vercel

## 📦 Installation & Configuration

### 1. Cloner le projet
```bash
git clone https://github.com/juste120/portfolio.git
cd portfolio
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Variables d'environnement (GitHub Secrets)
Pour l'automatisation via GitHub Actions, configurez les secrets suivants :
-   `VERCEL_TOKEN`: Token d'accès Vercel.
-   `GITHUB_USERNAME`: Votre nom d'utilisateur GitHub.
-   `GITLAB_USERNAME`: Votre nom d'utilisateur GitLab.
-   `GITLAB_TOKEN`: Token d'accès GitLab (si privé).
-   `CREDLY_USER_ID`: Votre UUID Credly.

## 🏃 Développement

Lancer le serveur de développement :
```bash
ng serve
```

Mettre à jour les données manuellement :
```bash
npm run update:all
```

## 🏗️ Build & Déploiement

Le build est géré automatiquement par GitHub Actions à chaque push sur `main`.
Pour une build locale :
```bash
npm run build:prod
```

## 📄 Licence

Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.

---
Conçu avec ❤️ par [PAKOU Komi Juste](mailto:pakoujuste2019@gmail.com)
