const express = require('express')
const path = require('path')
const mongoose= require("mongoose")
const LogData = require("./models/logdata.js");
const Signup = require("./models/signdata.js");

const app = express()
const port = 3000

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

main()
    .then(()=>{
        console.log("connection successful"); 
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/LoginSignup');
}

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login.ejs');
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    
    const user = await Signup.findOne({ email, password });

    if (user) {
        res.render("mainpage.ejs");
    } else {
        res.redirect("/signup");
    }
});

app.get('/signup', (req, res) => {
    res.render('signup.ejs', { error: null });
  });

app.post("/signup", async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.render('signup.ejs', { error: 'Passwords do not match' });
    }

    try {
        const existingUser = await Signup.findOne({ email });
        if (existingUser) {
            return res.render('signup.ejs', { error: 'Email already exists' });
        }

        // Remove confirmPassword before saving, as it's not part of the schema
        const newUser = new Signup({ name, email, password });
        const savedUser = await newUser.save();
        console.log("Saved User:", savedUser); 
        res.redirect("/login");
    } catch (err) {
        console.error("Signup Error:", err);
        res.send(`<h2>Error occurred! ${err.message}</h2>`);
    }
});

app.get("/mainpage", (req, res) => {
    res.render("mainpage.ejs");
});

const contributors = [
    {
        name: "Claude Shannon",
        image: "/images/crypto1.jpg",
        contribution: "🌟 Father of Information Theory - Established mathematical foundation for modern cryptography"
    },
    {
        name: "Alan Turing",
        image: "/images/crypto2.png",
        contribution: "🔓 Broke the Enigma code - Revolutionary work in computer science and cryptanalysis"
    },
    {
        name: "Whitfield Diffie",
        image: "/images/crypto3.png",
        contribution: "🔑 Co-invented public-key cryptography - Revolutionary secure communication method"
    },
    {
        name: "Martin Hellman",
        image: "/images/crypto4.png",
        contribution: "🛡️ Co-creator of Diffie-Hellman key exchange - Fundamental for secure internet communications"
    }
];


app.get("/explain", (req, res) => {
    res.render("explain.ejs", { contributors })
});

app.get("/detail", (req, res) => {
    res.render("detail.ejs");
});

app.post("/detail", (req, res) => {
    res.redirect("/mainpage");
});

app.get("/techniques", (req, res) => {
    res.render("techniques.ejs");
});

app.get("/games", (req, res) => {
    res.render("games.ejs");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

app.get("/discover", (req, res) => {
    res.render("discover.ejs");
});

app.get("/quiz", (req, res) => {
    res.render("quiz.ejs");
});