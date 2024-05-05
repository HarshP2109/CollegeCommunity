
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: process.env.CloudName , 
    api_key: process.env.CloudApiKey, 
    api_secret: process.env.CloudApiSecret 
  });

const storage = multer.memoryStorage(); // Store file data in memory
const upload = multer({ storage: storage });

async function sendImage(buffer) {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
            if (error) {
                console.error('Error uploading image:', error);
                reject(error);
            } else {
                // Image uploaded successfully, resolve with Cloudinary URL
                resolve(result.url);
            }
        }).end(buffer);
    });
}

module.exports = {
    sendImage
}
