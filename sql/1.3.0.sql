ALTER TABLE `gdespa`.`cunit`   
  ADD  UNIQUE INDEX `idx_ref` (`reference`);
ALTER TABLE `gdespa`.`item`   
  ADD  UNIQUE INDEX `idx_ref` (`reference`);
ALTER TABLE `gdespa`.`cunit_line`   
  ADD  UNIQUE INDEX `idx_unit_item` (`cunitId`, `itemId`);  