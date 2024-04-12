import DBController from "../db/DBController.js";

class RecordService {
    static add = function (req, res) {
        var records = DBController.LoadRecordDB();
        const newrecords = [...records, req.body.data];
        DBController.SaveRecordDB(newrecords);

        var result = {
            result : 0,
        };

        res.send(result);
    }

    static list = function (req, res) {
        var records = DBController.LoadRecordDB();

        records.reverse();

        var result = {
            result : 0,
            data : records
        };

        res.send(result);
    }
}

export default RecordService;