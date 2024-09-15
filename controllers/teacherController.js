const Teacher = require('../models/Teacher');
const Class = require('../models/Class');

// Add a teacher
exports.addTeacher = async (req, res) => {
  const { name, gender, dob, contactDetails, salary, assignedClasses } = req.body;
  try {
    const newTeacher = new Teacher({ name, gender, dob, contactDetails, salary, assignedClasses });
    await newTeacher.save();
    res.status(201).json(newTeacher);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all teachers
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    const transformedTeachers = await Promise.all(teachers.map(async teacher => {
      const classes = await Class.find({ teacher: teacher._id }, 'className');

      const classNames = classes.map(classObj => classObj.className);

      return {
        ...teacher.toObject(),
        assignedClasses: classNames
      };
    }));

    res.json(transformedTeachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Analytics: Get expenses for teachers
exports.getTeacherExpenses = async (req, res) => {
  try {
    const totalExpenses = await Teacher.aggregate([
      { $group: { _id: null, totalSalary: { $sum: '$salary' } } },
    ]);
    res.json(totalExpenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.deleteTeacher = async (req, res) => {
  try {
    const teacherToDelete = await Teacher.findByIdAndDelete(req.params.id);

    if (!teacherToDelete) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json({ message: 'Teacher removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
