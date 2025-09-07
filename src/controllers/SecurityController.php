<?php

require_once 'AppController.php';
require_once __DIR__.'/../models/User.php';
require_once __DIR__.'/../repository/UserRepository.php';

class SecurityController extends AppController {
    public function login() {
        $userRepository = new UserRepository();

        if(!$this->isPost()) {
            return $this->render('login');
        }

        $email = $_POST['email'];
        $password = $_POST['password'];

        $user = $userRepository->getUserByEmail($email);

        if(!$user) {
            return $this->render('login', ['message' => 'User not found']);
        }

        if($user->getEmail() !== $email || $user->getPassword() !== $password) {
            return $this->render('login', ['message' => 'Wrong email or password!']);
        }

        // return $this->render('home');

        $url = "http://$_SERVER[HTTP_HOST]";
        header("Location: {$url}/home");
    }
}