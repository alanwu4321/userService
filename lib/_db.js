mongoose = require('mongoose'),
Schema = mongoose.Schema;
const crypto = require('crypto');

const hashed = (str) => {
    const secret = 'abcdefg'
    return crypto.createHmac('sha256', secret)
                    .update(str)
                    .digest('hex')
  }


module.exports = {
    initConnection: async (db) => {
        var mongo_host = (process.env.MONGO_SERVICE_HOST || 'localhost' );
        var mongo_port = (process.env.MONGO_SERVICE_PORT || 27017 );
        return new Promise(function(resolve, reject) {
            mongoose.connect(`mongodb://${mongo_host}:${mongo_port}/${db}`, function (err) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                console.log("connection established")
                resolve(true)
            });
        })
        },
    createUser: (payload) => {
        var userSchema = new Schema({
            "name": {
                type: String
            },
            "fav_origin": {
                type: String
            },
            "fav_destination": {
                type: String
            },
            "booked": {
                type: Array
            },
            "hashedPW":{
                type: String
            },
            "token":{
                type: String
            }
        });
        var users = mongoose.models.users || mongoose.model('users', userSchema);
        return new users(payload);
    },

    authUser: async (User,name,password) => {
        return new Promise(function(resolve,reject){
            User.find({name:name.toLowerCase()},function (err, user) {
                if (err) return reject(false);
                console.log(hashed(password) == user[0].hashedPW)
                if (hashed(password) == user[0].hashedPW){
                    resolve(true)
                }
              });
        }) 
    },
    getUser: () => {
        var userSchema = new Schema({
            "name": {
                type: String
            },
            "fav_origin": {
                type: String
            },
            "fav_destination": {
                type: String
            },
            "booked": {
                type: Array
            },
            "hashedPW":{
                type: String
            },
            "token":{
                type: String
            }
        });
        return mongoose.models.users || mongoose.model('users', userSchema);
    }
}