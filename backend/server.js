const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Criar usuário
app.post("/create-user", async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const userRecord = await auth.createUser({ email, password });
    await db.collection("users").doc(userRecord.uid).set({ role, email });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Verificar usuário (login simulado)
app.get("/users", async (req, res) => {
  const { email } = req.query;
  try {
    const snapshot = await db.collection("users").get();
    const user = snapshot.docs.map(d => ({ uid: d.id, ...d.data() }))
                              .find(u => u.email === email);
    if(user) res.json(user);
    else res.status(404).json({ error: "Usuário não encontrado" });
  } catch(err) {
    res.status(400).json({ error: err.message });
  }
});

// CRUD vigilantes
app.get("/vigilantes", async (req, res) => {
  const snapshot = await db.collection("vigilantes").get();
  res.json(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
});

app.post("/vigilantes", async (req, res) => {
  const { nome, funcao, turno } = req.body;
  const docRef = await db.collection("vigilantes").add({ nome, funcao, turno });
  res.json({ id: docRef.id });
});

app.put("/vigilantes/:id", async (req, res) => {
  const { id } = req.params;
  await db.collection("vigilantes").doc(id).update(req.body);
  res.json({ success: true });
});

app.delete("/vigilantes/:id", async (req, res) => {
  const { id } = req.params;
  await db.collection("vigilantes").doc(id).delete();
  res.json({ success: true });
});

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));
