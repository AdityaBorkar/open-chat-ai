CREATE TABLE "account" (
	"access_token" text,
	"access_token_expires_at" timestamp,
	"account_id" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"id_token" text,
	"password" text,
	"provider_id" text NOT NULL,
	"refresh_token" text,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"updated_at" timestamp NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "passkey" (
	"aaguid" text,
	"backed_up" boolean NOT NULL,
	"counter" integer NOT NULL,
	"created_at" timestamp,
	"credential_i_d" text NOT NULL,
	"device_type" text NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"public_key" text NOT NULL,
	"transports" text,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"created_at" timestamp NOT NULL,
	"expires_at" timestamp NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"ip_address" text,
	"token" text NOT NULL,
	"updated_at" timestamp NOT NULL,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"created_at" timestamp NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"image" text,
	"is_anonymous" boolean,
	"name" text NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"created_at" timestamp,
	"expires_at" timestamp NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"updated_at" timestamp,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "apiKeys" (
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"keyHash" text NOT NULL,
	"lastUsed" timestamp,
	"name" text,
	"provider" text NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"userId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "connections" (
	"config" jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"description" text,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"lastUsed" timestamp,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"userId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"folderId" uuid,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"isArchived" boolean DEFAULT false NOT NULL,
	"isPinned" boolean DEFAULT false NOT NULL,
	"model" text DEFAULT 'gpt-4' NOT NULL,
	"provider" text DEFAULT 'openai' NOT NULL,
	"settings" jsonb,
	"systemPrompt" text,
	"tags" text[],
	"title" text NOT NULL,
	"type" text DEFAULT 'chat' NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"userId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "folders" (
	"color" text DEFAULT '#6366f1' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"userId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mcps" (
	"config" jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"description" text,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"isEnabled" boolean DEFAULT true NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"userId" uuid NOT NULL,
	"version" text
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"attachments" jsonb,
	"content" text NOT NULL,
	"conversationId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"metadata" jsonb,
	"parentMessageId" uuid,
	"role" text NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "modelPresets" (
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"description" text,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"isDefault" boolean DEFAULT false NOT NULL,
	"model" text NOT NULL,
	"name" text NOT NULL,
	"provider" text NOT NULL,
	"settings" jsonb NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"userId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "modelsConfig" (
	"config" jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"isEnabled" boolean DEFAULT true NOT NULL,
	"model" text NOT NULL,
	"provider" text NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"userId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "personas" (
	"avatar" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"description" text,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"instructions" text NOT NULL,
	"isDefault" boolean DEFAULT false NOT NULL,
	"name" text NOT NULL,
	"tags" text[],
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"userId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"description" text,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"settings" jsonb,
	"status" text DEFAULT 'active' NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"userId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prompts" (
	"category" text DEFAULT 'general' NOT NULL,
	"content" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"description" text,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"isPublic" boolean DEFAULT false NOT NULL,
	"isStarred" boolean DEFAULT false NOT NULL,
	"tags" text[],
	"title" text NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"usageCount" integer DEFAULT 0 NOT NULL,
	"userId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settingsConfig" (
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"settings" jsonb NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"userId" uuid NOT NULL,
	CONSTRAINT "settingsConfig_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "sharedLinks" (
	"conversationId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"expiresAt" timestamp,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"isPublic" boolean DEFAULT false NOT NULL,
	"maxViews" integer,
	"password" text,
	"slug" text NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"userId" uuid NOT NULL,
	"viewCount" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "sharedLinks_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "uploadedAttachments" (
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"fileName" text NOT NULL,
	"fileSize" integer NOT NULL,
	"fileType" text NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"metadata" jsonb,
	"path" text NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"uploadedAt" timestamp DEFAULT now() NOT NULL,
	"userId" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "passkey" ADD CONSTRAINT "passkey_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "apiKeys" ADD CONSTRAINT "apiKeys_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connections" ADD CONSTRAINT "connections_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_folderId_folders_id_fk" FOREIGN KEY ("folderId") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "folders" ADD CONSTRAINT "folders_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mcps" ADD CONSTRAINT "mcps_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversationId_conversations_id_fk" FOREIGN KEY ("conversationId") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "modelPresets" ADD CONSTRAINT "modelPresets_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "modelsConfig" ADD CONSTRAINT "modelsConfig_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personas" ADD CONSTRAINT "personas_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prompts" ADD CONSTRAINT "prompts_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settingsConfig" ADD CONSTRAINT "settingsConfig_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sharedLinks" ADD CONSTRAINT "sharedLinks_conversationId_conversations_id_fk" FOREIGN KEY ("conversationId") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sharedLinks" ADD CONSTRAINT "sharedLinks_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uploadedAttachments" ADD CONSTRAINT "uploadedAttachments_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;