<?php

require_once 'AppController.php';
require_once __DIR__.'/../models/User.php';
require_once __DIR__.'/../repository/UserRepository.php';
require_once __DIR__ . '/../models/Story.php';
require_once __DIR__ . '/../models/Note.php';

class SecurityController extends AppController {

    private $userRepository;

    public function __construct() {
        parent::__construct();
        $this->userRepository = new userRepository();
    }
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
        $_SESSION['last_story'] = $userRepository->getLastStory($_SESSION['user_id']);
        $_SESSION['last_note'] = $userRepository->getLastNote($_SESSION['user_id']);

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

    public function addAccount() {
        if($this->isPost()) {

            if($_POST['acc-pass'] !== $_POST['acc-repeat-pass']) {
                return $this->render('login', ['message' => 'Passwords do not match. Try again!']);
            }
            if($this->userRepository->checkMails($_POST['acc-mail'])) {
                return $this->render('login', ['message' => 'There is an account with this e-mail!']);
            }

            $user = new User($_POST['acc-username'], $_POST['acc-mail'], $_POST['acc-pass']);
            $this->userRepository->addAccount($user);

            header('Location: /login');
            exit();

            return $this->render('login', [ 'messages' => 'Your account has been created! Sign in.']);
        }

        $this->render('login', ['messages' => $this->messages]);
    }
}