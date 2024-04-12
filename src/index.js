import express from 'express';
import bodyParser from 'body-parser';
import WordTestService from "./webservice/WordTestService.js"
import RecordService from "./webservice/RecordService.js"

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect("index.html");
});

app.post('/wordtest/getall', WordTestService.getall);
app.post('/wordtest/getbylocation', WordTestService.getbylocation)

app.get('/testrecord/list', RecordService.list)
app.post('/testrecord/add', RecordService.add)

app.listen(80, () => {
    console.log('Server started on port 80');
});