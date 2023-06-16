const Joi = require('joi');
const Comment = require('../models/comment');
const Author = require('../models/user');
const CommentDTO = require('../dto/comment');
const mongodbIdPattern = /^[0-9a-fA-D]{24}$/;


commentController = {
    async create(req, res, next) {
        const createCommentSchema = Joi.object({
            content: Joi.string().required(),
            author: Joi.string().regex(mongodbIdPattern).required(),
            blog: Joi.string().regex(mongodbIdPattern).required()
        });

        const {error} = createCommentSchema.validate();

        if (error) {
            return next(error);
        }

        const {content, author, blog} = req.body;
        
        let comment;
        try {
            await Comment.updateOne({
                author: author,
                blog: blog
            },
            {content: content},
            {upsert: true});    
        } catch (error) {
            return next(error);
        }

        return res.status(201).json({message: "Comment added"});
    },
    async getAllByBlogId(req, res, next) {

        const getAllByBlogIdSchema = Joi.object({
            blog_id: Joi.string().regex(mongodbIdPattern).required()
        });

        const {error} = getAllByBlogIdSchema.validate(req.params);

        if (error) {
            return next(error);
        }

        const {blog_id} = req.params;

        let comments;
        try {
            comments = await Comment.find({blog: blog_id}).populate('author');
        } catch (error) {
            return next(error);
        }

        let commentsDto=[];

        comments.forEach((comment) => {
            commentsDto.push(new CommentDTO(comment));
        });

        return res.status(200).json({data: commentsDto});
    }
}

module.exports = commentController