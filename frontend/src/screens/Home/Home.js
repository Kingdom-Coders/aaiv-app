import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../actions/userActions";
import { listAnnouncements } from "../../actions/announcementActions";
import { getDailyVerse } from "../../utils/dailyVerse";
import AnnouncementsCarousel from "../../components/AnnouncementsCarousel/AnnouncementsCarousel";
import './Home.css';

const events = [
  {
    title: "Volleyball",
    description: "everyone come to IMA 3:30 Wed",
    time: "3:30pm - 5:30pm"
  },
  {
    title: "Bible Study",
    description: "Weekly Bible study session in the community room",
    time: "7:00pm - 8:30pm"
  },
  {
    title: "Prayer Meeting",
    description: "Join us for our weekly prayer meeting",
    time: "6:00pm - 7:00pm"
  },
  {
    title: "Youth Group",
    description: "Fun activities and fellowship for young adults",
    time: "5:00pm - 7:00pm"
  },
];

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

  // Get announcements state from Redux
  const announcementList = useSelector((state) => state.announcementList);
  const { loading: announcementsLoading, error: announcementsError, announcements } = announcementList;

  // Get the daily verse when component mounts
  useEffect(() => {
    const verse = getDailyVerse();
    setDailyVerse(verse);
  }, []);

  // Fetch announcements when component mounts
  useEffect(() => {
    dispatch(listAnnouncements());
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
  }, []);

  return (
    <div className="home-screen">
      <h1>Welcome to AAIV</h1>

      {/* Bible Verse Section */}
      <div className="BibleVerse">
        <p><strong>Daily Bible Verse:</strong></p>
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
        <h3>Upcoming Events</h3>
      </div>

      <div className="wrapper" ref={wrapperRef}>
        <i id="left" className="arrow left">←</i>
        <div className="carousel" ref={carouselRef}>
          {events.map((event, index) => (
            <div className="card" key={index}>
              <h2>{event.title}</h2>
              <p>{event.description}</p>
              <small>{event.time}</small>
            </div>
          ))}
        </div>
        <i id="right" className="arrow right">→</i>
      </div>

      {/* More Section */}
      {/* <div className="more-tab">
        <h2>More</h2>
        <div className="links">
          <div className="insta">AAIV Instagram</div>
          <div className="markcamp">Sign up for Mark Camp</div>
        </div>
      </div> */}

      {/* Sign Out Button */}
      <div className="signoutButton" onClick={logoutHandler}>
        Sign Out
      </div>
    </div>
  );
};

export default Home;
