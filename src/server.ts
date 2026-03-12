import express from "express";
import cookieParser from "cookie-parser";
import expressEjsLayouts from "express-ejs-layouts";
import session from "express-session";
import routes from "./routes";
import flash from "express-flash";
import path from "path";

const app = express();

// View Engine Setup
app.set("views", path.join(process.cwd(), "src/views"));
app.set("view engine", "ejs");

app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: true,
    }),
);

app.use(flash());

// Parse JSON bodies from incoming requests
app.use(express.json());
// Parse URL-encoded bodies from incoming requests
app.use(express.urlencoded({ extended: true }));
// Parse cookies from incoming requests
app.use(cookieParser());
// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));
// Use express-ejs-layouts for layout management
app.use(expressEjsLayouts);

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use("/", routes);

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
