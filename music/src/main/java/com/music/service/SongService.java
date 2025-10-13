package com.music.service;

import com.music.model.Song;
import com.music.repository.SongRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SongService {

    @Autowired
    private SongRepository songRepository;

    // Get all songs
    public List<Song> getAllSongs() {
        return songRepository.findAll();
    }

    // Get song by ID
    public Optional<Song> getSongById(Long id) {
        return songRepository.findById(id);
    }

    // Add new song
    public Song addSong(Song song) {
        return songRepository.save(song);
    }

    // Update song
    public Optional<Song> updateSong(Long id, Song updatedSong) {
        return songRepository.findById(id).map(song -> {
            song.setTitle(updatedSong.getTitle());
            song.setArtist(updatedSong.getArtist());
            song.setGenre(updatedSong.getGenre());
            song.setLink(updatedSong.getLink());
            songRepository.save(song);
            return song;
        });
    }

    // Delete song
    public boolean deleteSong(Long id) {
        if (!songRepository.existsById(id)) {
            return false;
        }
        songRepository.deleteById(id);
        return true;
    }
}