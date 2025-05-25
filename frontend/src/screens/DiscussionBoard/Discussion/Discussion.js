import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Accordion, Button } from '@chakra-ui/react';
import { MdOutlineArrowForwardIos } from 'react-icons/md';
import discussions from './DiscussionData';
import './Discussion.css';

const Discussion = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h2 className="pageTitle">Discussion Board</h2>

      <div className="buttonsContainer">
        <div
          className="signoutButton"
          onClick={() => {
            navigate("/create-post");
          }}
        >
          Create Post
        </div>
        <Accordion.Root collapsible className="postsContainer">
          {discussions.map((item, idx) => (
            <Accordion.Item key={idx} value={idx} className="post">
              {/* ───────── header row ───────── */}
              <Accordion.ItemTrigger className="title-container">
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                  <h1 className="title">
                    {item.verses}{' '}
                    <span className="date">{item.date}</span>
                  </h1>
                  <p className="subtitle" style={{ color: '#555', fontSize: '0.95rem' }}>
                    {item.title}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="button"
                  onClick={e => {
                    e.stopPropagation();
                    navigate('/thread');
                  }}
                >
                  <MdOutlineArrowForwardIos />
                </Button>
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Accordion.ItemBody className="content">
                  {item.applicationQuestions.map((q, i) => (
                    <p key={i}>• {q}</p>
                  ))}
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </div>
  );
};

export default Discussion;
