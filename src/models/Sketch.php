<?php

class Sketch {
    private $title;
    private $description;
    private $tag;
    private $parent;
    private $image;

    public function __construct($title, $description, $tag, $parent, $image)
    {
        $this->title = $title;
        $this->description = $description;
        $this->tag = $tag;
        $this->parent = $parent;
        $this->image = $image;
    }

    public function getTitle() : string {
        return $this->title;
    }

    public function setTitle(string $title) {
        $this->title = $title;
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

    public function getImage() : string {
        return $this->image;
    }

    public function setImage(string $image) {
        $this->image = $image;
    }
}