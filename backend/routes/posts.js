const express = require("express")

const Post = require("../models/post")
const multer = require("multer")

const router = express.Router()



const MIME_TYPE_MAP = {
    'image/png':'png',
    'image/jpeg':'jpg',
    'image/jpg':'jpg',
}
const storage = multer.diskStorage({
    destination: (req,file,cb) =>{
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("invalid mime type");
        if(isValid){
            error = null;
        }
        cb(null,"backend/images")
    },
    filename:(req,file,cb)=>{
        const name = file.originalname.toLowerCase().split(' ').join('-')
        const ext = MIME_TYPE_MAP[file.mimetype]
        cb(null,name+'-'+Date.now()+'.'+ext)
    }
})


router.post("",multer({storage:storage}).single("image"),(req,res,next)=>{
   const url = req.protocol + '://' + req.get("host")
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath:url + "/images/" + req.file.filename
    })
    post.save().then(createdPost=>{
        res.status(201).json(
            {message:"Post added succesfully",
            post:{
                ...createdPost,
                id:createdPost._id
            }})
    })
    
})
router.put("/:id",multer({storage:storage}).single("image"),(req,res,next)=>{
    let imagePath = req.body.imagePath
    if(req.file){
        const url  =req.protocol + '://' + req.get("host")
        imagePath = url + "/images/" + req.file.filename
    }
    const post = new Post({
        _id:req.body.id,
        title:req.body.title,
        content:req.body.content,
        imagePath:imagePath
    })
    Post.updateOne({_id:req.params.id},post).then(result=>{
        console.log('hhh',result)
        res.status(200).json({message:'updated'})
    })
})
router.get("/:id",(req,res,next)=>{
    Post.findById(req.params.id).then(post=>{
        if(post){
            res.status(200).json(post)
        }else{
            res.status(404).json({message:'Post not found'})
        }
    })
})
router.delete("/:id",(req,res,next)=>{
        
    Post.deleteOne({_id:req.params.id}).then( result=>{
    console.log(result)
    res.status(200).json({message:'deleted'})

})
})
router.get("",(req,res,next)=>{
    const pagesize  = +req.query.pagesize
    const currentPage  = +req.query.page
    const postQuery = Post.find()
    let fetchedPosts ;
    if(pagesize && currentPage){
        postQuery
        .skip(pagesize * (currentPage -1))
        .limit(pagesize)
    }
    postQuery.then(documents=>{
        fetchedPosts = documents
        return Post.count()
    }).then((count)=>{
        res.status(200).json({
            message:"Posts fetched succefully",
            posts:fetchedPosts,
            maxPosts:count
        }) 

    })
    
})

module.exports = router