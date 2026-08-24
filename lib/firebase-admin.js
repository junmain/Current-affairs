import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getAdminApp() {
  if (getApps().length) return getApps()[0];

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      // Vercel env vars store the \n literally — convert back to real newlines
      privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    }),
  });
}

let _db = null;
function getDb() {
  if (!_db) _db = getFirestore(getAdminApp());
  return _db;
}

// Proxy so existing call sites (adminDb.collection(...)) keep working unchanged,
// but the real Firebase connection only happens on first actual use at request
// time — never at build time, when env vars aren't available yet.
export const adminDb = new Proxy(
  {},
  {
    get(_target, prop) {
      return getDb()[prop];
    },
  }
);
