const express = require('express');
const cors = require('cors'); 
const { Client } = require('pg');
const e = require('express');
require('dotenv').config();
const app = express();
app.use(cors()); 
app.use(express.json()); 



const client = new Client({
  connectionString: process.env.DATABASE_URL
});

client.connect()
  .then(() => console.log('Connesso al database Neon con successo!'))
  .catch(err => console.error('Errore di connessione al DB:', err.stack));


app.post("/api/partiteRow", async(req, res)=>{
  const query= `
  select p.id_partita, s.nome as nome1, p.giorno, s2.nome as nome2, s.icon as icon1, s2.icon as icon2
  from partite p join squadre s on p.squadra1=s.nome join squadre s2 on p.squadra2=s2.nome`;
  try{
    const risultato= await client.query(query);
    res.json(risultato);
  }catch(errore){
    console.log(errore);
  }



});

app.post("/api/partite", async(req, res)=>{
  const query="select p.id_partita, p.squadra1, p.squadra2, risultato1, risultato2, giorno, s.icon as icon1, s2.icon as icon2 from partite p join squadre s on p.squadra1=s.nome join squadre s2 on p.squadra2= s2.nome order by giorno";
  try{
    const risultato= await client.query(query);
    res.json(risultato);
  }catch(errore){
    console.log(errore);
  }
});


app.post("/api/classifica", async(req, res)=>{
  const query= "select * from squadre order by punti";
  try{
    const risultato= await client.query(query);
    console.log(risultato);
    res.json(risultato);
  }catch(errore){
    console.error(errore);
  }


});


app.post("/api/partitemancanti", async(req, res)=>{
  const query= "select p.id_partita, s1.icon as icon1, s2.icon as icon2, p.giorno, p.squadra1, p.squadra2, p.risultato1, p.risultato2, s1.nome, s2.nome from partite p join squadre s1 on p.squadra1=s1.nome join squadre s2 on p.squadra2=s2.nome where squadra1=$1 or squadra2=$1 order by giorno";
  const {nome}= req.body;
  try{
    const risultato = await client.query(query, [nome]);
    res.json(risultato);
  }catch(errore){
    console.log("Errore", errore);
  }



});

app.post("/api/classificaCompleta", async(req, res)=>{
  const query="select * from squadre order by punti";
  try{
    const risultato= await client.query(query);
    res.json(risultato);
  }catch(errore){
    console.log("Errore", errore);
  }


});

app.post("/api/componentiSquadra", async(req,res)=>{
  const query= "select * from giocatori where squadra_giocatore=$1";
  const {nomeSquadra}= req.body;
  try{
    const risultato= await client.query(query, [nomeSquadra]);
    res.json(risultato);
  }catch(errore){
    console.log(errore);
  }


});

app.post("/api/cercaPartita", async(req, res)=>{
  const query= "select * from partite where id_partita=$1";
  const {id_partita}=req.body;
  console.log({id_partita});

  try{
    const risultato= await client.query(query, [id_partita]);
    res.json(risultato);
  }catch(errore){
    console.log(errore);
  }
});


app.post("/api/dettagliPartita", async(req, res)=>{
    const query= `
    select p.id_partita, p.squadra1, p.squadra2, p.risultato1, p.risultato2, s1.icon as icon1, s2.icon as icon2
    from partite p join squadre s1 on p.squadra1=s1.nome join squadre s2 on p.squadra2=s2.nome
    where p.id_partita=$1
  `;
  const {id_partita}= req.body;

  try{
    const risultato= await client.query(query, [id_partita]);
    console.log(risultato);
    res.json(risultato);

  }catch(errore){
    console.log(errore);
  }

});
app.post("/api/allEventi", async(req, res)=>{
  const {id_partita}= req.body;
  const query= "select s.icon, s.icon_square, e.evento_info, e.giocatore from eventi e join giocatori g on e.giocatore=g.nome_giocatore join squadre s on s.nome=g.squadra_giocatore where id_partita=$1"
  try{
    const risultato= await client.query(query, [id_partita]);
    res.json(risultato);
  console.log("Stocazzo",id_partita);

  }catch(errore){
    console.log(errore);
  }
});

app.listen(3001, () => {
  console.log('Server in ascolto sulla porta 3001!');
});