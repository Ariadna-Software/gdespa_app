CREATE TABLE `invoice`(  
  `invoiceId` INT(11) NOT NULL,
  `invoiceNumber` VARCHAR(255),
  `invoiceDate` DATE,
  `amount` DECIMAL(12,2),
  `comments` TEXT,
  `pwId` INT(11),
  PRIMARY KEY (`invoiceId`),
  CONSTRAINT `ref_invoice_pw` FOREIGN KEY (`pwId`) REFERENCES `pw`(`pwId`)
);
ALTER TABLE `user`   
  ADD COLUMN `perInvoice` TINYINT(1) DEFAULT 0 NULL AFTER `perReport`;