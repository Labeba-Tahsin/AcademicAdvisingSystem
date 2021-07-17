const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

const app = express();
const routes = require("./server/routes") // new
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", routes);

// mongoose.connect("mongodb+srv://testuser:testuser123@cluster0.bdpmg.mongodb.net/academia?retryWrites=true&w=majority", {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true
// })
//     .then(() => {
//         console.log('Connected to database ');

//     })
//     .catch((err) => {
//         console.error(`Error connecting to the database. \n${err}`);
//     });
const XRegExp = require('xregexp');

app.listen(5000, () => {
    const validChar = XRegExp('[\p{L}]*');
    const invalidChar = XRegExp('[&$@=;:+,?\{^}%`\'\"><~#|\\[\\]]');
    const text = '2021 06 30 - Contrat cadre QR SAS JF Gillet - Déc 2022 revu JFG - BC (2021-09).docx.pdf';
    const containsValidCharacter = validChar.test(text) && !invalidChar.test(text);
    console.log(containsValidCharacter);
    if (!containsValidCharacter) {
        console.log(`Invalid file name. Some charecters are not allowed (for example: & $ @ = ; : + , ? { ^ } % \` ' " > < ~ # | [ ] )`);
    }

    //console.log(`Server has started in ${port}`)
})

