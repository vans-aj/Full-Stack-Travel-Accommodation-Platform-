//creating a admin route and sending a error with status 404
const express = require('express');
const app = express();
//defining a port
const port = 8080;
//creating a route for admin
//setting a port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
app.get('/admin', (req, res) => {
    res.status(404).send('Page not found');
});
//creating a route for home
app.get('/',(req,res)=>{
    res.send('Hello World');
})