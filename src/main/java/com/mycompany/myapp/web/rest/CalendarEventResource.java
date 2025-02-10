package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.CalendarEvent;
import com.mycompany.myapp.service.CalendarEventService;
import com.mycompany.myapp.web.rest.errors.EventNotFoundException;
import com.mycompany.myapp.web.rest.errors.InvalidEventTimeException;
import java.util.List;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/calendar-events")
public class CalendarEventResource {

    private final CalendarEventService service;

    public CalendarEventResource(CalendarEventService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<CalendarEvent>> getAllEvents() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CalendarEvent> getEvent(@PathVariable Long id) {
        CalendarEvent event = service.findById(id).orElseThrow(() -> new EventNotFoundException(id));
        return ResponseEntity.ok(event);
    }

    @PostMapping
    public ResponseEntity<CalendarEvent> createEvent(@RequestBody CalendarEvent event) {
        // Validate event time
        if (event.getStartTime().isAfter(event.getEndTime())) {
            throw new InvalidEventTimeException("Start time cannot be after end time.");
        }
        return ResponseEntity.ok(service.save(event));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CalendarEvent> updateEvent(@PathVariable Long id, @RequestBody CalendarEvent event) {
        CalendarEvent existingEvent = service.findById(id).orElseThrow(() -> new EventNotFoundException(id));

        // Validate event time
        if (event.getStartTime().isAfter(event.getEndTime())) {
            throw new InvalidEventTimeException("Start time cannot be after end time.");
        }

        event.setId(id);
        return ResponseEntity.ok(service.save(event));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        if (!service.findById(id).isPresent()) {
            throw new EventNotFoundException(id);
        }
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
