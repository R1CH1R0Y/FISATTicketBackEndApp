const mongoose = require("mongoose")
const cors = require("cors")
const express = require("express")
const bcrypt = require("bcryptjs")
const { adminmodel } = require("./models/admin")
const { usermodel } = require("./models/user")
const { busmodel } = require("./models/bus")
const { ticketmodel } = require("./models/ticket")
const jwt = require("jsonwebtoken")

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://Richi2001:R1CH1R0Y@cluster0.ulfkc.mongodb.net/FisatBusTicketDB?retryWrites=true&w=majority&appName=Cluster0")

const generateHashedPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}

//Admin:

app.post("/adminsignup", async (req, res) => {
    let input = req.body
    let hashedPswd = await generateHashedPassword(input.pswd)
    input.pswd = hashedPswd
    let admin = new adminmodel(input)
    console.log(admin)
    admin.save()
    res.json({ status: "success" })
})

app.post("/adminsignin", (req, res) => {
    let input = req.body
    adminmodel.find({ "email": req.body.email }).then(
        (response) => {
            if (response.length > 0) {
                let dbpswd = response[0].pswd
                console.log(dbpswd)
                bcrypt.compare(input.pswd, dbpswd, (error, isMatch) => {
                    if (isMatch) {
                        jwt.sign({ email: input.email }, "fisat-bus-app", { expiresIn: "1d" }, (error, token) => {
                            if (error) {
                                res.json({ status: "unable to create token" })
                            } else {
                                res.json({ status: "success", "admin_id": response[0]._id, "token": token })
                            }
                        })
                    } else {
                        res.json({ status: "incorrect password" })
                    }
                })
            } else {
                res.json({ status: "incorrect email" })
            }
        }
    ).catch(
        (error) => {
            alert(error.message)
        }
    )
})

app.post("/viewadmins", (req, res) => {
    let token = req.headers["token"]
    jwt.verify(token, "fisat-bus-app", (error, decoded) => {
        if (error) {
            res.json({ status: "unauthorized access" })
        } else {
            if (decoded) {
                adminmodel.find().then(
                    (response) => {
                        res.json({ response })
                    }
                ).catch(
                    (error) => {
                        alert(error.message)
                    }
                )
            }
        }
    })
})

//User:

app.post("/usersignup", async (req, res) => {
    let input = req.body
    let hashedPswd = await generateHashedPassword(input.pswd)
    input.pswd = hashedPswd
    let user = new usermodel(input)
    console.log(user)
    user.save()
    res.json({ status: "success" })
})

app.post("/usersignin", (req, res) => {
    let input = req.body
    usermodel.find({ "email": req.body.email }).then(
        (response) => {
            if (response.length > 0) {
                let dbpswd = response[0].pswd
                console.log(dbpswd)
                bcrypt.compare(input.pswd, dbpswd, (error, isMatch) => {
                    if (isMatch) {
                        jwt.sign({ email: input.email }, "fisat-bus-app", { expiresIn: "1d" }, (error, token) => {
                            if (error) {
                                res.json({ status: "unable to create token" })
                            } else {
                                res.json({ status: "success", "user_id": response[0]._id, "token": token })
                            }
                        })
                    } else {
                        res.json({ status: "incorrect password" })
                    }
                })
            } else {
                res.json({ status: "incorrect email" })
            }
        }
    ).catch(
        (error) => {
            alert(error.message)
        }
    )
})

app.post("/viewusers", (req, res) => {
    let token = req.headers["token"]
    jwt.verify(token, "fisat-bus-app", (error, decoded) => {
        if (error) {
            res.json({ status: "unauthorized access" })
        } else {
            if (decoded) {
                usermodel.find().then(
                    (response) => {
                        res.json({ response })
                    }
                ).catch(
                    (error) => {
                        alert(error.message)
                    }
                )
            }
        }
    })
})

//Bus:

app.post("/add", (req, res) => {
    let input = req.body
    let bus = new busmodel(input)
    console.log(bus)
    bus.save()
    res.json({ status: "success" })
})

app.post("/search", (req, res) => {
    let input = req.body
    busmodel.find(input).then(
        (data) => {
            res.json(data)
        }
    ).catch(
        (error) => {
            alert(error.message)
        }
    )
})

app.post("/remove", (req, res) => {
    let input = req.body
    busmodel.findByIdAndDelete(input._id).then(
        (response) => {
            res.json({ status: "success" })
        }
    ).catch(
        (error) => {
            res.json({ status: "error" })
        }
    )
})

app.post("/view", (req, res) => {
    busmodel.find().then(
        (data) => {
            res.json(data)
        }
    ).catch(
        (error) => {
            alert(error.message)
        }
    )
})

app.post("/viewavailable", (req, res) => {
    busmodel.find({ available: true }).then(
        (data) => {
            res.json(data)
        }
    ).catch(
        (error) => {
            alert(error.message)
        }
    )
})

app.post("/makeAvailable", (req, res) => {
    let input = req.body
    busmodel.findByIdAndUpdate(input._id, { available: true }).then(
        (response) => {
            res.json({ status: "success" })
        }
    ).catch(
        (error) => {
            res.json({ status: "error" })
        }
    )
})

app.post("/makeNotAvailable", (req, res) => {
    let input = req.body
    busmodel.findByIdAndUpdate(input._id, { available: false }).then(
        (response) => {
            res.json({ status: "success" })
        }
    ).catch(
        (error) => {
            res.json({ status: "error" })
        }
    )
})

//Ticket:

app.post("/pay", (req, res) => {
    const { date, route, userId } = req.body;
    const ticket = new ticketmodel({ date, route, userId });
    ticket.save().then(() => {
        res.json({ status: "success" });
    }).catch((error) => {
        res.json({ status: "error" });
    });
});


app.listen(8835, () => {
    console.log("server started")
})