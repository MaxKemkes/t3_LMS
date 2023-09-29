ALTER TABLE `t3_LMS_account` DROP FOREIGN KEY `t3_LMS_account_userId_t3_LMS_user_id_fk`;
--> statement-breakpoint
ALTER TABLE `t3_LMS_account` ADD CONSTRAINT `t3_LMS_account_userId_t3_LMS_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `t3_LMS_user`(`id`) ON DELETE cascade ON UPDATE cascade;