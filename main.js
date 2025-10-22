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

let UnqCategories = await getCategories();

app.get("/", async (req, res) => {
    UnqCategories = await getCategories();
    let query = "SELECT * FROM notes";
    let conditions = [];
    let params = [];
    let sortTitle = "Best Rated";

    const sortType = req.query.sort;
    const category = req.query.category;
    const search = req.query["search-title"];

    if (category) {
        conditions.push(`$${params.length + 1} = ANY(category)`);
        params.push(category);
        sortTitle = category;
    }

    if (search) {
        conditions.push(`LOWER(title) LIKE LOWER($${params.length + 1})`);
        params.push(`%${search}%`);
        sortTitle = `Results for ${search}`;
    }

    if (sortType === "favourite") {
        conditions.push(`favourite = TRUE`);
        sortTitle = "Favourites";
    }

    if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
    }

    if (!sortType || sortType === "best") {
        query += " ORDER BY rating DESC";
    } else if (sortType === "latest") {
        query += " ORDER BY created_at DESC";
        sortTitle = "Latest";
    }

    const result = await db.query(query, params);
    const notes = result.rows;
    res.render("list.ejs", { pageTitle: "Home Page", notes: notes, categories: UnqCategories, sortTitle: sortTitle });
});

app.get("/notes/new", (req, res) => {
    const allCategories = ['Productivity', 'Classic', 'Sci-Fi', 'Self-Help', 'History', 'Philosophy', 'Biography', 'Poetry', 'Mystery', 'Fantasy', 'Psychology', 'Business', 'Technology', 'Horror', 'Romance', 'Adventure', 'Thriller', 'Comedy', 'Art & Design', 'Spirituality'];
    res.render("form.ejs", { pageTitle: "New Note", categories: UnqCategories, formTitle: "Create New Note", allCategories: allCategories, buttonType: "Create Note", action: "/notes/new", note: {} });
});

app.post("/notes/new", async (req, res) => {
    const name = req.body['book-name'];
    const author = req.body['book-author'];
    const isbn = req.body['book-isbn'];
    const notes = req.body['book-notes'];
    const categories = req.body.categories;
    const rating = parseInt(req.body.rating);
    const fav = req.body.favourite === 'true';
    await db.query("INSERT INTO notes(title, author, isbn, note, category, rating, favourite) VALUES($1, $2, $3, $4, $5, $6, $7)", [name, author, isbn, notes, categories, rating, fav]);
    console.log("Record inserted successfully!");
    res.redirect("/");
});

app.get("/notes/:id", async (req, res) => {
    const id = req.params.id;
    const result = await db.query("SELECT * FROM notes WHERE id = $1", [id]);
    const note = result.rows[0];
    console.log(note);
    res.render("view.ejs", { pageTitle: "View Note", categories: UnqCategories, note: note });
});

app.get("/edit/:id", async (req, res) => {
    const id = req.params.id;
    const result = await db.query("SELECT * FROM notes WHERE id = $1", [id]);
    const note = result.rows[0];
    const allCategories = ['Productivity', 'Classic', 'Sci-Fi', 'Self-Help', 'History', 'Philosophy', 'Biography', 'Poetry', 'Mystery', 'Fantasy', 'Psychology', 'Business', 'Technology', 'Horror', 'Romance', 'Adventure', 'Thriller', 'Comedy', 'Art & Design', 'Spirituality'];
    res.render("form.ejs", { pageTitle: "Update Note", categories: UnqCategories, formTitle: "Update Note", allCategories: allCategories, buttonType: "Update Note", action: `/edit/${note.id}`, note: note });

});

app.post("/edit/:id", async (req, res) => {
    const id = req.params.id;
    const {
        'book-name': name,
        'book-author': author,
        'book-isbn': isbn,
        'book-notes': notes,
        categories,
        rating,
        favourite
    } = req.body;

    await db.query(
        `UPDATE notes 
         SET title=$1, author=$2, isbn=$3, note=$4, category=$5, rating=$6, favourite=$7 
         WHERE id=$8`,
        [name, author, isbn, notes, categories, parseInt(rating), favourite === 'true', id]
    );

    res.redirect("/");
});

app.post("/delete/:id", async (req, res)=>{
    const id = req.params.id;
    await db.query("DELETE FROM notes WHERE id = $1", [id]);
    console.log("Successfully deleted record!")
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
})
