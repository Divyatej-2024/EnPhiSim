import React from "react";
import MailLevel from "./MailLevel";
import BrowserLevel from "./BrowserLevel";

export default function MailBrowserLevel({ levelData }) {
  return (
    <div>
      <MailLevel levelData={levelData} />
      <BrowserLevel levelData={levelData} />
    </div>
  );
}
