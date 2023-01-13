const express = require("express");
const bodyParser = require("body-parser");
//after installing mongodb, require the mongoose package
const mongoose = require("mongoose");
const path = require("path");
// getting day from other file using module
// const date = require(__dirname + "/date.js")

//lodash package to add some other features
const _ = require("lodash");

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static('public'));

//connecting and creating database
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true });

// var items = ['Buy Bullet', 'Add Nescafe', 'Take A Sip'];

//creating schema in mongo db
const itemSchema = {
    name: String
};

//where you use a mongoose model is usally capitalize
//the model takes two argument, singular version of the collection
//and the collection schema
//the model name is the collection name 
const Item = mongoose.model("Item", itemSchema);

//creating a new item in collection in mongodb

const Item1 = new Item({
    name: "Welcome to your todolist!"
});

const Item2 = new Item({
    name: "Hit the + button to add a new item"
});

const Item3 = new Item({
    name: "<---- Hit this to delete an item."
});

const defaultItem = [Item1, Item2, Item3];

// Item.insertMany(defaultItem, function(err) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("the items are successfully inserted into the collection");
//     }
// }); 

const listSchema = {
    name: String,
    items: [itemSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {

    //the find method takes two parameter -- condition and function
    
    Item.find({}, function(err, founditems){
        //to show all the items 
            if(founditems.length === 0) {
              Item.insertMany(defaultItem, function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log("the items are successfully inserted into the collection");
    }
}); 
res.redirect("/");  
            } else{
                res.render('list', {Today:"Today", newListItem: founditems});
            }
            });

    // let day = date.getDate();

  
});

//handling posting request and adding it to the array to create a new item
app.post('/', function(req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if(listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName}, function(err, foundList){
            //the items tap into the embedded array of the object
            foundList.Item.push(item);
            foundList.save();
            //here we are redirecting to the page the user came from
            res.redirect("/" + listName);
        })
    }

    // item.save();
    // res.redirect('/');
    
 });

 app.post("/delete", function(req, res){
    //to send what is being posted to the console
    // console.log(req.body.checkbox);

    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;


    //checking ig we try to delete an item from a route or custom list

    if(listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function(err){
        if (!err) {
            
            console.log("An Item Is Successfully Deleted")
             // to get the up to date items in the collections we have to 
    //redirect it
            res.redirect("/");
        }
    });
} else {
    //deleting in the custom list
    // List.findOneAndUpdate({condition}, {what update to made}, callback)
    List.findOneAndUpdate({name: listName}, {$pull:{items: {_id: checkedItemId}}}, function(err, foundList){
        if(!err){
            res.redirect("/" + listName);
        }
    });
}
   
 });

 //creating a custom list name as a dynamic page
 app.get("/:customListName", function(req,res){
    //its vaiable here
    const customListName = req.params.customListName;

        //how to check if a item in the collection and if
    //how not to resave it and if not how to save tyhe new item to
    //the collection
    //the findOne method will print out an object

    List.findOne({name: customListName}, function(err, foundList){
        if(!err) {
            if(!foundList) {
                //this is a part where we should create a new list

                  const list = new List({
        name: customListName,
        items: defaultItem
    });

    //a new list is created and save to the database
    list.save();
    //after the function is redirected to save the list to a new
    //dynamic route, it is redirected to the new page
    res.redirect("/" + customListName);
            } else{
             
               //this is a part where we should show an existing list
               res.render("list", {Today:foundList.name, newListItem: foundList.items});
            }
        }
    })
  



  
 });


 app.get('/about', function(req, res) {
    res.render('about');
 });





app.listen(3000, function(){
    console.log("Server running on port 3000")
});