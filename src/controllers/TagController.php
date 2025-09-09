<?php

require_once 'AppController.php';
require_once __DIR__.'/../models/Tag.php';
require_once __DIR__.'/../repository/TagRepository.php';

class TagController extends AppController {
    private $messages = [];
    private $tagRepository;

    public function __construct() {
        parent::__construct();
        $this->tagRepository = new TagRepository();
    }

    public function addTag() {
        if($this->isPost()) {
            $tag = new Tag($_POST['tag-name']);
            $this->tagRepository->addTag($tag);

            return $this->render('overview', [
                'tags' => $this->tagRepository->getTags(),
                'messages' => $this->messages,
                'tag' => $tag
            ]);
        }

        $this->render('overview', ['messages' => $this->messages]);
    }

    private function validate(array $file) : bool {
        return true;
    }

    public function overview() {
        $tags = $this->tagRepository->getTags();
        $this->render('overview', ['tags' => $tags]);
    }
}