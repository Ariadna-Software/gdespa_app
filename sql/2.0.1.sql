
ALTER TABLE `pw_line` DROP FOREIGN KEY `ref_pwline_chapter`;

ALTER TABLE `pw_line` ADD CONSTRAINT `ref_pwline_chapter` FOREIGN KEY (`chapterId`) REFERENCES `chapter`(`chapterId`) ON DELETE CASCADE;