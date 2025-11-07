const app = require("./api/index");
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`✅ Running locally on http://localhost:${port}`));
