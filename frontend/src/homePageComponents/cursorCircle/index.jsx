"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap, { Expo } from "gsap";
import "./cursorCirc.css";
import { getScale } from "@/utils/cursorCircle";
import Image from "next/image";
import useHomeStore from "@/store/homeStore";

const JellyBlob = () => {
  const [cursorImg, setCursorImg] = useState('spatula')
  const cursorImage = useHomeStore((state) => state.cursorImage);

  const jellyRef = useRef(null);

  // Save current position and target position
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  const setJellyX = useRef(null);
  const setJellyY = useRef(null);
  const setJellyRotate = useRef(null);
  const setJellyScaleX = useRef(null);
  const setJellyScaleY = useRef(null);
  const setJellyWidth = useRef(null);
  const setJellyOpacity = useRef(null);

  useLayoutEffect(() => {
    setJellyX.current = gsap.quickSetter(jellyRef.current, "x", "px");
    setJellyY.current = gsap.quickSetter(jellyRef.current, "y", "px");
    setJellyRotate.current = gsap.quickSetter(jellyRef.current, "rotate", "deg");
    setJellyScaleX.current = gsap.quickSetter(jellyRef.current, "scaleX");
    setJellyScaleY.current = gsap.quickSetter(jellyRef.current, "scaleY");
    setJellyWidth.current = gsap.quickSetter(jellyRef.current, "width", "px");
    setJellyOpacity.current = gsap.quickSetter(jellyRef.current, "opacity");
  }, []);

  // Start Animation loop
  const loop = () => {
    // Calculate rotation and scale based on velocity
    const dx = target.current.x - pos.current.x;
    const dy = target.current.y - pos.current.y;
    const rotation = 0
    const scale = getScale(dx, dy);

    // Update blob styles
    setJellyOpacity.current(1);
    setJellyRotate.current(rotation);
    setJellyWidth.current(45 + scale * 10);
    setJellyScaleX.current(1 + scale * 0.3);
    setJellyScaleY.current(1 - scale * 0.3);

    // Continue animation loop
    requestAnimationFrame(loop);
  };

  useLayoutEffect(() => {
    if (!window) return

    const setFromEvent = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      gsap.to(pos.current, {
        x,
        y,
        duration: 2, 
        ease: Expo.easeOut,
        onUpdate: () => {
          // Update the jelly blob position during tween
          setJellyX.current(pos.current.x);
          setJellyY.current(pos.current.y);
        },
      });

      target.current.x = x;
      target.current.y = y;
    };

    window.addEventListener("mousemove", setFromEvent);

    // Start the animation loop
    loop();

    // Cleanup on unmount
    return () => {
      window.removeEventListener("mousemove", setFromEvent);
    };
  }, []);

  useEffect(() => {
    setCursorImg(cursorImage)
  }, [cursorImage])
  

  return (
    <div ref={jellyRef} id="jelly-id" className="jelly-blob">
      <Image
          src={`/images/${cursorImg}.png`}
          width={512}
          height={512}
          alt="spatula"
          priority={true}
          className={`cursor_spatula`}
        />
    </div>
  );
};

export default JellyBlob;
