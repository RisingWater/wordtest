import path from "path";
import fs from "fs";

const db_dir = '/db/'

function LoadDB(filename) {
    var file = path.join(process.cwd(), filename);
    if (fs.existsSync(file)) {
        var data = JSON.parse(fs.readFileSync(file, 'utf-8'));
        return data;
    } else {
        fs.writeFileSync(file, JSON.stringify([]));
        return [];
    }
}

function SaveDB(filename, data) {
    var file = path.join(process.cwd(), filename);
    fs.writeFileSync(file, JSON.stringify(data, null, 4));
}

class DBController {
    static LoadRecordDB = function() {
        return LoadDB(db_dir + 'record.json');
    }

    static SaveRecordDB = function(data) {
        return SaveDB(db_dir + 'record.json', data);
    }
}

export default DBController;
