<?php

require_once 'AppController.php';

class DefaultController extends AppController {
    public function index() {
        $this->render('login');
    }

    public function home() {
        $this->render('home');
    }

    public function overview() {
        $this->render('overview');
    }

    public function sketches() {
        $this->render('sketches');
    }

    public function note() {
        $this->render('note');
    }
}