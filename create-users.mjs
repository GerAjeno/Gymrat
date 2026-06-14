import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_hQhxZwf-ad2JG56WElm2lXhUwGYrw40",
  authDomain: "gymrat-saas-hq-99.firebaseapp.com",
  projectId: "gymrat-saas-hq-99",
  storageBucket: "gymrat-saas-hq-99.firebasestorage.app",
  messagingSenderId: "169485976714",
  appId: "1:169485976714:web:47b035b7c6c27a3e881973"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const users = [
  { email: "superadmin@gymrat.com", password: "password123", role: "super_admin", firstName: "Super", lastName: "Admin" },
  { email: "admin@gymrat.com", password: "password123", role: "admin", firstName: "Gym", lastName: "Admin", gymId: "gym_premium_1" },
  { email: "trainer@gymrat.com", password: "password123", role: "trainer", firstName: "Trainer", lastName: "Pro", gymId: "gym_premium_1" },
  { email: "client@gymrat.com", password: "password123", role: "client", firstName: "Client", lastName: "Active", gymId: "gym_premium_1" },
];

async function seed() {
  // First, create the mock gym so it exists
  try {
    await setDoc(doc(db, "gyms", "gym_premium_1"), {
      id: "gym_premium_1",
      name: "Gymrat Premium",
      branding: {
        primaryColor: "#D4AF37",
        secondaryColor: "#00F0FF",
        accentColor: "#C0C0C0",
        theme: "dark"
      },
      status: "active",
      createdAt: Date.now()
    });
    console.log("Mock Gym created: gym_premium_1");
  } catch (e) {
    console.error("Failed to create gym:", e.message);
  }

  for (const u of users) {
    try {
      let cred;
      try {
        cred = await createUserWithEmailAndPassword(auth, u.email, u.password);
        console.log(`Created Auth user: ${u.email}`);
      } catch (e) {
        if (e.code === 'auth/email-already-in-use') {
          cred = await signInWithEmailAndPassword(auth, u.email, u.password);
          console.log(`Logged into existing Auth user: ${u.email}`);
        } else {
          throw e;
        }
      }
      
      const roles = {};
      if (u.gymId) {
        roles[u.gymId] = u.role;
      }
      
      await setDoc(doc(db, "users", cred.user.uid), {
        id: cred.user.uid,
        email: u.email,
        profile: { firstName: u.firstName, lastName: u.lastName },
        roles: roles,
        superAdmin: u.role === "super_admin"
      });
      console.log(`Created Firestore doc for: ${u.email}`);
    } catch (e) {
      console.error(`Failed to create ${u.email}:`, e.message);
    }
  }
  process.exit();
}

seed();
