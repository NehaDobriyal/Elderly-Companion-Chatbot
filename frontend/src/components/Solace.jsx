import React, { useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation for accessing navigation state
import "../styles/Solace.css";
import { assets } from "../assets/assets";
import { Context } from "../context/Context";

function Solace() {
    const {
        onSent,
        recentPrompt,
        showResults,
        loading,
        resultData,
        setInput,
        input,
    } = useContext(Context);

    const location = useLocation();

    // Set input to the passed prompt when navigating to Solace
    useEffect(() => {
        if (location.state?.prompt) {
            setInput(location.state.prompt); // Set the prompt to the input field
        }
    }, [location.state, setInput]);

    return (
        <div className="main">
            <div className="nav">
                <div className="logo-container">
                    <Link to="/">
                        <img src="./src/assets/logo1.png" alt="Logo" className="logo" />
                    </Link>
                </div>

                {/* Navbar links - Home and User Icon */}
                <div className="nav-links">
                    <Link to="/" className="home-link">Home</Link> {/* Home link */}
                    <div className="user-icon">
                        <img src={assets.user} alt="User Icon" />
                    </div>
                </div>
            </div>

            <div className="main-container">
                {!showResults ? (
                    <>
                        <div className="greet">
                            <p>
                                <span>Hello!</span>
                            </p>
                            <p>How Can I Help You Today?</p>
                        </div>
                    </>
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
                            onChange={(e) => {
                                setInput(e.target.value);
                            }}
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
                                onClick={() => {
                                    onSent();
                                }}
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
