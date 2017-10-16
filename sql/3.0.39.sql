ALTER TABLE `worker`   
  ADD COLUMN `administrative` BOOL DEFAULT FALSE NULL AFTER `license`,
  ADD COLUMN `active` BOOL DEFAULT FALSE NULL AFTER `administrative`;