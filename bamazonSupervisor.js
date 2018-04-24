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

var supervisor ={
    prompt: function(){
        inquirer.prompt([
            {
                name:"task",
                type: "list",
                message: "Choose an action",
                choices: ["View Product Sales by Department", "Create New Department"]
            }
        ]).then(function(answer){
            if (answer.task === "View Product Sales by Department"){
                supervisor.view();
            }else{
                supervisor.add();
            }
        })
    },
    view: function(){
        var select = "select products.department_name, departments.over_head_costs, sum(product_sales) as product_sales, sum(product_sales)-over_head_costs AS total_profit from products";
        var join="inner join departments on products.department_name = departments.department_name GROUP BY department_name";
        connection.query(select+" "+join, function(err, res){
            if(err) throw err;
            var table = new Table({
                head: ["Department", "Overhead costs", "Product sales", "Total profit"],
                colWidths: [30, 20, 20, 20]
            });
            for(var i=0;i<res.length;i++){
                table.push(
                    [res[i].department_name, res[i].over_head_costs+"$", res[i].product_sales+"$", res[i].total_profit+"$"]
                );
            }
            console.log(table.toString());
            connection.end();
        })
    },
    add: function(){
        inquirer.prompt([
            {
                name: "name",
                type: "input",
                message: "Department name:",
            },
            {
                name: "costs",
                type:"input",
                message: "Overhead costs:",
                validate: function(input){//validating input
                    if(isNaN(input)||input<0) return ("Invalid number"); //if input is not a number
                    else return true;
                }
            }
        ]).then(function(answer){
            connection.query("INSERT INTO departments SET ?",
            {
                department_name: answer.name,
                over_head_costs: answer.costs
            },function(err, res){
                if (err) throw err;
                console.log("New department added successfully!");
            })
        })
    }
}

connection.connect(function(err){
    if(err) throw err;
    supervisor.prompt();
});
