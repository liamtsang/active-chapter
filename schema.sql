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
