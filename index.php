<?php

require 'Routing.php';

$path = trim($_SERVER['REQUEST_URI'], '/');
$path = parse_url($path, PHP_URL_PATH);

Routing::get('index', 'DefaultController');
Routing::get('home', 'StoryController');
Routing::get('overview', 'TagController');
Routing::get('sketches', 'SketchController');
Routing::get('note', 'NoteController');
Routing::post('login', 'SecurityController');
Routing::post('logout', 'SecurityController');
Routing::post('addAccount', 'SecurityController');
Routing::post('addSketch', 'SketchController');
Routing::post('addStory', 'StoryController');
Routing::post('addTag', 'TagController');



Routing::run($path);