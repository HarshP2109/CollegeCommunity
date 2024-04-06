const multer = require('multer');
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: process.env.CloudName , 
    api_key: process.env.CloudApiKey, 
    api_secret: process.env.CloudApiSecret 
  });

const storage = multer.memoryStorage(); // Store file data in memory
const upload = multer({ storage: storage });

async function sendImage(){
    let data = '';
    cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async(error, result) => {
        if (error) {
          console.error('Error uploading image:', error);
          return res.status(500).json({ error: 'Error uploading image' });
        }
        data = result.url;
        return data;
    }).end(req.file.buffer);
}

module.exports = {
    sendImage
}
