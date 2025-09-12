<?php

class Tag {
    private $id;
    private $name;
    private $description;

    public function __construct(?int $id, string $name, string $description=null) {
        $this->id = $id;
        $this->name = $name;
        $this->description = $description;
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

    public function getDescription(): string {
        return $this->description;
    }

    public function setDescription(string $description): void {
        $this->description = $description;
    }

}