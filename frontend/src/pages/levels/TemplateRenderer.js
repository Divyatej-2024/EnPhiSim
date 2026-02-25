import React from "react";
import MailLevel from "./templates/MailLevel";
import BrowserLevel from "./templates/BrowserLevel";
import MessageLevel from "./templates/MessageLevel";
import NotificationLevel from "./templates/NotificationLevel";
import ImageLevel from "./templates/ImageLevel";
import MailBrowserLevel from "./templates/MailBrowserLevel";
import MailBrowserMessageLevel from "./templates/MailBrowserMessageLevel";

const levelTemplates = {
  mail: MailLevel,
  browser: BrowserLevel,
  message: MessageLevel,
  notification: NotificationLevel,
  image: ImageLevel,
  mailbrowser: MailBrowserLevel,
  mailbrowsermessage: MailBrowserMessageLevel,
};

export default function TemplateRenderer({ level, onOptionClick }) {
  const rawType = level.template_type || "";

  const normalizedType = rawType
    .toLowerCase()
    .replace(/[\s_]+/g, "")
    .trim();

  const TemplateComponent = levelTemplates[normalizedType];

  console.log("RAW TEMPLATE:", rawType);
  console.log("NORMALIZED TEMPLATE:", normalizedType);

  if (!TemplateComponent) {
    return (
      <h2>
        Template not found: <code>{rawType}</code>
      </h2>
    );
  }

  return <TemplateComponent level={level} onOptionClick={onOptionClick} />;
}
