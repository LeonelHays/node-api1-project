// BUILD YOUR SERVER HERE
const express = require('express')
const Users = require('./users/model')

const server = express()

server.use(express.json())

server.get('/', (req, res) => {
    res.json({ message: 'Hello there! - Obiwan Kenobi' })
})

server.get('/api/users', async (req, res) => {
    try{
        const users = await Users.find()
        res.status(200).json(users)
    }catch(err){
        res.status(500).json({ message: "The users information could not be retrieved" })
    }
})

server.get('/api/users/:id', (req, res) => {
    Users.findById(req.params.id)
        .then(user => {
            if(!user) {
                res.status(404).json({
                    message: "The user with the specified ID does not exist"
                })
            }else {
                res.status(200).json(user)
            }
        })
        .catch(err => {
            res.status(500).json({
                errorMessage: err.message,
                message: "The user information could not be retrieved"
            })
        })
})

server.post('/api/users', async (req, res) => {
    try{
        const { name, bio } = req.body
        if(!name || !bio) {
            res.status(400).json({ message: "Please provide name and bio for the user" })
        } else {
            const newUser = await Users.insert({ name, bio })
            res.status(201).json(newUser)
        }
    }catch(err){
        res.status(500).json({ mssage: err.message })
    }
})

server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params
    Users.remove(id)
        .then(removedUser => {
            if(!removedUser) {
                res.status(404).json({ message: "The user with the specified ID does not exist" })
            } else {
                res.status(200).json(removedUser)
            }
        })
        .catch(err => {
            res.status(500).json({
            message: "The user could not be removed",
            errorMessage: err.message
        })
        })
})

server.put('/api/users/:id', async (req, res) => {
    try{
        const maybeUser = await Users.findById(req.params.id)
        if(!maybeUser){
            res.status(404).json({
                message: "The user with the specified ID does not exist"
            })
        } else {
            if(!req.body.name || !req.body.bio){
                res.status(400).json({
                    message: "Please provide name and bio for the user"
                })
            } else {
                const updatedUser = await Users.update(
                     req.params.id,
                     req.body
                )
                res.status(200).json(updatedUser)
            }
        }
    }catch(err){
        res.status(500).json({
            message: "The user information could not be modified"
        })
    }
})


module.exports = server; // EXPORT YOUR SERVER instead of {}
