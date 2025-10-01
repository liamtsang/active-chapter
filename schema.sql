-- schema.sql

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- Drop tables if they exist (useful for migrations)
DROP TABLE IF EXISTS article_tags;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS authors;
DROP TABLE IF EXISTS journals;
DROP TABLE IF EXISTS mediums;
DROP TABLE IF EXISTS tags;

-- Create authors table
CREATE TABLE authors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create journals table
CREATE TABLE journals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create mediums table
CREATE TABLE mediums (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create tags table
CREATE TABLE tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create main articles table
CREATE TABLE articles (
    id TEXT PRIMARY KEY, -- Changed to TEXT for UUID
    title TEXT NOT NULL,
    author_id INTEGER NOT NULL,
    journal_id INTEGER NOT NULL,
    medium_id INTEGER NOT NULL,
    publish_date DATE NOT NULL,
    content_hash TEXT NOT NULL, -- This will store the R2 key
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES authors(id),
    FOREIGN KEY (journal_id) REFERENCES journals(id),
    FOREIGN KEY (medium_id) REFERENCES mediums(id)
);

-- Create junction table for article tags (many-to-many)
CREATE TABLE article_tags (
    article_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (article_id, tag_id),
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_authors_slug ON authors(slug);
CREATE INDEX idx_journals_slug ON journals(slug);
CREATE INDEX idx_mediums_slug ON mediums(slug);
CREATE INDEX idx_tags_slug ON tags(slug);

CREATE INDEX idx_articles_author ON articles(author_id);
CREATE INDEX idx_articles_journal ON articles(journal_id);
CREATE INDEX idx_articles_medium ON articles(medium_id);
CREATE INDEX idx_articles_publish_date ON articles(publish_date);

CREATE INDEX idx_article_tags_article ON article_tags(article_id);
CREATE INDEX idx_article_tags_tag ON article_tags(tag_id);

-- Create trigger to update the updated_at timestamp
CREATE TRIGGER articles_update_timestamp 
AFTER UPDATE ON articles
BEGIN
    UPDATE articles SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Insert some initial data for testing
INSERT INTO authors (name, slug) VALUES
    ('John Doe', 'john-doe'),
    ('Jane Smith', 'jane-smith');

INSERT INTO journals (name, slug) VALUES
    ('Nature', 'nature'),
    ('Science', 'science');

INSERT INTO mediums (name, slug) VALUES
    ('Print', 'print'),
    ('Digital', 'digital'),
    ('Online', 'online');

INSERT INTO tags (name, slug) VALUES
    ('AI', 'ai'),
    ('Machine Learning', 'ml'),
    ('Data Science', 'data-science'),
    ('Research', 'research');

-- Add cover_image to articles table
ALTER TABLE articles ADD COLUMN cover_image TEXT;

-- Create site_settings table for popup content and other site-wide settings
CREATE TABLE site_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key TEXT NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger to update the updated_at timestamp for site_settings
CREATE TRIGGER site_settings_update_timestamp 
AFTER UPDATE ON site_settings
BEGIN
    UPDATE site_settings SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Insert default popup content and about content
INSERT INTO site_settings (setting_key, setting_value) VALUES
    ('popup_content', '<p>Welcome to Active Chapter! 🌎️</p>'),
    ('about_content', '<section class="space-y-8 p-4 pb-32"><h2 class="text-xl/5 md:text-3xl font-medium">Active Chapter</h2><h3 class="text-sm/5 md:text-base/5 xl:text-lg/7 font-instrument font-medium italic">We are a publishing and art collective, and we like you and we love you and we need you.</h3><div id="body-text" class="max-w-[65ch] font-instrument text-sm/5 md:text-base/5 xl:text-lg/7 indent-8 space-y-2"><p>We believe in community through friendship, and knowledge through community. We publish words not only in print, but on everyday and fine art objects. We hope to proliferate theory, cultural mythologies, and the work of emerging/underrepresented writers––areas especially important to us as queer artists of color. We want words in your kitchen and your bathroom and your car (if you have one) and on your body and head and feet (if you have them).</p><p>Active Chapter was founded in 2024 by artists Eka Savajol, Lucia Mumma, Max Chu, and XY Zhou. Our intern is Jojo Savajol. Web design by Liam Tsang.</p><p>Our current project is In the Mood for Love, as a part of What Can We Do? artist grant received from Asian American Arts Alliance. We are working with people living in Chinatown, New York to collect their stories and perspectives themed around love. Stay tuned.</p><p>Get in touch! <a class="underline" href="mailto:activechapterpublishing@gmail.com" target="_blank">activechapterpublishing@gmail.com</a></p></div><div><h3 class="pb-2 text-sm/5 md:text-base/5 xl:text-lg/7 font-instrument font-medium italic">Markets & Stockists</h3><ul class="text-sm/5 md:text-base/5 xl:text-lg/7"><li>2025-Present Dreamers Coffee House, New York, NY</li><li>2025-Present Human Relations, Brooklyn, NY</li><li>2025-Present Hive Mind Books, Brooklyn, NY</li><li>2025 Everything Must Go , Rash, Brooklyn, NY</li><li>2024 Trans Art Bazaar, Brooklyn, NY</li><li>2024 Furuba Market, Brooklyn, NY</li><li>2023 am:pm gallery, Brooklyn, NY</li></ul></div><div><h3 class="pb-2 text-sm/5 md:text-base/5 xl:text-lg/7 font-instrument font-medium italic">Grants & Awards</h3><ul class="text-sm/5 md:text-base/5 xl:text-lg/7"><li>2025 What Can We Do? Artist Grant, Asian American Arts Alliance</li></ul></div><img alt="Photo of active chapter members" class="outline outline-black outline-[1px]" width="400" height="200" src="/about.jpeg" /></section>');
