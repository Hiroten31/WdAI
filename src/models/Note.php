<?php

class Note {
    private $id;
    private $name;
    private $description;
    private $parentId;
    private $reference_to;

    public function __construct(?int $id, string $name, string $description, ?int $parentId, ?int $reference_to = null) {
        $this->id = $id;
        $this->name = $name;
        $this->description = $description;
        $this->parentId = $parentId;
        $this->reference_to = $reference_to;
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

    public function getParentId() : ?int {
        return $this->parentId;
    }

    public function setParentId(int $parentId) {
        $this->parentId = $parentId;
    }

    public function getReferenceTo() : ?int {
        return $this->reference_to;
    }

    public function setReferenceTo(string $reference_to) {
        $this->reference_to = $reference_to;
    }
}