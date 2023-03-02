import functions = require("firebase-functions");
import admin = require("firebase-admin");
admin.initializeApp();

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.addmessage = functions.https.onRequest((req, res) => {
  const original = req.query.text;
  return admin
    .database()
    .ref("/messages")
    .push({ original: original })
    .then((snapshot) => {
      return res.redirect(303, snapshot.ref.toString());
    });
});

exports.makeUppercase = functions.firestore.document('/messages/{documentId}')
  .onCreate(async (snap, context) => {
    const original: string = snap.data().original;

    functions.logger.log('Uppercasing', context.params.documentId, original);

    const uppercase: string = original.toUpperCase();

    return snap.ref.set({uppercase}, {merge: true});
  });