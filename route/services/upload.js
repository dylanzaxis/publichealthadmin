const path = require("path");
const fs = require("fs");
const express = require("express");
const router = express.Router();

// upload file
const { Storage } = require("@google-cloud/storage");
require("dotenv").config();

// let credentials = {
//   type: process.env.GCS_TYPE,
//   project_id: process.env.GCS_PROJECT_ID,
//   private_key_id: process.env.GCS_PRIVATE_KEY_ID,
//   private_key: process.env.GCS_PRIVATE_KEY,
//   client_email: process.env.GCS_CLIENT_EMAIL,
//   client_id: process.env.GCS_CLIENT_ID,
//   auth_uri: process.env.GCS_AUTH_URI,
//   token_uri: process.env.GCS_TOKEN_URI,
//   auth_provider_x509_cert_url: process.env.GCS_AUTH_PROVIDER_CERT_URL,
//   client_x509_cert_url: process.env.GCS_CLIENT_CERT_URL,
// };

let credentials = {
  "type": "service_account",
  "project_id": "affable-hall-346918",
  "private_key_id": "e61d179017629fec34f027d7235cb7f7617fe46b",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCZdZxetYOu6jQA\nOp2vp1tA7nGCYpnfUvExkisBP4STBpa/cStOmkYmvSpM6SJhTrv47efCzKfH7fMA\nfN/oDye5PxYi3SNpCUJt0jvnSedpSPL/DrQjvuAzx18y5eVUajQ2dakatcOBqBgB\ndUTHe3y88wGuG+rJQV2WvBUcdNuab3Am4u6hSyBfG9J796i5/HgXA0UYxcKQ7AFc\nQr0w3/yG/QdiXW6H0wz2ilTzw05s4adG4JPBvr0fzFD4Bmhf0SGqO0EzvlYCOR78\nlqiis0BXQKuC9YFfCwtkjGeNJwUCYzqyQDOBpBXX8pq9Z8Me6myVWgs462QyV1yo\n15VeIJHNAgMBAAECggEAIguVJu/XKJmd8sUOUbdrx9J+jUIpyAFjMC+w6cR5OZMX\nI57MUFJqqNKDzW9VaMgqbLX/GlkEChdwt1V86UNfeToVQ6PS5M0glzOyhYQAWnvM\nKSjObzW8ENC0/ppBUAKF1eUxoJLdrmin9r7ZBPaQ/GxfHYzlAERHqpbMijUkuTSS\n7DS4SLmZGBKyOKCWD8qmJMtTl3G5cyNQ3tHSYUqU1P+8tCnSr3fPB0bpfz4Fnq9t\n6gWog22xc7g+63vLuaBhjQl2EUIC/Kz2tDt7jS28Km+5ow1jHX/+tG/JeK3gXyDl\ntCmZY6qA///K8GELP6zhvkI3V5YzsOX3MBQX223iwQKBgQDMjhU9uHe1FF0LvoQQ\n1qFjt5UU1e8BPLyz+b0Ggx8lY11aUudF+ORvFqcAv/lFNNFZLj/SlmQLZUVHvEur\njxG6LNdRe1GPPbo66ZeJ7vqzk3AgmL+IKGQCJ4IzCn+9n2dlVD0SKZnHD3HGp9c6\nZn3A9fSQuO2pHQT6gNKnnZ3QbQKBgQDADdPIh8/tYTu6wK1S8wE/rb9wYbvlsu7r\n364Fkxr+9NlWB5u3nt3hkF/5bPWgBWXo2MhuiYXVggyDi+rswJ4bHHZlTmkXm5YQ\nah0eG/6aVkg3sIU4eCh9Tm1YGFpDl5tgFaZrKE8a4Ips66slJdVYwHjlwftv3RBj\n3Qr115Sq4QKBgFMnx3bJ0NAqMREfJ+z4c69n6BEKTxj/qe64LaHCGB1I4aBgZ2hI\noASQ/t8NK7Z4nEpWxNdFD/KZ/qoE3/YkOR6oL/gN28ARZe2hHFuUbRInc8OslOAz\nG0TM7t70+60Iai4FKraBduQ3YRdTD+nL1H9m/T8ADo1bILT9PaWqK4eZAoGAOkx4\nO2kurwpTDU+rzYBCosflUwH3/bQhXqyZsMuE6Fv/FWRd2pF5HR2sZJS0wwygcNxN\ni3BnlfZSQiRY/eFCnUw4jGwO7sGl/fmYOSmaUdNbPLxy1D91WwRRoOpTjC0bV0F7\nMRAdYzVCD+pCG5auerCCgowt/TkH3qicyR/V20ECgYAuZuaW2eVfwNQuDSug8CKq\n/NdaVRdu8Q/S1W1cDdVVzl0plraSRIiCVh+zJi9xvfCFCrO1TgCb2hia/VXePnyx\n456AJmrYBa31b24+7D/Txp0yUtilmmf5DFXXCBvrMPgePYQ0Rdx+zk55poqz+aNk\n7FMsH5lKGRKdmxs07y3HRA==\n-----END PRIVATE KEY-----\n",
  "client_email": "publichealth@affable-hall-346918.iam.gserviceaccount.com",
  "client_id": "118093476587885835633",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/publichealth%40affable-hall-346918.iam.gserviceaccount.com"
}

router.post("/:type", async (req, res) => {
  let file_type = req.params.type;
  console.log(file_type);
  let uploaded_file_path = req.files[file_type].tempFilePath;
  console.log(uploaded_file_path);
  let location = req.files[file_type].tempFilePath;

  try {
    let config = {
      changed_name: Date.now() + "-" + req.files[file_type].name,
      file_location: path.join(uploaded_file_path),
    };
    let { changed_name, metedata_event, file_location, gzip } = config;

    let uploadSuccess = (err,file,apiResponse) => {
      // delete the temporary file after word
      console.log(err);
      fs.unlink(path.join(uploaded_file_path), (err) => {
        if (err) throw err;
      });
      console.log(apiResponse);
      res.json({
        ...apiResponse,
      });
    };

    let uploadError = (err) => {
      let output = { key: "FileUpload", msg: err.message };
      res.status(500).send(output);
    };
    let bucket = "publichealthnews2";

    let options = {
      resumable: false,
      metadata: {
        metadata: {},
      },
    };

    const gc = new Storage({credentials});

    if (changed_name) {
      options.destination = changed_name;
    }
    if (metedata_event) {
      options.metadata.event = metedata_event;
    }
    if (gzip) {
      options.metadata.gzip = gzip;
    }

    let location = file_location;

    console.log(config.file_location);
    let merchant_file_upload = gc.bucket(bucket);

    merchant_file_upload.upload(config.file_location, options, uploadSuccess);
  } catch (err) {
    console.log(error, "file upload error");
    let output = {
      key: "upload",
      msg: err.message,
    };
    res.status(500).send(output);
  }
});
module.exports = router;
