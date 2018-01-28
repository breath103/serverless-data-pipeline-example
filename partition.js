'use strict';

const AWS = require("aws-sdk");

module.exports.handler = (event, context, callback) => {
  // `ALTER TABLE track_tickets.user_content_action`,
  // `DROP partition (year="${time.year}", month="${time.month}", day="${time.day}", hour="${time.hour}")`
  const athena = new AWS.Athena();

  const now = new Date();
  now.setTime(now.getTime() + 1000 * 60 * 60);
  const formattedNow = now.toISOString(); // "2018-01-28T12:48:08.533Z"
  const time = {
    year: formattedNow.slice(0, 4),
    month: formattedNow.slice(5, 7),
    day: formattedNow.slice(8, 10),
    hour: formattedNow.slice(11, 13),
  };

  athena.startQueryExecution({
    QueryString: [
      `ALTER TABLE user_actions`,
      `ADD partition (year="${time.year}", month="${time.month}", day="${time.day}", hour="${time.hour}")`,
      `LOCATION 's3://realtime-counter-prod-logbucket-1v9nve14ar03f/log/${time.year}/${time.month}/${time.day}/${time.hour}/'`,
    ].join("\n"),
    ResultConfiguration: {
      OutputLocation: "s3://realtime-counter-prod-logbucket-1v9nve14ar03f/query_output"
    },
  }).promise().then((res) => {
    callback(null, res);
  }).catch((e) => {
    callback(e);
  });
};
