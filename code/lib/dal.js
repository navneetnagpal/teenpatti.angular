var databaseUrl = "local"; // "username:password@example.com/mydb"
var collections = ["users", "tables","sessions"];
var db = require("mongojs").connect(databaseUrl, collections);
var DAL={db:db};
module.exports = DAL;