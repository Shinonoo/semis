//instantiation
const express = require("express")
const app =  express();
const mysql = require("mysql")
const moment = require("moment")

const PORT = process.env.PORT  || 5001

const logger = (req, res, next) => {
  console.log(`
    ${req.protocol}://${req.get("host")} ${req.originalUrl} : ${moment().format()}`
  )
  next();
}

app.use(logger);



const connection = mysql.createConnection({
    host: "bdzen9c82siaaxpkfvsw-mysql.services.clever-cloud.com",
    user: "u8tir7uqflwqklj5",
    password: "YByaajR7V1u1eqRDTQPA",
    database: "employee",
});

connection.connect();

//REPORT - CRUD
app.get("/api/members", (req, res) => {
    connection.query("SELECT * FROM userdata", (err, rows, fields) =>{
      if(err) throw err;
      res.json(rows)
    })
})


//REPORT - CRUD - SEARCH
app.get("/api/members/:id", (req, res) => {
    const id = req.params.id
    //res.send(id)
    connection.query(`SELECT * FROM userdata WHERE id=${id}`, (err, rows, fields) => {
      if(err) throw err
      if(rows.length > 0){
        res.json(rows)
      }
      else{
        res.status(400).json({msg:`${id} not found`})
      }

    })
}) 

//POST
//CRUDE CREATE - CRUD
app.use(express.urlencoded({extended:false}))
app.post("/api/members", (req, res) => {
    const fname = req.body.fname;//Juan
    const lname = req.body.lname;//Dela Cruz
    const email = req.body.email;//juan@gmail.com
    const gender = req.body.gender;//male

    connection.query(`INSERT INTO userdata (first_name, last_name, email, gender) VALUES ('${fname}', '${lname}', '${email}', '${gender}')`, (err, rows, fields) => {
      if(err) throw err;
      res.json({msg: `Successfully inserted`})
    })
})


//PUT
//UPDATE - CRUD
app.use(express.urlencoded({extended:false}))
app.put("/api/members", (req, res) => {
  const fname = req.body.fname;//Juan
  const lname = req.body.lname;//Dela Cruz
  const email = req.body.email;//juan@gmail.com
  const gender = req.body.gender;//male
  const id = req.body.id;
  connection.query(`UPDATE userdata SET first_name = '${fname}', last_name = '${lname}', email = '${email}', gender = '${gender}' WHERE id = '${id}'`, (err, rows, fields) => {
    if(err) throw err;
    res.json({msg: `Successfully updated`})
  })
})

//DELETE
app.use(express.urlencoded({extended:false}))
app.delete("/api/members/", (req,res) => {
  const id = req.body.id;
  connection.query(`DELETE FROM userdata  WHERE id = '${id}'`, (err, rows, fields) => {
    if(err) throw err;
    res.json({msg: `Successfully deleted`})
  })

})


app.listen(5001, () => {
    console.log(`Server is running in port ${PORT}`);
})
