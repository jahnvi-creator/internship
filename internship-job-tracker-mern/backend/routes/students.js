const router = require('express').Router();
const Student = require('../models/Student');
router.post('/register', async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim();
    const rollNo = String(req.body.rollNo || '').trim().toUpperCase();
    if (!name || !rollNo) return res.status(400).json({ error: 'Name and roll number are required.' });
    let student = await Student.findOne({ rollNo });
    if (!student) student = await Student.create({ name, rollNo });
    res.json({ student: { name: student.name, rollNo: student.rollNo } });
  } catch (e) { next(e); }
});
module.exports = router;
