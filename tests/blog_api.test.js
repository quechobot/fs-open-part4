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

afterAll(() => {
    mongoose.connection.close()
})