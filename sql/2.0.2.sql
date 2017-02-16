ALTER TABLE `wo_line`   
  ADD COLUMN `chapterId` INT(11) NULL AFTER `quantity`,
  ADD CONSTRAINT `ref_wol_chapter` FOREIGN KEY (`chapterId`) REFERENCES `chapter`(`chapterId`);

UPDATE wo_line AS wol, wo, chapter AS ch
  SET wol.chapterId = ch.chapterId
  WHERE wo.woId = wol.woId
  AND ch.pwId = wo.pwId
  AND wol.chapterId IS NULL;  