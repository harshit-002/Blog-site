
const express = require("express");
const ejs = require("ejs");
const _=require('lodash');
require('dotenv').config();
const mongoose=require("mongoose");
const PORT = process.env.PORT || 3000;


//connecting to mongodb
mongoose.set("strictQuery",false);
mongoose.connect(process.env.ATLAS_URL,{
  useNewUrlParser: true ,
  useUnifiedTopology:true  
})

const postschema=new mongoose.Schema({
  name:String,
  content:String
})

const post=mongoose.model("post",postschema);

const homeStartingContent=new post({
  name:"homeStartingContent",
  content:"Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."
})
const aboutContent=new post({
  name:"aboutContent",
  content:"Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui."
})
const contactContent=new post({
  name:"contactContent",
  content: "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero."
})

const defaultposts=[homeStartingContent,aboutContent,contactContent];

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",function(req,res){

  post.find(function(err,founditems){
    if(founditems.length===0)
    {
      post.insertMany(defaultposts,function(err){
        if(!err)
        console.log("Added items successfully");
      })
    }
  })
  post.findOne({name:"homeStartingContent"},function(err,foundOne){
    if(!err)
    {
      
      post.find(function(err,foundposts){
       if(!err)
      
        res.render("home",{titleName:"Home",content:foundOne.content,postarray:foundposts});      
      })
      
      
    }
  })
})
app.get("/about",function(req,res){
  res.render("about",{titleName:"About",content:aboutContent.content});
})
app.get("/contact",function(req,res){
  res.render("contact",{titleName:"Contact",content:contactContent.content});
})
app.get("/compose",function(req,res){
  res.render("compose",{titleName:"Compose"});
})

app.get("/posts/:postName", function (req, res) {

  const postname=_.kebabCase(req.params.postName);
  post.find(function(err,foundposts){

      foundposts.forEach(post => {
        if (_.kebabCase(post.name)=== postname) {
          res.render("post",{titleName:post.name,content:post.content})
        }
      });
  })
  
});
 

app.post("/compose",function(req,res){
 
  const title =_.capitalize(req.body.postTitle);
   const body=req.body.postBody;

   const newpost=new post({
    name:title,
    content:body
   })
   newpost.save();

 res.redirect("/");
})


app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});

