const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require("bcrypt");
const {blogsInDb} = require("./test_helper");

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    for (let blog of helper.initialBlogs) {
        let blogObject = new Blog(blog)
        await blogObject.save()
    }
    for (let user of helper.initialUsers) {
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(user.password, saltRounds)
        const username = user.username
        const name = user.name
        const userObject = new User({ username, name, passwordHash})
        await userObject.save()

    }
    const users = await helper.usersInDb()
    const blogs = await helper.blogsInDb()
    for (let blog of blogs){
        const random = Math.round(Math.random())
        const user = users[random]
        const blogUpdate = {
            user: user.id
        }
        await Blog.findByIdAndUpdate(blog.id, blogUpdate, { new: true })
    }
})

test('blogs returned are correct', async () => {
    const response =await api.get('/api/blogs')
    const users = await api.get('/api/users')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('search for an id', async () => {
    const response = await api.get('/api/blogs')
    blogs = response.body
    expect(blogs.map(blog=>blog.id)).not.toEqual(expect.arrayContaining([undefined]));
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7
    }
    const response = await api.post('/api/login').send({ username: 'quechobot', password: 'test' })
    const token = response.body.token
    await api.post('/api/blogs').set('Authorization', 'Bearer ' + token)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    const blogs = await helper.blogsInDb()
    expect(blogs).toHaveLength(helper.initialBlogs.length + 1)
    const contents = blogs.map(n => n.title)
    expect(contents).toContain('React patterns')
})

test('missing like in request post 0 likes', async () => {
    const newBlog = {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
    }
    const response = await api.post('/api/login').send({ username: 'quechobot', password: 'test' })
    const token = response.body.token
    await api.post('/api/blogs').set('Authorization', 'Bearer ' + token)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    const blogs = await helper.blogsInDb()
    const blog = blogs.filter(blog => blog.title === newBlog.title)
    expect(blog[0].likes).toBe(0)
})
test('a blog without title, url response bad request', async () => {
    const newBlogNoUrl = {
        title: "React patterns",
        author: "Michael Chan",
        likes: 7
    }
    const response = await api.post('/api/login').send({ username: 'quechobot', password: 'test' })
    const token = response.body.token
    await api.post('/api/blogs').set('Authorization', 'Bearer ' + token)
          .send(newBlogNoUrl)
          .expect(400)
    const newBlogNoTitle = {
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7
    }
    await api.post('/api/blogs').set('Authorization', 'Bearer ' + token)
          .send(newBlogNoTitle)
          .expect(400)
    const newBlog = {
        author: "Michael Chan",
        likes: 7
    }
    await api.post('/api/blogs').set('Authorization', 'Bearer ' + token)
          .send(newBlog)
          .expect(400)
})


test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    const userInDb = await User.findById(blogToDelete.user.toString())
    const password = helper.initialUsers.find(user => user.username == userInDb.username).password
    const response = await api.post('/api/login').send({ username: userInDb.username, password: password })
    const token = response.body.token
    await api.delete(`/api/blogs/${blogToDelete.id}`).set('Authorization', 'Bearer ' + token)
        .expect(204)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length - 1
    )
})

test('succeeds with status code 201 when update likes +1', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const updateBody = {
        likes: blogToUpdate.likes+1
    }
    await api.put(`/api/blogs/${blogToUpdate.id}`).send(updateBody).expect(201)
    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd[0]
    expect(updatedBlog.likes).toBe(blogToUpdate.likes+1)
})

test('unauthorized with no token given', async () => {
    const newBlog = {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7
    }
    await api.post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)
    const blogs = await helper.blogsInDb()
    expect(blogs).toHaveLength(helper.initialBlogs.length)
})
afterAll(() => {
    mongoose.connection.close()
})