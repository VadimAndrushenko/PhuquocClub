import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '1234',
  database: 'phuquoc',
});

async function main() {
  const client = await pool.connect();
  try {
    // Create enum types if they don't exist
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "public"."enum_home_page_planning_block_items_icon" AS ENUM('Sun', 'BookType', 'Wallet', 'House', 'Plane', 'Map', 'Waves', 'Utensils');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "public"."enum_home_page_urgent_block_items_icon" AS ENUM('Sun', 'BookType', 'Wallet', 'House', 'Plane', 'Map', 'Waves', 'Utensils');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "public"."enum__home_page_v_version_planning_block_items_icon" AS ENUM('Sun', 'BookType', 'Wallet', 'House', 'Plane', 'Map', 'Waves', 'Utensils');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "public"."enum__home_page_v_version_urgent_block_items_icon" AS ENUM('Sun', 'BookType', 'Wallet', 'House', 'Plane', 'Map', 'Waves', 'Utensils');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create planning_block_items table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "home_page_planning_block_items" (
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL,
        "id" varchar PRIMARY KEY NOT NULL,
        "article_id" integer NOT NULL,
        "icon" "public"."enum_home_page_planning_block_items_icon" NOT NULL
      );
    `);

    // Create urgent_block_items table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "home_page_urgent_block_items" (
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL,
        "id" varchar PRIMARY KEY NOT NULL,
        "article_id" integer NOT NULL,
        "icon" "public"."enum_home_page_urgent_block_items_icon" NOT NULL
      );
    `);

    // Version tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS "_home_page_v_version_planning_block_items" (
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL,
        "id" serial PRIMARY KEY NOT NULL,
        "article_id" integer NOT NULL,
        "icon" "public"."enum__home_page_v_version_planning_block_items_icon" NOT NULL,
        "_uuid" varchar
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "_home_page_v_version_urgent_block_items" (
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL,
        "id" serial PRIMARY KEY NOT NULL,
        "article_id" integer NOT NULL,
        "icon" "public"."enum__home_page_v_version_urgent_block_items_icon" NOT NULL,
        "_uuid" varchar
      );
    `);

    // Foreign keys
    try {
      await client.query(`ALTER TABLE "home_page_planning_block_items" ADD CONSTRAINT "home_page_planning_block_items_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;`);
    } catch(e) { if (!e.message.includes('already exists')) throw e; }
    try {
      await client.query(`ALTER TABLE "home_page_planning_block_items" ADD CONSTRAINT "home_page_planning_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;`);
    } catch(e) { if (!e.message.includes('already exists')) throw e; }
    try {
      await client.query(`ALTER TABLE "home_page_urgent_block_items" ADD CONSTRAINT "home_page_urgent_block_items_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;`);
    } catch(e) { if (!e.message.includes('already exists')) throw e; }
    try {
      await client.query(`ALTER TABLE "home_page_urgent_block_items" ADD CONSTRAINT "home_page_urgent_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;`);
    } catch(e) { if (!e.message.includes('already exists')) throw e; }
    try {
      await client.query(`ALTER TABLE "_home_page_v_version_planning_block_items" ADD CONSTRAINT "_home_page_v_version_planning_block_items_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;`);
    } catch(e) { if (!e.message.includes('already exists')) throw e; }
    try {
      await client.query(`ALTER TABLE "_home_page_v_version_planning_block_items" ADD CONSTRAINT "_home_page_v_version_planning_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;`);
    } catch(e) { if (!e.message.includes('already exists')) throw e; }
    try {
      await client.query(`ALTER TABLE "_home_page_v_version_urgent_block_items" ADD CONSTRAINT "_home_page_v_version_urgent_block_items_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;`);
    } catch(e) { if (!e.message.includes('already exists')) throw e; }
    try {
      await client.query(`ALTER TABLE "_home_page_v_version_urgent_block_items" ADD CONSTRAINT "_home_page_v_version_urgent_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;`);
    } catch(e) { if (!e.message.includes('already exists')) throw e; }

    console.log('Schema pushed successfully!');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});
