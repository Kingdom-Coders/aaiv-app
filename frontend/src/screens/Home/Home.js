import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../actions/userActions";
import './Home.css'; 

const events = [
  {
    title: "Volleyball",
    description: "everyone come to IMA 3:30 Wed",
    time: "3:30pm - 5:30pm"
  },
  {
    title: "Volleyball",
    description: "everyone come to IMA 3:30 Wed",
    time: "3:30pm - 5:30pm"
  },
  {
    title: "Volleyball",
    description: "everyone come to IMA 3:30 Wed",
    time: "3:30pm - 5:30pm"
  },
  {
    title: "Volleyball",
    description: "everyone come to IMA 3:30 Wed",
    time: "3:30pm - 5:30pm"
  },
];

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const carouselRef = useRef(null);
  const wrapperRef = useRef(null);
  const timeoutIdRef = useRef(null);

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
    //wrapper.addEventListener("mouseleave", autoPlay);

    arrowBtns?.forEach(btn => {
      btn.addEventListener("click", () => {
        carousel.scrollLeft += btn.id === "left" ? -firstCardWidth : firstCardWidth;
      });
    });

    //autoPlay();

    return () => {
      carousel.removeEventListener("mousedown", dragStart);
      carousel.removeEventListener("mousemove", dragging);
      document.removeEventListener("mouseup", dragStop);
      wrapper.removeEventListener("mouseenter", () => clearTimeout(timeoutIdRef.current));
      //wrapper.removeEventListener("mouseleave", autoPlay);
      arrowBtns?.forEach(btn => {
        btn.removeEventListener("click", () => {});
      });
      clearTimeout(timeoutIdRef.current);
    };
  }, []);

  return (
    <div className="home-screen">
      <h1>Home Screen</h1>

      <div>
        <h3>Upcoming Events: </h3>
      </div>
      
      {/* Carousel */}
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
      <div className="signoutButton" onClick={logoutHandler}>
        Sign Out
      </div>
    </div>
  );
};

export default Home;
