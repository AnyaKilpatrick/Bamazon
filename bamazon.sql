create database bamazon;
use bamazon;
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