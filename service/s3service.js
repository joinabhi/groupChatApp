const AWS=require('aws-sdk');


exports.uploadToS3 = (fileData, filename) => {
    const BUCKET_NAME = 'groupchatapp4646';
    const IAM_USER_KEY = 'AKIAYRQ7MLNFQZDJAX3K';
    const IAM_USER_SECRET = '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';

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
    })
  var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: fileData,
        ACL: 'public-read'
    }
    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, s3response) => {
            if (err) {
                console.log('something went wrong', err)
                reject(err)
            } else {
                console.log('success', s3response)
                resolve(s3response.Location);
                
            }
        })
    })
}

exports.generateDownloadUrl = (filename) => {
    const BUCKET_NAME = 'groupchatapp12345'; // Replace with your bucket name
    const IAM_USER_KEY = 'AKIAYRQ7MLNFQZDJAX3K';
    const IAM_USER_SECRET = '3yO+UR0bsWUFZqFJE8jw7VZLCQ5RpoTAw9KPuhfw';
  

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
    })
  
    const params = {
      Bucket: BUCKET_NAME,
      Key: filename,
    //   Body: fileData,
    //   ACL: 'public-read',
      Expires: 3600, // The URL will expire in 1 hour
    };
  
    return new Promise((resolve, reject) => {
        s3bucket.getSignedUrl('getObject', params, (err, url) => {
        if (err) {
          reject(err);
        } else {
          resolve(url);
        }
      });
    });
  };