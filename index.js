import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const posts = [];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, (req, res) => {
   console.log(`Listening on port ${port}`);
});

// Display all posts
app.get('/', (req, res) => {
   res.render('index.ejs', { posts });
});

// Display single post
app.get('/post/:postId', (req, res) => {
   const postId = req.params.postId;
   const post = posts.find(p => p.id === postId); 
   if (!post) {
      res.status(404).send('Post not found');
   } else {
      res.render('post.ejs', { post });
   }
});

// Form for creating post
app.get('/create', (req, res) => {
   res.render('create.ejs');
});

// Create post
app.post("/create", (req, res) => {
   const { title, subtitle, content } = req.body;
   const newPost = {
      id: Date.now().toString(),
      date: `Posted on ${new Date().toLocaleDateString()}`,
      title,
      subtitle,
      content
   };
   // console.log(newPost);   
   posts.push(newPost);
   res.redirect('/');
});

// Form for editing an existing post
app.get('/edit/:postId', (req, res) => {
   const postId = req.params.postId;
   const post = posts.find(p => p.id === postId);
   if (!post) {
      res.status(404).send('Post not found');
   } else {
      res.render('edit.ejs', { post });
   }
});

// Handle form submission for updating an existing post
app.post('/edit/:postId', (req, res) => {
   const postId = req.params.postId;
   const { title, content } = req.body;
   const index = posts.findIndex(p => p.id === postId);
   if (index === -1) {
      res.status(404).send('Post not found');
   } else {
      posts[index].title = title;
      posts[index].content = content;
      res.redirect('/post/' + postId);
   }
});

// Handle form submission for deleting a post
app.post('/delete/:postId', (req, res) => {
   const postId = req.params.postId;
   const index = posts.findIndex(p => p.id === postId);
   if (index === -1) {
      res.status(404).send('Post not found');
   } else {
      posts.splice(index, 1);
      res.redirect('/');
   }
});