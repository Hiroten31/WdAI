-- Delete existing notes
DELETE FROM notes;

-- Insert root level notes for Fantasy World project (ID=1)
INSERT INTO notes (project_id, parent_note_id, title, content, position) VALUES
(1, NULL, 'Characters', 'List of main characters in the story', 0),
(1, NULL, 'Locations', 'Important locations and their descriptions', 1),
(1, NULL, 'Plot Outline', 'Main story arc and events', 2);

-- Store character note IDs for reference
-- Aragorn (Character child #1)
INSERT INTO notes (project_id, parent_note_id, title, content, position) 
SELECT 1, id, 'Aragorn', 'A ranger turned king with a mysterious past', 0
FROM notes WHERE title = 'Characters' AND parent_note_id IS NULL;

-- Legolas (Character child #2)
INSERT INTO notes (project_id, parent_note_id, title, content, position)
SELECT 1, id, 'Legolas', 'An elf archer with incredible skills', 1
FROM notes WHERE title = 'Characters' AND parent_note_id IS NULL;

-- Gimli (Character child #3)
INSERT INTO notes (project_id, parent_note_id, title, content, position)
SELECT 1, id, 'Gimli', 'A dwarf warrior with a strong sense of honor', 2
FROM notes WHERE title = 'Characters' AND parent_note_id IS NULL;

-- Location notes
INSERT INTO notes (project_id, parent_note_id, title, content, position)
SELECT 1, id, 'The Shire', 'A peaceful land of hobbits', 0
FROM notes WHERE title = 'Locations' AND parent_note_id IS NULL;

INSERT INTO notes (project_id, parent_note_id, title, content, position)
SELECT 1, id, 'Rivendell', 'An elven sanctuary of great power', 1
FROM notes WHERE title = 'Locations' AND parent_note_id IS NULL;

INSERT INTO notes (project_id, parent_note_id, title, content, position)
SELECT 1, id, 'Mordor', 'The dark realm of the enemy', 2
FROM notes WHERE title = 'Locations' AND parent_note_id IS NULL;

-- Plot notes
INSERT INTO notes (project_id, parent_note_id, title, content, position)
SELECT 1, id, 'Act 1: The Beginning', 'Where it all starts', 0
FROM notes WHERE title = 'Plot Outline' AND parent_note_id IS NULL;

INSERT INTO notes (project_id, parent_note_id, title, content, position)
SELECT 1, id, 'Act 2: The Journey', 'The main adventure unfolds', 1
FROM notes WHERE title = 'Plot Outline' AND parent_note_id IS NULL;

INSERT INTO notes (project_id, parent_note_id, title, content, position)
SELECT 1, id, 'Act 3: The Climax', 'The final confrontation', 2
FROM notes WHERE title = 'Plot Outline' AND parent_note_id IS NULL;

-- Aragorn's sub-notes
INSERT INTO notes (project_id, parent_note_id, title, content, position)
SELECT 1, id, 'Background', 'Born to the wandering Rangers of the North', 0
FROM notes WHERE title = 'Aragorn' AND parent_note_id IS NOT NULL LIMIT 1;

INSERT INTO notes (project_id, parent_note_id, title, content, position)
SELECT 1, id, 'Skills', 'Sword fighting, tracking, healing with herbs', 1
FROM notes WHERE title = 'Aragorn' AND parent_note_id IS NOT NULL LIMIT 1;

-- Rivendell's sub-notes
INSERT INTO notes (project_id, parent_note_id, title, content, position)
SELECT 1, id, 'History', 'Founded thousands of years ago', 0
FROM notes WHERE title = 'Rivendell' AND parent_note_id IS NOT NULL LIMIT 1;

INSERT INTO notes (project_id, parent_note_id, title, content, position)
SELECT 1, id, 'Inhabitants', 'Home to elves and wise beings', 1
FROM notes WHERE title = 'Rivendell' AND parent_note_id IS NOT NULL LIMIT 1;
