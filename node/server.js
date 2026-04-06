import express from "express";
import postgres from "postgres";

const app = express();
app.use(express.urlencoded({ extended: true }));

const sql = postgres({
    host: process.env.NODE_ENV === "production" ? "db" : "localhost",
    port: 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

app.get("/", async (req, res) => {
    try {
        const users = await sql`SELECT * FROM users`;

        let rows = users.map((user) => `<li>${user.name}</li>`).join("");

        res.send(`
            <h1>Guestbook</h1>
            <form action="/add" method="POST">
                <input type="text" name="username" required>
                <button>Add</button>
            </form>
            <ul>${rows}</ul>
        `);
    } catch (err) {
        res.status(500).send("Database Error: " + err.message);
    }
});

app.post("/add", async (req, res) => {
    try {
        const { username } = req.body;
        await sql`INSERT INTO users (name) VALUES (${username})`;

        res.redirect("/");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
