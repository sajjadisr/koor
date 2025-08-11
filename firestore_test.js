import admin from "firebase-admin";
import fs from "fs";

const serviceAccount = JSON.parse(
  fs.readFileSync("./serviceAccountKey.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id
});


console.log("Runtime project ID:", admin.app().options.projectId);

const db = admin.firestore();

async function testWrite() {
  try {
    const docRef = await db.collection("testCollection").add({
      test: true,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log("[SUCCESS] Successfully wrote document with ID:", docRef.id);
    process.exit(0);
  } catch (error) {
    console.error("[ERROR] Firestore write failed:");
    console.error("Code:", error.code);
    console.error("Message:", error.message);
    process.exit(1);
  }
}

testWrite();
