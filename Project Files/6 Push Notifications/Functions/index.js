const functions = require('firebase-functions');
var fetch = require('node-fetch')



const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);





//send the push notification 
exports.sendPushNotification = functions.database.ref('contacts/').onCreate(event => {

    const root = event.data.ref.root
    var messages = []

    //return the main promise 
    return root.child('/users').once('value').then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {

            var expoToken = childSnapshot.val().expoToken;

            messages.push({
                "to": expoToken,
                "sound": "default",
                "body": "New Note Added"
            });
        });
        //firebase.database then() respved a single promise that resolves
        //once all the messages have been resolved 
        return Promise.all(messages)

    })
        .then(messages => {
            // console.log(messages)
            fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messages)

            });
        })
        .catch(reason => {
            console.log(reason)
        })


});


