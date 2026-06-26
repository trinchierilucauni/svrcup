const express = require('express');
const cors = require('cors'); 
const { Pool } = require('pg'); 
require('dotenv').config();

// Cattura errori non gestiti per evitare crash
process.on('uncaughtException', (err) => {
  console.error('⚠️ Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('⚠️ Unhandled Rejection:', reason);
});

const app = express();
app.use(cors()); 
app.use(express.json()); 

const isProduction = process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  max: 10,
  ssl: isProduction 
    ? { rejectUnauthorized: false } 
    : false
});

pool.on('error', (err) => {
  console.error('⚠️ Errore imprevisto sul client PostgreSQL:', err.message);
});

pool.query('SELECT NOW()')
  .then(() => console.log('Connesso al database Neon (tramite Pool) con successo!'))
  .catch(err => console.error('❌ Errore di connessione iniziale al DB:', err.message));

app.post("/api/partiteRow", async (req, res) => {
  const query = `
    select p.id_partita, s.nome as nome1, p.giorno, s2.nome as nome2, s.icon as icon1, s2.icon as icon2
    from partite p join squadre s on p.squadra1=s.nome join squadre s2 on p.squadra2=s2.nome order by giorno`;
  try {
    const risultato = await pool.query(query);
    res.json(risultato.rows);
  } catch (errore) {
    console.error(errore);
    res.status(500).json({ errore: "Errore del server" });
  }
});

app.post("/api/partite", async (req, res) => {
  const query = "select p.id_partita, p.squadra1, p.squadra2, risultato1, risultato2, giorno, s.icon as icon1, s2.icon as icon2 from partite p join squadre s on p.squadra1=s.nome join squadre s2 on p.squadra2= s2.nome order by giorno DESC";
  try {
    const risultato = await pool.query(query);
    res.json(risultato.rows);
  } catch (errore) {
    console.error(errore);
    res.status(500).json({ errore: "Errore del server" });
  }
});

app.post("/api/classifica", async (req, res) => {
  const query = "select * from squadre order by punti";
  try {
    const risultato = await pool.query(query);
    res.json(risultato.rows);
  } catch (errore) {
    console.error(errore);
    res.status(500).json({ errore: "Errore del server" });
  }
});

app.post("/api/partitemancanti", async (req, res) => {
  const query = "select p.id_partita, s1.icon as icon1, s2.icon as icon2, p.giorno, p.squadra1, p.squadra2, p.risultato1, p.risultato2, s1.nome, s2.nome from partite p join squadre s1 on p.squadra1=s1.nome join squadre s2 on p.squadra2=s2.nome where squadra1=$1 or squadra2=$1 order by giorno";
  const { nome } = req.body;
  try {
    const risultato = await pool.query(query, [nome]);
    res.json(risultato.rows);
  } catch (errore) {
    console.error("Errore", errore);
    res.status(500).json({ errore: "Errore del server" });
  }
});

app.post("/api/classificaCompleta", async (req, res) => {
  const query = "select * from squadre order by punti";
  try {
    const risultato = await pool.query(query);
    res.json(risultato.rows);
  } catch (errore) {
    console.error("Errore", errore);
    res.status(500).json({ errore: "Errore del server" });
  }
});

app.post("/api/componentiSquadra", async (req, res) => {
  const query = "select * from giocatori where squadra_giocatore=$1";
  const { nomeSquadra } = req.body;
  try {
    const risultato = await pool.query(query, [nomeSquadra]);
    res.json(risultato.rows);
  } catch (errore) {
    console.error(errore);
    res.status(500).json({ errore: "Errore del server" });
  }
});

app.post("/api/cercaPartita", async (req, res) => {
  const query = "select * from partite where id_partita=$1";
  const { id_partita } = req.body;
  try {
    const risultato = await pool.query(query, [id_partita]);
    res.json(risultato.rows);
  } catch (errore) {
    console.error(errore);
    res.status(500).json({ errore: "Errore del server" });
  }
});

app.post("/api/dettagliPartita", async (req, res) => {
  const query = `
    select p.id_partita, p.squadra1, p.squadra2, p.risultato1, p.risultato2, s1.icon as icon1, s2.icon as icon2
    from partite p join squadre s1 on p.squadra1=s1.nome join squadre s2 on p.squadra2=s2.nome
    where p.id_partita=$1
  `;
  const { id_partita } = req.body;
  try {
    const risultato = await pool.query(query, [id_partita]);
    res.json(risultato.rows);
  } catch (errore) {
    console.error(errore);
    res.status(500).json({ errore: "Errore del server" });
  }
});

app.post("/api/allEventi", async (req, res) => {
  const { id_partita } = req.body;
  const query = "select s.icon, s.icon_square, e.evento_info, e.giocatore from eventi e join giocatori g on e.giocatore=g.nome_giocatore join squadre s on s.nome=g.squadra_giocatore where id_partita=$1";
  try {
    const risultato = await pool.query(query, [id_partita]);
    res.json(risultato.rows);
  } catch (errore) {
    console.error(errore);
    res.status(500).json({ errore: "Errore del server" });
  }
});

app.post("/api/classificaGironeA", async (req, res) => {
  const query = "select * from classificagironi c join squadre s on c.nome_squadra=s.nome where girone='A' order by c.punti";
  try {
    const risultato = await pool.query(query);
    res.json(risultato.rows);
  } catch (errore) {
    console.error(errore);
    res.status(500).json({ errore: "Errore del server" });
  }
});

app.post("/api/classificaGironeB", async (req, res) => {
  const query = "select * from classificagironi c join squadre s on c.nome_squadra=s.nome where girone='B' order by c.punti";
  try {
    const risultato = await pool.query(query);
    res.json(risultato.rows);
  } catch (errore) {
    console.error(errore);
    res.status(500).json({ errore: "Errore del server" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}!`);
});