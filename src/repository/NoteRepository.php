<?php

require_once "Repository.php";
require_once __DIR__.'/../models/Note.php';

class NoteRepository extends Repository {
    public function getNote(int $id): Note {
        $stmt = $this->db->connect()->prepare(
            'SELECT * FROM public.notes WHERE id=:id'
        );
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        $stmt->execute();

        $note = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($note == false) {
            return null;
        }

        return new Note(
            $note['name'],
            $note['description'],
            $note['parent'],
            $note['reference_to']
        );
    }

    public function addNote(Note $note) {
        $stmt = $this->db->connect()->prepare(
            'INSERT INTO public.notes(name, description, parent_id, reference_to)
                    VALUES (?, ?, ?, ?)'
        );
        $stmt->execute([
            $note->getName(),
            $note->getDescription(),
            $note->getParent(),
            $note->getReferenceTo()
        ]);
    }

    public function getNotes(): array {
        $results = [];
        $stmt = $this->db->connect()->prepare(
            'SELECT * FROM public.notes'
        );
        $stmt->execute();
        $notes = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($notes as $note) {
            $results[] = new Note($note['name'], $note['description'], $note['parent_id'], $note['reference_to']);
        }

        return $results;
    }
}