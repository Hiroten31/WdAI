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

        session_start();
        $_SESSION['user_id'] = $userRepository->getUserIdByEmail($email);
        $_SESSION['user_email'] = $user->getEmail();
        $_SESSION['user_name'] = $user->getUsername();

        $url = "http://$_SERVER[HTTP_HOST]";
        header("Location: {$url}/home");
        exit();
    }

    public function logout() {
        session_start();
        session_unset();
        session_destroy();
        $url = "http://$_SERVER[HTTP_HOST]";
        header("Location: {$url}/login");
        exit();
    }
}