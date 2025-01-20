MEMORY[forgot_password_design]: Design moderne pour la page de mot de passe oublié :

1. Arrière-plan :
- Image SVG personnalisée avec motif géométrique subtil (hero-pattern.svg)
- Cercles flous animés avec effet de mélange et animation blob
- Overlay avec léger flou et dégradé

2. Carte principale :
- Fond blanc semi-transparent (bg-white/90)
- Effet glassmorphism avec backdrop-blur-md
- Ombre portée prononcée (shadow-2xl)
- Bordure subtile (border-white/20)

3. Éléments visuels :
- Icône de cadenas rotative dans un carré avec dégradé
- Titre avec dégradé de texte (from-indigo-600 to-purple-600)
- Bouton avec dégradé et animation de rebond au survol
- Icône de retour avec animation de translation

4. Animations Tailwind :
- animate-blob pour les cercles flous
- hover:animate-slight-bounce pour le bouton
- Délais d'animation personnalisés [animation-delay:2s]

5. Configuration Tailwind nécessaire :
- Keyframes pour blob et slight-bounce
- Extensions de thème pour les animations
- Gestion des transparences et des flous
