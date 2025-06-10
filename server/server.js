// Import express.js
import express from "express";
// import axios
import axios from "axios";
// import body parser
import bodyParser from "body-parser";
// import module path
import path from "path";

// declare express
const app = express();
// declare port
const port = 3000;
// lokasi API buat kirim data ke DB
const API_URL = "http://localhost:4000";

// buat urusan file, biar bisa kerja dimanapun
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
// minta alamat ke server.js
const __dirname = dirname(fileURLToPath(import.meta.url));
// dapetin alamat ke public
const publicAddress = path.join(__dirname,'..','client/public');
// Biar express bisa akses static file(css,js,image)
app.use(express.static(publicAddress));


// middleware body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// akses ke page home
app.get('/',(req,res) => {
    res.sendFile(path.join(publicAddress,'index.html'));
})

// akses ke page history
app.get('/history',(req,res) => {
    res.sendFile(path.join(publicAddress,'history.html'));
})

// akses ke page program akademik
app.get('/akademik',(req,res) => {
    res.sendFile(path.join(publicAddress,'academics.html'));
})

// akses ke program pembinaan intensif
app.get('/intensif',(req,res) => {
    res.sendFile(path.join(publicAddress,'intensivetraining.html'));
})

// akses ke kalender
app.get('/kalender',(req,res) => {
    res.sendFile(path.join(publicAddress,'calendar.html'));
})

// akses ke admisi
app.get('/admisi',(req,res) => {
    res.sendFile(path.join(publicAddress,'admissions.html'));
})

// akses ke podcast
app.get('/podcast',(req,res) => {
    res.sendFile(path.join(publicAddress,'podcast.html'));
})

// Ngirim data pesantren
app.post("/data", async(req,res) => {
    const dataDiterima = req.body
    await axios.post('/datasiswa',dataDiterima);
})

// port
app.listen(port,() =>{
    console.log(`Port is listening on ${port}`);
});

