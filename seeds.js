var mongoose = require('mongoose');
var Collection = require('./models/collection');
var Comment = require('./models/comment');

var data = [
    // {
    //     name:'Daisy', 
    //     image: 'https://www.gardeningknowhow.com/wp-content/uploads/2020/06/daisies.jpg',
    //     desc: 'The Daisy flower',
    //     pr: 100,
    //     qty: 50
    // }    
];



function seedDB(){
    Collection.remove({}, function(err){
        if(err) {
            console.log(err);
        }
        console.log("Database Reset");
        data.forEach(function(seed){
            Collection.create(seed, function(err, collection){
                if(err) {
                    console.log(err);
                } else {
                    console.log('New data added');
                }
            });
        });
    
    });
}

module.exports = seedDB;