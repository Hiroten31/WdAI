<?php

class Sketch {
    private $id;
    private $name;
    private $description;
    private $parent_note_id;
    private $image;

    public function __construct(?int $id, string $name, string $description, int $parent_note_id, $image) {
        $this->id = $id;
        $this->name = $name;
        $this->description = $description;
        $this->parent_note_id = $parent_note_id;
        $this->image = $image;
    }

    public function getId() : int {
        return $this->id;
    }

    public function getName() : string {
        return $this->name;
    }

    public function setName(string $name) {
        $this->name = $name;
    }

    public function getDescription() : string {
        return $this->description;
    }

    public function setDescription(string $description) {
        $this->description = $description;
    }

    public function getParentNoteId() : string {
        return $this->parent_note_id;
    }

    public function setParentNoteId(int $parentNoteId) {
        $this->parent_note_id = $parentNoteId;
    }

    public function getImage() : string {
        return $this->image;
    }

    public function setImage(string $image) {
        $this->image = $image;
    }
}