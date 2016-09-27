ALTER TABLE `gdespa`.`item_stock`   
  ADD  UNIQUE INDEX `idx_stock_store_item` (`storeId`, `itemId`);
