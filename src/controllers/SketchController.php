<?php

require_once 'AppController.php';
require_once __DIR__.'/../models/Sketch.php';
require_once __DIR__.'/../repository/SketchRepository.php';

class SketchController extends AppController {

    const MAX_FILE_SIZE = 1024 * 1024;
    const SUPPORTED_FILE_TYPES = ['png', 'jpg', 'jpeg'];
    const UPLOAD_DIR = '/../public/uploads/';

    private $messages = [];
    private $sketchRepository;

    public function __construct() {
        parent::__construct();
        $this->sketchRepository = new SketchRepository();
    }

    public function addSketch() {
        if($this->isPost() && is_uploaded_file($_FILES['file']['tmp_name']) && $this->validate($_FILES['file'])) {
            move_uploaded_file(
                $_FILES['file']['tmp_name'],
                dirname(__DIR__).self::UPLOAD_DIR.$_FILES['file']['name']
            );

            $sketch = new Sketch($_POST['sketch-name'], $_POST['sketch-description'], $_POST['sketch-tag'], $_POST['sketch-parent'], $_FILES['file']['name']);
            $this->sketchRepository->addSketch($sketch);

            return $this->render('sketches', [
                'sketches' => $this->sketchRepository->getSketches(),
                'messages' => $this->messages, 'sketch' => $sketch
            ]);
        }

        $this->render('sketches', ['messages' => $this->messages]);
    }

    private function validate(array $file) : bool {
        if($_FILES['file']['size'] > self::MAX_FILE_SIZE) {
            $this->messages[] = 'File is too large to upload!';
            return false;
        }

        if(!isset($file['type']) && !in_array($file['type'], self::SUPPORTED_FILE_TYPES)) {
            $this->messages[] = 'Invalid file type!';
            return false;
        }

        return true;
    }

    public function sketches() {
        $sketches = $this->sketchRepository->getSketches();
        $this->render('sketches', ['sketches' => $sketches]);
    }
}