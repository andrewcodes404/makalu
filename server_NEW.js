const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const path = require('path');
const fs = require('fs')
var admin = require('firebase-admin');
require('dotenv').config()


admin.initializeApp({
    credential: admin.credential.cert(
        {
            projectId: process.env.REACT_APP_FIRE_ADMIN_PROJECT_ID,
            clientEmail: process.env.REACT_APP_FIRE_ADMIN_CLIENT_EMAIL,
            private_key: process.env.REACT_APP_FIRE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n')
        }),
    databaseURL: process.env.REACT_APP_FIRE_ADMIN_DATABASE_URL
});

var db = admin.database();

app.get('/', function (request, response) {
    console.log(' "/" page visited');
    const filePath = path.resolve(__dirname, './build', 'index.html');

    fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        data = data.replace(/\$TWITTER_TITLE/g, 'Create your personal online advent calendar');
        data = data.replace(/\$TWITTER_DESC/g, "Make your own digital advent calendar");
        data = data.replace(/\$TWITTER_IMAGE/g, "https://s3.eu-west-2.amazonaws.com/elasticbeanstalk-eu-west-2-431995029029/countdown_images/cc_twittercard_cal.jpg");

        data = data.replace(/\$OG_TITLE/g, "Create your personal online advent calendar");
        data = data.replace(/\$OG_IMAGE/g, "https://s3.eu-west-2.amazonaws.com/elasticbeanstalk-eu-west-2-431995029029/countdown_images/cc_fb_card_cal.jpg");
        data = data.replace(/\$OG_IMAGE_TYPE/g, "image/jpeg");
        data = data.replace(/\$OG_IMG_WIDTH/g, "1200");
        data = data.replace(/\$OG_IMG_HEIGHT/g, "630");
        data = data.replace(/\$OG_IMG_ALT/g, "an example of a countdown advent calendar");
        data = data.replace(/\$OG_URL/g, "https://countdowncals.com/");
        data = data.replace(/\$OG_DESCRIPTION/g, "Make your own digital advent calendar");
        var result = data.replace(/\$PAGE_TITLE/g, "CountdownCals");
        response.send(result);
    });
});

app.get('/example/:id', function (request, response, next) {
    const paramId = request.params.id
    const getTheData = db.ref(`examples/${paramId}`).once('value');


    getTheData.then((snapshot) => {

        // let coverUrl = ""
        let calendarUrl = ""
        let cardImage = ""

        const values = snapshot.val()

        if (values) {
            // coverUrl = "https://s3.eu-west-2.amazonaws.com/elasticbeanstalk-eu-west-2-431995029029/countdown_images/covers/" + values.coverUrl
            calendarUrl = "https://countdowncals.com/examples/" + paramId
            cardImage = values.cardImage
        }

        const filePath = path.resolve(__dirname, './build', 'index.html')


        fs.readFile(filePath, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }

            data = data.replace(/\$TWITTER_TITLE/g, `🎄Check out the ${paramId} advent calender 🎄`);
            data = data.replace(/\$TWITTER_DESC/g, "Make your own digital advent calendar");
            data = data.replace(/\$TWITTER_IMAGE/g, cardImage);

            data = data.replace(/\$OG_TITLE/g, `🎄Check out the ${paramId} advent calender 🎄`);
            data = data.replace(/\$OG_IMAGE/g, cardImage);
            data = data.replace(/\$OG_IMAGE_TYPE/g, "image/jpeg");
            data = data.replace(/\$OG_IMG_WIDTH/g, "1200");
            data = data.replace(/\$OG_IMG_HEIGHT/g, "630");
            data = data.replace(/\$OG_IMG_ALT/g, "a countdown advent calendar");
            data = data.replace(/\$OG_URL/g, calendarUrl);
            data = data.replace(/\$OG_DESCRIPTION/g, "Make your own digital advent calendar");
            var result = data.replace(/\$PAGE_TITLE/g, `CountdownCals`);

            response.send(result);
        });
    })
});


app.get('/:id', function (request, response, next) {
    const paramId = request.params.id
    const getTheData = db.ref(`users/${paramId}`).once('value');

    getTheData.then((snapshot) => {


        let coverUrl = ""
        let calendarUrl = ""
        let username = ""
        const values = snapshot.val()
        
        if (values) {
            coverUrl = "https://s3.eu-west-2.amazonaws.com/elasticbeanstalk-eu-west-2-431995029029/countdown_images/covers/" + values.coverUrl
            calendarUrl = "https://countdowncals.com/" + paramId
            username = values.username
        }


        const filePath = path.resolve(__dirname, './build', 'index.html')
        fs.readFile(filePath, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }

            data = data.replace(/\$TWITTER_TITLE/g, `🎄Check out ${username}'s Advent Calendar🎄`);
            data = data.replace(/\$TWITTER_DESC/g, "Make your own digital advent calendar");
            data = data.replace(/\$TWITTER_IMAGE/g, coverUrl);

            data = data.replace(/\$OG_TITLE/g, `🎄Check out ${username}'s Advent Calendar🎄`);
            data = data.replace(/\$OG_IMAGE/g, coverUrl);
            data = data.replace(/\$OG_IMAGE_TYPE/g, "image/jpeg");
            data = data.replace(/\$OG_IMG_WIDTH/g, "1200");
            data = data.replace(/\$OG_IMG_HEIGHT/g, "630");
            data = data.replace(/\$OG_IMG_ALT/g, "a countdown advent calendar");
            data = data.replace(/\$OG_URL/g, calendarUrl);
            data = data.replace(/\$OG_DESCRIPTION/g, "Make your own digital advent calendar");
            var result = data.replace(/\$PAGE_TITLE/g, `CountdownCals`);

            response.send(result);
        });
    })
});



app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));

// app.get('*', function (request, response) {
//     const filePath = path.resolve(__dirname, './build', 'index.html');
//     response.sendFile(filePath);
// });

app.listen(port, () => console.log(`Listening on port ${port}`));