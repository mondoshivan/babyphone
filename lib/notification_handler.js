const webpush = require('web-push');
const debug = require('debug')('babyphone:database_handler');
const DatabaseHandler = require('./database_handler');

const vapidKeys = {
    "publicKey":"BAhrrCzKYBzAiPwPjaH_kKHh7PrYCCKlEYBIINqnCIgGIBTqo58ciDXXZeo54jSpuDaOVURLKjEXNo3sYl-Tngs",
    "privateKey":"pfk0qfAc2-gTWnHItsV07vrnRNKYZkKkgDelAvzxLpQ"
};

webpush.setVapidDetails(
    'mailto:oliver.schmidt@stud.hs-emden-leer.de',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

class NotificationHandler {

    static async notify(title, body, icon) {
        const dbHandler = new DatabaseHandler();
        const collection = 'NotificationSubscriptions';
        const allSubscriptions = await dbHandler.find(collection, { });

        console.log('Total subscriptions', allSubscriptions.length);

        const notificationPayload = {
            "notification": {
                "title": title,
                "body": body,
                "icon": icon,
                "vibrate": [100, 50, 100],
                "data": {
                    "dateOfArrival": Date.now(),
                    "primaryKey": 1
                },
                "actions": [{
                    "action": "explore",
                    "title": "Go to the site"
                }]
            }
        };

        return Promise.all(allSubscriptions.map(
            sub => webpush.sendNotification(
                sub, JSON.stringify(notificationPayload)
            )
        ));
    }

}

module.exports = NotificationHandler;