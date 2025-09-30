import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();

const port = 3000;

const db = new pg.Client({
    user : "postgres",
    host : "localhost",
    database : "bookNotes",
    password : "123456",
    port : 5433
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function getCategories(){
    const result = await db.query("SELECT DISTINCT unnest(category) AS category FROM notes");
    console.log(result.rows); 
    return result.rows; 
}


app.get("/", async (req, res)=>{
    const categories = await getCategories();
    const result = await db.query("SELECT * FROM notes");
    const notes = result.rows;
    // console.log(notes);
    res.render("display.ejs",{pageTitle : "Home Page", notes : notes, categories : categories, sortTitle : "Best Rated"});
});
app.listen(port, ()=>{
    console.log(`App running on port ${port}`);
})
