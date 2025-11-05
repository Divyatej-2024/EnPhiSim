
export const levels = {
  /* ===== EASY l1 - l6 ===== */
  l1: {
    id: "l1",
    title: "Mass Credential-Phish",
    category: "easy",
    contentHtml: `<p><strong>Hello User,</strong></p>
      <p>Your account verification has timed out. Click below to re-verify immediately.</p>`,
    contentPlain: "Account verification timed out. Re-verify now.",
    events: [
      { t: 0, type: "arrive_email" },
      { t: 6, type: "followup", data: { text: "Reminder: action required in 30s", unlockHint: "Check sender domain" } },
      { t: 10, type: "activate_link", data: { key: "phish_link", duration: 18 } },
      { t: 20, type: "ml_check" }
    ],
    actions: [
      { id: "verify", label: "Verify Now", linkKey: "phish_link" },
      { id: "remind", label: "Remind Me Later", style: "neutral" },
      { id: "unsubscribe", label: "Unsubscribe", style: "neutral" }
    ],
    correctAction: "unsubscribe",
    hints: ["Sender domain mismatches official address", "Calls for urgency are suspicious"],
    nextLevel: "/levels/easy/l2",
    successMessage: "This was a phishing email. Well done.",
    points: 10,
    mlCheck: { enabled: false }
  },

  l2: {
    id: "l2",
    title: "Scam Invoice / Payment Reminder",
    category: "easy",
    contentHtml: `<p>Dear User, your pending invoice of £259.99 is due. Click to pay now.</p>`,
    events: [{ t:0, type:"arrive_email" }, { t:8, type:"activate_link", data:{ key:"pay_link", duration:15 } }],
    actions: [{ id:"pay", label:"Pay Now", linkKey:"pay_link" }, { id:"report", label:"Report", style:"neutral" }],
    correctAction: "report",
    hints: ["Unexpected invoices should be verified with vendor", "Check invoice details"],
    nextLevel: "/levels/easy/l3",
    points: 8,
    mlCheck: { enabled: false }
  },

  l3: {
    id: "l3",
    title: "Fake Newsletter Subscription",
    category: "easy",
    contentHtml: `<p>Subscribe now for discounts and rewards!</p>`,
    events: [{ t:0, type:"arrive_email" }],
    actions: [{ id:"subscribe", label:"Subscribe" }, { id:"ignore", label:"Ignore", style:"neutral" }],
    correctAction: "ignore",
    hints: ["Unsolicited subscriptions often hide tracking links"],
    nextLevel: "/levels/easy/l4",
    points: 5
  },

  l4: {
    id: "l4",
    title: "Lottery / Prize Scam",
    category: "easy",
    contentHtml: `<p>Congratulations — you won! Provide bank details to claim.</p>`,
    events: [{ t:0, type:"arrive_email" }],
    actions: [{ id:"claim", label:"Claim Prize" }, { id:"report", label:"Report", style:"neutral" }, { id:"delete", label:"Delete", style:"neutral" }],
    correctAction: "report",
    hints: ["Prizes you did not enter for are likely scams"],
    nextLevel: "/levels/easy/l5",
    points: 10
  },

  l5: {
    id: "l5",
    title: "Simple Attachment Lure",
    category: "easy",
    contentHtml: `<p>See attached invoice (invoice.pdf).</p>`,
    events: [{ t:0, type:"arrive_email" }],
    actions: [{ id:"open", label:"Open Attachment" }, { id:"report", label:"Report", style:"neutral" }],
    correctAction: "report",
    hints: ["Attachments from unknown senders can contain malware"],
    nextLevel: "/levels/easy/l6",
    points: 9
  },

  l6: {
    id: "l6",
    title: "Spoofed Display-Name Sender",
    category: "easy",
    contentHtml: `<p>Message shows HR in the name but uses a public gmail address.</p>`,
    events: [{ t:0, type:"arrive_email" }, { t:10, type:"unlock_hint", data:{ hint:"Hover or inspect sender address" } }],
    actions: [{ id:"trust", label:"Trust & Reply" }, { id:"inspect", label:"Inspect Email Address", style:"neutral" }, { id:"report", label:"Report", style:"neutral" }],
    correctAction: "inspect",
    hints: ["Look beyond display name; check the actual address"],
    nextLevel: "/levels/bonus/bl1",
    points: 12
  },
  bl1: {
    id: "bl1",
    title: "BL1: Eagle (Bonus)",
    category: "bonus",
    contentHtml: `<p>Bonus milestone: identify 5 suspicious indicators in a mixed email chain.</p>`,
    events: [{ t:0, type:"arrive_email" }],
    actions: [{ id:"flag", label:"Flag Suspicious Items" }, { id:"skip", label:"Skip", style:"neutral" }],
    correctAction: "flag",
    hints: ["Look for typos, unknown senders, urgency, attachments, odd links"],
    nextLevel: "/levels/adv_easy/l7",
    points: 15
  },

  /* ===== ADV_EASY l7 - l12 ===== */
  l7: {
    id: "l7",
    title: "TypoSquatted Domain Phish",
    category: "adv_easy",
    contentHtml: `<p>Link points to "micr0soft.com" (zero instead of o). Hover to check destination.</p>`,
    events: [{ t:0, type:"arrive_email" }, { t:6, type:"unlock_hint", data:{ hint:"Check domain spelling/punycode" } }],
    actions: [{ id:"click", label:"Click Link" }, { id:"hover", label:"Hover Link to Inspect", style:"neutral" }, { id:"report", label:"Report", style:"neutral" }],
    correctAction: "hover",
    hints: ["Typographical variants in domains are common in phishing"],
    nextLevel: "/levels/adv_easy/l8",
    points: 12
  },

  l8: {
    id: "l8",
    title: "URL Shortener Redirected Phish",
    category: "adv_easy",
    contentHtml: `<p>Shortened URL (bit.ly/xyz) included. Expand before opening.</p>`,
    events: [{ t:0, type:"arrive_email" }, { t:4, type:"activate_link", data:{ key:"short_link", duration:18 } }],
    actions: [{ id:"open", label:"Open Short URL", linkKey:"short_link" }, { id:"expand", label:"Expand URL to see target", style:"neutral" }, { id:"report", label:"Report", style:"neutral" }],
    correctAction: "expand",
    hints: ["Use link preview/expander to reveal final destination"],
    nextLevel: "/levels/adv_easy/l9",
    points: 11
  },

  l9: {
    id: "l9",
    title: "Malicious Survey / Feedback Request",
    category: "adv_easy",
    contentHtml: `<p>Quick survey claims to give a discount — asks for login.</p>`,
    events: [{ t:0, type:"arrive_email" }],
    actions: [{ id:"take", label:"Take Survey" }, { id:"report", label:"Report", style:"neutral" }, { id:"ignore", label:"Ignore", style:"neutral" }],
    correctAction: "report",
    hints: ["Surveys asking to login or enter credentials are suspicious"],
    nextLevel: "/levels/adv_easy/l10",
    points: 9
  },

  l10: {
    id: "l10",
    title: "SMS (Smishing) Generic Link",
    category: "adv_easy",
    contentHtml: `<p>SMS-like content included in email: 'Click to verify your account'.</p>`,
    events: [{ t:0, type:"arrive_email" }, { t:8, type:"activate_link", data:{ key:"sms_link", duration:14 } }],
    actions: [{ id:"click", label:"Click Link", linkKey:"sms_link" }, { id:"call", label:"Call Number Shown", style:"neutral" }, { id:"report", label:"Report", style:"neutral" }],
    correctAction: "report",
    hints: ["Don't follow links that mimic SMS inside email; verify via app/official site"],
    nextLevel: "/levels/adv_easy/l11",
    points: 10
  },

  l11: {
    id: "l11",
    title: "Fake Social Media Notification",
    category: "adv_easy",
    contentHtml: `<p>Social network asks you to login via embedded link to confirm account.</p>`,
    events: [{ t:0, type:"arrive_email" }, { t:10, type:"unlock_hint", data:{ hint:"Open the app/site directly rather than clicking email links" } }],
    actions: [{ id:"login", label:"Login via Link" }, { id:"openapp", label:"Open App or Site Directly", style:"neutral" }, { id:"report", label:"Report", style:"neutral" }],
    correctAction: "openapp",
    hints: ["Open the official app/site instead of email links"],
    nextLevel: "/levels/adv_easy/l12",
    points: 11
  },

  l12: {
    id: "l12",
    title: "Clone of a Public Service Alert",
    category: "adv_easy",
    contentHtml: `<p>Mimics a government/tax alert asking to verify details online.</p>`,
    events: [{ t:0, type:"arrive_email" }, { t:6, type:"activate_link", data:{ key:"gov_link", duration:12 } }],
    actions: [{ id:"follow", label:"Follow Link", linkKey:"gov_link" }, { id:"call", label:"Call Official Number", style:"neutral" }, { id:"report", label:"Report", style:"neutral" }],
    correctAction: "call",
    hints: ["Check official channels; government bodies rarely ask via email for credentials"],
    nextLevel: "/levels/bonus/bl2",
    points: 12
  },
  bl2: {
    id: "bl2",
    title: "BL2: Monkey (Bonus)",
    category: "bonus",
    contentHtml: `<p>Mini-challenge: timed identification of 3 obfuscation tricks.</p>`,
    events: [{ t:0, type:"arrive_email" }, { t:5, type:"unlock_hint", data:{ hint:"Look for shortened URLs" } }],
    actions: [{ id:"start", label:"Start Challenge" }, { id:"skip", label:"Skip", style:"neutral" }],
    correctAction: "start",
    nextLevel: "/levels/normal/l13",
    points: 12
  },
  /* ===== NORMAL l13 - l18 ===== */
  l13: {
    id: "l13",
    title: "Spear-Phishing",
    category: "normal",
    contentHtml: `<p>Personalised email references your manager and requests urgent info.</p>`,
    events: [{ t:0, type:"arrive_email" }, { t:6, type:"followup", data:{ text:"Manager: Please do this urgently", unlockHint:"Verify via separate channel" } }],
    actions: [{ id:"reply", label:"Reply with Info" }, { id:"verify", label:"Verify With Manager", style:"neutral" }, { id:"report", label:"Report", style:"neutral" }],
    correctAction: "verify",
    hints: ["Verify any unusual request through a known channel (phone/IM)"],
    nextLevel: "/levels/normal/l14",
    points: 15
  },

  l14: {
    id: "l14",
    title: "Business Email Compromise",
    category: "normal",
    contentHtml: `<p>Urgent payment request appears to be from a senior exec.</p>`,
    events: [{ t:0, type:"arrive_email" }, { t:8, type:"escalation" }],
    actions: [{ id:"pay", label:"Initiate Payment" }, { id:"verify", label:"Verify With Exec", style:"neutral" }, { id:"report", label:"Report", style:"neutral" }],
    correctAction: "verify",
    hints: ["Contact the exec directly before transferring funds"],
    nextLevel: "/levels/normal/l15",
    points: 18
  },

  l15: {
    id: "l15",
    title: "Drive / Share Notification",
    category: "normal",
    contentHtml: `<p>Shared drive link asks you to login to view a document.</p>`,
    events: [{ t:0, type:"arrive_email" }, { t:6, type:"activate_link", data:{ key:"drive_link", duration:15 } }],
    actions: [{ id:"login", label:"Login to View", linkKey:"drive_link" }, { id:"open", label:"Open Without Login", style:"neutral" }, { id:"report", label:"Report", style:"neutral" }],
    correctAction: "report",
    hints: ["Use verified sharing tools; don't enter credentials on random pages"],
    nextLevel: "/levels/normal/l16",
    points: 10
  },

  l16: {
    id: "l16",
    title: "Invoice Impersonation",
    category: "normal",
    contentHtml: `<p>Invoice that looks like your vendor changed payment details.</p>`,
    events: [{ t:0, type:"arrive_email" }],
    actions: [{ id:"pay", label:"Pay" }, { id:"verify", label:"Verify Invoice", style:"neutral" }, { id:"report", label:"Report", style:"neutral" }],
    correctAction: "verify",
    hints: ["Confirm changes to payment instructions separately with vendor"],
    nextLevel: "/levels/normal/l17",
    points: 14
  },

  l17: {
    id: "l17",
    title: "Account Lockout Scare",
    category: "normal",
    contentHtml: `<p>Your account will be locked unless you click the link to unlock it.</p>`,
    events: [{ t:0, type:"arrive_email" }, { t:12, type:"activate_link", data:{ key:"unlock_link", duration:18 } }],
    actions: [{ id:"click", label:"Click to Unlock", linkKey:"unlock_link" }, { id:"report", label:"Report", style:"neutral" }, { id:"ignore", label:"Ignore", style:"neutral" }],
    correctAction: "report",
    hints: ["Verify directly via official account portal, not email links"],
    nextLevel: "/levels/normal/l18",
    points: 11
  },

  l18: {
    id: "l18",
    title: "Credential-harvest via Landing Page",
    category: "normal",
    contentHtml: `<p>Link leads to a convincing login page that requests your credentials.</p>`,
    events: [{ t:0, type:"arrive_email" }, { t:6, type:"activate_link", data:{ key:"landing_link", duration:16 } }],
    actions: [{ id:"login", label:"Login", linkKey:"landing_link" }, { id:"inspect", label:"Inspect Link/URL", style:"neutral" }, { id:"report", label:"Report", style:"neutral" }],
    correctAction: "inspect",
    hints: ["Check TLS/punycode and prefer official bookmarks"],
    nextLevel: "/levels/bonus/bl3",
    points: 16
  },
  bl3: {
    id: "bl3",
    title: "BL3: Turtle (Bonus)",
    category: "bonus",
    contentHtml: `<p>Verify a chain of three emails for authenticity.</p>`,
    events: [{ t:0, type:"arrive_email" }],
    actions: [{ id:"start", label:"Start" }, { id:"skip", label:"Skip", style:"neutral" }],
    correctAction: "start",
    nextLevel: "/levels/prehard/l19",
    points: 15
  },

  /* ===== PREHARD l19 - l23 (5) ===== */
  l19: {
    id: "l19",
    title: "Whaling",
    category: "prehard",
    contentHtml: `<p>High-value target email requests confidential info from exec.</p>`,
    events: [{ t:0, type:"arrive_email" }, { t:8, type:"followup", data:{ text:"This is urgent — reply now", unlockHint:"Check header relays" } }],
    actions: [{ id:"respond", label:"Respond" }, { id:"verify", label:"Verify via Phone", style:"neutral" }, { id:"report", label:"Report", style:"neutral" }],
    correctAction: "verify",
    hints: ["Inspect headers and verify via a known phone number"],
    nextLevel: "/levels/prehard/l20",
    points: 20
  },

  l20: {
    id: "l20",
    title: "Spear + Whishing Combo",
    category: "prehard",
    contentHtml: `<p>Email + a simulated phone request that pushes for credentials.</p>`,
    events: [{ t:0, type:"arrive_email" }, { t:6, type:"escalation" }],
    actions: [{ id:"comply", label:"Comply" }, { id:"verify", label:"Verify Identity", style:"neutral" }, { id:"report", label:"Report", style:"neutral" }],
    correctAction: "verify",
    hints: ["Do not share credentials over phone unless verified"],
    nextLevel: "/levels/prehard/l21",
    points: 20
  },

  l21: {
    id: "l21",
    title: "QR Code Quishing",
    category: "prehard",
    contentHtml: `<p>Email includes a QR code pointing to a fake login site. Preview before scanning.</p>`,
    events: [{ t:0, type:"arrive_email" }, { t:4, type:"unlock_hint", data:{ hint:"Preview QR target URL" } }],
    actions: [{ id:"scan", label:"Scan QR" }, { id:"preview", label:"Preview URL", style:"neutral" }, { id:"report", label:"Report", style:"neutral" }],
    correctAction: "preview",
    hints: ["QR codes can obfuscate destinations; preview first"],
    nextLevel: "/levels/prehard/l22",
    points: 12
  },

  l22: {
    id: "l22",
    title: "Account Takeover",
    category: "prehard",
    contentHtml: `<p>Compromised account sends password-reset lookalike email. Confirm with owner.</p>`,
    events: [{ t:0, type:"arrive_email" }, { t:10, type:"unlock_hint", data:{ hint:"Confirm with account owner" } }],
    actions: [{ id:"reset", label:"Reset Password" }, { id:"report", label:"Report", style:"neutral" }, { id:"contact", label:"Contact User", style:"neutral" }],
    correctAction: "contact",
    hints: ["Confirm with the account owner before changing access"],
    nextLevel: "/levels/prehard/l23",
    points: 15
  },

  l23: {
    id: "l23",
    title: "Malicious HTML in Attachment",
    category: "prehard",
    contentHtml: `<p>Attachment contains HTML that may auto-execute. Use a sandbox to inspect.</p>`,
    events: [{ t:0, type:"arrive_email" }, { t:6, type:"unlock_hint", data:{ hint:"Open attachments in sandbox or VM" } }],
    actions: [{ id:"open", label:"Open Attachment" }, { id:"sandbox", label:"Open in Sandbox", style:"neutral" }, { id:"report", label:"Report", style:"neutral" }],
    correctAction: "sandbox",
    hints: ["Use a secure environment for unknown attachments"],
    nextLevel: "/levels/bonus/bl4",
    points: 16
  },
  bl4: {
    id: "bl4",
    title: "BL4: Shark (Bonus)",
    category: "bonus",
    contentHtml: `<p>Mixed vector (QR + voice + email) puzzle.</p>`,
    events: [{ t:0, type:"arrive_email" }],
    actions: [{ id:"start", label:"Start Bonus" }, { id:"skip", label:"Skip", style:"neutral" }],
    correctAction: "start",
    nextLevel: "/levels/hard/l24",
    points: 18
  },

  /* ===== HARD l24 - l28 (5) ===== */
  l24: {
    id: "l24",
    title: "Business Process Compromise",
    category: "hard",
    contentHtml: `<p>Attacker injected into business payment flow to change beneficiary details.</p>`,
    events: [{ t:0, type:"arrive_email" }, { t:8, type:"escalation" }],
    actions: [{ id:"follow", label:"Follow Process" }, { id:"verify", label:"Verify Process Change", style:"neutral" }, { id:"report", label:"Report", style:"neutral" }],
    correctAction: "verify",
    hints: ["Verify changes to payment flows with multiple stakeholders"],
    nextLevel: "/levels/hard/l25",
    points: 22
  },

  l25: {
    id: "l25",
    title: "Compromised Internal Account Spear-Phish",
    category: "hard",
    contentHtml: `<p>Email appears internal, but headers show unusual external relay. Inspect headers.</p>`,
    events: [{ t:0, type:"arrive_email" }, { t:6, type:"unlock_hint", data:{ hint:"View full headers" } }],
    actions: [{ id:"trust", label:"Trust" }, { id:"verify", label:"Verify Headers", style:"neutral" }, { id:"report", label:"Report", style:"neutral" }],
    correctAction: "verify",
    hints: ["Header inspection reveals relay and SPF issues"],
    nextLevel: "/levels/hard/l26",
    points: 20
  },

  l26: {
    id: "l26",
    title: "Deepfake-Assisted Voice Whishing",
    category: "hard",
    contentHtml: `<p>Voice call impersonates manager using deepfake audio alongside email.</p>`,
    events: [{ t:0, type:"arrive_email" }, { t:6, type:"escalation" }],
    actions: [{ id:"comply", label:"Comply with Request" }, { id:"verify", label:"Verify via Secure Channel", style:"neutral" }, { id:"report", label:"Report", style:"neutral" }],
    correctAction: "verify",
    hints: ["Use a trusted secure channel for verification"],
    nextLevel: "/levels/hard/l27",
    points: 24
  },

  l27: {
    id: "l27",
    title: "Man-in-the-Middle Credential Capture",
    category: "hard",
    contentHtml: `<p>Transparent proxy page captures credentials before relaying to the real site.</p>`,
    events: [{ t:0, type:"arrive_email" }, { t:10, type:"activate_link", data:{ key:"proxy_link", duration:20 } }],
    actions: [{ id:"login", label:"Login", linkKey:"proxy_link" }, { id:"inspect", label:"Inspect TLS/URL", style:"neutral" }, { id:"report", label:"Report", style:"neutral" }],
    correctAction: "inspect",
    hints: ["Check TLS lock, domain and certificate details"],
    nextLevel: "/levels/hard/l28",
    points: 24
  },

  l28: {
    id: "l28",
    title: "Targeted Supply-Chain Phishing",
    category: "hard",
    contentHtml: `<p>Compromise originates via a vendor update email. Verify vendor signatures.</p>`,
    events: [{ t:0, type:"arrive_email" }, { t:8, type:"unlock_hint", data:{ hint:"Check vendor digital signatures" } }],
    actions: [{ id:"install", label:"Install Update" }, { id:"verify", label:"Verify with Vendor", style:"neutral" }, { id:"report", label:"Report", style:"neutral" }],
    correctAction: "verify",
    hints: ["Verify updates with vendor and checksum signatures"],
    nextLevel: "/levels/bonus/bl5",
    points: 26
  },
  bl5: {
    id: "bl5",
    title: "BL5: Elephant (Bonus)",
    category: "bonus",
    contentHtml: `<p>Long puzzle combining supply-chain + deepfake signals.</p>`,
    events: [{ t:0, type:"arrive_email" }],
    actions: [{ id:"start", label:"Start Bonus" }, { id:"skip", label:"Skip", style:"neutral" }],
    correctAction: "start",
    nextLevel: "/levels/adv_hard/l29",
    points: 20
  },


  /* ===== ADV_HARD l29 - l32 (4) ===== */
  l29: {
    id: "l29",
    title: "AI-generated personalised campaigns",
    category: "adv_hard",
    contentHtml: `<p>Emails crafted using public data to increase trust (personalisation).</p>`,
    events: [{ t:0, type:"arrive_email" }, { t:6, type:"ml_check" }],
    actions: [{ id:"engage", label:"Engage" }, { id:"verify", label:"Verify Identity", style:"neutral" }, { id:"report", label:"Report", style:"neutral" }],
    correctAction: "verify",
    hints: ["Targeted personalization often uses harvested public data"],
    nextLevel: "/levels/adv_hard/l30",
    points: 28,
    mlCheck: { enabled: false }
  },

  l30: {
    id: "l30",
    title: "Homograph / Unicode Confusables",
    category: "adv_hard",
    contentHtml: `<p>Domain uses confusable unicode characters to look identical to trusted domain.</p>`,
    events: [{ t:0, type:"arrive_email" }, { t:6, type:"unlock_hint", data:{ hint:"Convert to punycode to inspect" } }],
    actions: [{ id:"click", label:"Click Link" }, { id:"inspect", label:"Inspect Domain (punycode)", style:"neutral" }, { id:"report", label:"Report", style:"neutral" }],
    correctAction: "inspect",
    hints: ["Punycode and unicode confusables are used for homograph attacks"],
    nextLevel: "/levels/adv_hard/l31",
    points: 28
  },

  l31: {
    id: "l31",
    title: "Credential Replay + Slow Drip Exfiltration",
    category: "adv_hard",
    contentHtml: `<p>Credentials replayed to a shadow account over time; detect unusual sessions.</p>`,
    events: [{ t:0, type:"arrive_email" }, { t:8, type:"unlock_hint", data:{ hint:"Revoke stale sessions on suspicion" } }],
    actions: [{ id:"revoke", label:"Revoke Sessions" }, { id:"ignore", label:"Ignore", style:"neutral" }, { id:"report", label:"Report", style:"neutral" }],
    correctAction: "revoke",
    hints: ["Revoke sessions and rotate credentials on suspicious activity"],
    nextLevel: "/levels/adv_hard/l32",
    points: 30
  },

  l32: {
    id: "l32",
    title: "Multi-vector adaptive BEC",
    category: "adv_hard",
    contentHtml: `<p>Adaptive scam combining data across channels to request funds.</p>`,
    events: [{ t:0, type:"arrive_email" }, { t:6, type:"escalation" }],
    actions: [{ id:"transfer", label:"Transfer Funds" }, { id:"verify", label:"Verify via CFO", style:"neutral" }, { id:"report", label:"Report", style:"neutral" }],
    correctAction: "verify",
    hints: ["High-value transfers require multi-person verification"],
    nextLevel: "/levels/bonus/bl6",
    points: 32
  },
  bl6: {
    id: "bl6",
    title: "BL6: HoneyBee (Bonus)",
    category: "bonus",
    contentHtml: `<p>Multi-day investigation simulation (condensed).</p>`,
    events: [{ t:0, type:"arrive_email" }],
    actions: [{ id:"start", label:"Start Challenge" }, { id:"skip", label:"Skip", style:"neutral" }],
    correctAction: "start",
    nextLevel: "/levels/final/f",
    points: 25
  },

  /* ===== FINAL l33 ===== */
  f: {
    id: "f",
    title: "Advanced Persistent Phishing (Final)",
    category: "final",
    contentHtml: `<p>Multi-stage hybrid spear-phishing exercise requiring synthesis of previous levels.</p>`,
    events: [
      { t:0, type:"arrive_email" },
      { t:6, type:"followup", data:{ text:"Multiple channels are used — email, SMS, call", unlockHint:"Map all signals before acting" } },
      { t:12, type:"activate_link", data:{ key:"final_link", duration:20 } },
      { t:20, type:"ml_check" }
    ],
    actions: [{ id:"submit", label:"Submit Full Report" }, { id:"skip", label:"Skip Final", style:"neutral" }],
    correctAction: "submit",
    hints: ["Use all previous rulesets: headers, links, vendor verification, out-of-band checks"],
    nextLevel: null,
    points: 50,
    mlCheck: { enabled: false }
  }
};
