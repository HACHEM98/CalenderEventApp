package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class CalendarEventTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static CalendarEvent getCalendarEventSample1() {
        return new CalendarEvent().id(1L).title("title1").description("description1");
    }

    public static CalendarEvent getCalendarEventSample2() {
        return new CalendarEvent().id(2L).title("title2").description("description2");
    }

    public static CalendarEvent getCalendarEventRandomSampleGenerator() {
        return new CalendarEvent()
            .id(longCount.incrementAndGet())
            .title(UUID.randomUUID().toString())
            .description(UUID.randomUUID().toString());
    }
}
