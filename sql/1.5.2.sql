ALTER TABLE `gdespa`.`closure_line` DROP FOREIGN KEY `ref_closline_closure`;

ALTER TABLE `gdespa`.`closure_line` ADD CONSTRAINT `ref_closline_closure` FOREIGN KEY (`closureId`) REFERENCES `gdespa`.`closure`(`closureId`) ON DELETE CASCADE;
