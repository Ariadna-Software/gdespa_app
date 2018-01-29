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

CREATE TABLE `abs`(  
  `absId` INT(11) NOT NULL AUTO_INCREMENT,
  `fromDate` DATE,
  `toDate` DATE,
  `workerId` INT(11),
  `absTypeId` INT(11),
  `comments` TEXT,
  PRIMARY KEY (`absId`),
  CONSTRAINT `ref_abs_worker` FOREIGN KEY (`workerId`) REFERENCES `worker`(`workerId`),
  CONSTRAINT `ref_abs_absType` FOREIGN KEY (`absTypeId`) REFERENCES `abs_type`(`absTypeId`)
);
