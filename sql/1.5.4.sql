ALTER TABLE `gdespa`.`item_stock`   
  ADD COLUMN `lastStock` DECIMAL(12,2) NULL AFTER `lastInvId`;
ALTER TABLE `gdespa`.`item_in_line` DROP FOREIGN KEY `ref_iteminline_itemin`;

ALTER TABLE `gdespa`.`item_in_line` ADD CONSTRAINT `ref_iteminline_itemin` FOREIGN KEY (`itemInId`) REFERENCES `gdespa`.`item_in`(`itemInId`) ON DELETE NO ACTION;
ALTER TABLE `gdespa`.`item_out_line` DROP FOREIGN KEY `ref_itemoutline_itemin`;

ALTER TABLE `gdespa`.`item_out_line` ADD CONSTRAINT `ref_itemoutline_itemin` FOREIGN KEY (`itemOutId`) REFERENCES `gdespa`.`item_out`(`itemOutId`) ON DELETE NO ACTION;
  