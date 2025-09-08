<?php

class Note {
    private $name;
    private $description;
    private $parent;
    private $reference_to;

    public function __construct($name, $description, $parent, $reference_to = null) {
        $this->name = $name;
        $this->description = $description;
        $this->parent = $parent;
        $this->reference_to = $reference_to;
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

    public function getTag() : string {
        return $this->tag;
    }

    public function setTag(string $tag) {
        $this->tag = $tag;
    }

    public function getParent() : string {
        return $this->parent;
    }

    public function setParent(string $parent) {
        $this->parent = $parent;
    }

    public function getReferenceTo() : string {
        return $this->reference_to;
    }

    public function setReferenceTo(string $reference_to) {
        $this->reference_to = $reference_to;
    }
}