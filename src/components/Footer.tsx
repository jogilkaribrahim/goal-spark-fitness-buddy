import { X } from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-card text-card-foreground py-8 mt-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center md:justify-between gap-6">
        {/* Logos Collaboration */}
        <div className="flex items-center gap-2">
          {/* Left Logo with URL */}
          <a
            href="https://goldengymnasium.com"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer inline-block flex items-center justify-center shadow-fitness rounded-full w-[64px] h-[64px] bg-white"
          >
            <img
              src="/gym-logo.png"
              alt="Golden Gymnasium Logo"
              className="object-contain"
              style={{ width: "56px", height: "56px" }}
            />
          </a>
          {/* X for collaboration */}
          <span className=" text-2xl font-bold text-muted-foreground select-none">
            <X />
          </span>
          {/* Right Logo with URL */}
          <a
            href="https://wolvesandcompany.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer inline-block flex items-center justify-center rounded-full w-[64px] h-[64px] bg-white"
          >
            <img
              src="/wolf.png"
              alt="AI Logo"
              className="object-contain"
              style={{
                width: "56px",
                height: "56px",
                objectFit: "contain",
                objectPosition: "center",
                background: "none",
                display: "block",
              }}
            />
          </a>
        </div>

        {/* Copyright and Text */}
        <div className="text-center text-muted-foreground text-sm w-full md:w-auto mt-4 md:mt-0">
          © {new Date().getFullYear()} Golden Gymnasium. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
