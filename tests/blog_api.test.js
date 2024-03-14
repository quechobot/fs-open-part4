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

test('missing like in request post 0 likes', async () => {
    const newBlog = {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
    }
    await api.post('/api/blogs').send(newBlog).expect(201)
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
    await api.post('/api/blogs').send(newBlogNoUrl).expect(400)
    const newBlogNoTitle = {
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7
    }
    await api.post('/api/blogs').send(newBlogNoTitle).expect(400)
    const newBlog = {
        author: "Michael Chan",
        likes: 7
    }
    await api.post('/api/blogs').send(newBlog).expect(400)
})

describe('deletion of a note', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(
            helper.initialBlogs.length - 1
        )
    })
})

describe('update of a note', () => {
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
})
afterAll(() => {
    mongoose.connection.close()
})