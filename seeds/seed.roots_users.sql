BEGIN;

TRUNCATE
  roots_users
  RESTART IDENTITY CASCADE;

INSERT INTO roots_users (email, first_name, last_name, password)
VALUES
    ('sam@email.com', 'Sam', 'Gamgee', '$2a$12$simF6/5Z2thud5c6Y/caVu2RcUb6msHTZE4efvZSvO7vveS3XgHCG');

COMMIT;