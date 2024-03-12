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

const favoriteBlog = (blogs) => {
    const mostLikedBLog = _.maxBy(blogs, 'likes')
    return {'title':mostLikedBLog['title'], 'author': mostLikedBLog['author'], 'likes':mostLikedBLog['likes']}
}

const mostBlogs = (blogs) => {
    const blogsByAuthor = _.countBy(blogs,'author')
    const maxBlogger =  blogsByAuthor.length !== 0 ? _.maxBy(_.toPairs(blogsByAuthor), ([clave, valor]) => valor) : ["no data", 0]
    return {'author': maxBlogger[0], 'blogs': maxBlogger[1]}
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
    favoriteBlog,
    mostLikes,
    mostBlogs
}