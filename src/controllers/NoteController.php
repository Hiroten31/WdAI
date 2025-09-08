<?php

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
            $note = new Note($_POST['note-name'], $_POST['note-description'], $_POST['note-tags'], $_POST['note-parent']);
            $this->noteRepository->addNote($note);

            return $this->render('notes', [
                'notes' => $this->noteRepository->getNotes(),
                'messages' => $this->messages, 'note' => $note
            ]);
        }

        $this->render('notes', ['messages' => $this->messages]);
    }

    private function validate(array $file) : bool {
        return true;
    }

    public function notes() {
        $notes = $this->noteRepository->getNotes();
        $this->render('notes', ['notes' => $notes]);
    }
}