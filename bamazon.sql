create database bamazon;
use bamazon;

--PRODUCTS TABLE
create table products(
	item_id INT(15) primary key auto_increment,
    product_name VARCHAR(100) not null,
    department_name VARCHAR(100) not null,
    price DECIMAL(6,2) not null,
    stock_quantity INTEGER(8) not null
);
select * from products;

insert into products(item_id, product_name, department_name, price, stock_quantity)
values(12534, "Game of Thrones Collection George R.R. Martin 6 Books Set", "Books", 79.39, 12);
--modifying the products table so that there's a product_sales column
alter table products
add column product_sales INTEGER(15) after stock_quantity;

--DEPARTMENTS TABLE
create table departments(
	department_id INT primary key auto_increment,
    department_name VARCHAR(30) not null,
    over_head_costs INTEGER(15) not null
);
insert into departments(department_name, over_head_costs)
values("Books", 15000);

-- bamazonSupervisor
select products.department_name, departments.over_head_costs, sum(product_sales) as product_sales, sum(product_sales)-over_head_costs AS total_profit from products
inner join departments on products.department_name = departments.department_name GROUP BY department_name;