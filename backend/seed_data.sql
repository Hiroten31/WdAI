-- Clear existing data (in correct order due to foreign keys)
DELETE FROM note_tags;
DELETE FROM notes;
DELETE FROM tags;
DELETE FROM projects;

-- Get user_id for testuser (assuming it exists)
DO $$
DECLARE
    v_user_id INT;
    v_project1_id INT;
    v_project2_id INT;
    v_project3_id INT;
    v_project4_id INT;
    
    -- Tags
    v_tag_locations_p1 INT;
    v_tag_characters_p1 INT;
    v_tag_quests_p1 INT;
    v_tag_items_p1 INT;
    
    v_tag_locations_p2 INT;
    v_tag_characters_p2 INT;
    v_tag_quests_p2 INT;
    v_tag_items_p2 INT;
    
    v_tag_locations_p3 INT;
    v_tag_characters_p3 INT;
    v_tag_quests_p3 INT;
    v_tag_items_p3 INT;
    
    v_tag_locations_p4 INT;
    v_tag_characters_p4 INT;
    v_tag_quests_p4 INT;
    v_tag_items_p4 INT;
    
    -- Notes for Project 1
    v_note_riverwood INT;
    v_note_darkwood INT;
    v_note_blacksmith INT;
    v_note_elder INT;
    v_note_town_square INT;
    v_note_market INT;
    v_note_hunter INT;
    v_note_forest_path INT;
    v_note_quest1 INT;
    v_note_quest2 INT;
    v_note_quest3 INT;
    v_note_item1 INT;
    v_note_item2 INT;
    v_note_item3 INT;
    
    -- Notes for Project 2
    v_note_castle INT;
    v_note_kingdom INT;
    v_note_king INT;
    v_note_queen INT;
    v_note_throne_room INT;
    v_note_dungeon INT;
    v_note_knight INT;
    v_note_wizard INT;
    v_note_quest4 INT;
    v_note_quest5 INT;
    v_note_quest6 INT;
    v_note_item4 INT;
    v_note_item5 INT;
    v_note_item6 INT;
    
    -- Notes for Project 3
    v_note_desert INT;
    v_note_oasis INT;
    v_note_merchant INT;
    v_note_nomad INT;
    v_note_bazaar INT;
    v_note_ruins INT;
    v_note_quest7 INT;
    v_note_quest8 INT;
    v_note_item7 INT;
    v_note_item8 INT;
    
    -- Notes for Project 4
    v_note_port INT;
    v_note_lighthouse INT;
    v_note_captain INT;
    v_note_sailor INT;
    v_note_dock INT;
    v_note_tavern INT;
    v_note_quest9 INT;
    v_note_quest10 INT;
    v_note_item9 INT;
    v_note_item10 INT;

BEGIN
    -- Get user ID
    SELECT id INTO v_user_id FROM users WHERE username = 'testuser';
    
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'User testuser not found';
    END IF;

    -- Create 4 Projects
    INSERT INTO projects (user_id, title, description) 
    VALUES (v_user_id, 'Fantasy RPG World', 'A medieval fantasy world with villages, characters, and quests')
    RETURNING id INTO v_project1_id;
    
    INSERT INTO projects (user_id, title, description) 
    VALUES (v_user_id, 'Kingdom Chronicles', 'Royal castle and kingdom management')
    RETURNING id INTO v_project2_id;
    
    INSERT INTO projects (user_id, title, description) 
    VALUES (v_user_id, 'Desert Adventures', 'Mysteries of the ancient desert')
    RETURNING id INTO v_project3_id;
    
    INSERT INTO projects (user_id, title, description) 
    VALUES (v_user_id, 'Coastal Trading Port', 'Maritime trade and sea adventures')
    RETURNING id INTO v_project4_id;

    -- === PROJECT 1: Fantasy RPG World ===
    -- Create tags for Project 1
    INSERT INTO tags (project_id, name) VALUES (v_project1_id, 'Locations') RETURNING id INTO v_tag_locations_p1;
    INSERT INTO tags (project_id, name) VALUES (v_project1_id, 'Characters') RETURNING id INTO v_tag_characters_p1;
    INSERT INTO tags (project_id, name) VALUES (v_project1_id, 'Quests') RETURNING id INTO v_tag_quests_p1;
    INSERT INTO tags (project_id, name) VALUES (v_project1_id, 'Items') RETURNING id INTO v_tag_items_p1;

    -- Create notes for Project 1
    -- Village: Riverwood
    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project1_id, NULL, 'Riverwood', 'A peaceful village by the river', 'A small trading village known for its fishing industry', 0)
    RETURNING id INTO v_note_riverwood;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_riverwood, v_tag_locations_p1);

    -- Characters under Riverwood
    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project1_id, v_note_riverwood, 'Blacksmith John', 'Master craftsman of Riverwood', 'An experienced blacksmith who can forge legendary weapons', 0)
    RETURNING id INTO v_note_blacksmith;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_blacksmith, v_tag_characters_p1);

    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project1_id, v_note_riverwood, 'Elder Maria', 'Village elder and herbalist', 'Wise elder who knows ancient remedies and village history', 1)
    RETURNING id INTO v_note_elder;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_elder, v_tag_characters_p1);

    -- Locations under Riverwood
    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project1_id, v_note_riverwood, 'Town Square', 'Central meeting place', 'The heart of village social life with a fountain', 2)
    RETURNING id INTO v_note_town_square;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_town_square, v_tag_locations_p1);

    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project1_id, v_note_riverwood, 'Market', 'Daily trading market', 'Vendors sell fresh fish, vegetables, and crafted goods', 3)
    RETURNING id INTO v_note_market;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_market, v_tag_locations_p1);

    -- Quests under characters
    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project1_id, v_note_blacksmith, 'Forge the Legendary Sword', 'Help John craft a special weapon', 'Gather rare materials to forge a sword of ancient power', 0)
    RETURNING id INTO v_note_quest1;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_quest1, v_tag_quests_p1);

    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project1_id, v_note_elder, 'Gather Rare Herbs', 'Collect healing herbs for Elder Maria', 'Find moonflower and dragonthistle in the nearby forest', 0)
    RETURNING id INTO v_note_quest2;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_quest2, v_tag_quests_p1);

    -- Items under characters and locations
    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project1_id, v_note_blacksmith, 'Steel Hammer', 'Johns trusted crafting tool', 'A well-worn hammer with masterful balance', 1)
    RETURNING id INTO v_note_item1;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_item1, v_tag_items_p1);

    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project1_id, v_note_market, 'Healing Potion', 'Restores health', 'A glass vial filled with red liquid that heals wounds', 0)
    RETURNING id INTO v_note_item2;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_item2, v_tag_items_p1);

    -- Village: Darkwood
    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project1_id, NULL, 'Darkwood', 'A mysterious forest village', 'Hidden village deep in the dark woods', 1)
    RETURNING id INTO v_note_darkwood;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_darkwood, v_tag_locations_p1);

    -- Character under Darkwood
    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project1_id, v_note_darkwood, 'Hunter Tom', 'Expert tracker and hunter', 'Knows every path through the dangerous woods', 0)
    RETURNING id INTO v_note_hunter;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_hunter, v_tag_characters_p1);

    -- Location under Darkwood
    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project1_id, v_note_darkwood, 'Forest Path', 'Winding trail through trees', 'Dangerous path where wolves are often seen', 1)
    RETURNING id INTO v_note_forest_path;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_forest_path, v_tag_locations_p1);

    -- Quest under Hunter
    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project1_id, v_note_hunter, 'Hunt the Alpha Wolf', 'Eliminate the pack leader', 'A massive wolf has been terrorizing travelers', 0)
    RETURNING id INTO v_note_quest3;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_quest3, v_tag_quests_p1);

    -- Item under Hunter
    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project1_id, v_note_hunter, 'Hunters Bow', 'Finely crafted longbow', 'Made from ancient oak with perfect tension', 1)
    RETURNING id INTO v_note_item3;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_item3, v_tag_items_p1);

    -- === PROJECT 2: Kingdom Chronicles ===
    -- Create tags for Project 2
    INSERT INTO tags (project_id, name) VALUES (v_project2_id, 'Locations') RETURNING id INTO v_tag_locations_p2;
    INSERT INTO tags (project_id, name) VALUES (v_project2_id, 'Characters') RETURNING id INTO v_tag_characters_p2;
    INSERT INTO tags (project_id, name) VALUES (v_project2_id, 'Quests') RETURNING id INTO v_tag_quests_p2;
    INSERT INTO tags (project_id, name) VALUES (v_project2_id, 'Items') RETURNING id INTO v_tag_items_p2;

    -- Main location: Castle
    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project2_id, NULL, 'Royal Castle', 'The seat of power', 'Magnificent stone fortress overlooking the kingdom', 0)
    RETURNING id INTO v_note_castle;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_castle, v_tag_locations_p2);

    -- Location: Kingdom
    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project2_id, NULL, 'Kingdom of Valor', 'The entire realm', 'Prosperous kingdom known for its knights', 1)
    RETURNING id INTO v_note_kingdom;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_kingdom, v_tag_locations_p2);

    -- Characters
    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project2_id, v_note_castle, 'King Edmund', 'Ruler of the kingdom', 'Just and wise monarch beloved by his people', 0)
    RETURNING id INTO v_note_king;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_king, v_tag_characters_p2);

    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project2_id, v_note_castle, 'Queen Isabella', 'Royal consort', 'Diplomatic and intelligent, handles foreign relations', 1)
    RETURNING id INTO v_note_queen;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_queen, v_tag_characters_p2);

    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project2_id, v_note_kingdom, 'Sir Galahad', 'Champion knight', 'The finest warrior in the realm', 0)
    RETURNING id INTO v_note_knight;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_knight, v_tag_characters_p2);

    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project2_id, v_note_castle, 'Merlin the Wise', 'Court wizard', 'Ancient sorcerer who advises the king', 2)
    RETURNING id INTO v_note_wizard;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_wizard, v_tag_characters_p2);

    -- Sub-locations
    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project2_id, v_note_castle, 'Throne Room', 'Hall of judgment', 'Grand chamber where the king holds court', 3)
    RETURNING id INTO v_note_throne_room;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_throne_room, v_tag_locations_p2);

    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project2_id, v_note_castle, 'Royal Dungeon', 'Prison beneath the castle', 'Dark cells holding dangerous criminals', 4)
    RETURNING id INTO v_note_dungeon;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_dungeon, v_tag_locations_p2);

    -- Quests
    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project2_id, v_note_knight, 'Defend the Border', 'Protect from invaders', 'Enemy forces are massing at the northern border', 0)
    RETURNING id INTO v_note_quest4;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_quest4, v_tag_quests_p2);

    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project2_id, v_note_wizard, 'Retrieve the Ancient Tome', 'Recover lost magical knowledge', 'A powerful spellbook was stolen by dark forces', 0)
    RETURNING id INTO v_note_quest5;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_quest5, v_tag_quests_p2);

    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project2_id, v_note_dungeon, 'Interrogate the Prisoner', 'Extract information', 'A captured spy knows enemy plans', 0)
    RETURNING id INTO v_note_quest6;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_quest6, v_tag_quests_p2);

    -- Items
    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project2_id, v_note_king, 'Royal Crown', 'Symbol of authority', 'Golden crown adorned with precious gems', 0)
    RETURNING id INTO v_note_item4;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_item4, v_tag_items_p2);

    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project2_id, v_note_knight, 'Excalibur', 'Legendary blade', 'Ancient sword with unmatched sharpness', 1)
    RETURNING id INTO v_note_item5;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_item5, v_tag_items_p2);

    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project2_id, v_note_wizard, 'Staff of Power', 'Magical artifact', 'Crystal-topped staff that amplifies magic', 1)
    RETURNING id INTO v_note_item6;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_item6, v_tag_items_p2);

    -- === PROJECT 3: Desert Adventures ===
    -- Create tags for Project 3
    INSERT INTO tags (project_id, name) VALUES (v_project3_id, 'Locations') RETURNING id INTO v_tag_locations_p3;
    INSERT INTO tags (project_id, name) VALUES (v_project3_id, 'Characters') RETURNING id INTO v_tag_characters_p3;
    INSERT INTO tags (project_id, name) VALUES (v_project3_id, 'Quests') RETURNING id INTO v_tag_quests_p3;
    INSERT INTO tags (project_id, name) VALUES (v_project3_id, 'Items') RETURNING id INTO v_tag_items_p3;

    -- Main location
    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project3_id, NULL, 'Endless Desert', 'Vast sandy wasteland', 'Scorching desert with hidden secrets', 0)
    RETURNING id INTO v_note_desert;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_desert, v_tag_locations_p3);

    -- Sub-location
    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project3_id, v_note_desert, 'Oasis Settlement', 'Water source community', 'Small settlement built around precious water source', 0)
    RETURNING id INTO v_note_oasis;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_oasis, v_tag_locations_p3);

    -- Characters
    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project3_id, v_note_oasis, 'Merchant Rashid', 'Traveling trader', 'Wealthy merchant who knows desert routes', 0)
    RETURNING id INTO v_note_merchant;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_merchant, v_tag_characters_p3);

    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project3_id, v_note_desert, 'Nomad Zahra', 'Desert wanderer', 'Knows the ancient ways of survival', 0)
    RETURNING id INTO v_note_nomad;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_nomad, v_tag_characters_p3);

    -- More locations
    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project3_id, v_note_oasis, 'Bazaar', 'Trading market', 'Colorful market with exotic goods', 1)
    RETURNING id INTO v_note_bazaar;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_bazaar, v_tag_locations_p3);

    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project3_id, v_note_desert, 'Ancient Ruins', 'Forgotten temple', 'Crumbling structure from a lost civilization', 1)
    RETURNING id INTO v_note_ruins;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_ruins, v_tag_locations_p3);

    -- Quests
    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project3_id, v_note_merchant, 'Escort the Caravan', 'Protect traders', 'Bandits threaten the trade route', 0)
    RETURNING id INTO v_note_quest7;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_quest7, v_tag_quests_p3);

    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project3_id, v_note_ruins, 'Explore the Temple', 'Uncover ancient secrets', 'Mysterious artifacts lie within', 0)
    RETURNING id INTO v_note_quest8;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_quest8, v_tag_quests_p3);

    -- Items
    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project3_id, v_note_merchant, 'Silk Robes', 'Fine desert clothing', 'Protects from sun and sand', 1)
    RETURNING id INTO v_note_item7;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_item7, v_tag_items_p3);

    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project3_id, v_note_ruins, 'Golden Scarab', 'Ancient artifact', 'Mysterious jeweled beetle statue', 1)
    RETURNING id INTO v_note_item8;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_item8, v_tag_items_p3);

    -- === PROJECT 4: Coastal Trading Port ===
    -- Create tags for Project 4
    INSERT INTO tags (project_id, name) VALUES (v_project4_id, 'Locations') RETURNING id INTO v_tag_locations_p4;
    INSERT INTO tags (project_id, name) VALUES (v_project4_id, 'Characters') RETURNING id INTO v_tag_characters_p4;
    INSERT INTO tags (project_id, name) VALUES (v_project4_id, 'Quests') RETURNING id INTO v_tag_quests_p4;
    INSERT INTO tags (project_id, name) VALUES (v_project4_id, 'Items') RETURNING id INTO v_tag_items_p4;

    -- Main location
    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project4_id, NULL, 'Harbor Town', 'Bustling port city', 'Major trading hub on the coast', 0)
    RETURNING id INTO v_note_port;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_port, v_tag_locations_p4);

    -- Sub-location
    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project4_id, v_note_port, 'The Lighthouse', 'Beacon for ships', 'Tall tower guiding vessels safely', 0)
    RETURNING id INTO v_note_lighthouse;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_lighthouse, v_tag_locations_p4);

    -- Characters
    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project4_id, v_note_port, 'Captain Morgan', 'Ship captain', 'Experienced sailor with many tales', 0)
    RETURNING id INTO v_note_captain;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_captain, v_tag_characters_p4);

    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project4_id, v_note_port, 'First Mate Jack', 'Loyal crewman', 'Captains right hand and navigator', 1)
    RETURNING id INTO v_note_sailor;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_sailor, v_tag_characters_p4);

    -- More locations
    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project4_id, v_note_port, 'Loading Dock', 'Cargo area', 'Where ships load and unload goods', 2)
    RETURNING id INTO v_note_dock;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_dock, v_tag_locations_p4);

    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project4_id, v_note_port, 'The Salty Mermaid Tavern', 'Sailors pub', 'Rowdy tavern where stories are shared', 3)
    RETURNING id INTO v_note_tavern;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_tavern, v_tag_locations_p4);

    -- Quests
    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project4_id, v_note_captain, 'Hunt the Sea Monster', 'Clear shipping lanes', 'A kraken is attacking merchant vessels', 0)
    RETURNING id INTO v_note_quest9;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_quest9, v_tag_quests_p4);

    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project4_id, v_note_dock, 'Stop the Smugglers', 'End illegal trade', 'Contraband is being moved through the port', 0)
    RETURNING id INTO v_note_quest10;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_quest10, v_tag_quests_p4);

    -- Items
    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project4_id, v_note_captain, 'Captains Compass', 'Magical navigation tool', 'Always points to true north', 1)
    RETURNING id INTO v_note_item9;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_item9, v_tag_items_p4);

    INSERT INTO notes (project_id, parent_note_id, title, description, content, position)
    VALUES (v_project4_id, v_note_tavern, 'Barrel of Rum', 'Fine spirits', 'The taverns specialty brew', 0)
    RETURNING id INTO v_note_item10;
    INSERT INTO note_tags (note_id, tag_id) VALUES (v_note_item10, v_tag_items_p4);

    RAISE NOTICE 'Database seeded successfully with 4 projects and % notes', 
        (SELECT COUNT(*) FROM notes);
END $$;
