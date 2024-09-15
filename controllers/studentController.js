const Student = require('../models/Student');
const Class = require('../models/Class');


// Add a class
exports.addStudent = async (req, res) => {
  const { name, gender, dob, contactDetails, className, feesPaid } = req.body;

  try {
    const classObj = await Class.findOne({ className: className });

    if (!classObj) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const newStudent = new Student({
       name, gender, dob, contactDetails, class: classObj._id, feesPaid 
      });

    await newStudent.save();

    res.status(201).json({
      _id: newStudent._id,
      name: newStudent.name,
      gender: newStudent.gender,
      dob: newStudent.dob,
      contactDetails: newStudent.contactDetails,
      class: classObj.className,
      feesPaid: newStudent.feesPaid
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all students
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('class', 'className');

    const transformedStudents = students.map(student => ({
      ...student.toObject(), 
      class: student.class ? student.class.className : "No class assigned"
    }));

    
    res.json(transformedStudents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.deleteStudent = async (req, res) => {
  try {
    const studentToDelete = await Student.findById(req.params.id);
    if (!studentToDelete) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await studentToDelete.deleteOne();
    res.json({ message: 'Student removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Analytics: Get fees for students
exports.getStudentExpenses = async (req, res) => {
  try {
    const totalExpenses = await Student.aggregate([
      { $group: { _id: null, totalFees: { $sum: '$feesPaid' } } },
    ]);
    res.json(totalExpenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};