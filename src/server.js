const express = require('express');
const cors = require('cors');
const WritingAssistant = require('./WritingAssistant');

const app = express();
const assistant = new WritingAssistant();

app.use(cors());
app.use(express.json());

app.post('/analyze', (req, res) => {
  const { text } = req.body;
  const analysis = assistant.analyze(text);
  res.json(analysis);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
