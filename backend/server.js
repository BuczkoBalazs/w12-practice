const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 9000;
app.get("/", (request, response, next)=>{
    response.sendFile(path.join(`${__dirname}/../frontend/index.html`));
});

app.get("/kismacska", (request, response, next)=>{
    response.sendFile(path.join(`${__dirname}/../frontend/somefile.json`));
});

app.get("/something", (request, response, next)=>{
    console.log("Request received for something endpoint.")
    response.send("Thank you for Your request! This is our response for something endpoint.")
});

app.get("/api/v1/users", (request, response, next)=>{
    console.log("Request received for users endpoint")
    response.sendFile(path.join(`${__dirname}/../frontend/users.json`));

/*     const users = [
        {
            name: "John",
            surname: "Doe",
            status: "active",
        },
        {
            name: "Jane",
            surname: "Scotch",
            status: "passive",
        }
    ]
    response.send(JSON.stringify(users))
 */
});

app.get("/api/v1/users/active", (request, response, next)=>{
    fs.readFile("../frontend/users.json", (error, data) => {
        if (error) {
            response.send("Error just happened")
        } else {
            const users = JSON.parse(data);
            // const activeUsers = users.filter(user => user.status === "active");
            response.send(users.filter(user => user.status === "active"));
        }
    })
});

app.get("/api/v1/users/passive", (request, response, next)=>{
    fs.readFile("../frontend/users.json", (error, data) => {
        if (error) {
            response.send("Error just happened")
        } else {
            const users = JSON.parse(data);
            // const activeUsers = users.filter(user => user.status === "passive");
            response.send(users.filter(user => user.status === "passive"));
        }
    })

});

app.use('/pub', express.static(`${__dirname}/../frontend/public`));

app.listen(port, ()=>{
    console.log(`http://127.0.0.1:${port}`)
});