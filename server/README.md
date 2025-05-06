# Business Tracker Backend

Ce serveur backend fournit les API pour l'application Business Tracker.

## Configuration requise

- Node.js (version 14 ou supérieure)
- MySQL (version 5.7 ou supérieure)

## Installation

1. Clonez ce dépôt
2. Installez les dépendances:
   ```
   npm install
   ```

3. Créez un fichier `.env` à la racine du dossier server avec le contenu suivant:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=votre_mot_de_passe
   DB_NAME=business_tracker
   ```
   
   Remplacez `votre_mot_de_passe` par votre mot de passe MySQL.

## Initialisation de la base de données

Pour initialiser la base de données avec la structure complète définie dans le fichier DSATABASE.MD:

```
npm run init-db
```

Cette commande va:
1. Créer une base de données `business_tracker`
2. Créer toutes les tables nécessaires avec leurs relations
3. Créer des tables de compatibilité pour l'interface existante
4. Insérer des données de test pour vous permettre de commencer immédiatement

## Démarrer le serveur

Démarrer en mode développement (avec auto-restart):
```
npm run dev
```

Démarrer en mode production:
```
npm start
```

Le serveur sera accessible à l'adresse: http://localhost:3000

## API disponibles

### Utilisateurs
- `GET /api/users` - Liste des utilisateurs
- `POST /api/users` - Créer un utilisateur

### Business
- `GET /api/business` - Liste des entreprises
- `POST /api/business` - Créer une entreprise

### Produits
- `GET /api/products` - Liste des produits
- `POST /api/products` - Créer un produit

### Clients
- `GET /api/clients` - Liste des clients
- `POST /api/clients` - Créer un client

### Fournisseurs
- `GET /api/vendors` - Liste des fournisseurs
- `POST /api/vendors` - Créer un fournisseur

### Revenus
- `GET /api/incomes` - Liste des revenus
- `POST /api/incomes` - Créer un revenu

### Dépenses
- `GET /api/expenses` - Liste des dépenses
- `POST /api/expenses` - Créer une dépense

### Transactions (Complexes)
- `GET /api/complex-transactions` - Liste des transactions complexes
- `POST /api/complex-transactions` - Créer une transaction complexe

### Transactions (Simplifiées pour l'interface actuelle)
- `GET /api/transactions` - Liste des transactions
- `POST /api/transactions` - Créer une transaction
- `PUT /api/transactions/:id` - Mettre à jour une transaction
- `DELETE /api/transactions/:id` - Supprimer une transaction

### Inventaire
- `GET /api/inventory` - Liste des articles en inventaire
- `POST /api/inventory` - Ajouter un article à l'inventaire
- `PUT /api/inventory/:id` - Mettre à jour un article en inventaire
- `DELETE /api/inventory/:id` - Supprimer un article de l'inventaire

### Mouvements de stock
- `GET /api/stock-movements` - Liste des mouvements de stock
- `POST /api/stock-movements` - Créer un mouvement de stock

### Catégories
- `GET /api/categories` - Liste des catégories
- `POST /api/categories` - Créer une catégorie

### Analytiques
- `GET /api/analytics/summary` - Résumé financier
- `GET /api/analytics/monthly` - Rapport mensuel

## Structure de la base de données

La base de données est structurée selon le modèle suivant:

- `user` - Utilisateurs du système
- `Business` - Entreprises
- `Products` - Produits
- `vendor` - Fournisseurs
- `Client` - Clients
- `Expense` - Dépenses
- `Income` - Revenus
- `Transaction` - Transactions complexes
- `Stock_Movement` - Mouvements de stock
- `category` - Catégories de produits
- `transactions` - Transactions simplifiées (compatibilité interface)
- `inventory` - Inventaire simplifié (compatibilité interface)

Pour la structure détaillée, consultez le fichier `src/db-init.sql`. 