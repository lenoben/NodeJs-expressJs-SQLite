--# deletes everything in the table
DELETE FROM fileitem;
DELETE FROM blog_article;

SELECT * FROM fileitem WHERE fileitem.file_id = 1680826078688;

SELECT * FROM blog_article WHERE slug = "g2811";