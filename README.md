# Bamazon
# Node.js & MySQL

## Overview

I created an Amazon-like storefront. The app will take in orders from customers and deplete stock from the store's inventory. App can track product sales across store's departments and then provide a summary of the highest-grossing departments in the store.

For data input and storage app is using `MySQL` and `Inquirer` npm packages. `cli-table` npm package is used for displaying some data.

* I am providing videos of typical user flows through the application (for the customer and if relevant the manager/supervisor). This includes views of the prompts and the responses after their selection (for the different selection options).

### Customer View

`bamazonCustomer.js`

Running this application will first display all of the items available for sale (the ids, names, and prices of products for sale).

Then app prompts users with two messages.

   * The first asks them the ID of the product they would like to buy.
   * The second message asks how many units of the product they would like to buy.

Once the customer has placed the order, application checks if store has enough of the product to meet the customer's request.

   * If not, the app logs `Insufficient quantity!`, and then prevents the order from going through.

However, if store _does_ have enough of the product, app fulfills the customer's order.
   * This means updating the SQL database to reflect the remaining quantity.
   * Once the update goes through, the total cost of the purchase is displayed.


### Manager View

`bamazonManager.js`

  Application provides next menu options:

    * View Products for Sale
    
    * View Low Inventory
    
    * Add to Inventory
    
    * Add New Product

  * If a manager selects `View Products for Sale`, the app lists every available item: the item IDs, names, prices, and quantities.

  * If a manager selects `View Low Inventory`, then it lists all items with an inventory count lower than five.

  * If a manager selects `Add to Inventory`, app displays a prompt that will let the manager "add more" of any item currently in the store.

  * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.


### Supervisor View

`bamazonSupervisor.js`

Running this application will list a set of menu options:

    * View Product Sales by Department
   
    * Create New Department

When a supervisor selects `View Product Sales by Department`, the app displays a summarized table in their terminal/bash window. 
Ex:
| department_id | department_name | over_head_costs | product_sales | total_profit |
| ------------- | --------------- | --------------- | ------------- | ------------ |
| 01            | Electronics     | 10000           | 20000         | 10000        |
| 02            | Clothing        | 60000           | 100000        | 40000        |

`total_profit` column is calculated on the fly using the difference between `over_head_costs` and `product_sales`. `total_profit` and is not stored in any database. Custom alias were used for that.
