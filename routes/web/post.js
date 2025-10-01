var express = require("express");
var multer = require("multer");
var crypto = require("crypto");
var path = require ("path");
var ensureAuthenticated = require("../../auth/auth").ensureAuthenticated;
var Post = require("../../models/post");

var router =express.Router();

var storage = multer.diskStorage({
  destination:'./uploads/images/', 

  filename:function(req,file,cb){
    crypto.pseudoRandomBytes(16,function(err,raw){
    cb(null,raw.toString('hex') + Date.now()+ path.extname(file.originalname));
 
  });
}

})

var upload = multer({storage:storage})

router.use(ensureAuthenticated)

router.get("/" ,function(req, res){

async  function findpost(posts){

  posts =  await Post.find({userID:req.user._id}).exec({
    if (err){console.log(err);}
  })
  console.log(posts);
      res.render("post/posts",{posts:posts});
      }
    
    findpost();
     //res.render("post/posts",{posts:posts});
    });

      router.get("/add",function(req, res){

      res.render("post/addpost");
      });

       router.post("/add",function(req, res){


        console.log("you enter posting post");
        var newPost = new Post({
            title: req.body.title,
            content: req.body.content,
            userID: req.user._id
        });
        
      

        async function savepost(){ 
          console.log("inside savepost")  
 try{ const res = await newPost.save();
console.log("done saving");



      
 }

 catch(err){
    console.log(err);
    req.flash("error", err);
 }
       



      
      }

 savepost();
res.redirect("/posts");


 });
router.get("/:postId", async function(req, res){
  const post = await Post.findById(req.params.postId);  
    res.render("post/detailpost",{post:post});

  })

  router.get("/edit/:postId", async function(req, res){
  const post = await Post.findById(req.params.postId); 
  console.log("inside postid") 
    res.render("post/editpost",{post:post});

  })

router.post("/update", upload.single('image'),async function(req, res){
  
const post = await Post.findById(req.body.postid);
post.title = req.body.title;
post.content = req.body.content;
post.image = req.file.path;
// post.save
try{
  let savePost = await post.save();                                           
  console.log("savepost",savePost);
  res.redirect("/posts/"+req.body.postid);
}

catch(err){
  console.log("error  happened");
  res.status(500).send(err);

}

} )








module.exports = router;