package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.CalendarEventAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.CalendarEvent;
import com.mycompany.myapp.repository.CalendarEventRepository;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link CalendarEventResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CalendarEventResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Instant DEFAULT_START_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_START_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_END_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_END_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/calendar-events";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private CalendarEventRepository calendarEventRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCalendarEventMockMvc;

    private CalendarEvent calendarEvent;

    private CalendarEvent insertedCalendarEvent;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CalendarEvent createEntity() {
        return new CalendarEvent()
            .title(DEFAULT_TITLE)
            .description(DEFAULT_DESCRIPTION)
            .startTime(DEFAULT_START_TIME)
            .endTime(DEFAULT_END_TIME);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CalendarEvent createUpdatedEntity() {
        return new CalendarEvent()
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .startTime(UPDATED_START_TIME)
            .endTime(UPDATED_END_TIME);
    }

    @BeforeEach
    public void initTest() {
        calendarEvent = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedCalendarEvent != null) {
            calendarEventRepository.delete(insertedCalendarEvent);
            insertedCalendarEvent = null;
        }
    }

    @Test
    @Transactional
    void createCalendarEvent() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the CalendarEvent
        var returnedCalendarEvent = om.readValue(
            restCalendarEventMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(calendarEvent)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            CalendarEvent.class
        );

        // Validate the CalendarEvent in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertCalendarEventUpdatableFieldsEquals(returnedCalendarEvent, getPersistedCalendarEvent(returnedCalendarEvent));

        insertedCalendarEvent = returnedCalendarEvent;
    }

    @Test
    @Transactional
    void createCalendarEventWithExistingId() throws Exception {
        // Create the CalendarEvent with an existing ID
        calendarEvent.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCalendarEventMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(calendarEvent)))
            .andExpect(status().isBadRequest());

        // Validate the CalendarEvent in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCalendarEvents() throws Exception {
        // Initialize the database
        insertedCalendarEvent = calendarEventRepository.saveAndFlush(calendarEvent);

        // Get all the calendarEventList
        restCalendarEventMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(calendarEvent.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].startTime").value(hasItem(DEFAULT_START_TIME.toString())))
            .andExpect(jsonPath("$.[*].endTime").value(hasItem(DEFAULT_END_TIME.toString())));
    }

    @Test
    @Transactional
    void getCalendarEvent() throws Exception {
        // Initialize the database
        insertedCalendarEvent = calendarEventRepository.saveAndFlush(calendarEvent);

        // Get the calendarEvent
        restCalendarEventMockMvc
            .perform(get(ENTITY_API_URL_ID, calendarEvent.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(calendarEvent.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.startTime").value(DEFAULT_START_TIME.toString()))
            .andExpect(jsonPath("$.endTime").value(DEFAULT_END_TIME.toString()));
    }

    @Test
    @Transactional
    void getNonExistingCalendarEvent() throws Exception {
        // Get the calendarEvent
        restCalendarEventMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCalendarEvent() throws Exception {
        // Initialize the database
        insertedCalendarEvent = calendarEventRepository.saveAndFlush(calendarEvent);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the calendarEvent
        CalendarEvent updatedCalendarEvent = calendarEventRepository.findById(calendarEvent.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedCalendarEvent are not directly saved in db
        em.detach(updatedCalendarEvent);
        updatedCalendarEvent.title(UPDATED_TITLE).description(UPDATED_DESCRIPTION).startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME);

        restCalendarEventMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCalendarEvent.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedCalendarEvent))
            )
            .andExpect(status().isOk());

        // Validate the CalendarEvent in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedCalendarEventToMatchAllProperties(updatedCalendarEvent);
    }

    @Test
    @Transactional
    void putNonExistingCalendarEvent() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        calendarEvent.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCalendarEventMockMvc
            .perform(
                put(ENTITY_API_URL_ID, calendarEvent.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(calendarEvent))
            )
            .andExpect(status().isBadRequest());

        // Validate the CalendarEvent in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCalendarEvent() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        calendarEvent.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCalendarEventMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(calendarEvent))
            )
            .andExpect(status().isBadRequest());

        // Validate the CalendarEvent in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCalendarEvent() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        calendarEvent.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCalendarEventMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(calendarEvent)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CalendarEvent in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCalendarEventWithPatch() throws Exception {
        // Initialize the database
        insertedCalendarEvent = calendarEventRepository.saveAndFlush(calendarEvent);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the calendarEvent using partial update
        CalendarEvent partialUpdatedCalendarEvent = new CalendarEvent();
        partialUpdatedCalendarEvent.setId(calendarEvent.getId());

        partialUpdatedCalendarEvent.description(UPDATED_DESCRIPTION).startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME);

        restCalendarEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCalendarEvent.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCalendarEvent))
            )
            .andExpect(status().isOk());

        // Validate the CalendarEvent in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCalendarEventUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedCalendarEvent, calendarEvent),
            getPersistedCalendarEvent(calendarEvent)
        );
    }

    @Test
    @Transactional
    void fullUpdateCalendarEventWithPatch() throws Exception {
        // Initialize the database
        insertedCalendarEvent = calendarEventRepository.saveAndFlush(calendarEvent);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the calendarEvent using partial update
        CalendarEvent partialUpdatedCalendarEvent = new CalendarEvent();
        partialUpdatedCalendarEvent.setId(calendarEvent.getId());

        partialUpdatedCalendarEvent
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .startTime(UPDATED_START_TIME)
            .endTime(UPDATED_END_TIME);

        restCalendarEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCalendarEvent.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCalendarEvent))
            )
            .andExpect(status().isOk());

        // Validate the CalendarEvent in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCalendarEventUpdatableFieldsEquals(partialUpdatedCalendarEvent, getPersistedCalendarEvent(partialUpdatedCalendarEvent));
    }

    @Test
    @Transactional
    void patchNonExistingCalendarEvent() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        calendarEvent.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCalendarEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, calendarEvent.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(calendarEvent))
            )
            .andExpect(status().isBadRequest());

        // Validate the CalendarEvent in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCalendarEvent() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        calendarEvent.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCalendarEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(calendarEvent))
            )
            .andExpect(status().isBadRequest());

        // Validate the CalendarEvent in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCalendarEvent() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        calendarEvent.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCalendarEventMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(calendarEvent)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CalendarEvent in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCalendarEvent() throws Exception {
        // Initialize the database
        insertedCalendarEvent = calendarEventRepository.saveAndFlush(calendarEvent);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the calendarEvent
        restCalendarEventMockMvc
            .perform(delete(ENTITY_API_URL_ID, calendarEvent.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return calendarEventRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected CalendarEvent getPersistedCalendarEvent(CalendarEvent calendarEvent) {
        return calendarEventRepository.findById(calendarEvent.getId()).orElseThrow();
    }

    protected void assertPersistedCalendarEventToMatchAllProperties(CalendarEvent expectedCalendarEvent) {
        assertCalendarEventAllPropertiesEquals(expectedCalendarEvent, getPersistedCalendarEvent(expectedCalendarEvent));
    }

    protected void assertPersistedCalendarEventToMatchUpdatableProperties(CalendarEvent expectedCalendarEvent) {
        assertCalendarEventAllUpdatablePropertiesEquals(expectedCalendarEvent, getPersistedCalendarEvent(expectedCalendarEvent));
    }
}
