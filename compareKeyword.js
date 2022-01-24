var googleTrends = require('google-trends-api');
var mongoose = require('mongoose');

const verbose = true;
const dbSearchnum = 64;

class KeywordDB{
    constructor(initiate){
        mongoose.connect('mongodb://localhost:27017/uzzultibi');
        this.db = mongoose.connection;
        this.db.on('error', function(){
            if(verbose) {console.log('Mongo Connection Failed!')};
        });
        this.db.once('open', function() {
            if(verbose) {console.log('Mongo Connected!')};
        });
        
        this.keyword = mongoose.Schema({
            word : String,
            rank : Number
        });
        this.Keyword = mongoose.model('Keyword', this.keyword);
        if(initiate){
            this.newKeyword('티비', 1);
        }
    }
    newKeyword(keyword, rank, callback = ()=>{}){
        this.Keyword({word:keyword, rank:rank}).save((err, data)=>{
            if(err){
                if(verbose) {console.log(err)};
            }else{
                if(verbose) {console.log(keyword+'Saved!')};
                callback();
            }
        });
    }
    addKeyword(prevKeyword, newKeyword, callback){
        var prevRank;
        this.Keyword.findOne({
            word:prevKeyword
        }, (err, keyword)=>{
            if(err){if(verbose) {console.log(`[ERROR] addKeyword, prevKeyword "${prevKeyword}" not found`)}}
            else{
                prevRank = keyword.rank;
                if(verbose) {console.log(keyword.rank)};
                this.evaluateNewKeyword(newKeyword, prevRank, callback);
            }
        })
    }  
    evaluateNewKeyword(newKeyword, rank, callback){
        this.Keyword.findOne({
            rank: rank+1
        }, (err,keyword)=>{
            if(keyword == null){
                this.newKeyword(newKeyword, rank+1, callback);
            }else{
                if(verbose) {console.log(`newKeyword: ${newKeyword}, Keyword.word: ${keyword.word}`)}
                CompareKeywords(newKeyword, keyword.word).then(
                    (ratio)=>{
                        if(verbose) {console.log(ratio)};
                        if(ratio>=1){
                            this.pushRank(rank+1);
                            this.newKeyword(newKeyword, rank+1, callback);
                        }
                        else{
                            this.evaluateNewKeyword(newKeyword, rank+1, callback);
                        }
                    }
                )
            }
        })
    }
    pushRank(rank){
        if(verbose) console.log("pushing Rank...");
        this.Keyword.updateMany({rank:{$gte: rank}},{$inc:{rank : 1}}, ()=>{if(verbose) console.log("pushed!")});
    }
}

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

/* Function that returns the ratio of average interest during the recent 1 year. Returns (Keyword1_interest)/(Keyword2_interest) */
async function CompareKeywords(keyword1, keyword2){
    var myDate = new Date;
    var result;

    myDate.setTime(myDate.getTime() - (365*24*60*60*1000));
    result = await googleTrends.interestOverTime({keyword: [keyword1, keyword2],startTime: myDate});
    result = JSON.parse(result);
    return result.default.averages[0]/result.default.averages[1];
}

function recursiveRead(startText){
    readline.question(`어쩔${startText}~\n`,
    (resp) => {
        CompareKeywords(resp, startText).then(
            (result)=>{
                var compare = result;
                console.log(compare);
                if(compare>=1){
                    console.log(`응~ 내가이김~`);
                }else if (compare<0.01){
                    console.log(`응~ 노인정~`);
                }else{
                    keywordDB.addKeyword(startText,resp, ()=>{
                        console.log('addKeyword complete!');
                        keywordDB.Keyword.findOne({word:resp},(err, res)=>{
                            keywordDB.Keyword.findOne({rank:res.rank+1},(e, r)=>{
                                if(r==null){
                                    console.log(`으악졌다`);
                                }
                                else{
                                    startText = r.word;
                                    recursiveRead(startText)
                                }
                            });
                        });
                    });
                }
            }
        );
    });
}

function main(){
    startText = '티비';
    prevText = '';
    recursiveRead(startText, prevText);
    //readline.close();
    }

var keywordDB = new KeywordDB(false);

if(module.parent) {
    console.log('required module');
} else{
    main(keywordDB);
}

module.exports = {
    compareKeywords:CompareKeywords,
    recursiveRead:recursiveRead,
    KeywordDB:KeywordDB
}