USE wynflex;

CREATE TABLE users(
id BIGINT PRIMARY KEY auto_increment,
email varchar(180) NOT NULL UNIQUE,
rol varchar(90) NOT NULL,
password varchar(90) not null,
created_at timestamp(0) not null,
updated_at timestamp(0) not null
);


/*
DISCUTIR SI CREAR BASES EN 3RA FORMA NORMAL

create table roles(
id BIGINT primary key auto_increment,
name varchar(90) not null unique,
route varchar(255) not null,
created_at timestamp(0) not null,
updated_at timestamp(0) not null
);

insert into roles(
name,
route,
created_at,
updated_at
)
values(
'RESTAURANTE',
'/restaurant/orders/list',
'2025-03-15',
'2025-03-15'
);

insert into roles(
name,
route,
created_at,
updated_at
)
values(
'REPARTIDOR',
'/delivery/orders/list',
'2025-03-15',
'2025-03-15'
);

insert into roles(
name,
route,
created_at,
updated_at
)
values(
'CLIENTE',
'/client/products/list',
'2025-03-15',
'2025-03-15'
);

create table user_has_roles(
id_user bigint not null,
id_rol bigint not null,
created_at timestamp(0) not null,
updated_at timestamp(0) not null,
foreign key(id_user) references users(id) on update cascade on delete cascade,
foreign key(id_rol) references roles(id) on update cascade on delete cascade,
primary key(id_user, id_rol)
);*/