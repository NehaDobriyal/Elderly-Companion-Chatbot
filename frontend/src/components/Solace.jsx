import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Solace.css";
import { assets } from "../assets/assets";
import runChat from "../config/Gemini";

function Solace() {
    const [input, setInput] = useState("");  // State for input prompt
    const [recentPrompt, setRecentPrompt] = useState("");  // State for recent prompt
    const [prevPrompts, setPrevPrompts] = useState([]);  // State for previous prompts
    const [showResults, setShowResults] = useState(false);  // State for showing results
    const [loading, setLoading] = useState(false);  // State for loading indicator
    const [resultData, setResultData] = useState("");  // State for result data

    const location = useLocation();

    // Set input when navigating to this component with a prompt in the location state
    useEffect(() => {
        if (location.state?.prompt) {
            setInput(location.state.prompt);
        }
    }, [location.state]);

    const delayPara = (index, nextWord) => {
        setTimeout(() => {
            setResultData((prev) => prev + nextWord); // Append each word after a slight delay
        }, 10 * index);
    };

    // Function for handling the sending of a prompt
    const onSent = async () => {
        setResultData("");  // Clear previous result
        setLoading(true);  // Set loading state
        setShowResults(true);  // Show the results section

        let response;
        if (input) {
            setPrevPrompts((prev) => [...prev, input]);  // Store the prompt in prevPrompts
            setRecentPrompt(input);  // Update the recent prompt
            response = await runChat(input);  // Call the API or logic to get a response
        }

        try {
            let responseArray = response.split("**");
            let newResponse = "";
            for (let i = 0; i < responseArray.length; i++) {
                if (i === 0 || i % 2 !== 1) {
                    newResponse += responseArray[i]; // Regular text
                } else {
                    newResponse += "<b>" + responseArray[i] + "</b>"; // Bold text for some parts
                }
            }
            let newResponse2 = newResponse.split("*").join("<br/>");
            let newResponseArray = newResponse2.split("");  // Split to handle word by word
            for (let i = 0; i < newResponseArray.length; i++) {
                const nextWord = newResponseArray[i];
                delayPara(i, nextWord);
            }
        } catch (error) {
            console.error("Error while running chat:", error);
        } finally {
            setLoading(false);
            setInput("");  // Clear the input field after completion
        }
    };

    return (
        <div className="main">
            <div className="nav">
                <div className="logo-container">
                    <Link to="/">
                        <img src="./src/assets/logo1.png" alt="Logo" className="logo" />
                    </Link>
                </div>
                <div className="nav-links">
                    <Link to="/" className="home-link">Home</Link>
                    <div className="user-icon">
                        <img src={assets.user} alt="User Icon" />
                    </div>
                </div>
            </div>

            <div className="main-container">
                {!showResults ? (
                    <div className="greet">
                        <p><span>Hello!</span></p>
                        <p>How Can I Help You Today?</p>
                    </div>
                ) : (
                    <div className="result">
                        <div className="result-title">
                            <img src={assets.user} alt="User Icon" />
                            <p>{recentPrompt}</p>
                        </div>
                        <div className="result-data">
                            <img src={assets.gemini_icon} alt="Gemini Icon" />
                            {loading ? (
                                <div className="loader">
                                    <hr />
                                    <hr />
                                    <hr />
                                </div>
                            ) : (
                                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
                            )}
                        </div>
                    </div>
                )}
                <div className="main-bottom">
                    <div className="search-box">
                        <input
                            onChange={(e) => setInput(e.target.value)}  // Update input on change
                            value={input}
                            type="text"
                            placeholder="Enter the Prompt Here"
                        />
                        <div>
                            <img src={assets.gallery_icon} alt="Gallery Icon" />
                            <img src={assets.mic_icon} alt="Mic Icon" />
                            <img
                                src={assets.send_icon}
                                alt="Send Icon"
                                onClick={onSent}  // Call onSent when the send button is clicked
                            />
                        </div>
                    </div>
                    <div className="bottom-info">
                        <p>
                            Solace may display inaccurate info, including about people, so
                            double-check its responses. Your privacy & Solace Apps
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Solace;