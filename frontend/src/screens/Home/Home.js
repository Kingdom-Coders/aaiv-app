import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../actions/userActions";
import { listAnnouncements } from "../../actions/announcementActions";
import { listEvents } from "../../actions/eventActions";
import { getDailyVerse } from "../../utils/dailyVerse";
import AnnouncementsCarousel from "../../components/AnnouncementsCarousel/AnnouncementsCarousel";
import './Home.css';

function toggleBlur() {
  const blurredText = document.querySelector('.blur-text');
  blurredText.classList.toggle('revealed');
}

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const carouselRef = useRef(null);
  const wrapperRef = useRef(null);
  const timeoutIdRef = useRef(null);
  const [dailyVerse, setDailyVerse] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Get announcements state from Redux
  const announcementList = useSelector((state) => state.announcementList);
  const { loading: announcementsLoading, error: announcementsError, announcements } = announcementList;

  // Get events state from Redux
  const eventList = useSelector((state) => state.eventList);
  const { loading: eventsLoading, error: eventsError, events } = eventList;

  // Get the daily verse when component mounts
  useEffect(() => {
    const verse = getDailyVerse();
    setDailyVerse(verse);
  }, []);

  // Fetch announcements and events when component mounts
  useEffect(() => {
    dispatch(listAnnouncements());
    dispatch(listEvents());
  }, [dispatch]);

  // Set up an interval to check for new day and update verse at midnight
  useEffect(() => {
    const checkForNewDay = () => {
      const now = new Date();
      const isNearMidnight = now.getHours() === 0 && now.getMinutes() === 0;
      
      if (isNearMidnight) {
        const newVerse = getDailyVerse();
        setDailyVerse(newVerse);
      }
    };

    // Check every minute for midnight
    const interval = setInterval(checkForNewDay, 60000);

    return () => clearInterval(interval);
  }, []);

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/');
  };

  // Handle event card click
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && showModal) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showModal]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  // Format event date and time for display
  const formatEventTime = (event) => {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);

    if (event.isAllDay) {
      if (start.toDateString() === end.toDateString()) {
        return start.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      } else {
        return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      }
    } else {
      if (start.toDateString() === end.toDateString()) {
        return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
      } else {
        return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
      }
    }
  };

  // Truncate description for card display
  const truncateDescription = (description, maxLength = 50) => {
    if (!description) return '';
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength).trim() + '...';
  };

  // Format full event date and time for modal
  const formatFullEventTime = (event) => {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);

    if (event.isAllDay) {
      if (start.toDateString() === end.toDateString()) {
        return start.toLocaleDateString('en-US', { 
          weekday: 'long',
          year: 'numeric',
          month: 'long', 
          day: 'numeric' 
        }) + ' (All Day)';
      } else {
        return `${start.toLocaleDateString('en-US', { 
          weekday: 'long',
          year: 'numeric',
          month: 'long', 
          day: 'numeric' 
        })} - ${end.toLocaleDateString('en-US', { 
          weekday: 'long',
          year: 'numeric',
          month: 'long', 
          day: 'numeric' 
        })} (All Day)`;
      }
    } else {
      if (start.toDateString() === end.toDateString()) {
        return `${start.toLocaleDateString('en-US', { 
          weekday: 'long',
          year: 'numeric',
          month: 'long', 
          day: 'numeric' 
        })} from ${start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} to ${end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
      } else {
        return `${start.toLocaleDateString('en-US', { 
          weekday: 'long',
          year: 'numeric',
          month: 'long', 
          day: 'numeric' 
        })} at ${start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${end.toLocaleDateString('en-US', { 
          weekday: 'long',
          year: 'numeric',
          month: 'long', 
          day: 'numeric' 
        })} at ${end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
      }
    }
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    const wrapper = wrapperRef.current;
    const arrowBtns = wrapper?.querySelectorAll("i");

    if (!carousel || !wrapper) return;

    const firstCard = carousel.querySelector(".card");
    const firstCardWidth = firstCard?.offsetWidth || 0;

    let isDragging = false;
    let startX;
    let startScrollLeft;

    const dragStart = (e) => {
      // Don't start dragging if clicking on an event card
      if (e.target.closest('.card') && !e.target.closest('.arrow')) {
        return;
      }
      isDragging = true;
      carousel.classList.add("dragging");
      startX = e.pageX;
      startScrollLeft = carousel.scrollLeft;
    };

    const dragging = (e) => {
      if (!isDragging) return;

      const newScrollLeft = startScrollLeft - (e.pageX - startX);

      if (newScrollLeft <= 0 || newScrollLeft >= (carousel.scrollWidth - carousel.offsetWidth)) {
        isDragging = false;
        return;
      }

      carousel.scrollLeft = newScrollLeft;
    };

    const dragStop = () => {
      isDragging = false;
      carousel.classList.remove("dragging");
    };

    const autoPlay = () => {
      if (window.innerWidth < 800) return;
      const totalCardWidth = carousel.scrollWidth;
      const maxScrollLeft = totalCardWidth - carousel.offsetWidth;
      if (carousel.scrollLeft >= maxScrollLeft) return;

      timeoutIdRef.current = setTimeout(() => {
        carousel.scrollLeft += firstCardWidth;
      }, 2500);
    };

    carousel.addEventListener("mousedown", dragStart);
    carousel.addEventListener("mousemove", dragging);
    document.addEventListener("mouseup", dragStop);
    wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutIdRef.current));

    arrowBtns?.forEach(btn => {
      btn.addEventListener("click", () => {
        carousel.scrollLeft += btn.id === "left" ? -firstCardWidth : firstCardWidth;
      });
    });

    return () => {
      carousel.removeEventListener("mousedown", dragStart);
      carousel.removeEventListener("mousemove", dragging);
      document.removeEventListener("mouseup", dragStop);
      wrapper.removeEventListener("mouseenter", () => clearTimeout(timeoutIdRef.current));
      arrowBtns?.forEach(btn => {
        btn.removeEventListener("click", () => {});
      });
      clearTimeout(timeoutIdRef.current);
    };
  }, [events]); // Re-run when events change

  return (
    <div className="home-screen">
      {/* Header with title and logout icon */}
      <div className="home-header">
        <h1>🙏 Welcome to AAIV 🙏</h1>
        <button className="logout-icon" onClick={logoutHandler} title="Sign Out">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Bible Verse Section */}
      <div className="BibleVerse">
        <p><strong>📖  Daily Bible Verse:</strong></p>
        <div className="blur-container" onClick={toggleBlur}>
          <p className="blur-text">
            {dailyVerse ? (
              <>
                {dailyVerse.text.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < dailyVerse.text.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
                <br />
                {dailyVerse.reference}
              </>
            ) : (
              'Loading daily verse...'
            )}
          </p>
        </div>
      </div>

      {/* Announcements Section */}
      <AnnouncementsCarousel 
        announcements={announcements}
        loading={announcementsLoading}
        error={announcementsError}
      />

      {/* Upcoming Events Section */}
      <div className="upcomingevents-tab">
        <h3>📅 Upcoming Events</h3>
      </div>

      <div className="wrapper" ref={wrapperRef}>
        <i id="left" className="arrow left">←</i>
        <div className="carousel" ref={carouselRef}>
          {eventsLoading ? (
            <div className="card">
              <div className="card-content">
                <h2>Loading Events...</h2>
                <p>Fetching upcoming events from the database</p>
              </div>
              <div className="card-footer">
                <small>Please wait</small>
              </div>
            </div>
          ) : eventsError ? (
            <div className="card">
              <div className="card-content">
                <h2>Error Loading Events</h2>
                <p>Unable to fetch events at this time</p>
              </div>
              <div className="card-footer">
                <small>Please try again later</small>
              </div>
            </div>
          ) : !events || events.length === 0 ? (
            <div className="card">
              <div className="card-content">
                <h2>No Upcoming Events</h2>
                <p>Check back later for new events!</p>
              </div>
              <div className="card-footer">
                <small>Create events in the Events tab</small>
              </div>
            </div>
          ) : (
            events.slice(0, 6).map((event) => (
              <div className="card" key={event._id} onClick={() => handleEventClick(event)}>
                <div className="card-content">
                  <h2>{event.title}</h2>
                  <p>{truncateDescription(event.description)}</p>
                </div>
                <div className="card-footer">
                  <small>{formatEventTime(event)}</small>
                  {event.location && (
                    <small>📍 {event.location}</small>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        <i id="right" className="arrow right">→</i>
      </div>

      {/* Event Modal */}
      {showModal && selectedEvent && (
        <div className="event-modal-overlay" onClick={closeModal}>
          <div className="event-modal" onClick={(e) => e.stopPropagation()}>
            <div className="event-modal-header">
              <h2 className="event-modal-title">{selectedEvent.title}</h2>
              <button className="event-modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            <div className="event-modal-badge">
              {selectedEvent.isAllDay ? 'All Day Event' : 'Timed Event'}
            </div>

            <div className="event-modal-details">
              <div className="event-modal-detail-row">
                <span className="event-modal-detail-icon">🗓️</span>
                <span>{formatFullEventTime(selectedEvent)}</span>
              </div>
              
              {selectedEvent.location && (
                <div className="event-modal-detail-row">
                  <span className="event-modal-detail-icon">📍</span>
                  <span>{selectedEvent.location}</span>
                </div>
              )}
            </div>

            {selectedEvent.description && (
              <div className="event-modal-description">
                <h4>Description</h4>
                <p>{selectedEvent.description}</p>
              </div>
            )}

            {selectedEvent.createdBy && (
              <div className="event-modal-creator">
                Created by {selectedEvent.createdBy.firstName} {selectedEvent.createdBy.lastName}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
