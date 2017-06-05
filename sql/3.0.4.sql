ALTER TABLE `wo_worker`   
  ADD COLUMN `extraHoursNight` DECIMAL(10,2) NULL AFTER `planHours`,
  ADD COLUMN `expenses` DECIMAL(10,2) NULL AFTER `extraHoursNight`;