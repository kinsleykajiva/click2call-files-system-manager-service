const express = require('express');
const {SECRETACCESSKEY, ACCESSKEYID, REGION, BUCKET} = require("../configs/aws/awsConfig");
const multiparty = require("multiparty");
const {v4: uuidv4} = require('uuid');
const router = express.Router();
let aws = require('aws-sdk');
const fs = require("fs");

aws.config.update({
  secretAccessKey: SECRETACCESSKEY,
  accessKeyId: ACCESSKEYID,
  region: REGION
});
const s3 = new aws.S3();

const getExtension = filename   => filename.split(".").pop();
const getFilename  =()  => Date.now().toString() + '__' + uuidv4();
const uploadFile = (buffer, name, type) => {
  const params = {
    // ACL: 'public-read',
    Body: buffer,
    Bucket: BUCKET,
    ContentType: type.mime,
    Key: `${name}.${type}`
  };
  return s3.upload(params).promise();
};


/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});
router.post('/upload-files', (req, res, next) => {
  try{


    const form = new multiparty.Form();
    form.parse(req, async (error, fields, files) => {
      if (error) {
        return res.status(500).send(error);
      }
      let folderPost = fields['folder'][0];

      if (!files.file) {
        return res.status(400).send("No file");
      }
      let result = [];
      for (const file of files.file) {
        const path = file.path;
        const buffer = fs.readFileSync(path);
        const typee = getExtension(file.originalFilename);
        const fileName = `${folderPost}/` + getFilename();
        const data = await uploadFile(buffer, fileName, typee);
        console.log(data);
        result.push({ data });
      }

      return res.status(200).send({
        success: true,
        message: 'Files',
        data: {
          fileObjects: result
        }
      });
    });
  } catch (e) {
    console.error(e)
    return res.json({
      success: false,
      message: " Failed upload Files",

    });
  }

});

module.exports = router;
