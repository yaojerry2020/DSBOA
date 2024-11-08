// controllers/userProfileController.js

const db = require('../models');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const path = require('path');
const { User } = db;

// 配置 multer，用于处理头像文件上传
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/avatars/')); // 确保此目录存在
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// 头像上传控制器
exports.uploadAvatar = (req, res) => {
    // 使用 multer 中间件处理单个文件上传
    upload.single('avatar')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: '头像上传失败', error: err.message });
        }

        try {
            const userId = req.user.id;
            const avatarPath = '/uploads/avatars/' + req.file.filename;

            // 更新用户头像路径
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: '用户未找到' });
            }

            user.avatar = avatarPath;
            await user.save();

            res.json({ message: '头像上传成功', avatar: avatarPath });
        } catch (error) {
            res.status(500).json({ message: '服务器错误', error });
        }
    });
};


// 获取当前用户的个人信息
exports.getUserProfile = async (req, res) => {
  console.log("getUserProfile - 请求的用户ID:", req.user.id);
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "用户未找到" });
    }
    res.json({
      id: user.id,
      username: user.username,
	  displayName: user.displayName,
      email: user.email,
      phone: user.phone,
	  avatar: user.avatar || null,    // 添加头像路径
    });
  } catch (error) {
    console.error("获取用户信息出错:", error);
    res.status(500).json({ message: "服务器错误" });
  }
};

// 更新用户个人信息
exports.updateUserProfile = async (req, res) => {
  console.log("updateUserProfile - 请求的用户ID:", req.user.id);
  const { email, phone, password } = req.body;
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "用户未找到" });
    }

    user.email = email || user.email;
    user.phone = phone || user.phone;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json({ message: "用户信息已更新" });
  } catch (error) {
    console.error("更新用户信息出错:", error);
    res.status(500).json({ message: "服务器错误" });
  }
};
