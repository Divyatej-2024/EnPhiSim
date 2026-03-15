// Sections: imports, configuration, logic, render/exports

// frontend/src/pages/levels/templates/index.js
import MailLevel from "./MailLevel";
import BrowserLevel from "./BrowserLevel";
import MessageLevel from "./MessageLevel";
import NotificationLevel from "./NotificationLevel";
import ImageLevel from "./ImageLevel";
import MailBrowserLevel from "./MailBrowserLevel";
import MailBrowserMessageLevel from "./MailBrowserMessageLevel";

export const levelTemplates = {
  mail: MailLevel,
  browser: BrowserLevel,
  message: MessageLevel,
  notification: NotificationLevel,
  image: ImageLevel,
  "mail + browser": MailBrowserLevel,
  "mail + browser + message": MailBrowserMessageLevel,
};

// Export individual components for direct use
export {
  MailLevel,
  BrowserLevel,
  MessageLevel,
  NotificationLevel,
  ImageLevel,
  MailBrowserLevel,
  MailBrowserMessageLevel
};
