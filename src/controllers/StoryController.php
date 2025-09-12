<?php
session_start();
require_once 'AppController.php';
require_once __DIR__.'/../models/Story.php';
require_once __DIR__.'/../repository/StoryRepository.php';

class StoryController extends AppController {

    private $messages = [];
    private $storyRepository;

    public function __construct() {
        parent::__construct();
        $this->storyRepository = new StoryRepository();
    }

    public function addStory() {
        if($this->isPost()) {
            $story = new Story($_POST['story-name'], $_POST['story-description']);
            $this->storyRepository->addStory($story, $_SESSION['user_id']);

            header('Location: /home');
            exit();

            return $this->render('home', [
                'stories' => $this->storyRepository->getStories($_SESSION['user_id']),
                'messages' => $this->messages,
                'story' => $story
            ]);

        }

        $this->render('home', ['messages' => $this->messages]);
    }

    public function searchStories() {
        if($this->isGet()) {
            $story = new Story($_POST['story-name'], $_POST['story-description']);
            $this->storyRepository->getStories($_SESSION['user_id']);

            return $this->render('home', [
                'stories' => $this->storyRepository->getStories($_SESSION['user_id']),
                'messages' => $this->messages,
                'story' => $story
            ]);
        }

        $this->render('home', ['messages' => $this->messages]);
    }

    private function validate(array $file) : bool {
        return true;
    }

    public function home() {
        $stories = $this->storyRepository->getStories($_SESSION['user_id']);
        $this->render('home', ['stories' => $stories]);
    }
}