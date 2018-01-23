ALTER TABLE `pl_line`   
  ADD COLUMN `prevPlanned` DECIMAL(12,2) NULL AFTER `estimate`;

ALTER TABLE `pl_line`   
  CHANGE `estimate` `estimate` DECIMAL(12,2) DEFAULT 0 NULL,
  CHANGE `prevPlanned` `prevPlanned` DECIMAL(12,2) DEFAULT 0 NULL,
  CHANGE `done` `done` DECIMAL(12,2) DEFAULT 0 NULL,
  CHANGE `quantity` `quantity` DECIMAL(12,2) DEFAULT 0 NULL;