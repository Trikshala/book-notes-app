# NoteVault

**NoteVault** is a sleek and user-friendly web application that allows book lovers to preserve their thoughts, observations, and notes about the books they’ve read. It’s your personal vault for keeping track of your understanding, reflections, and insights.

## Features

- **CRUD Functionality**
  - Create new notes
  - View existing notes
  - Update notes
  - Delete notes
- **Sorting Options**
  - **Best Rated** – Display your highest-rated notes first
  - **Latest** – Show the newest notes at the top
  - **Category** – Organize notes by book genres
  - **Favourite** – Quickly access your favourite entries
- **Search**
  - Find notes instantly by book title
- **Book Cover Integration**
  - Fetches book cover images dynamically using the [Open Library Covers API](https://openlibrary.org/dev/docs/api/covers) to make notes more visually appealing.  
  - Example URL format: `https://covers.openlibrary.org/b/isbn/<ISBN>-S.jpg`
- **Clean and Interactive Interface**
  - Built with **EJS**, **CSS**, **JavaScript**, and **Bootstrap**

## What Sets NoteVault Apart

The combination of **aesthetic interface**, **book cover visuals**, and **powerful sorting features** makes managing and revisiting your book notes a breeze. Functional, intuitive, and enjoyable to use.

## Future Plans

- **Login & Authentication** – Keep notes private and user-specific
- **Advanced Features** – Tagging, note sharing, enhanced search, and more

## Technologies Used

- **Frontend:** EJS, HTML, CSS, JavaScript, Bootstrap  
- **Backend:** Node.js, Express.js  
- **Database:** PostgreSQL  
- **External APIs:** Book cover fetching API - [Open Library Covers API](https://openlibrary.org/dev/docs/api/covers)

## How to Run

1. **Clone the repository**

   ```bash
   git clone https://github.com/Trikshala/book-notes-app.git
   cd book-notes-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the application**

   ```bash
   node main.js
   ```

4. **Open in your browser**
   Go to:

   ```
   http://localhost:3000
   ```


