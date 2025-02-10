package com.mycompany.myapp.service;

import com.example.calendar.domain.CalendarEvent;
import com.example.calendar.repository.CalendarEventRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class CalendarEventService {

    private final CalendarEventRepository repository;

    public CalendarEventService(CalendarEventRepository repository) {
        this.repository = repository;
    }

    public List<CalendarEvent> findAll() {
        return repository.findAll();
    }

    public Optional<CalendarEvent> findById(Long id) {
        return repository.findById(id);
    }

    public CalendarEvent save(CalendarEvent event) {
        return repository.save(event);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
