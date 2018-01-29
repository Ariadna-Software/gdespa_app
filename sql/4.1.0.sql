CREATE TABLE `holiday`(  
  `holidayId` INT(11) NOT NULL AUTO_INCREMENT,
  `holidayDate` DATE NOT NULL,
  `name` VARCHAR(255),
  `dayTypeId` INT(11),
  PRIMARY KEY (`holidayId`),
  CONSTRAINT `ref_holiday_dayType` FOREIGN KEY (`dayTypeId`) REFERENCES `day_type`(`dayTypeId`)
);


CREATE TABLE `abs_type`(  
  `absTypeId` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255),
  PRIMARY KEY (`absTypeId`)
);
