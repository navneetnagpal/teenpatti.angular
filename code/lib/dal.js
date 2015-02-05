// var config = JSON.parse(process.env.APP_CONFIG);
var databaseUrl ="app_384:nopassword@localhost/app_384"; /*"mongodb://" + config.mongo.user + ":nopassword@" +
    	config.mongo.host + ":" + config.mongo.port + "/" + config.mongo.db;*/ // "username:password@example.com/mydb"
var collections = ["users", "tables","sessions"];
var db = require("mongojs").connect(databaseUrl, collections);



var DAL={db:db};


module.exports = DAL;