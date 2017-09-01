CREATE TABLE `doc`(  
  `docId` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255),
  `docDate` DATE,
  `comments` TEXT,
  `pwId` INT,
  PRIMARY KEY (`docId`),
  CONSTRAINT `ref_pw` FOREIGN KEY (`pwId`) REFERENCES `pw`(`pwId`)
);
