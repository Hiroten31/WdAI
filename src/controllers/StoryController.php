<?php

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
            $this->storyRepository->addStory($story);

            return $this->render('home', [
                'stories' => $this->storyRepository->getStories(),
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
        $stories = $this->storyRepository->getStories();
        $this->render('home', ['stories' => $stories]);
    }
}