package com.mycompany.myapp.web.rest.errors;

public class EventNotFoundException extends RuntimeException {

    public EventNotFoundException(Long id) {
        super("Event not found with ID: " + id);
    }
}

public class InvalidEventTimeException extends RuntimeException {

    public InvalidEventTimeException(String message) {
        super(message);
    }
}
