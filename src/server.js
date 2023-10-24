const express = require('express');
const bodyParser = require('body-parser');
const lessonRouter = require('./lessonRouter');

const app = express();
app.use(bodyParser.json());

app.use('/', lessonRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
