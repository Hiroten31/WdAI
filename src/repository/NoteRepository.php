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
            $note['id'],
            $note['name'],
            $note['description'],
            $note['parent_id'],
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
            $note->getParentId(),
            $note->getReferenceTo()
        ]);
    }

    public function getNotes(int $id_story): array {
        $results = [];
        $stmt = $this->db->connect()->prepare(
            'SELECT n.* 
                    FROM public.notes n
                    INNER JOIN public.stories_notes sn 
                    ON n.id = sn.id_story
                    WHERE sn.id_story = :id_story'
        );
        $stmt->execute(['id_story' => $id_story]);
        $notes = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($notes as $note) {
            $results[] = new Note(
                $note['id'],
                $note['name'],
                $note['description'],
                $note['parent_id'],
                $note['reference_to']);
        }

        return $results;
    }
}