ALTER TABLE `wo_line`   
  ADD COLUMN `chapterId` INT(11) NULL AFTER `quantity`,
  ADD CONSTRAINT `ref_wol_chapter` FOREIGN KEY (`chapterId`) REFERENCES `chapter`(`chapterId`);