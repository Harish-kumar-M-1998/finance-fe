
const express = require('express');
const importController = require('../controllers/importController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/csv', upload.single('file'), importController.importCSV);
router.post('/excel', upload.single('file'), importController.importExcel);
router.post('/confirm', importController.confirmImport);

module.exports = router;