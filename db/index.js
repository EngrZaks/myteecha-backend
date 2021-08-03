module.exports.course_schema = {
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
};

module.exports.comments_schema = {
  comment: String,
  course_title: String,
  course_id: String,
  author_id: Number,
};

module.exports.user_schema = {
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
};
