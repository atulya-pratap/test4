(function () {
  "use strict";

  const portalOverlay = document.getElementById("portal-overlay");
  const phaseTerminal = document.getElementById("phase-terminal");
  const phaseDocument = document.getElementById("phase-document");
  const skipBtn = document.getElementById("skip-btn");
  
  const terminalLines = [
    document.getElementById("term-1"),
    document.getElementById("term-2"),
    document.getElementById("term-3"),
    document.getElementById("term-4"),
    document.getElementById("term-5")
  ];
  
  const scannerLine = document.getElementById("scanner-line");
  const approvalStamp = document.getElementById("approval-stamp");
  const actionArea = document.getElementById("action-area");
  const authDocument = document.getElementById("auth-document");
  const enterBtn = document.getElementById("enter-btn");

  let isSkipped = false;
  let sequenceTimeouts = [];

  const T = {
    terminalLineDelay: 700,
    terminalToDocTransition: 1200,
    scannerDelay: 600,
    scannerDuration: 2200,
    stampDelay: 300,
    actionAreaDelay: 900
  };

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function sleep(ms) {
    return new Promise(resolve => {
      const timeoutId = setTimeout(resolve, ms);
      sequenceTimeouts.push(timeoutId);
    });
  }

  async function runSequence() {
    if (prefersReducedMotion) {
      completeSequenceInstantly();
      return;
    }

    try {
      await sleep(400);
      for (let i = 0; i < terminalLines.length; i++) {
        if (isSkipped) return;
        if (terminalLines[i]) terminalLines[i].classList.add('is-visible');
        const delay = (i === 1 || i === 2) ? 400 : T.terminalLineDelay;
        await sleep(delay);
      }

      await sleep(T.terminalToDocTransition);
      if (isSkipped) return;

      phaseTerminal.classList.remove('is-active');
      phaseDocument.classList.add('is-active');
      
      await sleep(T.scannerDelay);
      if (isSkipped) return;

      scannerLine.classList.add('is-scanning');
      
      await sleep(T.scannerDuration);
      if (isSkipped) return;

      await sleep(T.stampDelay);
      if (isSkipped) return;

      approvalStamp.classList.add("is-stamped");
      authDocument.classList.add("thud");

      await sleep(T.actionAreaDelay);
      if (isSkipped) return;

      actionArea.classList.add("is-visible");
      skipBtn.style.display = "none"; 

    } catch (e) {
      completeSequenceInstantly();
    }
  }

  function completeSequenceInstantly() {
    isSkipped = true;
    sequenceTimeouts.forEach(clearTimeout);
    sequenceTimeouts = [];

    phaseTerminal.classList.remove('is-active');
    phaseDocument.classList.add('is-active');
    scannerLine.style.display = "none"; 
    
    approvalStamp.style.transitionDuration = "0.01ms";
    approvalStamp.classList.add("is-stamped");
    
    actionArea.classList.add("is-visible");
    actionArea.style.transitionDuration = "0.01ms";
    skipBtn.style.display = "none";
  }

  function closePortal() {
    portalOverlay.classList.add("is-hidden");
    document.body.classList.remove("is-locked");
  }

  if (skipBtn) skipBtn.addEventListener('click', completeSequenceInstantly);
  if (enterBtn) enterBtn.addEventListener('click', closePortal);

  window.addEventListener('load', runSequence);

})();
