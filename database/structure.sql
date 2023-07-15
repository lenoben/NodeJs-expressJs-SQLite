/* CREATE TABLE IF NOT EXISTS fileitem (
    file_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT DEFAULT " ",
    data BLOB NOT NULL
); */

DROP TABLE IF EXISTS fileitem;

--# inserts

INSERT INTO fileitem (name,data)
VALUES ("testing 3", "bloding 3");

--# instead of using blod use file system and save the source to the file in the database
CREATE TABLE IF NOT EXISTS fileitem (
    file_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT DEFAULT "",
    data_src TEXT
);

CREATE TABLE IF NOT EXISTS blog_article (
    blog_id INTEGER PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT " ",
    markdown TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS blog_article_temp;

INSERT INTO blog_article (blog_id, title, markdown, createdAt)
VALUES (1234567890, "ArticleTEST", "ArticleTESTMARKDOWN", datetime('now','localtime'));

SELECT createdAt FROM blog_article where blog_id = 1234567890;

ALTER TABLE blog_article ADD COLUMN slug TEXT NOT NULL;

CREATE TABLE IF NOT EXISTS blog_article (
    blog_id INTEGER PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT " ",
    markdown TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bblog_article (
    blog_id INTEGER PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT " ",
    markdown TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO blog_article SELECT * FROM blog_article_temp;

DELETE FROM blog_article;

CREATE TABLE IF NOT EXISTS blog_article_temp (
    blog_id INTEGER PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT " ",
    markdown TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    sanitizedMarkdown TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
*******************************************
DROP TABLE IF EXISTS blog_article;

CREATE TABLE IF NOT EXISTS blog_article (
    blog_id INTEGER PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT " ",
    markdown TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    sanitizedMarkdown TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO blog_article SELECT * FROM blog_article_temp;

DROP TABLE IF EXISTS blog_article_temp;