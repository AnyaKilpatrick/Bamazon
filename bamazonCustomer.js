var Table = require("cli-table");
var mysql = require("mysql");
var inquirer = require("inquirer");

//creating connection with database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

//GLOBAL VARIABLES
var itemChoices = [];
var updatedQuantity;
var itemID;

//OBJECT
var bamazonCustomer = {
    displayItems: function(){
        connection.query("SELECT * FROM products", function(err, res){
            //creating a table using cli-table npm package
            var table = new Table({
                head: ["item id", "name", "price"],
                colWidths: [10, 70, 10]
            });
            // table is an array, so we are pushing our data into it
            for (var i=0; i<res.length;i++){//looping through our data in database
                table.push(
                    [res[i].item_id, res[i].product_name, res[i].price+" $"]
                );
                var id=res[i].item_id.toString();
                itemChoices.push(id); //pushing all item IDs into itemChoices array, to use it in prompt as options for answer
            }
            console.log(table.toString());
            bamazonCustomer.prompt();
        })
        
    },
    prompt: function(){
        inquirer.prompt([
            {
                name: "id",
                message: "Which product would you like to buy ? ID",
                type: "list",
                choices: itemChoices //array of item ids
            }
        ]).then(function(answer){
            connection.query("SELECT * FROM products where ?",[{item_id: answer.id}], function(err, res){//selecting the item user wants to purchase
                if(err) throw err;
                itemID=answer.id;
                console.log("\x1b[36m%s\x1b[0m","Product: "+ res[0].product_name);
                console.log("In stock: "+ res[0].stock_quantity);

                //asking next question
                inquirer.prompt([
                    {
                        name: "amount",
                        message: "How many units would you like to buy?",
                        type: "input",
                        validate: function(input){//validating input
                            if(isNaN(input)) return ("Invalid number"); //if input is not a number
                            if(input > res[0].stock_quantity || input <0) return("Insufficient quantity!"); //if there is not enough units in stock
                            else return true;
                        }
                    }
                ]).then (function(response){
                    console.log("\x1b[36m%s\x1b[0m",`
                    Product: ${res[0].product_name}
                    Price per unit: ${res[0].price}$
                    Requested units: ${response.amount} 
                    Total purchase: ${parseFloat(res[0].price*response.amount).toFixed(2)}$
                    `)
                    updatedQuantity = parseFloat(res[0].stock_quantity) - parseFloat(response.amount);
                    bamazonCustomer.updateDatabase();//updating amount of units in stock after successful purchase
                })
            })
        })
    },
    updateDatabase: function(){ //updating amount of units in stock after successful purchase
        connection.query("UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: updatedQuantity
            },
            {
                item_id: itemID
            }
        ],function(err, res){
            if (err) throw err;
            console.log("Sold! In stock: "+updatedQuantity);
            connection.end();//end connection with MySQL
        })
    }
}




connection.connect(function(err){
    if(err) throw err;
    bamazonCustomer.displayItems();
});
