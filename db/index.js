const mongo = require("mongodb"),
  mongoose = require("mongoose"),
  course_schema = {
    title: String,
    description: String,
    courseImage: String,
    slideUrl: String,
    topics: [
      {
        title: String,
        videos: {
          Url: String,
          title: String,
          description: String,
          viewed: Boolean,
        },
        pdfs: {
          title: String,
          url: String,
          opened: Boolean,
        },
      },
    ],
  },
  comments_schema = {
    comment: String,
    course_title: String,
    course_id: String,
    author_id: Number,
  },
  user_schema = {
    role: String,
    email: String,
    name: String,
    password: String,
    age: Number,
    gender: String,
    phone: String,
    dateOfBirth: String,
    dateJoined: String,
    profileImage: String,
    location: {},
    courses: [{}],
  },
  userSchema = new mongoose.Schema(user_schema),
  courseSchema = new mongoose.Schema(course_schema),
  commentSchema = new mongoose.Schema(comments_schema);
module.exports.User = mongoose.model("User", userSchema);
module.exports.Course = mongoose.model("Course", courseSchema);
module.exports.Comment = mongoose.model("Comment", commentSchema);
