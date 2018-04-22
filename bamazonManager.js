var Table = require("cli-table");
var inquirer=require("inquirer");
var mysql = require("mysql");
//creating connection with database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});
//Global Variables
var select;
var itemID;
var itemChoices = [];
var stockQuantity;
//OBJECT
var manager = {
    prompt: function(){
        inquirer.prompt([ //offering options of available actions
            {
                name: "command",
                type: "list",
                message: "Choose an action",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
            }
        ]).then(function(answer){
            switch (answer.command){
                case "View Products for Sale":
                    select = "SELECT * FROM products";
                    manager.viewProducts()
                    break;
                case "View Low Inventory":
                    select = "SELECT * FROM products WHERE stock_quantity<5";
                    manager.viewProducts()
                    break;
                case "Add to Inventory":
                    select = "SELECT * FROM products";
                    manager.addQ1()
                    break;
                case "Add New Product":
                    manager.addProduct();
            }
            
        })
    },
    viewProducts: function(){ //displaying all items (using a table)
        connection.query(select, function(err, res){
            if (err) throw err;
            //creating a table using cli-table npm package
            var table = new Table({
                head: ["Item ID", "Name", "Price", "In Stock"],
                colWidths: [10, 70, 10, 10]
            });
            // table is an array, so we are pushing our data into it
            for (var i=0; i<res.length;i++){//looping through our data in database
                table.push(
                    [res[i].item_id, res[i].product_name, res[i].price+" $", res[i].stock_quantity]
                );
                var id=res[i].item_id.toString();
                itemChoices.push(id);
            }
            console.log(table.toString());
            connection.end();
        })
    },
    addQ1: function(){ //asking first question (item id)
        connection.query(select, function(err, res){
            for (var i=0; i<res.length;i++){//looping through our data in database
                var id=res[i].item_id.toString();
                itemChoices.push(id);
            };
            inquirer.prompt([
                {
                    name: "id",
                    type: "list",
                    message: "What item would you like to add?",
                    choices: itemChoices
                }
            ]).then(function(answer1){
                itemID=answer1.id;
                manager.addQ2(); //after user picked item id, we can select this item from database for further process
            })
        })
    },
    addQ2: function(){//second question (amount of units)
        connection.query("SELECT * FROM products WHERE ?",[{item_id:itemID}], function(err, resp){//selecting specific item
            if(err) throw err;
            console.log("\x1b[36m%s\x1b[0m",`
                You picked next item
                ${resp[0].item_id} Item: ${resp[0].product_name}
                Stock quantity: ${resp[0].stock_quantity}
            `)
            inquirer.prompt([
                {
                    name: "amount",
                    message: "How many units would you like to add?",
                    type: "input",
                    validate: function(input){//validating input
                        if(isNaN(input)) return ("Invalid number"); //if input is not a number
                        if(input <0) return("Insufficient quantity!"); //if there is not enough units in stock
                        else return true;
                    }
                }
            ]).then(function(answer2){
                newStockQuantity=parseFloat(resp[0].stock_quantity)+parseFloat(answer2.amount); //updating stock quantity
                manager.updateStock();
            })
        })
    },
    updateStock: function(){ //updating stock quantity in databse
        connection.query("UPDATE products SET ? WHERE ?",
            [
                {
                    stock_quantity: newStockQuantity
                },
                {
                    item_id:itemID
                }
            ],function(err, res){
                if(err) throw err;
                connection.query("SELECT * FROM products WHERE ?",[{item_id:itemID}],function(err, resp){
                //kept template literal to the left so it would log data with the same distance from the left as perevious information 
                console.log("\x1b[36m%s\x1b[0m",`
                Updated!!!
                ${resp[0].item_id} Item: ${resp[0].product_name}
                Stock quantity: ${resp[0].stock_quantity}
                `)
                connection.end();
                })
        })
    },
    addProduct: function(){
        inquirer.prompt([
            {
                name: "name",
                type: "input",
                message: "Name of new product:"
            },
            {
                name: "id",
                type: "input",
                message: "Product ID (4-6 digits)",
                validate: function(input){//validating input
                    if(isNaN(input)) return ("Invalid number"); //if input is not a number
                    if(input.length <4 || input.legnth>6) return("Invalid number!"); //if there are less then 4 or more then 6 digits
                    else return true;
                }
            },
            {
                name: "department",
                type: "list",
                message: "Department:",
                choices: ["Books", "Video Games", "Furniture", "Electronics", "Clothing, Shoes & Jewelry", "Food"]
            },
            {
                name: "price",
                type: "input",
                message: "Price per unit:"
            },
            {
                name: "stock",
                type: "input",
                message: "Stock quantity:"
            },
            {
                name: "confirm",
                type:"confirm",
                message: "Add this product to Bamazon."
            }
        ]).then(function(answer){
            if(answer.confirm === "false"){
                connection.end();
            } 
            // adding new product to database
            connection.query("INSERT INTO products SET ?",
            {
                item_id: answer.id,
                product_name: answer.name,
                department_name: answer.department,
                price: answer.price,
                stock_quantity: answer.stock
            }, function(err, res){
                if(err) throw err;
                console.log("\x1b[36m%s\x1b[0m","Inventory updated successfully!!");
                connection.end();
            })
        })  
    }
}


connection.connect(function(err){
    if(err) throw err;
    manager.prompt();
});

