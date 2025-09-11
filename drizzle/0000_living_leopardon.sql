CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"category" varchar(50) NOT NULL,
	"image_url" varchar(255) NOT NULL,
	"stock_quantity" integer NOT NULL,
	"weight" numeric(10, 2) NOT NULL,
	"dimensions" json NOT NULL,
	"moisture" numeric(5, 2) NOT NULL,
	"season" varchar(50) NOT NULL,
	"features" json NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
