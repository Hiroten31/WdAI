<?php

require_once 'AppController.php';
require_once __DIR__.'/../models/User.php';

class SecurityController extends AppController {
    public function login() {
        $user = new User('john@wp.pl', 'password', 'Hiroten');

        if(!$this->isPost()) {
            return $this->render('login');
        }

        $email = $_POST['email'];
        $password = $_POST['password'];

        if($user->getEmail() !== $email && $user->getPassword() !== $password) {
            return $this->render('login', ['message' => 'Wrong email or password!']);
        }

        // return $this->render('home');

        $url = "http://$_SERVER[HTTP_HOST]";
        header("Location: {$url}/home");
    }
}