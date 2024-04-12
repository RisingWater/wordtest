import path from "path";
import XLSX from 'xlsx'

function readxlsx() {
    var file = path.join(process.cwd(), '/db/word.xlsx');
    const workbook = XLSX.readFile(file, { type: 'file' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    return jsonData;
}

function getQuestions(jsonData, count) {
    var SelectData = [];

    var TotalRight = 0;
    var wordCount = jsonData.length;

    jsonData.forEach((item) => {
        TotalRight += item.right;
    })

    //choose word by right
    for (let i = 0; i < count; i++) {
        var choose = Math.random() * (TotalRight + 1) + 1;
        var chooseobj;
        jsonData.some((item, index) => {
            choose -= item.right;
            if (choose < 0) {
                chooseobj = item;
                return true;
            }
        })

        var duplicate = SelectData.some((item, index) => {
            return item.id == chooseobj.id;
        })

        if (!duplicate) {
            SelectData = [...SelectData, chooseobj];
        } else {
            i--;
        }
    }

    //create wrong answer
    SelectData.forEach((item) => {
        item.result = false;
        item.selectAnswer = "";
        var select = parseInt(Math.random() * 4);
            
        var choices = [];
        for (let i = 0; i < 4; i++) {
            if (i == select) {
                var temp = { "id": item.id, "answer": item.answer };
                choices = [...choices, temp];
            }
            else {
                var wrongIndex = Math.random() * (wordCount) + 1;
                if (wrongIndex != item.id) {
                    var duplicate = false;
                    if (choices.length != 0) {
                        duplicate = choices.some((wrongItem, index) => {
                            return wrongItem.id == wrongIndex;
                        })
                    }

                    if (!duplicate) {
                        var wrongItem2 = jsonData[parseInt(wrongIndex) - 1];
                        var temp = { "id": wrongItem2.id, "answer": wrongItem2.answer };
                        choices = [...choices, temp];
                    } else {
                        i--;
                    }
                } else {
                    i--;
                }
            }
        }
        item.choices = choices;
    })

    return SelectData;
}

class WordTestService {
    static getall = function(req, res) {
        var result = {
            result : 0,
            data : []
        };

        var jsonData = readxlsx();

        if (req.body.count == undefined) {
            req.body.count = 10;
        }

        result.data = getQuestions(jsonData, req.body.count);

        res.send(result);
    }

    static getbylocation = function(req, res) {
        var result = {
            result : 0,
            data : []
        };

        var jsonData = readxlsx();
        var filterData = [];

        if (req.body.location == undefined) {
            filterData = jsonData;
        } else {
            filterData = jsonData.filter(element => {
                if (element.location == req.body.location) {
                    return true;
                }
                return false;
            })
        }

        if (req.body.count == undefined) {
            req.body.count = 10;
        }

        result.data = getQuestions(filterData, req.body.count);

        res.send(result);
    }
}

export default WordTestService;