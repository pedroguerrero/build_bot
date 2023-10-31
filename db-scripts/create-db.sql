CREATE TABLE "builds" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_c181c897db1d7b044faace6e86c" PRIMARY KEY ("id"));
CREATE TABLE "tags" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"));
CREATE TABLE "builds_tags_tags" ("buildsId" integer NOT NULL, "tagsId" integer NOT NULL, CONSTRAINT "PK_df61ac1409ea9da7435a44ebb99" PRIMARY KEY ("buildsId", "tagsId"));
CREATE INDEX "IDX_b82847a4e1fc955d0c1f10f88d" ON "builds_tags_tags" ("buildsId");
CREATE INDEX "IDX_3c45d9d1bffab0553a365f9da1" ON "builds_tags_tags" ("tagsId");
ALTER TABLE "builds_tags_tags" ADD CONSTRAINT "FK_b82847a4e1fc955d0c1f10f88d4" FOREIGN KEY ("buildsId") REFERENCES "builds"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "builds_tags_tags" ADD CONSTRAINT "FK_3c45d9d1bffab0553a365f9da14" FOREIGN KEY ("tagsId") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
