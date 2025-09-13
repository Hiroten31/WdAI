<?php
session_start();
require_once 'AppController.php';
require_once __DIR__.'/../models/Note.php';
require_once __DIR__.'/../repository/NoteRepository.php';

class NoteController extends AppController {
    private $messages = [];
    private $noteRepository;

    public function __construct() {
        parent::__construct();
        $this->noteRepository = new NoteRepository();
    }

    public function addNote() {
        if($this->isPost()) {
            $note = new Note(null, $_POST['note-name'], $_POST['note-description'], $_POST['note-parent']);
            //$this->noteRepository->addNote($note, $_SESSION['last_story']->getId(), $_POST['note-tags']);

            header('Location: /overview');
            console.log($_POST['note-tags']);
            exit();

            return $this->render('overview', [
                'stories' => $this->storyRepository->getStories($_SESSION['user_id']),
                'messages' => $this->messages,
                'story' => $story
            ]);

        }

        $this->render('overview', ['messages' => $this->messages]);
    }

    public function selectNote() {
        if($this->isPost()) {
            // Zaktualizowanie bazy
            $this->noteRepository->selectNote((int) $_POST['noteId'], $_SESSION['user_id']);

            var_dump($_POST['noteId']);

            // Zaktualizowanie danych w sesji
            $note = $this->noteRepository->getNote((int) $_POST['noteId']);
            $_SESSION['last_note'] = $note;

            header('Location: /overview');
            exit();

            return $this->render('overview', [
                'stories' => $this->storyRepository->getStories($_SESSION['user_id']),
                'messages' => $this->messages,
                'story' => $story
            ]);

        }

        $this->render('overview', ['messages' => $this->messages]);
    }

    public function note() {
        if(!isset($_SESSION['last_story'])) {
            $this->render('home', ['message' => 'You have to create and choose a story first!', 'sketches' => null]);
            exit();
        }
        $notes = $this->noteRepository->getNotes($_SESSION['last_story']->getId());
        $this->render('note', ['notes' => $notes]);
    }
}