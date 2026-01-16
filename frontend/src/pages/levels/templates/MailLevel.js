// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useProgress } from "../../../context/ProgressContext";
// import "../../../level.css";


// export default function MockMailTemplate() {
//   const { recordAction, completeLevel } = useProgress();
//   const navigate = useNavigate();

//   const [levels, setLevels] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [locked, setLocked] = useState(false);

//   const [dialog, setDialog] = useState({
//     show: false,
//     title: "",
//     message: "",
//   });

//   const [hover, setHover] = useState(false);
//  const [emailDialog, setEmailDialog] = useState(false);

//   const getSenderInitial = (email) =>
//     email ? email[0].toUpperCase() : "?";

//   const openEmailDialog = () => setEmailDialog(true);
//   /* ---------------- FETCH LEVELS ---------------- */
//   useEffect(() => {
//     async function loadLevels() {
//       try {
//         const res = await fetch(
//           `${process.env.REACT_APP_API_URL.replace(/\/$/, "")}/api/levels`
//         );

//         const text = await res.text();
//         if (!res.ok || text.startsWith("<")) {
//           throw new Error("Expected JSON, got HTML");
//         }

//         setLevels(JSON.parse(text));
//       } catch (err) {
//         console.error("Error fetching levels:", err.message);
//       }
//     }

//     loadLevels();
//   }, []);

//   if (levels.length === 0) {
//     return <div>Loading levels...</div>;
//   }

//   const level = levels[currentIndex];
//   if (!level) {
//     return <div>Level data not found.</div>;
//   }

//   const {
//     id,
//     /*page_title,*/
//     hint,
//     correct_option,
//     correct_info,
//   } = level;

//   const dummyEmails = [
//     { sender: "LinkedIn", subject: "New connection request" },
//     { sender: "Amazon", subject: "Your order has shipped" },
//     {
//       sender: level.phish_email,
//       subject: level.subj || level.page_title,
//       isCurrent: true,
//     },
//     { sender: "Netflix", subject: "Update your payment details" },
//     { sender: "Bank of America", subject: "Security alert" },
//   ];

//   /* ---------------- CORE LOGIC ---------------- */
//   const handleCheck = (option) => {
//     if (locked) return;
//     setLocked(true);

//     const isCorrect = option === correct_option;

//     recordAction(id, {
//       selected: option,
//       correct: isCorrect,
//       timestamp: Date.now(),
//     });

//     if (isCorrect) {
//       completeLevel(id);
//     }

//     setDialog({
//       show: true,
//       title: isCorrect ? "Correct!" : "Incorrect!",
//       message: `Correct Info: ${correct_info}\nHint: ${hint}`,
//     });
//   };

//   const closeDialog = () => {
//     setDialog({ ...dialog, show: false });
//     setLocked(false);

//     if (dialog.title === "Correct!") {
//       if (currentIndex < levels.length - 1) {
//         setCurrentIndex((prev) => prev + 1);
//       } else {
//         navigate("/thankyou");
//       }
//     }
//   };

// const gmailStyles = `
//   .top-bar {
//     display: flex;
//     align-items: center;
//     background-color: #ffffff;
//     padding: 10px 20px;
//     box-shadow: 0 1px 2px rgba(0,0,0,0.1);
//   }
//   .top-bar h1 {
//     font-size: 20px;
//     color: #202124;
//     margin: 0;
//     flex-grow: 1;
//     cursor: default;
//   }
//   .top-bar input {
//     padding: 5px 10px;
//     border-radius: 20px;
//     border: 1px solid #dcdcdc;
//     width: 300px;
//   }
//   .container-level {
//     display: flex;
//     height: calc(100vh - 50px);
//     background-color: #f1f3f4;
//   }
//   .sidebar-level {
//     width: 220px;
//     background-color: #ffffff;
//     padding: 20px;
//     box-shadow: 1px 0 2px rgba(0,0,0,0.1);
//   }
//   .sidebar-level button {
//     width: 100%;
//     padding: 10px;
//     margin-bottom: 10px;
//     border: none;
//     border-radius: 4px;
//     background-color: #1a73e8;
//     color: white;
//     font-weight: bold;
//     cursor: pointer;
//   }
//   .sidebar-level ul {
//     list-style: none;
//     padding: 0;
//     margin-top: 20px;
//   }
//   .sidebar-level ul li {
//     padding: 10px 5px;
//     cursor: pointer;
//     border-radius: 4px;
//     color: #333;
//   }
//   .sidebar-level ul li:hover, .sidebar-level ul li.active {
//     background-color: #e8f0fe;
//     color: #1a73e8;
//   }
//   .inbox-level {
//     flex-grow: 1;
//     display: flex;
//     flex-direction: column;
//     overflow: hidden;
//   }
//   .split-level {
//     display: flex;
//     height: 100%;
//   }
//   .email-list-level {
//     width: 350px; /* Wider to show sender/subject */
//     overflow-y: auto;
//     background-color: #ffffff;
//     border-right: 1px solid #e0e0e0;
//   }
//   .email-item-level {
//     background-color: white;
//     padding: 15px 20px;
//     border-bottom: 1px solid #e0e0e0;
//     display: block;
//     cursor: pointer;
//   }
//   .email-item-level:hover {
//     background-color: #f5f5f5;
//   }
//   .email-item-level .sender {
//     font-weight: bold;
//     color: #202124;
//   }
//   .email-item-level .subject {
//     color: #5f6368;
//     font-size: 14px;
//     white-space: nowrap;
//     overflow: hidden;
//     text-overflow: ellipsis;
//   }
//   .email-preview-level {
//     flex: 1;
//     padding: 30px;
//     background-color: white;
//     overflow-y: auto;
//   }
//   .email-header-level {
//     font-size: 24px;
//     font-weight: 400;
//     margin-bottom: 20px;
//     color: #202124;
//   }
//   .email-from-level {
//     display: flex;
//     align-items: center;
//     margin-bottom: 20px;
//     padding-bottom: 10px;
//     border-bottom: 1px solid #e0e0e0;
//   }
//   .email-from-level .avatar {
//     background-color: #fbbc04;
//     color: white;
//     border-radius: 50%;
//     width: 40px;
//     height: 40px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     font-size: 18px;
//     font-weight: bold;
//     margin-right: 15px;
//   }
//   .email-from-level .info p {
//     margin: 0;
//     line-height: 1.4;
//   }
//   .email-from-level .info strong {
//     font-weight: bold;
//     color: #202124;
//   }
//   .email-from-level .info span {
//     font-size: 12px;
//     color: #5f6368;
//   }
//   .email-content-level {
//     line-height: 1.8;
//     color: #333;
//     white-space: pre-wrap; /* To respect line breaks in level_text */
//   }
//   .level-actions-container {
//     padding: 20px 0;
//     border-top: 1px solid #e0e0e0;
//     margin-top: 20px;
//     text-align: center;
//   }
//   .level-actions-container button {
//     margin: 0 10px;
//     padding: 10px 20px;
//     font-size: 16px;
//   }
//   /* Original dialog styles from level.css are assumed to handle the dialog-overlay/box */`;
//   return (
//     <>
//       {/* Inject custom styles */}
//       <style>{gmailStyles}</style>

//       <div style={{ padding: "10px", background: "#fff" }}>
//         <button
//           onClick={() => navigate("/dashboard")}
//           style={{
//             background: "#444",
//             color: "white",
//             padding: "8px 14px",
//             borderRadius: "6px",
//             border: "none",
//           }}
//         >
//           ← Back to Dashboard
//         </button>
//       </div>

//       {/* TOP BAR */}
//   <div className="container-level">
//         <div className="sidebar-level">
//           <button>Compose</button>
//           <ul>
//             <li className="active">Inbox</li>
//             <li>Starred</li>
//             <li>Sent</li>
//             <li>Drafts</li>
//             <li>Trash</li>
//           </ul>
//         </div>

//         <div className="inbox-level">
//           <div className="split-level">
//             <div className="email-list-level">
//               {dummyEmails.map((email, index) => (
//                 <div
//                   key={index}
//                   className="email-item-level"
//                   style={
//                     email.isCurrent
//                       ? { backgroundColor: "#e8f0fe" }
//                       : {}
//                   }
//                 >
//                   <div className="sender">{email.sender}</div>
//                   <div className="subject">{email.subject}</div>
//                 </div>
//               ))}
//             </div>

//            <div className="email-preview-level">
//               <div className="email-header-level">
//                 {/*level.subj || level.page_title*/}
//               </div>
              
//               <div className="email-from-level">
//                 <div className="avatar">
//                   {/*getSenderInitial(level.phish_email)*/}
//                 </div>
//                 <div className="info">
//                   <strong>{level.phish_email}</strong>
//                   <span
//                     onMouseEnter={() => setHover(true)}
//                     onMouseLeave={() => setHover(false)}
//                     style={{
//                       marginLeft: "10px",
//                       cursor: "pointer",
//                       color: hover ? "red" : "gray",
//                       fontSize: "12px",
//                     }}
//                   >
//                     {hover ? level.crct_email : "Show details"}
//                   </span>
//                 </div>
//               </div>

//               <div className="email-content-level">
//                 {level.level_text}
//               </div>

//               <div className="level-actions-container">
//                 <button
//                   className="btn correct"
//                   disabled={locked}
//                   onClick={() => handleCheck(level.correct_option)}
//                 >
//                   {level.correct_option}
//                 </button>

//                 <button
//                   className="btn neutral"
//                   disabled={locked}
//                   onClick={() => handleCheck(level.neutral_option)}
//                 >
//                   {level.neutral_option}
//                 </button>

//                 <button
//                   className="btn wrong"
//                   disabled={locked}
//                   onClick={() => handleCheck(level.wrong_option)}
//                 >
//                   {level.wrong_option}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {dialog.show && (
//         <div className="dialog-overlay">
//           <div className="dialog-box">
//             <h3>{dialog.title}</h3>
//             <pre className="dialog-message">{dialog.message}</pre>
//             <button className="dialog-close" onClick={closeDialog}>
//               Continue
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }