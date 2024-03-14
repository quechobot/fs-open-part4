const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    for (let blog of helper.initialBlogs) {
        let blogObject = new Blog(blog)
        await blogObject.save()
    }
})

test('blogs returned are correct', async () => {
    const response =await api.get('/api/blogs')
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
    await api.post('/api/blogs').send(newBlog).expect(201)
        .expect('Content-Type', /application\/json/)
    const blogs = await helper.blogsInDb()
    expect(blogs).toHaveLength(helper.initialBlogs.length + 1)
    const contents = blogs.map(n => n.title)
    expect(contents).toContain('React patterns')
})
afterAll(() => {
    mongoose.connection.close()
})