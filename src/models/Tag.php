<?php

class Tag {
    private $name;

    public function __construct($name) {
        $this->name = $name;
    }

    public function getName() : string {
        return $this->name;
    }

    public function setName(string $name) {
        $this->name = $name;
    }
}