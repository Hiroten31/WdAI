<?php

class Story {
    private $id;
    private $name;
    private $description;
    private $creation_date;

    public function __construct(?int $id, string $name, string $description, $creation_date = null) {
        $this->id = $id;
        $this->name = $name;
        $this->description = $description;
        $this->creation_date = $creation_date;
    }

    public function getId() : int {
        return $this->id;
    }

    public function getCreationDate() {
        return $this->creation_date;
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
}