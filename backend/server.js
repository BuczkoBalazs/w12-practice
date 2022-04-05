const { response } = require("express");
const express = require("express");
const fs = require("fs");
const path = require("path");
const { stringify } = require("querystring");

const app = express();
const port = 9000;
const fFolder = `${__dirname}/../frontend`;

app.use(express.json());

app.use('/pub', express.static(`${fFolder}/public`));

app.get("/", (request, response, next)=>{
    response.sendFile(path.join(`${__dirname}/../frontend/index.html`));
});

app.get("/admin/order-view", (request, response, next)=>{
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
app.get("/api/v1/users-query", (request, response)=>{
    console.dir(request.query.apiKey);
    if (request.query.apiKey === "apple") {
        response.sendFile(path.join(`${__dirname}/../frontend/users.json`));
    } else {
        response.send("Unauthorized request");
    }
});

/* app.get("/api/v1/users-params/:key", (request, response)=>{
    console.dir(request.params);
    console.dir(request.params.key);
    if (request.params.key === "apple") {
        response.send("Csutkás laptop")
    } else {
        response.send("Rendes laptop")
    }
}); */

app.get("/api/v1/users-params/:key", (request, response)=>{
    // console.dir(request.params);
    // console.dir(request.params.key);
    if (request.params.key === "active") {
        fs.readFile("../frontend/users.json", (error, data) => {
            if (error) {
                response.send("Error just happened")
            } else {
                const users = JSON.parse(data);
                response.send(users.filter(user => user.status === "active"));
            }
        })
    }
    if (request.params.key === "passive") {
        fs.readFile("../frontend/users.json", (error, data) => {
            if (error) {
                response.send("Error just happened")
            } else {
                const users = JSON.parse(data);
                response.send(users.filter(user => user.status === "passive"));
            }
        })
    }
    if (request.params.key !== "passive" && request.params.key !== "active") {
        response.send("More, itt baj van.")
    }
});

/* 
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
 */

app.post("/users/new", (req,res) => {
    fs.readFile(`${fFolder}/users.json`, (error, data) => {
        if (error) {
            console.log(error);
            res.send("Error reading users file");
        } else {
            const users = JSON.parse(data);
            console.log(req.body);
            users.push(req.body);

            fs.writeFile(`${fFolder}/users.json`, JSON.stringify(users), error => {
                if (error) {
                    console.log(error)
                    res.send("Error wrinting users file")
                }
            })
            res.send(req.body);
        }
    })
})


app.listen(port, ()=>{
    console.log(`http://127.0.0.1:${port}`)
});