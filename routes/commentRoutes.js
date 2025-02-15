const express = require("express");
const router = express.Router();
const Comment = require("../models/comment");
const Blog = require("../models/post");
// const user= require("../models/user");
const { jwtAuthMiddleware } = require("./jwt");

// ✅ Add a Comment
router.post("/:blogId", jwtAuthMiddleware, async (req, res) => {
    try {
        const { content } = req.body;
        const blogId = req.params.blogId;
        const userId = req.user.id; 
        console.log(userId);
        const userId1 = req.user.id.id;
        console.log(userId1);
        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // ✅ Correctly creating the comment object
        const comment = new Comment({
            content,
            author: req.user.id.id, // ✅ Use extracted userId
            blog: blogId
        });

        await comment.save();
        // blog.comment.push(comment._id);
        await blog.save();

        res.json({ message: "Comment added successfully", comment });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});


module.exports = router;
