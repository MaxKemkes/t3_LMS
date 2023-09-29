DROP TABLE `t3_LMS_example`;--> statement-breakpoint
ALTER TABLE `t3_LMS_user` ADD `password` varchar(255);--> statement-breakpoint
ALTER TABLE `t3_LMS_account` DROP COLUMN `password`;