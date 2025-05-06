-- MySQL Script for Business Application
-- Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema business_tracker
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema business_tracker
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `business_tracker` DEFAULT CHARACTER SET utf8 ;
USE `business_tracker` ;

-- -----------------------------------------------------
-- Table `business_tracker`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `business_tracker`.`user` (
  `username` VARCHAR(16) NOT NULL,
  `email` VARCHAR(255) NULL,
  `password` VARCHAR(32) NOT NULL,
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `userid` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`userid`));


-- -----------------------------------------------------
-- Table `business_tracker`.`Business`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `business_tracker`.`Business` (
  `idBusiness` INT NOT NULL,
  `BusinessName` VARCHAR(45) NULL,
  `contact` VARCHAR(45) NULL,
  `user_userid` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idBusiness`, `user_userid`),
  INDEX `fk_Business_user1_idx` (`user_userid` ASC),
  CONSTRAINT `fk_Business_user1`
    FOREIGN KEY (`user_userid`)
    REFERENCES `business_tracker`.`user` (`userid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `business_tracker`.`Products`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `business_tracker`.`Products` (
  `idproduct` INT NOT NULL,
  `productname` VARCHAR(255) NOT NULL,
  `quantity` VARCHAR(45) NULL,
  `Description` VARCHAR(45) NULL,
  `Business_idBusiness` INT NOT NULL,
  `Business_user_userid` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idproduct`, `Business_idBusiness`, `Business_user_userid`),
  INDEX `fk_Products_Business1_idx` (`Business_idBusiness` ASC, `Business_user_userid` ASC),
  CONSTRAINT `fk_Products_Business1`
    FOREIGN KEY (`Business_idBusiness` , `Business_user_userid`)
    REFERENCES `business_tracker`.`Business` (`idBusiness` , `user_userid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `business_tracker`.`vendor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `business_tracker`.`vendor` (
  `idvendor` INT NOT NULL,
  `vendorName` VARCHAR(45) NULL,
  `Contact` VARCHAR(45) NULL,
  `Payment` VARCHAR(45) NULL,
  `Business_idBusiness` INT NOT NULL,
  `Business_user_userid` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idvendor`, `Business_idBusiness`, `Business_user_userid`),
  INDEX `fk_vendor_Business1_idx` (`Business_idBusiness` ASC, `Business_user_userid` ASC),
  CONSTRAINT `fk_vendor_Business1`
    FOREIGN KEY (`Business_idBusiness` , `Business_user_userid`)
    REFERENCES `business_tracker`.`Business` (`idBusiness` , `user_userid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `business_tracker`.`Client`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `business_tracker`.`Client` (
  `idClient` INT NOT NULL,
  `ClientName` VARCHAR(45) NULL,
  `Clientaddress` VARCHAR(45) NULL,
  `Business_idBusiness` INT NOT NULL,
  `Business_user_userid` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idClient`, `Business_idBusiness`, `Business_user_userid`),
  INDEX `fk_Client_Business1_idx` (`Business_idBusiness` ASC, `Business_user_userid` ASC),
  CONSTRAINT `fk_Client_Business1`
    FOREIGN KEY (`Business_idBusiness` , `Business_user_userid`)
    REFERENCES `business_tracker`.`Business` (`idBusiness` , `user_userid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `business_tracker`.`Expense`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `business_tracker`.`Expense` (
  `idExpense` INT NOT NULL,
  `date` VARCHAR(45) NULL,
  `Amount` VARCHAR(45) NULL,
  `vendor_idvendor` INT NOT NULL,
  PRIMARY KEY (`idExpense`, `vendor_idvendor`),
  INDEX `fk_Expense_vendor1_idx` (`vendor_idvendor` ASC),
  CONSTRAINT `fk_Expense_vendor1`
    FOREIGN KEY (`vendor_idvendor`)
    REFERENCES `business_tracker`.`vendor` (`idvendor`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `business_tracker`.`Income`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `business_tracker`.`Income` (
  `idIncome` INT NOT NULL,
  `date` VARCHAR(45) NULL,
  `Amount` VARCHAR(45) NULL,
  `Client_idClient` INT NOT NULL,
  PRIMARY KEY (`idIncome`, `Client_idClient`),
  INDEX `fk_Income_Client1_idx` (`Client_idClient` ASC),
  CONSTRAINT `fk_Income_Client1`
    FOREIGN KEY (`Client_idClient`)
    REFERENCES `business_tracker`.`Client` (`idClient`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `business_tracker`.`Transaction`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `business_tracker`.`Transaction` (
  `idTransaction` INT NOT NULL,
  `date` VARCHAR(45) NULL,
  `Amount` VARCHAR(45) NULL,
  `Status` VARCHAR(45) NULL,
  `Created_at` VARCHAR(45) NULL,
  `Business_idBusiness` INT NOT NULL,
  `Expense_idExpense` INT NOT NULL,
  `Income_idIncome` INT NOT NULL,
  PRIMARY KEY (`idTransaction`, `Expense_idExpense`, `Income_idIncome`),
  INDEX `fk_Transaction_Business_idx` (`Business_idBusiness` ASC),
  INDEX `fk_Transaction_Expense1_idx` (`Expense_idExpense` ASC),
  INDEX `fk_Transaction_Income1_idx` (`Income_idIncome` ASC),
  CONSTRAINT `fk_Transaction_Business`
    FOREIGN KEY (`Business_idBusiness`)
    REFERENCES `business_tracker`.`Business` (`idBusiness`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Transaction_Expense1`
    FOREIGN KEY (`Expense_idExpense`)
    REFERENCES `business_tracker`.`Expense` (`idExpense`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Transaction_Income1`
    FOREIGN KEY (`Income_idIncome`)
    REFERENCES `business_tracker`.`Income` (`idIncome`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `business_tracker`.`Stock_Movement`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `business_tracker`.`Stock_Movement` (
  `idStock` INT NOT NULL,
  `movementid` VARCHAR(45) NOT NULL,
  `quantity` VARCHAR(45) NULL,
  `movement_time` VARCHAR(45) NULL,
  `Products_idproduct` INT NOT NULL,
  PRIMARY KEY (`idStock`, `movementid`, `Products_idproduct`),
  INDEX `fk_Stock_Movement_Products1_idx` (`Products_idproduct` ASC),
  CONSTRAINT `fk_Stock_Movement_Products1`
    FOREIGN KEY (`Products_idproduct`)
    REFERENCES `business_tracker`.`Products` (`idproduct`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `business_tracker`.`category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `business_tracker`.`category` (
  `category_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `product_type` VARCHAR(45) NULL,
  `Products_idproduct` INT NOT NULL,
  `Products_Business_idBusiness` INT NOT NULL,
  `Products_Business_user_userid` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`category_id`, `Products_idproduct`, `Products_Business_idBusiness`, `Products_Business_user_userid`),
  INDEX `fk_category_2_Products1_idx` (`Products_idproduct` ASC, `Products_Business_idBusiness` ASC, `Products_Business_user_userid` ASC),
  CONSTRAINT `fk_category_2_Products1`
    FOREIGN KEY (`Products_idproduct` , `Products_Business_idBusiness` , `Products_Business_user_userid`)
    REFERENCES `business_tracker`.`Products` (`idproduct` , `Business_idBusiness` , `Business_user_userid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- Create a simpler transactions table compatible with current BusinessService
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

-- Create a simpler inventory table compatible with current BusinessService
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

-- Create indexes for better performance
CREATE INDEX idx_transactions_date ON business_tracker.transactions(date);
CREATE INDEX idx_transactions_type ON business_tracker.transactions(type);
CREATE INDEX idx_inventory_category ON business_tracker.inventory(category);
CREATE INDEX idx_transactions_business ON business_tracker.transactions(business_id);
CREATE INDEX idx_inventory_business ON business_tracker.inventory(business_id);

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS; 