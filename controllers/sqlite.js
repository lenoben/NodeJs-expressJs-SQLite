const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const dbPath = path.join(__dirname, "..", "database", "file.db");
const slugify = require("slugify");
const { marked } = require("marked");
const createDomPurifier = require("dompurify");
const { JSDOM } = require("jsdom");
const dompurify = createDomPurifier(new JSDOM().window);

//marked.use(require("marked-mangle"));

const markdownCleaning = (markdown) => {
  return dompurify.sanitize(
    marked.parse(markdown, {
      mangle: false,
      headerIds: false,
    })
  );
};

const slugging = (title) => {
  let sl = slugify(title, { lower: true, strict: true });
  return sl;
};

let db;

function generateUniqueId() {
  return Date.now();
}

const initAllDb = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
      if (err) reject(err);
      console.log("database success on ", dbPath);
      const createBlogItemTable = `
        CREATE TABLE IF NOT EXISTS blog_article (
          blog_id INTEGER PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT DEFAULT " ",
          markdown TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
      `;

      const createTables = () => {
        return new Promise((resolve, reject) => {
          db.run(createBlogItemTable, (err) => {
            if (err) reject(err);
            console.log("blog_article table created");
            resolve();
          });
        });
      };

      createTables().then(resolve).catch(reject);
    });
  });
};

const shutDb = async () => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

//blog_article
const addDbBlog_article = async (value) => {
  return new Promise((resolve, reject) => {
    let addSQL = `INSERT INTO blog_article (blog_id, title, description, markdown, createdAt) VALUES(?,?,?,?,datetime('now','localtime'));`;
    db.run(
      addSQL,
      [generateUniqueId(), value.title, value.description, value.markdown],
      (err) => {
        if (err) {
          console.log("dbBlog_article insert error", err);
          reject(err);
        }
        resolve();
      }
    );
  });
};

const addDbBlog_articleReturnItem = async (value) => {
  const timestamp = generateUniqueId();
  const slugtext = slugging(value.title.toString());
  const smd = markdownCleaning(value.markdown.toString());
  return new Promise((resolve, reject) => {
    let addSQL = `INSERT INTO blog_article (blog_id, title, description, markdown, slug, sanitizedMarkdown, createdAt) VALUES(?,?,?,?,?,?,datetime('now','localtime'));`;
    db.run(
      addSQL,
      [
        timestamp,
        value.title,
        value.description,
        value.markdown,
        slugtext,
        smd,
      ],
      (err) => {
        if (err) {
          console.log("dbBlog_article insert error", err);
          reject(err);
        }
        resolve({
          id: timestamp,
          slug: slugtext,
        });
      }
    );
  });
};

const putDbBlog_articleReturnItem = async (value) => {
  const smd = markdownCleaning(value.markdown.toString());
  return new Promise((resolve, reject) => {
    let upSQL = `
    UPDATE blog_article
    SET title = ?,
        description = ?,
        markdown = ?,
        sanitizedMarkdown = ?,
        createdAt = datetime('now','localtime')
    WHERE blog_id = ?;
  `;
    db.run(
      upSQL,
      [value.title, value.description, value.markdown, smd, value.blog_id],
      (err) => {
        if (err) {
          console.log("dbBlog_article update error", err);
          reject(err);
        }
        resolve({
          id: value.blog_id,
          slug: value.slug,
        });
      }
    );
  });
};

const getAllDbBlog_article = async (direction) => {
  let qQuery;
  if (direction) {
    qQuery = "SELECT * FROM blog_article ORDER BY createdAt DESC;";
  } else {
    qQuery = "SELECT * FROM blog_article;";
  }
  return new Promise((resolve, reject) => {
    db.all(qQuery, [], (err, result) => {
      if (err) reject(err);
      else {
        resolve(result);
      }
    });
  });
};
const getLimitDbBlog_article = async () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM blog_article LIMIT 10;", [], (err, result) => {
      if (err) reject(err);
      else {
        resolve(
          result.map((item) => {
            return item.blog_id;
          })
        );
      }
    });
  });
};

const getDbBlog_articleById = async (id) => {
  return new Promise((resolve, reject) => {
    let getSQL = `SELECT * FROM blog_article WHERE blog_id =${id};`;
    db.all(getSQL, [], (err, result) => {
      if (err) return reject(err);
      else {
        resolve(result[0]); //returns the first one in the array
      }
    });
  });
};

const getDbBlog_articleBySlug = async (slug) => {
  return new Promise((resolve, reject) => {
    let getSQL = `SELECT * FROM blog_article WHERE slug = "${slug}";`;
    db.all(getSQL, [], (err, result) => {
      if (err) return reject(err);
      else {
        resolve(result[0]); //returns the first one in the array
      }
    });
  });
};

const delDbBlog_articleById = async (id) => {
  let delsql = `DELETE FROM blog_article WHERE blog_id = ${id}`;
  return new Promise((resolve, reject) => {
    db.run(delsql, [], (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
};

const updateDbBlog_article = async (id) => {};
//end of blog_article

module.exports = {
  initAllDb,
  blog: {
    addDbBlog_article,
    addDbBlog_articleReturnItem,
    putDbBlog_articleReturnItem,
    getAllDbBlog_article,
    getLimitDbBlog_article,
    getDbBlog_articleById,
    getDbBlog_articleBySlug,
    delDbBlog_articleById,
  },
};
