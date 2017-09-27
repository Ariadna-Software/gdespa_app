CREATE TABLE `gdespa_test`.`report_dates`(  
  `userId` INT(11),
  `repdate` DATE,
  CONSTRAINT `ref_users` FOREIGN KEY (`userId`) REFERENCES `gdespa_test`.`user`(`userId`)
);
