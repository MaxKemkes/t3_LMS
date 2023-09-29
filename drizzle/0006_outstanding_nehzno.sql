CREATE TABLE `t3_LMS_emailVerificationTokens` (
	`userId` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `t3_LMS_emailVerificationTokens_token` PRIMARY KEY(`token`)
);
--> statement-breakpoint
CREATE INDEX `userId_idx` ON `t3_LMS_emailVerificationTokens` (`userId`);