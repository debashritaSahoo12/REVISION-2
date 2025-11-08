import { useState, useEffect } from "react";
import "./AnimatedBanner.css";

const AnimatedBanner = ({
  texts = ["Learn React", "Build Projects", "Get Hired"],
  typingSpeed = 120,
  erasingSpeed = 60,
  delayBeforeErase = 1000,
  delayBeforeNext = 500,
  loop = true,
}) => {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    let typingTimeout;

    const currentWord = texts[index % texts.length];

    if (!isDeleting && text.length < currentWord.length) {
      // Typing characters
      typingTimeout = setTimeout(() => {
        setText(currentWord.substring(0, text.length + 1));
      }, typingSpeed);
    } else if (!isDeleting && text.length === currentWord.length) {
      // Pause before erasing
      typingTimeout = setTimeout(() => setIsDeleting(true), delayBeforeErase);
    } else if (isDeleting && text.length > 0) {
      // Erasing characters
      typingTimeout = setTimeout(() => {
        setText(currentWord.substring(0, text.length - 1));
      }, erasingSpeed);
    } else if (isDeleting && text.length === 0) {
      // Fade transition before next word
      setFade(true);
      typingTimeout = setTimeout(() => {
        setFade(false);
        setIsDeleting(false);
        setIndex((prev) => prev + 1);
      }, delayBeforeNext);
    }

    return () => clearTimeout(typingTimeout);
  }, [
    text,
    isDeleting,
    index,
    texts,
    typingSpeed,
    erasingSpeed,
    delayBeforeErase,
    delayBeforeNext,
  ]);

  useEffect(() => {
    return () => {
      // Cleanup timers on unmount
      setText("");
    };
  }, []);

  if (!loop && index >= texts.length) return null;

  return (
    <div className="banner-container" aria-live="polite">
      <span className={`banner-text ${fade ? "fade-out" : "fade-in"}`}>
        {text}
      </span>
      <span className="cursor">|</span>
    </div>
  );
};

export default AnimatedBanner;
