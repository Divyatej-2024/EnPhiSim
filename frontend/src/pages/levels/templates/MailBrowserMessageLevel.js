import React from "react";
import MailLevel from "./MailLevel";
import BrowserLevel from "./BrowserLevel";
import MessageLevel from "./MessageLevel";

export default function MailBrowserMessageLevel({ levelData }) {
  return (
    <div>
      <MailLevel levelData={levelData} />
      <BrowserLevel levelData={levelData} />
      <MessageLevel levelData={levelData} />
    </div>
  );
}
