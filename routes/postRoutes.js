const express=require('express');
const mongoose = require('mongoose');
// const commentRoutes=require('./routes/commentRoutes');
const router=express.Router();
const Post=require('./../models/post');
const User=require('../models/user');
const { post } = require('./userRoutes');

router.post('/createblog',async(req,res)=>{
    try{
       
        const {title,content,author}=req.body
        console.log(req.body)
 
        if(!title||!content||!author){
            return res.status(400).json({error:"All fields are required"})
        }
        const user=await User.findById(author);
        if(!user){
            return res.status(403).json({message: 'user not found'})
        }
        //create and save post
        console.log("post save previous step")
        const newPost=new Post({title,content,author})
        await newPost.save();

        res.status(201).json({message: "Post created successfully", newPost});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal server error'})
    }
});

router.get('/', async(req,res)=>{
    try{
        const blogs= await Post.find()
        return res.status(200).json(
            blogs.map(blog=>({
                title:blog.title,
                content:blog.content,
                author:blog.author,
                time:blog.createdAt
            }))
        );
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'internal server error'})
    }
})

router.delete('/delete', async (req, res) => {
    try {
        const { author,blogid } = req.body;
        console.log("author is",author)
        console.log("blogid is",blogid)
        if (!author || !blogid) {
            return res.status(400).json({ message: "Author blogid name is required." });
        }
        console.log("author found")
        const deletedBlog = await Post.findOneAndDelete({ _id: blogid, author: author });
        if (!deletedBlog) {
            return res.status(404).json({ message: "No blog found for this author." });
        }

        res.json({ message: "Blog deleted successfully!", deletedBlog });
    } catch (error) {
        console.log("catch error")
        res.status(500).json({ message: "Internal server error", error });
    }
});

router.put('/update_blog', async (req, res) => {
    try {
        const { author, title, content } = req.body;

        if (!author) {
            return res.status(400).json({ message: "Author name is required." });
        }
        console.log("author found")
        // Create an update object dynamically
        let updateData = {};
        if (title) updateData.title = title;
        if (content) updateData.content = content;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "Nothing to update." });
        }
        console.log("update data found")
        const updatedBlog = await Post.findOneAndUpdate(
            { author: author },  // Find blog by author
            { $set: updateData }, // Update fields
            { new: true }         // Return the updated document
        );

        if (!updatedBlog) {
            return res.status(404).json({ message: "No blog found for this author." });
        }

        res.json({ message: "Blog updated successfully!", updatedBlog });

    } catch (error) {
        console.error("Error updating blog:", error);
        res.status(500).json({ message: "Internal server error", error: error.message || error });
    }
});

module.exports=router;