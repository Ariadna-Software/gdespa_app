CREATE TABLE `chapter`(  
  `chapterId` INT(11) NOT NULL AUTO_INCREMENT,
  `order` INT(11),
  `name` VARCHAR(255),
  `comments` TEXT,
  `pwId` INT,
  PRIMARY KEY (`chapterId`),
  CONSTRAINT `chapter_pw` FOREIGN KEY (`pwId`) REFERENCES `pw`(`pwId`)
);

ALTER TABLE `pw_line`   
  ADD COLUMN `chapterId` INT(11) NULL AFTER `comments`,
  ADD CONSTRAINT `ref_pwline_chapter` FOREIGN KEY (`chapterId`) REFERENCES `chapter`(`chapterId`);

INSERT INTO chapter (`order`,`name`, comments, pwId)
SELECT 
1 AS `order` , 'Capítulo global' AS `name`, 'Generado automáticamente por script' AS comments,pwId
FROM pw;

UPDATE pw_line AS pwl, chapter AS ch
SET pwl.chapterId = ch.chapterId
WHERE pwl.pwId = ch.pwId;