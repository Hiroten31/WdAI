<?php

require 'Routing.php';

$path = trim($_SERVER['REQUEST_URI'], '/');
$path = parse_url($path, PHP_URL_PATH);

Routing::get('index', 'DefaultController');
Routing::get('home', 'DefaultController');
Routing::get('overview', 'DefaultController');
Routing::get('sketches', 'SketchController');
Routing::get('note', 'DefaultController');
Routing::post('login', 'SecurityController');
Routing::post('logout', 'SecurityController');
Routing::post('addSketch', 'SketchController');

Routing::run($path);