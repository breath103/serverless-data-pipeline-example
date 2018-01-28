'use strict';

const AWS = require("aws-sdk");

module.exports.collect = (event, context, callback) => {
  if (event.httpMethod === "POST" && event.path === "/log") {
    const firehose = new AWS.Firehose();
    const records = JSON.parse(event.body);
    firehose.putRecordBatch({
      DeliveryStreamName: "Firehose-prod",
      Records: records.map((record) => ({
        Data: `${JSON.stringify(record)}\n`,
      })),
    }).promise().then((res) => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({ output: res }),
      });
    }).catch((e) => {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({ error: e }),
      });
    });
  } else {
     callback(null, {
       statusCode: 404,
     });
  }
};
