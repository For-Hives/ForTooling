---
description: 
globs: 
alwaysApply: true
---
## 1. Contexte et problématique générale

### 1.1 Problématique adressée

De nombreuses entreprises possèdent et gèrent un parc d'équipements qu'elles doivent suivre, attribuer et entretenir. Ces équipements peuvent représenter plusieurs dizaines à centaines d'articles différents (outils, matériel technique, appareils spécialisés, etc.).

Les systèmes traditionnels de gestion présentent des lacunes importantes :

- Suivi manuel chronophage et source d'erreurs
- Difficulté à localiser rapidement les équipements
- Absence d'historique fiable des mouvements et utilisations
- Complexité pour gérer les attributions
- Manque de visibilité globale sur l'état du parc
- Coût très elevé pour des balises gps précies (e.g hilti etc)
- Impossibilité d'appliquer ça sur des éléments autres

## 2. Objectifs de la plateforme SaaS

Développer une plateforme SaaS de gestion d'équipements qui permettra de :

- Centraliser l'inventaire complet du parc matériel
- Suivre la localisation de chaque équipement en temps réel grâce à des étiquettes nfc/qr
- Gérer l'attribution des équipements aux utilisateurs et aux projets/emplacements
- Automatiser la détection des entrées/sorties d'équipements via des points de scan
- Conserver l'historique de tous les mouvements et utilisations
- Fournir des analyses et statistiques d'utilisation avancées
- Offrir une solution adaptable à différents secteurs d'activité

## 3. Besoins fonctionnels détaillés

### 3.1 Gestion multi-organisations

- Support de plusieurs organisations clientes avec isolation complète des données
- Paramétrage par organisation (terminologie, champs personnalisés, flux de travail)
- Gestion des rôles et permissions par organisation

### 3.2 Gestion des équipements

- Inventaire complet avec informations détaillées :
  - Référence unique et code NFC/qr associé
  - Nom et description
  - Date d'acquisition et valeur
  - État et niveau d'usure
  - Spécifications techniques (type, marque, modèle, etc.)
  - Catégorie de rattachement
  - Champs personnalisables selon le secteur d'activité
- Création, modification et suppression d'équipements
- Association d'un équipement à une catégorie spécifique
- Support pour documentation technique, photos et fichiers associés
- Gestion des maintenances préventives et curatives

### 3.3 Suivi automatisé par NFC // ou SCAN QR Code

- Intégration avec des étiquettes nfc/qr à faible coût / ou équivalent
- Points de scan aux entrées/sorties des zones de stockage
- Scan mobile via smartphones/tablettes pour vérification terrain
- Détection automatique des mouvements d'équipements
- Alertes en cas de sortie non autorisée
  - mail
  - sms
  - alerte perso
- Cartographie des dernières localisations connues

### 3.4 Gestion des affectations

- Attribution d'équipements à :
  - Un utilisateur/employé
  - Un projet/chantier
  - Un emplacement physique
- Enregistrement des dates de début et fin d'affectation
- Affectation groupée de plusieurs équipements simultanément
- Workflows d'approbation configurables
- Historique complet des affectations

### 3.5 Gestion des utilisateurs

- Enregistrement des informations sur les utilisateurs :
  - Profil complet (nom, prénom, contact, etc.)
  - Rôle et permissions dans le système
  - Département/équipe de rattachement
- Suivi des équipements attribués à chaque utilisateur
- Gestion des accès par niveau de permission

### 3.6 Gestion des projets/emplacements/chantiers

- Structure flexible adaptable selon les besoins :
  - Projets temporaires avec dates de début/fin
  - Emplacements physiques permanents
  - Zones géographiques
- Hiérarchisation possible (bâtiment > étage > pièce)
- Géolocalisation et cartographie
- Suivi des équipements affectés

### 3.7 Catégorisation des équipements

- Système de catégories et sous-catégories multiniveau
- Attributs spécifiques par catégorie d'équipement
- Système de préfixage automatique des références
- Organisation logique adaptée au secteur d'activité

### 3.8 Analyses et statistiques avancées

- Dashboard personnalisable avec indicateurs clés
- Rapports sur les taux d'utilisation des équipements
- Analyses prédictives pour planification des besoins
- Alertes sur équipements sous-utilisés ou sur-utilisés
- Statistiques par utilisateur, projet, catégorie et équipement
- Rapports exportables dans différents formats

### 3.9 Intégration et API

- API REST complète pour intégration avec d'autres systèmes
- Intégration possible avec des ERP, GMAO, ou logiciels comptables
- Export/import de données en différents formats
- Webhooks pour événements système

## 4. Description fonctionnelle détaillée

### 4.1 Structure générale

- Interface responsive accessible sur tous supports
- Cinq modules principaux : Utilisateurs, Projets/Emplacements, Catégories, Équipements, Affectations
- Navigation intuitive avec accès contextuel aux fonctionnalités
- Dashboard personnalisable par type d'utilisateur

### 4.2 Module de gestion des utilisateurs

- Annuaire complet avec recherche avancée et filtres
- Gestion des profils avec historique d'activité
- Vue des équipements actuellement affectés
- Statistiques d'utilisation et de responsabilité matérielle
- Système de notification personnalisable

### 4.3 Module de gestion des projets/emplacements

- Structure adaptable selon le secteur d'activité
- Visualisation des équipements actuellement présents
- Timeline d'occupation des ressources
- Planification des besoins futurs
- Cartographie des emplacements physiques

### 4.4 Module de gestion des catégories

- Arborescence des catégories personnalisable
- Gestion des attributs spécifiques par catégorie
- Règles de nommage et d'attribution automatisées
- Templates pour accélérer la création d'équipements similaires
- Rapports analytiques par catégorie

### 4.5 Module de gestion des équipements

- Interface complète de gestion d'inventaire
- Fiche détaillée avec historique complet de chaque équipement
- Journal d'activité avec tous les mouvements et scans nfc/qr
- Suivi du cycle de vie (de l'acquisition à la mise au rebut)
- Planning de maintenance préventive
- Système d'alerte pour maintenance ou certification à renouveler

### 4.6 Module de gestion des affectations

- Processus guidé d'affectation avec validation
- Scan nfc/qr pour confirmation de prise en charge
- Vue calendaire des disponibilités
- Système de réservation anticipée
- Alertes de retour pour affectations arrivant à échéance
- Workflows configurables avec approbations multi-niveaux

### 4.7 Fonctionnalités de recherche avancée

- Recherche globale intelligente sur tous les critères
- Filtres contextuels et sauvegarde de recherches favorites
- Recherche par scan nfc/qr pour identification rapide
- Suggestions intelligentes basées sur l'historique

### 4.8 Module d'administration et paramétrage

- Configuration complète adaptée à chaque organisation
- Personnalisation de la terminologie et des champs
- Gestion des droits et rôles utilisateurs
- Audit logs pour toutes les actions système
- Paramétrage des notifications et alertes

## 5. Interactions et automatisations

### 5.1 Workflow de scan nfc/qr

- Scan à l'entrée/sortie des zones de stockage
- Mise à jour automatique de la localisation
- Vérification de la légitimité du mouvement
- Création automatique d'affectation sur scan sortant
- Clôture automatique d'affectation sur scan entrant

### 5.2 Interactions entre équipements

- Gestion des relations parent/enfant entre équipements
- Suivi des assemblages/désassemblages
- Alertes sur incompatibilités potentielles
- Recommandations d'équipements complémentaires

### 5.3 Automatisation des processus

- Rappels automatiques pour retours d'équipements
- Alertes de maintenance basées sur l'utilisation réelle
- Détection d'anomalies dans les patterns d'utilisation
- Suggestions d'optimisation du parc

Ce cahier des charges est destiné à servir de référence pour le développement d'une plateforme SaaS de gestion d'équipements adaptable à différents secteurs d'activité, avec un accent particulier sur l'automatisation via technologie nfc/qr et l'analyse avancée des données.
