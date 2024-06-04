const express = require("express")
const app = express()
const PORT = 3000
 
app.use(express.static('public'))

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`)
})

app.get("/", (request, response) => {
  response.sendFile('./public/index.html');
})

app.get("/hardcore", (request, response) => {
  response.sendFile('./public/hardcore-index.html');
})