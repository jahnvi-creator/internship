const router = require('express').Router();
const { Application, STATUSES } = require('../models/Application');
const Student = require('../models/Student');

router.get('/stats/:rollNo', async (req, res, next) => {
  try {
    const rows = await Application.aggregate([{ $match: { rollNo: req.params.rollNo.toUpperCase() } }, { $group: { _id: '$status', count: { $sum: 1 } } }]);
    const counts = Object.fromEntries(STATUSES.map(s => [s, 0]));
    rows.forEach(x => counts[x._id] = x.count);
    res.json({ total: Object.values(counts).reduce((a,b) => a+b, 0), counts });
  } catch (e) { next(e); }
});
router.get('/:rollNo', async (req, res, next) => {
  try { res.json(await Application.find({ rollNo: req.params.rollNo.toUpperCase() }).sort({ createdAt: -1 })); }
  catch (e) { next(e); }
});
router.post('/', async (req, res, next) => {
  try {
    const rollNo = String(req.body.rollNo || '').toUpperCase().trim();
    if (!await Student.exists({ rollNo })) return res.status(400).json({ error: 'Register the student first.' });
    if (!req.body.company || !req.body.role) return res.status(400).json({ error: 'Company and role are required.' });
    const application = await Application.create({ ...req.body, rollNo });
    res.status(201).json({ application });
  } catch (e) { if (e.code === 11000) return res.status(400).json({ error: 'Application already exists.' }); next(e); }
});
router.patch('/:id/status', async (req, res, next) => {
  try {
    if (!STATUSES.includes(req.body.status)) return res.status(400).json({ error: 'Invalid status.' });
    const application = await Application.findOneAndUpdate({ _id: req.params.id, rollNo: String(req.body.rollNo).toUpperCase() }, { status: req.body.status }, { new: true, runValidators: true });
    if (!application) return res.status(404).json({ error: 'Application not found.' });
    res.json({ application });
  } catch (e) { next(e); }
});
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Application.findOneAndDelete({ _id: req.params.id, rollNo: String(req.query.rollNo).toUpperCase() });
    if (!deleted) return res.status(404).json({ error: 'Application not found.' });
    res.json({ ok: true });
  } catch (e) { next(e); }
});
module.exports = router;
