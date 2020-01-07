CREATE TABLE roots_users (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    email TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now() NOT NULL
);