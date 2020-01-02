BEGIN;

TRUNCATE
  roots_donations
  RESTART IDENTITY CASCADE;

INSERT INTO roots_donations (user_id, donated_on, amount, project_name, project_description, project_url, school_name, image_url)
VALUES
    (1, '2019-02-14T16:28:32.615Z', 50.25, 'We Stay #TECHReady', 'Help me give my students technology equipment to improve their audio listening, computer literacy, and motor skills.', 'https://www.donorschoose.org/donors/proposal.html?id=3950014&challengeid=21280889', 'Frick Impact Academy', 'https://www.donorschoose.org/teacher/photo/u5889786?size=sm&t=1575349850702');

COMMIT;