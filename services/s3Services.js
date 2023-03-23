const AWS = require('aws-sdk');

const uploadTos3 = async(data, filename)=>{
    try{
        const BUCKET_NAME = process.env.AWS_USER_BUCKET;
        const IAM_USER_KEY = process.env.AWS_USER_KEY;
        const IAM_USER_SECRET = process.env.AWS_SECRET_KEY;
        const s3bucket = new AWS.S3({
            accessKeyId: IAM_USER_KEY,
            secretAccessKey: IAM_USER_SECRET
        });
        const fileDetails={
            Bucket: BUCKET_NAME,
            Key: filename,
            Body: data,
            ACL: 'public-read'
        };
        return new Promise((res,rej)=>{
            s3bucket.upload(fileDetails,(err,response)=>{
                if(err){
                    rej(err);
                }else{
                    res(response.Location);
                }
            });
        })
    }catch(err){
        console.log("Error",err);
        return resizeBy.status(500).json({message:"Something wrong",Error:err});
    }
}
module.exports={
    uploadTos3,
}