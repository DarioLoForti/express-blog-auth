const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const postSlugExist = require('../middlewares/postSlugExist');
const auth = require('../middlewares/authenticateJWT');

const multer = require("multer");
const uploader = multer({dest: "public/images"});

router.use(auth.authenticateJWT);

router.get('/', postController.index);
router.post('/', auth.isAdmin, uploader.single("image"), postController.store);
// router.get('/create', postController.create);
router.get('/:slug', postController.show);
router.delete('/:slug', postSlugExist, postController.destroy);
router.get('/:slug/download', postController.download);

module.exports = router;

