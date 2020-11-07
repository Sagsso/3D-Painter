-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema ThreeDShop
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `ThreeDShop` ;

-- -----------------------------------------------------
-- Schema ThreeDShop
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `ThreeDShop` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ;
USE `ThreeDShop` ;

-- -----------------------------------------------------
-- Table `ThreeDShop`.`User`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ThreeDShop`.`User` ;

CREATE TABLE IF NOT EXISTS `ThreeDShop`.`User` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ThreeDShop`.`Item`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ThreeDShop`.`Item` ;

CREATE TABLE IF NOT EXISTS `ThreeDShop`.`Item` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `price` DECIMAL(12,3) NOT NULL DEFAULT 0,
  `quantity` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ThreeDShop`.`Property`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ThreeDShop`.`Property` ;

CREATE TABLE IF NOT EXISTS `ThreeDShop`.`Property` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ThreeDShop`.`Item_has_Property`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ThreeDShop`.`Item_has_Property` ;

CREATE TABLE IF NOT EXISTS `ThreeDShop`.`Item_has_Property` (
  `itemId` INT NOT NULL,
  `propertyId` INT NOT NULL,
  `value` VARCHAR(60) NOT NULL,
  PRIMARY KEY (`itemId`, `propertyId`),
  CONSTRAINT `fk_Item_has_Property_Item`
    FOREIGN KEY (`itemId`)
    REFERENCES `ThreeDShop`.`Item` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Item_has_Property_Property1`
    FOREIGN KEY (`propertyId`)
    REFERENCES `ThreeDShop`.`Property` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_Item_has_Property_Property1_idx` ON `ThreeDShop`.`Item_has_Property` (`propertyId` ASC);

CREATE INDEX `fk_Item_has_Property_Item_idx` ON `ThreeDShop`.`Item_has_Property` (`itemId` ASC);


-- -----------------------------------------------------
-- Table `ThreeDShop`.`Bag`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ThreeDShop`.`Bag` ;

CREATE TABLE IF NOT EXISTS `ThreeDShop`.`Bag` (
  `userId` INT NOT NULL,
  `itemId` INT NOT NULL,
  `quantity` INT NOT NULL,
  PRIMARY KEY (`userId`, `itemId`),
  CONSTRAINT `fk_User_has_Item_User1`
    FOREIGN KEY (`userId`)
    REFERENCES `ThreeDShop`.`User` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_User_has_Item_Item1`
    FOREIGN KEY (`itemId`)
    REFERENCES `ThreeDShop`.`Item` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_User_has_Item_Item1_idx` ON `ThreeDShop`.`Bag` (`itemId` ASC);

CREATE INDEX `fk_User_has_Item_User1_idx` ON `ThreeDShop`.`Bag` (`userId` ASC);


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `ThreeDShop`.`Item`
-- -----------------------------------------------------
START TRANSACTION;
USE `ThreeDShop`;
INSERT INTO `ThreeDShop`.`Item` (`id`, `name`, `price`, `quantity`) VALUES (1, 'Bomb', 15, 20);
INSERT INTO `ThreeDShop`.`Item` (`id`, `name`, `price`, `quantity`) VALUES (2, 'Square Bomb', 15, 20);

COMMIT;


-- -----------------------------------------------------
-- Data for table `ThreeDShop`.`Property`
-- -----------------------------------------------------
START TRANSACTION;
USE `ThreeDShop`;
INSERT INTO `ThreeDShop`.`Property` (`id`, `name`) VALUES (1, 'type');
INSERT INTO `ThreeDShop`.`Property` (`id`, `name`) VALUES (2, 'color');
INSERT INTO `ThreeDShop`.`Property` (`id`, `name`) VALUES (3, 'posX');
INSERT INTO `ThreeDShop`.`Property` (`id`, `name`) VALUES (4, 'posY');
INSERT INTO `ThreeDShop`.`Property` (`id`, `name`) VALUES (5, 'posZ');
INSERT INTO `ThreeDShop`.`Property` (`id`, `name`) VALUES (6, 'width');
INSERT INTO `ThreeDShop`.`Property` (`id`, `name`) VALUES (7, 'height');
INSERT INTO `ThreeDShop`.`Property` (`id`, `name`) VALUES (8, 'depth');
INSERT INTO `ThreeDShop`.`Property` (`id`, `name`) VALUES (9, 'radius');

COMMIT;


-- -----------------------------------------------------
-- Data for table `ThreeDShop`.`Item_has_Property`
-- -----------------------------------------------------
START TRANSACTION;
USE `ThreeDShop`;
INSERT INTO `ThreeDShop`.`Item_has_Property` (`itemId`, `propertyId`, `value`) VALUES (1, 1, 'cube');
INSERT INTO `ThreeDShop`.`Item_has_Property` (`itemId`, `propertyId`, `value`) VALUES (1, 2, '0x000066');
INSERT INTO `ThreeDShop`.`Item_has_Property` (`itemId`, `propertyId`, `value`) VALUES (1, 6, '20');
INSERT INTO `ThreeDShop`.`Item_has_Property` (`itemId`, `propertyId`, `value`) VALUES (1, 7, '20');
INSERT INTO `ThreeDShop`.`Item_has_Property` (`itemId`, `propertyId`, `value`) VALUES (1, 8, '20');

COMMIT;

