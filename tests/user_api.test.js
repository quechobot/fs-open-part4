const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const bcrypt = require("bcrypt");

describe('testing validation of users', () => {

    beforeEach(async () => {
        await User.deleteMany({})
        for (let user of helper.initialUsers) {
            const saltRounds = 10
            const passwordHash = await bcrypt.hash(user.password, saltRounds)
            const username = user.username
            const name = user.name
            const userObject = new User({ username, name, passwordHash})
            await userObject.save()
        }
    })

    test("user with password invalid length; does not create a new user in db", async ()=> {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: "test",
            name: "fail",
            password: "12"
        }
        const response = await api.post('/api/users')
            .send(newUser)
            .expect(400)
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test("user with no password; does not create a new user in db", async ()=> {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: "test",
            name: "fail"
        }
        const response = await api.post('/api/users')
            .send(newUser)
            .expect(400)
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test("user with invalid username; does not create a new user in db", async ()=> {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: "te",
            name: "fail",
            password: "123"
        }
        const response = await api.post('/api/users')
            .send(newUser)
            .expect(400)
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })


    test("user with no username; does not create a new user in db", async ()=> {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            name: "fail",
            password: "123"
        }
        const response = await api.post('/api/users')
            .send(newUser)
            .expect(400)
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})