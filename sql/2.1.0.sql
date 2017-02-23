ALTER TABLE `wo_worker`   
  CHANGE `cost` `cost` DECIMAL(12,2) DEFAULT 0.00 NULL,
  ADD COLUMN `normalHours` DECIMAL(10,2) NULL AFTER `cost`,
  ADD COLUMN `extraHours` DECIMAL(10,2) NULL AFTER `normalHours`,
  ADD COLUMN `initialKm` DECIMAL(10,2) NULL AFTER `extraHours`,
  ADD COLUMN `finalKm` DECIMAL(10,2) NULL AFTER `initialKm`,
  ADD COLUMN `totalKm` DECIMAL(10,2) NULL AFTER `finalKm`,
  ADD COLUMN `fuel` DECIMAL(10,2) NULL AFTER `totalKm`;
UPDATE wo_worker SET normalHours = quantity, extraHours = 0;  