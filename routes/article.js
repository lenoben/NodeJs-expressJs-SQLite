const express = require("express");
const router = express.Router();
const path = require("path");
const sql = require("../controllers/sqlite");

/*
localhost:3000/article/
*/
router.get("/", async (req, res) => {
  const articles = await sql.blog["getAllDbBlog_article"](1); //1 MEANS DESC
  res.render(path.join(__dirname, "../views/article/index"), {
    boxes: articles,
  });
});

router.get("/new", (req, res) => {
  res.render(path.join(__dirname, "../views/article/new"), {
    value: {
      title: "",
      description: "",
      markdown: "",
    },
  });
});

router.get("/edit/:id", async (req, res) => {
  const data = await sql.blog.getDbBlog_articleById(req.params.id);
  res.render(path.join(__dirname, "../views/article/edit"), {
    value: data,
  });
});

router.get("/link/:slug", async (req, res) => {
  const article = await sql.blog["getDbBlog_articleBySlug"](req.params.slug);
  if (article == null) {
    res.redirect("/article");
    return;
  } else {
    res.render(path.join(__dirname, "../views/article/show"), {
      article: article,
    });
  }
});

router.post(
  "/new",
  async (req, res, next) => {
    req.value = {};
    next();
  },
  saveArticleAndRedirect("../views/article/new", "post")
);

router.put(
  "/:id",
  async (req, res, next) => {
    req.value = await sql.blog.getDbBlog_articleById(req.params.id);
    next();
  },
  saveArticleAndRedirect("../views/article/edit", "put")
);

function saveArticleAndRedirect(path, method) {
  return async (req, res) => {
    let value = req.value;
    value.title = req.body.title;
    value.description = req.body.description;
    value.markdown = req.body.markdown;
    if (req.body.title == "" && req.body.markdown == "") {
      res.render(path.join(__dirname, path), { value: value });
      return;
    }
    try {
      let data = {};
      data.slug = "";
      if (method == "post") {
        data = await sql.blog["addDbBlog_articleReturnItem"](value);
      }
      if (method == "put") {
        data = await sql.blog["putDbBlog_articleReturnItem"](value);
      }
      res.redirect(`/article/link/${data.slug}`);
    } catch (error) {
      console.error(error);
      res.render(path.join(__dirname, path), { value: value });
    }
  };
}

router.delete("/:id", async (req, res) => {
  await sql.blog["delDbBlog_articleById"](req.params.id);
  res.redirect("/article");
});

module.exports = router;
