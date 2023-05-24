import { useEffect, useState, useRef } from "react";

// -----------------------------------------------------
// todo New from another project
let loadInterval

function loader(element) {
    element.textContent = ''

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

function typeText(element, text) {
    let index = 0

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++
        } else {
            clearInterval(interval)
        }
    }, 20)
}

// -----------------------------------------------------
const App = () => {
  const [ value, setValue ] = useState("");
  const [message, setMessage] = useState(null);
  const [ previousChats, setPreviousChats ] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);
  const inputRef = useRef(null);

  const createNewChat = () => {
    setCurrentTitle(null);
    setValue("");
    setMessage(null);
  }

  const handleClick = (uniqueTitles) => {
    setCurrentTitle(uniqueTitles);
    setMessage(null);
  }
  const getMessages = async () => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
          message: value
      })
    }
    try { 
      const response = await fetch("http://localhost:8000/completions", options);
      const data = await response.json();
      setMessage(data.choices[0].message);
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.keyCode === 13) {
        getMessages();
      }
    };
    
    const inputElement = inputRef.current;
    
    if (inputElement) {
      inputElement.addEventListener('keypress', handleKeyPress);
    }
    
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }
    
    if (currentTitle && value && message) {
      setPreviousChats(previousChats => ([
        ...previousChats,
        { title: currentTitle, role: "user", content: value },
        { title: currentTitle, role: message.role, content: message.content }
      ]));
    }
    
    return () => {
      if (inputElement) {
        inputElement.removeEventListener('keypress', handleKeyPress);
      }
    };
  }, [message, currentTitle]);
  


  const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle);
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => (previousChat.title))))

  return (
    <div className="app">
      <section className='side-bar' style={{ overflow: 'auto'}}>
        <button onClick={createNewChat}>New chat</button>
        <ul className='history'>
          {uniqueTitles?.map((uniqueTitles, index) => <li key={index} onClick={() => handleClick(uniqueTitles)}>{uniqueTitles}</li>)}

        </ul>
        <nav>Made by Hieu</nav>
      </section>
      <section className='main'>
        {!currentTitle && <h1 className="main-title">Start New Chat</h1>}
        
        <div class="feed-container">
          <ul className="feed" style={{ overflow: 'auto' }}>
            {currentChat.map((chatMessage, index) => 
            <li key={index}>
              {chatMessage.role === 'user' ? (
                <>
                  <p className="user"></p>
                  <p>{chatMessage.content}</p>
                </>
              ) : (
                <>
                  <p className="bot"></p>
                  <p>{chatMessage.content}</p>
                </>
                
              )}
            </li>)}
          </ul>
        </div>
        
        <div className="bottom-section">
          <div className="input-container">
            <input type="text" placeholder="Type a message" value={value} onChange={(e) => setValue(e.target.value)} ref={inputRef} />
            <div id="submit" onClick={getMessages}>
              ➢
            </div>
            <p className="info">Ask anything you want</p>
          </div>
        </div>

      </section>

    </div>
  );  
}

export default App;
