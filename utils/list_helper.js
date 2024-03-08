const dummy = (blogs) => {
    return 1
}
const totalLikes = (blogs) => {
  const likes = blogs.length !== 0
      ? blogs.reduce((acc,current) =>acc + current.likes, 0)
      : 0;
  return likes
}
module.exports = {
    dummy,
    totalLikes
}