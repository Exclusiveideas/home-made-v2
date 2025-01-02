'use client'

import { ReactLenis } from "@studio-freight/react-lenis";
import gsap from "gsap";
import { useEffect, useRef } from "react";


function SmoothScrolling({ children }) {
  const lenisRef = useRef()

  const lenisOptions = {
    lerp: 0.1,
    duration: 1.5,
    smoothTouch: true, //smooth scroll for touch devices
    smooth: true,
  };

  
  useEffect(() => {
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }
  
    gsap.ticker.add(update)
  
    return () => {
      gsap.ticker.remove(update)
    }
  })

  return (
    <ReactLenis ref={lenisRef} root options={lenisOptions}>
      {children}
    </ReactLenis>
  );
}
export default SmoothScrolling;
