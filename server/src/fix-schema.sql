-- Vérifier et créer la table transactions si elle n'existe pas
CREATE TABLE IF NOT EXISTS `business_tracker`.`transactions` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `type` ENUM('income', 'expense') NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `description` TEXT,
  `date` DATETIME NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `business_id` INT,
  FOREIGN KEY (`business_id`) REFERENCES `business_tracker`.`Business` (`idBusiness`)
);

-- Vérifier et créer la table inventory si elle n'existe pas
CREATE TABLE IF NOT EXISTS `business_tracker`.`inventory` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `quantity` INT NOT NULL,
  `unit_cost` DECIMAL(10, 2) NOT NULL,
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `business_id` INT,
  FOREIGN KEY (`business_id`) REFERENCES `business_tracker`.`Business` (`idBusiness`)
);

-- Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_transactions_date ON business_tracker.transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON business_tracker.transactions(type);
CREATE INDEX IF NOT EXISTS idx_inventory_category ON business_tracker.inventory(category);
CREATE INDEX IF NOT EXISTS idx_transactions_business ON business_tracker.transactions(business_id);
CREATE INDEX IF NOT EXISTS idx_inventory_business ON business_tracker.inventory(business_id);

-- Insérer des données de test
INSERT IGNORE INTO business_tracker.user (username, email, password, userid)
VALUES ('admin', 'admin@example.com', 'password', '1');

INSERT IGNORE INTO business_tracker.Business (idBusiness, BusinessName, contact, user_userid)
VALUES (1, 'Sample Business', '123-456-7890', '1');

-- Insérer quelques transactions de test
INSERT IGNORE INTO business_tracker.transactions (type, category, amount, description, date, business_id)
VALUES 
('income', 'sales', 50000, 'Sample income', NOW(), 1),
('expense', 'supplies', 20000, 'Sample expense', NOW(), 1);

-- Insérer quelques items d'inventaire de test
INSERT IGNORE INTO business_tracker.inventory (name, category, quantity, unit_cost, description, business_id)
VALUES
('Sample Product', 'Product', 100, 500, 'Sample inventory item', 1); 