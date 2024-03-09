var _ = require('lodash');
const {maxBy} = require("lodash/math");
const dummy = (blogs) => {
    return 1
}
const totalLikes = (blogs) => {
  const likes = blogs.length !== 0
      ? blogs.reduce((acc,current) =>acc + current.likes, 0)
      : 0;
  return likes
}

const mostBlogs = (blogs) => {
    const authors = (_.uniqBy(blogs, 'author')).map( blog => blog.author)
    const blogsByAuthor = _.countBy(blogs,'author')
    let maxBlogger = {author:undefined, blogs:0};
    authors.forEach( author => {
        let blogsByAuthor = blogs.filter(blog=>{
            return blog.author === author
        }).length
        if(blogsByAuthor > maxBlogger.blogs ){
            maxBlogger= {author: author, blogs: blogsByAuthor}
        }
    })
    return maxBlogger
}

const mostLikes = (blogs) => {
    const authors = (_.uniqBy(blogs, 'author')).map( blog => blog.author)
    let mostLiked = {author:undefined, likes:0}
    authors.forEach( author => {
        let blogsByAuthor = blogs.filter(blog=>{
            return blog.author === author
        })
        let likes = _.sumBy(blogsByAuthor, "likes")
        if(likes > mostLiked.likes ){
            mostLiked = {author: author, likes: likes}
        }
    })
    return mostLiked
}
module.exports = {
    dummy,
    totalLikes,
    mostLikes,
    mostBlogs
}