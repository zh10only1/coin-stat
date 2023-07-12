const Joi = require('joi');
const fs = require('fs');
const Blog = require('../models/blog');
const BlogDetailsDTO = require("../dto/blog-details");
const Comment = require('../models/comment');
const {BACKEND_SERVER_PATH} = require('../config/environment');
const BlogDTO = require('../dto/blog');

const mongodbIdPattern = /^[0-9a-fA-D]{24}$/;

const blogController = {
    async create(req, res, next) {

        const blogSchema = Joi.object({
            title: Joi.string().required(),
            author: Joi.string().regex(mongodbIdPattern).required(),
            content: Joi.string().required(),
            photo: Joi.string().required()
        });

        const {error} = blogSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const {title, author, content, photo} = req.body;

        const buffer = Buffer.from(photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), 'base64');
        const imagePath = `${Date.now()}_${author}.png`;

        try {
            fs.writeFileSync(`storage/${imagePath}`, buffer);
        } catch (error) {
            return next(error);
        }
        
        let newBlog;
        try {
            newBlog = new Blog({
                title,
                author,
                content,
                photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`

            });

            await newBlog.save();
            
        } catch (error) {
            return next(error);
        }

        const blog = new BlogDTO(newBlog);
        return res.status(201).json({blog});

    },
    async getAll(req, res, next) {
        try {
            const allBlogs = await Blog.find({});

            const blogsDto = [];

            allBlogs.forEach((blog)=> {
                blogsDto.push(new BlogDTO(blog));
            });

            return res.status(200).json({blogs: blogsDto});
        } catch (error) {
            return next(error);
        }
    },
    async getById(req, res, next) {
        const getBlogByIdSchema = Joi.object({
            id: Joi.string().regex(mongodbIdPattern).required()
        });

        const {error} = getBlogByIdSchema.validate(req.params);

        if(error) {
            return next(error);
        }

        let blog;

        try {
            blog = await Blog.findById(req.params.id).populate("author");
        } catch (error) {
            return next(error);
        }

        const blogDto = new BlogDetailsDTO(blog);

        return res.status(200).json({blog: blogDto});
    },
    async update(req, res, next) {

        const updateBlogSchema = Joi.object({
            title: Joi.string().required(),
            content: Joi.string().required(),
            author: Joi.string().regex(mongodbIdPattern).required(),
            blogId: Joi.string().regex(mongodbIdPattern).required(),
            photo: Joi.string()
        });

        const {error} = updateBlogSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const {title, content, author, blogId, photo} = req.body;

        let blog;
        try {
            blog = await Blog.findById(blogId);
        } catch (error) {
            return next(error);   
        }

        if(!photo) {
            try {
                await Blog.findByIdAndUpdate(blogId,{title, content});
            } catch (error) {
                return next(error);
            }
            return res.status(200).json({message: 'Blog Updated'});
        }

        let previousPhotoPath = blog.photoPath;
        previousPhotoPath = previousPhotoPath.split('/').at(-1);
        fs.unlinkSync(`storage/${previousPhotoPath}`);

        const buffer = Buffer.from(photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), 'base64');
        const imagePath = `${Date.now()}_${author}.png`;

        try {
            fs.writeFileSync(`storage/${imagePath}`, buffer);
        } catch (error) {
            return next(error);
        }

        try {
            await Blog.findByIdAndUpdate(blogId,{title, content, photoPath:`${BACKEND_SERVER_PATH}/storage/${imagePath}`});
        } catch (error) {
            return next(error);
        }

        return res.status(200).json({message: 'Blog Updated'});
    },
    async delete(req, res, next) {
        const deleteBlogSchema = Joi.object({
            id: Joi.string().regex(mongodbIdPattern).required()
        });

        const {error} = deleteBlogSchema.validate(req.params);

        if (error) {
            return next(error);
        }

        const {id} = req.params;

        let blog;
        try {
            blog = await Blog.findById(id);
        } catch (error) {
            return next(error);
        }

        let photoPath = blog.photoPath;
        photoPath = photoPath.split('/').at(-1);
        fs.unlinkSync(`storage/${photoPath}`);

        try {
            await Blog.findByIdAndDelete(id);
            await Comment.deleteMany({blog: id});
        } catch (error) {
            return next(error);
        }

        return res.status(200).json({message: 'Blog Deleted'});
    }
}



module.exports = blogController;