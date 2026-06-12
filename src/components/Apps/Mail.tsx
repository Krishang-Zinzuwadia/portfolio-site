"use client";

import React, { useState, useEffect } from "react";
import { useAudio } from "@/hooks/useAudio";

type SendingStage = "idle" | "dialing" | "negotiating" | "transferring" | "success";

interface AlertData {
  title: string;
  message: string;
  type: "error" | "success";
}

export default function Mail() {
  const { playSound } = useAudio();
  
  const [from, setFrom] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  
  const [sendingStage, setSendingStage] = useState<SendingStage>("idle");
  const [alert, setAlert] = useState<AlertData | null>(null);

  // Connection/sending stages simulation timers
  useEffect(() => {
    if (sendingStage === "idle" || sendingStage === "success") return;

    let timer: NodeJS.Timeout;

    if (sendingStage === "dialing") {
      timer = setTimeout(() => {
        setSendingStage("negotiating");
      }, 1500);
    } else if (sendingStage === "negotiating") {
      timer = setTimeout(() => {
        setSendingStage("transferring");
      }, 1200);
    } else if (sendingStage === "transferring") {
      timer = setTimeout(() => {
        setSendingStage("success");
        playSound("chime");
        setAlert({
          title: "Mail Transmission Successful",
          message: "Your electronic message has been queued and sent to Krishang Zinzuwadia's mailbox. Thank you!",
          type: "success",
        });
        // Reset form fields
        setFrom("");
        setSubject("");
        setMessage("");
      }, 1200);
    }

    return () => clearTimeout(timer);
  }, [sendingStage, playSound]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    playSound("click");

    // Basic Validation
    if (!from || !from.includes("@")) {
      playSound("beep");
      setAlert({
        title: "Address Error",
        message: "Please enter a valid sender email address (containing '@') so Krishang can reply to you.",
        type: "error",
      });
      return;
    }

    if (!subject.trim()) {
      playSound("beep");
      setAlert({
        title: "Subject Missing",
        message: "Please write a brief subject line for your message.",
        type: "error",
      });
      return;
    }

    if (!message.trim()) {
      playSound("beep");
      setAlert({
        title: "Message Body Empty",
        message: "You cannot send a blank message. Please type your note before transmitting.",
        type: "error",
      });
      return;
    }

    // Begin simulated send
    setSendingStage("dialing");
  };

  const handleClear = () => {
    playSound("click");
    setFrom("");
    setSubject("");
    setMessage("");
  };

  const closeAlert = () => {
    playSound("click");
    setAlert(null);
    if (sendingStage === "success") {
      setSendingStage("idle");
    }
  };

  return (
    <div className="w-full h-full bg-white text-black font-geneva select-none flex flex-col relative border border-black shadow-[inset_1px_1px_0px_#fff]">
      {/* Mail Header / Envelope Icon */}
      <div className="bg-[#c0c0c0] border-b border-black p-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Retro Mail icon */}
          <svg className="w-6 h-5" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="36" height="28" rx="2" fill="#fff" stroke="black" strokeWidth="3"/>
            <path d="M2 4L20 18L38 4" stroke="black" strokeWidth="3" strokeLinejoin="round"/>
          </svg>
          <span className="text-[10px] font-chicago font-bold tracking-wider uppercase">Mail Composer (SMTP)</span>
        </div>
        <div className="text-[9px] text-retro-inactiveHeader uppercase font-bold pr-1">Outbox Server</div>
      </div>

      {/* Main Mail form */}
      <form onSubmit={handleSend} className="flex-1 p-3 flex flex-col space-y-3 overflow-y-auto text-[11px]">
        {/* TO Field */}
        <div className="flex items-center space-x-2 border-b border-black/10 pb-1.5">
          <span className="w-12 font-bold text-right text-[#555]">To:</span>
          <input
            type="text"
            readOnly
            value="Krishang Zinzuwadia <krishang@zinzuwadia.com>"
            className="flex-grow bg-[#f0f0f0] border border-black/20 text-[#555] px-2 py-0.5 select-all focus:outline-none cursor-default font-chicago"
          />
        </div>

        {/* FROM Field */}
        <div className="flex items-center space-x-2 border-b border-black/10 pb-1.5">
          <span className="w-12 font-bold text-right text-black">From:</span>
          <input
            type="email"
            required
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              playSound("keystroke");
            }}
            placeholder="your.email@address.com"
            className="flex-grow bg-white border border-black px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-black font-monaco"
          />
        </div>

        {/* SUBJECT Field */}
        <div className="flex items-center space-x-2 border-b border-black/10 pb-1.5">
          <span className="w-12 font-bold text-right text-black">Subject:</span>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              playSound("keystroke");
            }}
            placeholder="Collaboration Inquiry"
            className="flex-grow bg-white border border-black px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        {/* MESSAGE Field */}
        <div className="flex-grow flex flex-col space-y-1">
          <span className="font-bold text-black pl-1">Message Body:</span>
          <textarea
            required
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              playSound("keystroke");
            }}
            placeholder="Hi Krishang, I love your portfolio! Let's work together..."
            className="flex-grow bg-white border border-black p-2 font-monaco text-[11px] leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-black select-text"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 pt-2 border-t border-black/10">
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-1 border border-black rounded bg-[#c0c0c0] shadow-retro hover:bg-black/5 active:shadow-none font-bold"
          >
            Clear
          </button>
          <button
            type="submit"
            className="px-5 py-1 border-2 border-black rounded bg-[#c0c0c0] shadow-retro hover:bg-black/5 active:shadow-none font-chicago font-bold tracking-wide"
          >
            Send Mail
          </button>
        </div>
      </form>

      {/* DIAL-UP PROGRESS WINDOW OVERLAY */}
      {sendingStage !== "idle" && (
        <div className="absolute inset-0 bg-[#c0c0c0] z-40 flex items-center justify-center p-4 border border-black">
          <div className="w-[280px] bg-white border-2 border-black p-4 shadow-[3px_3px_0px_#000] flex flex-col items-center text-center space-y-3 font-chicago">
            <span className="text-[10px] tracking-wider uppercase border-b border-black pb-1 mb-1 w-full text-center">
              SMTP Network Gateway
            </span>
            
            {/* Spinning phone/modem connector SVG */}
            <div className="w-12 h-12 flex items-center justify-center relative animate-bounce">
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="12" rx="2" fill="#f0f0f0"/>
                <path d="M12 14v4" />
                <path d="M8 18h8" />
                <circle cx="6" cy="6" r="1" fill="#00ff00"/>
                <circle cx="10" cy="6" r="1" fill="#00e6ff"/>
              </svg>
            </div>

            <div className="w-full text-left text-[9px] font-monaco leading-relaxed bg-[#f0f0f0] p-2 border border-black/20 rounded max-h-[80px] overflow-y-auto">
              {sendingStage === "dialing" && (
                <>
                  <div>&gt; Connecting to SMTP mail server...</div>
                  <div>&gt; ATDT 555-MACTCP-NET</div>
                  <div>&gt; Carrier detected...</div>
                </>
              )}
              {sendingStage === "negotiating" && (
                <>
                  <div>&gt; ATDT 555-MACTCP-NET (Connected)</div>
                  <div>&gt; CONNECT 14400 / V.42bis</div>
                  <div>&gt; Performing protocol handshake...</div>
                  <div>&gt; Resolving MX record for zinzuwadia.com...</div>
                </>
              )}
              {sendingStage === "transferring" && (
                <>
                  <div>&gt; CONNECT 14400 / V.42bis</div>
                  <div>&gt; SMTP HELO mactcp.portfolio.local</div>
                  <div>&gt; MAIL FROM: &lt;{from.substring(0, 15)}...&gt;</div>
                  <div>&gt; Sending payload packets (4.2 KB)...</div>
                </>
              )}
              {sendingStage === "success" && (
                <>
                  <div>&gt; Sending payload packets (4.2 KB) (DONE)</div>
                  <div>&gt; SMTP 250 OK Message accepted</div>
                  <div>&gt; Closing socket connection...</div>
                  <div>&gt; Mail transaction completed.</div>
                </>
              )}
            </div>

            {/* Simulated mini progress bar */}
            <div className="w-full h-3 border-2 border-black bg-white p-[1px]">
              <div 
                className="h-full bg-black transition-all duration-300"
                style={{
                  width: 
                    sendingStage === "dialing" ? "30%" :
                    sendingStage === "negotiating" ? "60%" :
                    sendingStage === "transferring" ? "90%" : "100%"
                }}
              />
            </div>
            
            <span className="text-[10px] text-retro-inactiveHeader uppercase font-bold animate-pulse">
              {sendingStage === "dialing" && "Dialing..."}
              {sendingStage === "negotiating" && "Shaking Hands..."}
              {sendingStage === "transferring" && "Transmitting..."}
              {sendingStage === "success" && "Delivered!"}
            </span>
          </div>
        </div>
      )}

      {/* SYSTEM 7 STYLE ALERT POPUP */}
      {alert && (
        <div className="absolute inset-0 bg-black/25 z-50 flex items-center justify-center p-4">
          <div className="w-[300px] bg-[#c0c0c0] border-2 border-black p-4 shadow-[2px_2px_0px_#000] flex flex-col space-y-4 select-none">
            <div className="flex items-start space-x-3">
              {/* Alert Sign */}
              <div className="w-10 h-10 border-2 border-black rounded-full bg-white flex items-center justify-center flex-shrink-0 text-xl font-bold font-chicago">
                {alert.type === "error" ? "!" : "i"}
              </div>
              <div className="space-y-1.5">
                <span className="font-chicago font-bold block text-[11px] leading-tight tracking-wide text-retro-activeHeader uppercase">
                  {alert.title}
                </span>
                <p className="text-[10px] leading-normal font-geneva">
                  {alert.message}
                </p>
              </div>
            </div>
            
            {/* Double Bordered OK button */}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={closeAlert}
                className="px-6 py-0.5 border-2 border-black rounded bg-white shadow-retro hover:bg-black/5 active:shadow-none font-chicago font-bold text-[10px] tracking-wide outline-none focus:ring-1 focus:ring-black"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
