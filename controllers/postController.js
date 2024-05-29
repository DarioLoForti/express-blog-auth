const path = require('path');
const posts = require('../db/db.json');
const fs = require('fs');

const index = (req, res) => {
  let html = '<main>';
                posts.forEach((post) => {
                    html += `
                    <article>
                    <h2><a href="/posts/${post.slug}">${post.title}</a></h2>
                        <img width="500" src="/${post.image}" alt="${post.title}">
                        <p>${post.content}</p>
                        <h4>Tags:</h4>
                        <ul>`;
                    post.tags.forEach(tag => {
                        html += `<li>${tag}</li>`;
                    });
                    html += `</ul>
                    </article> `;
                });
                html += '</main> <style>body{background-color: black; color: white;} p{font-size: 20px;}a{text-decoration: none; color: white;}</style> ';
                res.send(html);
};

const show = (req, res) => {
  const post = posts.find(p => p.slug === req.params.slug);
  if (post) {
    const postWithUrls = {
      ...post,
      image_url: `http://${req.headers.host}/${post.image}`,
      image_download_url: `http://${req.headers.host}/posts/${post.slug}/download`
    };

    res.format({
      'text/html': function () {
        let html = `
          <article>
            <h2>${post.title}</h2>
            <img width="500" src="/${post.image}" alt="${post.title}">
            <p>${post.content}</p>
            <h4>Tags:</h4>
            <ul>`;
        post.tags.forEach(tag => {
          html += `<li>${tag}</li>`;
        });
        html += `</ul>
          </article>
          <a href="/posts">Back to posts</a>
          <style>body{background-color: black; color: white;} p{font-size: 20px;}a{text-decoration: none; color: white;}</style>`;
        res.send(html);
      },
      'default': function () {
        res.json(postWithUrls);
      }
    });
  } else {
    res.status(404).send('Post not found');
  }
};

// const create = (req, res) => {
//   res.format({
//     'text/html': function () {
//       res.send('<h1>Creazione nuovo post</h1>');
//     },
//     'default': function () {
//       res.status(406).send('Not Acceptable');
//     }
//   });
// };


const createSlug = (title) => {

  const baseSlug = title.replaceAll(' ', '-').toLowerCase().replaceAll('/', '');

  const slugs = posts.map(p => p.slug);

  let counter = 1;

  let slug = baseSlug;
  while (slugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};


const updatePosts = (newPost) => {
  const filePath = path.join(__dirname, '../db/db.json');

  fs.writeFileSync(filePath, JSON.stringify(newPost));
  posts = newPost;
}

const store = (req, res) => {

  const { title, content, tags } = req.body;
  
  if (!title || !content || !tags) {
    req.file?.filename && deletePublicFile(req.file.filename);
    return res.status(400).send('All fields are required');
  } else if(!req.file || !req.file.mimetype.includes('image')) {
    req.file?.filename && deletePublicFile(req.file.filename);
    return res.status(400).send('Image is required');
  }

  const slug = createSlug(title);

  const newPost = {
    title,
    slug,
    content,
    image: req.file.filename,
    tags,
  };
  
  updatePosts([...posts, newPost]);


  res.format({
    html: function () {
      res.redirect(`/posts/${slug}`);
    },
    'default': function () {
      res.json(newPost);
    }
  });
};


const download = (req, res) => {
  const post = posts.find(p => p.slug === req.params.slug);
  if (post) {
    const imagePath = path.join(__dirname, '../public/images', post.image);
    res.download(imagePath);
  } else {
    res.status(404).send('Image not found');
  }
};

const deletePublicFile = (fileName) => {
  const filePath = path.join(__dirname, '../public/images', fileName);
  fs.unlinkSync(filePath);
}

const destroy = (req, res) => {
  const deletePost = req.post;

  deletePublicFile(deletePost.image);
  updatePosts(posts.filter(p => p.slug !== deletePost.slug));

  res.send(`Post ${slug} deleted`);
}

module.exports = {
  index,
  show,
  // create,
  store,
  download,
  destroy
  
};
