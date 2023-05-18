import { useEffect, useState } from "react";



const App = () => {
  const [ value, setValue ] = useState("");
  const [message, setMessage] = useState(null);
  const [ previousChats, setPreviousChats ] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);
  const createNewChat = () => {
    setCurrentTitle(null);
    setValue("");
    setMessage(null);
  }

  const handleClick = (uniqueTitles) => {
    setCurrentTitle(uniqueTitles);
    setMessage(null);
    setValue("");
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
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }
    if (currentTitle && value && message) {
      setPreviousChats(previousChats => (
        [...previousChats, {title: currentTitle, role: "user", content: value}, 
        {title: currentTitle, role: message.role, content: message.content}]
      )

      )
    }
  }, [message, currentTitle]);


  const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle);
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => (previousChat.title))))

  return (
    <div className="app">
      <section className='side-bar'>
        <button onClick={createNewChat}>New chat</button>
        <ul className='history'>
          {uniqueTitles?.map((uniqueTitles, index) => <li key={index} onClick={() => handleClick(uniqueTitles)}>{uniqueTitles}</li>)}

        </ul>
        <nav>Made by Hieu</nav>
      </section>
      <section className='main'>
        {!currentTitle && <h1>Hieu GPT</h1>}
        <ul className='feed'>
          {currentChat.map((chatMessage, index) => <li key={index}>
            <p className="role">{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
          </li>)}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input type="text" placeholder="Type a message" value={value} onChange={(e) => setValue(e.target.value)} />
            <div id="submit" onClick={getMessages}>
              ➢
            </div>
            <p className="info">Best AI chatbot Copilot. Ask anything you want</p>
          </div>
        </div>

      </section>

    </div>
  );  
}

export default App;
