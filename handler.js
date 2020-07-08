'use strict';

module.exports.detectCar = async event => {
  const AWS = require("aws-sdk");
  var rekognition = new AWS.Rekognition();

  var json = JSON.parse(event.body);

  var putParams = {
    Bucket: "devawsapidetectcars",
    Key: "devawsapidetectcars.jpg",
    Body: Buffer.from(json.image, "base64")
  };

  var params = {
    Image: {
      S3Object: {
        Bucket: "devawsapidetectcars",
        Name: "devawsapidetectcars.jpg"
      }
    }
  };

  var s3 = new AWS.S3();

  var p = new Promise((resolve) => {
    s3.putObject(putParams, err => {
      resolve(err);
    })
  })

  var r = await p;
  console.log(r);

  var pr = new Promise((resolve) =>  {
    rekognition.detectLabels(params, (err, data) => {
      if (err) {
        console.log(err);
      }

      resolve(data);
    })
  })

  var result = await pr;

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        data: result
      },
      null,
      2
    ),
  };
};
