const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const upload = require('../middlewares/multer');
const db = require('../db'); // thay bằng module DB của bạn

router.post('/:productId/images', upload.array('images', 5), async (req, res) => {
  const productId = parseInt(req.params.productId, 10);
  try {
    const [rows] = await db.query('SELECT COUNT(*) AS cnt FROM product_images WHERE product_id = ?', [productId]);
    const existing = rows[0].cnt || 0;
    if (existing + req.files.length > 5) {
      // xóa file đã upload
      req.files.forEach(f => { try { fs.unlinkSync(path.join(process.cwd(), f.path)); } catch(e){} });
      return res.status(400).json({ error: 'Tối đa 5 ảnh cho mỗi sản phẩm' });
    }

    // chèn vào DB - lưu đường dẫn tương đối (ví dụ '/public/uploads/products/filename.jpg')
    const inserts = req.files.map(f => [productId, '/' + path.posix.join(process.env.UPLOAD_DIR || 'public/uploads/products', path.basename(f.filename)), 0]);
    await db.query('INSERT INTO product_images (product_id, url, is_primary) VALUES ?', [inserts]);

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;