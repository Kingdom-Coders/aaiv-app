import React, { useEffect, useRef } from 'react';
import './AnnouncementsCarousel.css';

const AnnouncementsCarousel = ({ announcements, loading, error }) => {
  const carouselRef = useRef(null);
  const wrapperRef = useRef(null);
  const timeoutIdRef = useRef(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    const wrapper = wrapperRef.current;
    const arrowBtns = wrapper?.querySelectorAll("i");

    if (!carousel || !wrapper || !announcements?.length) return;

    const firstCard = carousel.querySelector(".announcement-card");
    const firstCardWidth = firstCard?.offsetWidth || 0;

    let isDragging = false;
    let startX;
    let startScrollLeft;

    const dragStart = (e) => {
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
      }, 3000);
    };

    carousel.addEventListener("mousedown", dragStart);
    carousel.addEventListener("mousemove", dragging);
    document.addEventListener("mouseup", dragStop);
    wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutIdRef.current));
    wrapper.addEventListener("mouseleave", autoPlay);

    arrowBtns?.forEach(btn => {
      btn.addEventListener("click", () => {
        carousel.scrollLeft += btn.id === "announcement-left" ? -firstCardWidth : firstCardWidth;
      });
    });

    // Start autoplay
    autoPlay();

    return () => {
      carousel.removeEventListener("mousedown", dragStart);
      carousel.removeEventListener("mousemove", dragging);
      document.removeEventListener("mouseup", dragStop);
      wrapper.removeEventListener("mouseenter", () => clearTimeout(timeoutIdRef.current));
      wrapper.removeEventListener("mouseleave", autoPlay);
      arrowBtns?.forEach(btn => {
        btn.removeEventListener("click", () => {});
      });
      clearTimeout(timeoutIdRef.current);
    };
  }, [announcements]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="announcements-section">
        <h3>📢 Announcements</h3>
        <div className="loading">Loading announcements...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="announcements-section">
        <h3>📢 Announcements</h3>
        <div className="error">Error loading announcements: {error}</div>
      </div>
    );
  }

  if (!announcements?.length) {
    return (
      <div className="announcements-section">
        <h3>📢 Announcements</h3>
        <div className="no-announcements">No announcements available</div>
      </div>
    );
  }

  return (
    <div className="announcements-section">
      <h3>📢 Announcements</h3>
      <div className="announcements-wrapper" ref={wrapperRef}>
        <i id="announcement-left" className="arrow left">←</i>
        <div className="announcements-carousel" ref={carouselRef}>
          {announcements.map((announcement) => (
            <div className="announcement-card" key={announcement._id}>
              <div className="announcement-header">
                <h4>{announcement.title}</h4>
              </div>
              <small className="announcement-date">
                {formatDate(announcement.createdAt)}
              </small>
              <p className="announcement-body">{announcement.body}</p>
              {announcement.user && (
                <small className="announcement-author">
                  — {announcement.user.name}
                </small>
              )}
            </div>
          ))}
        </div>
        <i id="announcement-right" className="arrow right">→</i>
      </div>
    </div>
  );
};

export default AnnouncementsCarousel; 