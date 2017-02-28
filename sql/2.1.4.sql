ALTER TABLE `pw_line`   
  ADD COLUMN `plannedQuantity` DECIMAL(6,2) NULL AFTER `cost`;
UPDATE pw_line SET plannedQuantity = quantity;
