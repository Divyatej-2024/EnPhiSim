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
