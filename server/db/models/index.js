const Sequelize = require('sequelize');
const db = require('../config/database');

// Table Definitions
const School = db.define('school', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const User = db.define('user', {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  fName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  userType: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

const StudentQuestion = db.define('studentquestion', {
  question: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const Cohort = db.define('cohort', {
  subject: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  time: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const Lecture = db.define('lecture', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const Topic = db.define('topic', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const Quiz = db.define('quiz', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const Question = db.define('question', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  choices: {
    type: Sequelize.ARRAY(Sequelize.INTEGER),
    allowNull: false,
  },
  correct: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

const Answer = db.define('answer', {
  // choices: {
  //   type: Sequelize.ARRAY(Sequelize.INTEGER),
  //   allowNull: false,
  // },
  selected: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

const Attendance = db.define('attendance', {
  present: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
});

// Join Tables
// Students and Cohorts
const StudentCohort = db.define('studentcohort', {
  student_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  cohort_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

// Relation Definitions
// THESE FUCKING WORK!!!!
School.hasMany(User, { foreignKey: { name: 'school_id', allowNull: true }, onDelete: 'CASCADE' });
User.belongsTo(School, { foreignKey: { name: 'school_id', allowNull: true }, onDelete: 'CASCADE' });

User.hasMany(Cohort, { as: 'teacher', foreignKey: { name: 'teacher_id', allowNull: false }, onDelete: 'CASCADE' });
Cohort.belongsTo(User, { as: 'cohort', foreignKey: { name: 'teacher_id', allowNull: false }, onDelete: 'CASCADE' });

User.belongsToMany(Cohort, { as: 'student_cohort', through: 'StudentCohort', foreignKey: { name: 'student_id', allowNull: false }, onDelete: 'CASCADE' });
Cohort.belongsToMany(User, { as: 'cohort_student', through: 'StudentCohort', foreignKey: { name: 'cohort_id', allowNull: false }, onDelete: 'CASCADE' });

Cohort.hasMany(Lecture, { foreignKey: { name: 'cohort_id', allowNull: false }, onDelete: 'CASCADE' });
Lecture.belongsTo(Cohort, { foreignKey: { name: 'cohort_id', allowNull: false }, onDelete: 'CASCADE' });

User.hasMany(Attendance, { as: 'students_attendance', foreignKey: { name: 'student_id', allowNull: false }, onDelete: 'CASCADE' });
Attendance.belongsTo(User);

User.hasMany(StudentQuestion, { foreignKey: { name: 'student_id', allowNull: false }, onDelete: 'CASCADE' });
StudentQuestion.belongsTo(User, { foreignKey: { name: 'student_id', allowNull: false }, onDelete: 'CASCADE' });

Lecture.hasMany(Attendance, { as: 'lecture_attendance' });
Attendance.belongsTo(Lecture);

Lecture.hasMany(Topic, { foreignKey: { name: 'lecture_id', allowNull: false }, onDelete: 'CASCADE' });
Topic.belongsTo(Lecture, { foreignKey: { name: 'lecture_id', allowNull: false }, onDelete: 'CASCADE' });

Topic.hasMany(Quiz, { foreignKey: { name: 'topic_id', allowNull: false }, onDelete: 'CASCADE' });
Quiz.belongsTo(Topic, { foreignKey: { name: 'topic_id', allowNull: false }, onDelete: 'CASCADE' });

Topic.hasMany(StudentQuestion, { foreignKey: { name: 'topic_id', allowNull: false }, onDelete: 'CASCADE' });
StudentQuestion.belongsTo(Topic, { foreignKey: { name: 'topic_id', allowNull: false }, onDelete: 'CASCADE' });

Quiz.hasMany(Question, { foreignKey: { name: 'quiz_id', allowNull: false }, onDelete: 'CASCADE' });
Question.belongsTo(Quiz, { foreignKey: { name: 'quiz_id', allowNull: false }, onDelete: 'CASCADE' });

Question.hasMany(Answer, { foreignKey: { name: 'question_id', allowNull: false }, onDelete: 'CASCADE' });
Answer.belongsTo(Question, { foreignKey: { name: 'question_id', allowNull: false }, onDelete: 'CASCADE' });

module.exports = {
  School,
  User,
  StudentQuestion,
  Cohort,
  StudentCohort,
  Lecture,
  Topic,
  Quiz,
  Question,
  Answer,
  Attendance,
};
