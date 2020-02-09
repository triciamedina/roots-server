BEGIN;

TRUNCATE
  roots_users
  RESTART IDENTITY CASCADE;

INSERT INTO roots_users (email, first_name, last_name, password)
VALUES
    ('test@test.com', 'FirstName', 'LastName', '$2y$12$GmDO.JQRnQ.T6LhwjurRVu.4DaMQvvueQaOYkH/9bjEjSk.HfVLbu');

COMMIT;