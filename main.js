import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();

const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "bookNotes",
    password: "123456",
    port: 5433
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function getCategories() {
    const result = await db.query("SELECT DISTINCT unnest(category) AS category FROM notes");
    console.log(result.rows);
    return result.rows;
}

const categories = await getCategories();

app.get("/", async (req, res) => {
    let query = "SELECT * FROM notes";
    let params = [];
    let sortTitle = "Best Rated";
    const sortType = req.query.sort;
    const category = req.query.category;
    const search = req.query["search-title"];
    if (sortType) {
        if (sortType === "best") {
            sortTitle = "Best Rated";
            query += " ORDER BY rating DESC";
        }
        else if (sortType === "latest") {
            sortTitle = "Latest";
            query += " ORDER BY created_at DESC";
        }
        else if (sortType === "favourite") {
            sortTitle = "Favourites";
            query += " WHERE favourite = TRUE";
        }
    }

    else if (category) {
        sortTitle = category;
        query += " WHERE $1 = ANY(category)";
        params.push(category);
    }

    else if (search) {
        sortTitle = `Results for ${search}`;
        query += category ? ' AND LOWER(title) LIKE LOWER($2)' : ' WHERE LOWER(title) LIKE LOWER($1)';
        params.push(`%${search}%`);
    }
    const result = await db.query(query, params);
    const notes = result.rows;
    res.render("list.ejs", { pageTitle: "Home Page", notes: notes, categories: categories, sortTitle: sortTitle });
});

app.get("/notes/new", (req, res)=>{
    res.render("form.ejs", {pageTitle : "New Note", categories : categories});
});

app.get("/notes/:id", async (req, res) => {
    const id = req.params.id;
    const result = await db.query("SELECT * FROM notes WHERE id = $1", [id]);
    const note = result.rows[0];
    console.log(note);
    res.render("view.ejs", { pageTitle: "View Note", categories: categories, note : note });
});



app.listen(port, () => {
    console.log(`App running on port ${port}`);
})
