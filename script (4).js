'use strict';
/* =====================================================================
   Basic Computer Skills for Rural School Students
   Single-page website (hash routing). All data is stored in the browser
   (localStorage) so it works on GitHub Pages with no server.
   ===================================================================== */

/* ---------------- helpers ---------------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const LS = {
  get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage full or blocked */ } }
};
const K = { users: 'bcs_users', session: 'bcs_session', prog: 'bcs_progress', att: 'bcs_attempts', typing: 'bcs_typing', fb: 'bcs_feedback', last: 'bcs_last' };
const mmss = s => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(Math.floor(s % 60)).padStart(2, '0');
const fmtDate = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
const ordinal = n => { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };
const app = html => { $('#app').innerHTML = html; };
const user = () => LS.get(K.session, null);
const who = () => user() || 'Guest';
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => t.hidden = true, 2600); }

/* ---------------- course content ---------------- */
// lesson = [title, icon, paragraph, [[bold, text], ...], key-points heading]
const LEVELS = [
  {
    id: 1, short: 'Basics', name: 'Quiz 1 – Computer Basics', color: '#1e7bf2', icon: '🖥️',
    desc: 'Understand the computer, its parts and how it works.',
    lessons: [
      ['What is a Computer', '🖥️', 'A computer is an electronic device that helps us to do many tasks. It can store information, process data and give us results.', [['Monitor', 'shows the output.'], ['Keyboard', 'helps us type.'], ['Mouse', 'helps us click and move.'], ['CPU', 'works like the brain.']], 'Main Parts of a Computer'],
      ['Parts of a Computer', '🧩', 'A computer has two kinds of parts. Hardware is what we can touch. Software is the set of programs that tell the hardware what to do.', [['Hardware', 'parts we can touch, like the monitor and mouse.'], ['Software', 'programs and apps, like games and Word.'], ['Speaker', 'gives us sound.'], ['Printer', 'prints on paper.']], 'Hardware and Software'],
      ['Input and Output Devices', '🎙️', 'We give information to the computer with input devices. The computer shows us results with output devices.', [['Input devices', 'keyboard, mouse, microphone.'], ['Output devices', 'monitor, printer, speaker.'], ['Both', 'a touch screen can do input and output.']], 'Input and Output'],
      ['The Desktop', '🗂️', 'The Desktop is the main screen you see when the computer starts. It is like the top of your study table.', [['Icons', 'small pictures that open programs and files.'], ['Taskbar', 'the bar at the bottom that shows open programs.'], ['Start button', 'opens the menu of programs.'], ['Recycle Bin', 'keeps deleted files.']], 'Parts of the Desktop']
    ],
    quiz: [
      ['Which device shows the output?', ['Monitor', 'Keyboard', 'Mouse', 'Microphone'], 0],
      ['The brain of the computer is the…', ['Mouse', 'Printer', 'CPU', 'Speaker'], 2],
      ['Which one is an input device?', ['Printer', 'Keyboard', 'Monitor', 'Speaker'], 1],
      ['Parts of a computer that we can touch are called…', ['Software', 'Hardware', 'Apps', 'Files'], 1],
      ['Which device prints on paper?', ['Scanner', 'Printer', 'Mouse', 'Monitor'], 1],
      ['The main screen when the computer starts is the…', ['Desktop', 'Folder', 'Browser', 'Window'], 0],
      ['Which device helps us click and move the pointer?', ['Keyboard', 'Mouse', 'Speaker', 'Printer'], 1],
      ['Programs that tell the computer what to do are…', ['Hardware', 'Cables', 'Software', 'Screens'], 2],
      ['Which one is an output device?', ['Microphone', 'Mouse', 'Speaker', 'Keyboard'], 2],
      ['The bar at the bottom of the Desktop is the…', ['Taskbar', 'Menu bar', 'Title bar', 'Scroll bar'], 0]
    ]
  },
  {
    id: 2, short: 'Typing', name: 'Quiz 2 – Typing Skills', color: '#27a060', icon: '⌨️',
    desc: 'Learn to type faster and more accurately.',
    lessons: [
      ['Home Row Keys', '⌨️', 'The home row is the middle row of letter keys. Your fingers rest here, and they return here after every key you press.', [['Left hand', 'A S D F'], ['Right hand', 'J K L ;'], ['Bumps', 'small bumps on F and J help you find the home row.'], ['Thumbs', 'rest on the space bar.']], 'Where fingers rest'],
      ['Sitting and Hand Position', '🪑', 'Good posture helps you type longer without getting tired. Sit comfortably and keep your hands relaxed.', [['Back', 'sit straight.'], ['Feet', 'keep them flat on the floor.'], ['Wrists', 'keep them level, do not rest them hard on the table.'], ['Eyes', 'look at the screen, not at your fingers.']], 'Good Posture'],
      ['Top and Bottom Rows', '🔤', 'The top row (Q W E R T Y) and the bottom row (Z X C V B N M) are reached by moving the nearest finger up or down and then back home.', [['Top row', 'Q W E R T Y U I O P'], ['Bottom row', 'Z X C V B N M'], ['Shift', 'makes capital letters.'], ['Enter', 'moves to the next line.']], 'Reaching the Keys'],
      ['Typing Tips', '💡', 'Speed comes from practice. First type correctly, then slowly type faster.', [['Accuracy first', 'correct typing is better than fast typing.'], ['Touch typing', 'typing without looking at the keys.'], ['Backspace', 'erases the letter on the left.'], ['Practice daily', 'even 10 minutes a day helps a lot.']], 'Tips to Improve']
    ],
    quiz: [
      ['The left-hand home row keys are…', ['A S D F', 'Q W E R', 'Z X C V', '1 2 3 4'], 0],
      ['Which finger rests on the space bar?', ['Little finger', 'Thumb', 'Ring finger', 'Index finger'], 1],
      ['Typing without looking at the keys is called…', ['Fast clicking', 'Copying', 'Touch typing', 'Scrolling'], 2],
      ['What should you focus on first when learning to type?', ['Speed', 'Accuracy', 'Noise', 'Colour'], 1],
      ['The small bumps are found on which keys?', ['A and S', 'K and L', 'Q and P', 'F and J'], 3],
      ['Good posture means sitting…', ['Bent over', 'Straight with feet flat on the floor', 'Lying down', 'On the table'], 1],
      ['Which key makes a capital letter?', ['Shift', 'Enter', 'Tab', 'Delete'], 0],
      ['Which key moves the cursor to the next line?', ['Space bar', 'Esc', 'Enter', 'Shift'], 2],
      ['Which key erases the letter to the left?', ['Backspace', 'Enter', 'Tab', 'Caps Lock'], 0],
      ['Typing speed is measured in…', ['Pages per hour', 'Letters per day', 'Keys per page', 'Words per minute'], 3]
    ]
  },
  {
    id: 3, short: 'Files & Folders', name: 'Quiz 3 – Files & Folders', color: '#7a4be0', icon: '📁',
    desc: 'Create, save and organise your files and folders.',
    lessons: [
      ['What is a File', '📄', 'A file is a piece of work saved on the computer. It can be a letter, a photo, a song or a video.', [['Document', 'a letter or homework, for example .docx'], ['Picture', 'a photo, for example .jpg'], ['Music', 'a song, for example .mp3'], ['File name', 'every file has its own name.']], 'Kinds of Files'],
      ['What is a Folder', '📁', 'A folder is like a cupboard drawer. It keeps related files together so we can find them easily.', [['Folder', 'a place to keep files.'], ['Subfolder', 'a folder inside another folder.'], ['Example', 'a folder called School can hold Maths and Science folders.']], 'Keeping Things Tidy'],
      ['Create, Rename and Delete', '✏️', 'Right-click is the quickest way to manage files. Think before you delete!', [['New folder', 'right-click on empty space, then New, then Folder.'], ['Rename', 'right-click the item and choose Rename.'], ['Delete', 'select the item and press Delete. It goes to the Recycle Bin.']], 'Simple Steps'],
      ['Copy, Cut and Paste', '📋', 'Use these tricks to copy or move your files from one place to another.', [['Copy', 'Ctrl + C makes a copy.'], ['Cut', 'Ctrl + X moves the file.'], ['Paste', 'Ctrl + V puts it in the new place.'], ['Undo', 'Ctrl + Z takes back your last action.']], 'Keyboard Shortcuts']
    ],
    quiz: [
      ['Which is used to keep files organised?', ['Folder', 'Mouse', 'Printer', 'Speaker'], 0],
      ['A file ending in .jpg is usually a…', ['Song', 'Picture', 'Document', 'Game'], 1],
      ['Which shortcut copies a file?', ['Ctrl + V', 'Ctrl + X', 'Ctrl + C', 'Ctrl + Z'], 2],
      ['Ctrl + V does what?', ['Copy', 'Cut', 'Delete', 'Paste'], 3],
      ['Which action moves a file instead of copying?', ['Copy', 'Cut', 'Rename', 'Print'], 1],
      ['How do you rename a file?', ['Unplug the computer', 'Close the screen', 'Right-click and choose Rename', 'Press the power button'], 2],
      ['Where do deleted files go first?', ['Recycle Bin', 'Desktop', 'Taskbar', 'Start menu'], 0],
      ['A folder inside another folder is called a…', ['Virus', 'Icon', 'Shortcut', 'Subfolder'], 3],
      ['A file ending in .docx is a…', ['Song', 'Word document', 'Picture', 'Game'], 1],
      ['Which shortcut undoes your last action?', ['Ctrl + Z', 'Ctrl + P', 'Ctrl + S', 'Ctrl + A'], 0]
    ]
  },
  {
    id: 4, short: 'MS Word', name: 'Quiz 4 – MS Word Basics', color: '#f58220', icon: '📝',
    desc: 'Write and format simple documents in MS Word.',
    lessons: [
      ['Opening MS Word', '📝', 'Microsoft Word is a program used to write letters, essays and reports. Open it from the Start menu or a desktop icon.', [['Blank document', 'an empty page to start writing.'], ['Ribbon', 'the strip of buttons at the top.'], ['Cursor', 'the blinking line that shows where you type.']], 'Getting Started'],
      ['Typing and Editing', '⌨️', 'Click on the page and start typing. You can fix mistakes easily without rewriting the whole page.', [['Select', 'drag the mouse over words to select them.'], ['Delete', 'press Delete or Backspace to remove text.'], ['Undo', 'Ctrl + Z brings back your last change.'], ['Select all', 'Ctrl + A selects everything.']], 'Editing Text'],
      ['Formatting Text', '🎨', 'Formatting makes your work look neat and clear. Select the text first, then press a button.', [['Bold', 'B or Ctrl + B makes text thick.'], ['Italic', 'I or Ctrl + I slants the text.'], ['Underline', 'U or Ctrl + U draws a line under it.'], ['Font size', 'makes letters bigger or smaller.'], ['Align', 'left, centre or right.']], 'Formatting Buttons'],
      ['Saving and Printing', '💾', 'Always save your work so it does not get lost.', [['Save', 'Ctrl + S saves the file.'], ['File name', 'give it a clear name like MyEssay.'], ['Print', 'Ctrl + P opens the print window.'], ['Close', 'close Word after saving.']], 'Save Your Work']
    ],
    quiz: [
      ['MS Word is mainly used to…', ['Play videos', 'Write documents', 'Draw maps only', 'Browse the web'], 1],
      ['Which button makes text thick?', ['Italic', 'Underline', 'Bold', 'Align'], 2],
      ['Which button slants the text?', ['Italic', 'Bold', 'Copy', 'Paste'], 0],
      ['Which shortcut saves a file?', ['Ctrl + P', 'Ctrl + S', 'Ctrl + C', 'Ctrl + N'], 1],
      ['Which shortcut prints a file?', ['Ctrl + Z', 'Ctrl + X', 'Ctrl + V', 'Ctrl + P'], 3],
      ['A Word file usually ends with…', ['.docx', '.mp3', '.jpg', '.exe'], 0],
      ['What do you change to make letters bigger?', ['Font colour', 'Font size', 'Page colour', 'Volume'], 1],
      ['Which shortcut underlines selected text?', ['Ctrl + B', 'Ctrl + I', 'Ctrl + U', 'Ctrl + S'], 2],
      ['Which alignment puts text in the middle?', ['Left', 'Right', 'Justify', 'Centre'], 3],
      ['Ctrl + Z does what?', ['Undoes the last action', 'Saves', 'Prints', 'Closes Word'], 0]
    ]
  },
  {
    id: 5, short: 'Internet', name: 'Quiz 5 – Internet Basics', color: '#12a4b8', icon: '🌐',
    desc: 'Explore the internet, search and stay safe online.',
    lessons: [
      ['What is the Internet', '🌐', 'The internet is a worldwide network of computers that are connected to each other. It lets us share information very quickly.', [['Network', 'many computers joined together.'], ['Wi-Fi', 'a wireless way to join the internet.'], ['Uses', 'learning, news, videos and talking to others.']], 'Understanding the Internet'],
      ['Browsers and Websites', '🧭', 'A browser is a program that lets us visit websites. Every website has a unique address called a URL.', [['Browser', 'Chrome, Edge, Firefox.'], ['Website', 'a collection of web pages.'], ['URL', 'the address of a website, like www.example.com.'], ['Address bar', 'type the URL here.']], 'Browsing the Web'],
      ['Searching for Information', '🔍', 'A search engine helps us find answers. Type a few clear words, called keywords, and press Enter.', [['Search engine', 'Google, Bing.'], ['Keywords', 'short, clear words, like "rice farming tips".'], ['Check', 'always read more than one result.'], ['Source', 'trust websites of schools, government and news.']], 'Search Smartly'],
      ['Safe Browsing', '🔒', 'Not everything on the internet is true or safe. Learn simple rules to protect yourself.', [['https', 'a padlock and https show a secure site.'], ['Downloads', 'download only from trusted sites.'], ['Pop-ups', 'do not click strange pop-up ads.'], ['Ask', 'if unsure, ask a teacher or parent.']], 'Safe Habits']
    ],
    quiz: [
      ['Which program is used to browse the web?', ['Browser', 'Calculator', 'Paint', 'Notepad'], 0],
      ['Which one is a web browser?', ['Word', 'Excel', 'Chrome', 'Paint'], 2],
      ['The address of a website is called a…', ['Folder', 'URL', 'File', 'Icon'], 1],
      ['Which is a search engine?', ['Google', 'Keyboard', 'Printer', 'Windows'], 0],
      ['A safe website address usually starts with…', ['ftp', 'abc', 'http only', 'https'], 3],
      ['The internet is a…', ['Single computer', 'Printer', 'Worldwide network of computers', 'Type of keyboard'], 2],
      ['Words we type to search are called…', ['Keywords', 'Icons', 'Folders', 'Cables'], 0],
      ['Wi-Fi is a…', ['Wired mouse', 'Type of paper', 'Computer game', 'Wireless internet connection'], 3],
      ['Before trusting information online, check the…', ['Colour of the page', 'Source', 'Font', 'Mouse'], 1],
      ['Downloading means…', ['Copying a file from the internet to your device', 'Deleting a file', 'Printing a page', 'Turning off Wi-Fi'], 0]
    ]
  },
  {
    id: 6, short: 'Email', name: 'Quiz 6 – Email Basics', color: '#e0508a', icon: '✉️',
    desc: 'Send and receive emails with confidence.',
    lessons: [
      ['What is Email', '✉️', 'Email means electronic mail. It is a fast way to send letters, photos and files to anyone in the world.', [['Fast', 'arrives in seconds.'], ['Free', 'many email services cost nothing.'], ['Address', 'every person has their own email address.']], 'Why Email?'],
      ['Your Email Address', '📧', 'An email address has a name, an @ symbol and a service name, like name@example.com.', [['Name', 'your username.'], ['@', 'read as "at".'], ['Password', 'keep it secret and strong.']], 'Parts of an Address'],
      ['Writing and Sending', '📤', 'To send an email, fill in the boxes and press Send.', [['To', 'the person you are writing to.'], ['Subject', 'a short title for your email.'], ['Body', 'the message itself.'], ['Send', 'check everything, then press Send.']], 'Steps to Send'],
      ['Inbox, Reply and Attach', '📥', 'Emails you receive appear in your Inbox. You can reply or send a file along with your message.', [['Inbox', 'where new emails arrive.'], ['Reply', 'answers the sender.'], ['Attachment', 'a file sent with an email.'], ['Spam', 'unwanted junk email. Do not open it.']], 'Managing Email']
    ],
    quiz: [
      ['Email stands for…', ['Electric mail', 'Electronic mail', 'Easy mail', 'Express mail'], 1],
      ['Which symbol is in every email address?', ['#', '&', '@', '%'], 2],
      ['Where do new emails arrive?', ['Inbox', 'Outbox', 'Desktop', 'Taskbar'], 0],
      ['The Subject line is…', ['Your password', 'A short title of the email', 'The sender name', 'A photo'], 1],
      ['A file sent along with an email is an…', ['Icon', 'Attachment', 'Address', 'Folder'], 1],
      ['Reply is used to…', ['Delete the email', 'Print the email', 'Answer the sender', 'Close the browser'], 2],
      ['Spam means…', ['Important mail', 'Unwanted junk email', 'A new password', 'A photo'], 1],
      ['Which is a correct email address?', ['name.example.com', 'name@example.com', 'name@@com', 'www.name'], 1],
      ['Before pressing Send you should check the…', ['Address and message', 'Keyboard colour', 'Room light', 'Mouse'], 0],
      ['You should NOT open attachments from…', ['Your teacher', 'Your parents', 'Unknown senders', 'Your school'], 2]
    ]
  },
  {
    id: 7, short: 'Cyber Safety', name: 'Quiz 7 – Cyber Safety', color: '#d64545', icon: '🛡️',
    desc: 'Protect yourself and your information online.',
    lessons: [
      ['Strong Passwords', '🔑', 'A password is the key to your account. A strong password is hard for others to guess.', [['Long', 'use at least 8 characters.'], ['Mixed', 'use letters, numbers and symbols.'], ['Secret', 'never share it with friends.'], ['Different', 'use a different password for each account.']], 'Make it Strong'],
      ['Protect Your Information', '🪪', 'Some details are private. Never post them online or tell them to strangers.', [['Private', 'home address, phone number, school name.'], ['Photos', 'think before you share a photo.'], ['Log out', 'always log out on a shared computer.']], 'Keep it Private'],
      ['Fake Messages and Scams', '🎣', 'Scammers send fake messages to trick people. This is called phishing.', [['Prize', 'a message saying "You won money!" is usually fake.'], ['Bank details', 'never give OTP or bank details.'], ['Links', 'do not click unknown links.'], ['Tell', 'show the message to a parent or teacher.']], 'Spot the Trick'],
      ['Be Kind Online', '🤝', 'Treat people online the way you want to be treated. If someone is unkind or scary, you are not alone.', [['Respect', 'write kind words only.'], ['Bullying', 'do not reply. Save proof and tell a trusted adult.'], ['Strangers', 'never meet an online friend alone.'], ['Antivirus', 'helps protect the computer from viruses.']], 'Online Kindness']
    ],
    quiz: [
      ['A strong password has…', ['Only your name', 'Letters, numbers and symbols', 'Only 1234', 'Your phone number'], 1],
      ['With whom can you share your password?', ['Any friend', 'Anyone online', 'Only a trusted parent or guardian', 'A stranger'], 2],
      ['A message says you won a prize and asks for bank details. You should…', ['Send the details', 'Ignore it and tell an adult', 'Reply fast', 'Forward to friends'], 1],
      ['Phishing means…', ['Fishing in a river', 'Fake messages that steal information', 'Typing fast', 'Cleaning a screen'], 1],
      ['If someone bullies you online you should…', ['Bully back', 'Tell a trusted adult', 'Hide it forever', 'Delete the computer'], 1],
      ['After using a public computer you should…', ['Leave it logged in', 'Log out', 'Save your password', 'Turn off the light'], 1],
      ['Which is private information?', ['Your favourite colour', 'Your home address', 'Your favourite fruit', 'The weather'], 1],
      ['A padlock and https in the address show a…', ['Secure connection', 'Broken page', 'Virus', 'Slow internet'], 0],
      ['Antivirus software…', ['Plays music', 'Protects the computer from viruses', 'Prints pages', 'Types for you'], 1],
      ['A stranger online asks to meet you. You should…', ['Go alone', 'Refuse and tell an adult', 'Give your address', 'Send a photo'], 1]
    ]
  },
  {
    id: 8, short: 'Final Challenge', name: 'Quiz 8 – Final Challenge', color: '#e6a100', icon: '👑',
    desc: 'Test everything you have learned and win the crown.',
    lessons: [
      ['How the Challenge Works', '🎯', 'The Final Challenge has 10 mixed questions from all the levels. Take your time and read each question carefully.', [['10 questions', 'one point for each correct answer.'], ['Mixed topics', 'computer, typing, files, Word, internet, email and safety.'], ['Goal', 'score 80% or more to become a Champion.']], 'Rules'],
      ['Revise: Computer, Typing, Files', '🔁', 'Remember the parts of a computer, the home row keys and how to copy, cut and paste.', [['Computer', 'monitor, keyboard, mouse, CPU.'], ['Typing', 'home row is A S D F and J K L ;'], ['Files', 'Ctrl + C copy, Ctrl + X cut, Ctrl + V paste.']], 'Quick Revision 1'],
      ['Revise: Word, Internet, Email', '🔁', 'Remember the Word shortcuts, how to search safely and how to write an email.', [['Word', 'Ctrl + S saves, Ctrl + B bold.'], ['Internet', 'browser, URL, search engine, keywords.'], ['Email', 'To, Subject, Body, Send.']], 'Quick Revision 2'],
      ['Revise: Stay Safe', '🛡️', 'Stay safe online by keeping passwords secret and thinking before you click.', [['Passwords', 'long, mixed and secret.'], ['Scams', 'do not trust prizes or unknown links.'], ['Help', 'always tell a trusted adult.']], 'Quick Revision 3']
    ],
    quiz: [
      ['Which device is the brain of the computer?', ['CPU', 'Mouse', 'Printer', 'Monitor'], 0],
      ['Which keys are on the left-hand home row?', ['Q W E R', 'Z X C V', 'A S D F', '1 2 3 4'], 2],
      ['Which shortcut pastes a file?', ['Ctrl + C', 'Ctrl + V', 'Ctrl + X', 'Ctrl + S'], 1],
      ['Which shortcut saves a Word document?', ['Ctrl + P', 'Ctrl + B', 'Ctrl + Z', 'Ctrl + S'], 3],
      ['A web address is called a…', ['URL', 'File', 'Folder', 'Icon'], 0],
      ['Which symbol is used in an email address?', ['#', '$', '@', '%'], 2],
      ['A strong password should be…', ['Short and simple', 'Long and mixed', 'Your name', 'Shared with friends'], 1],
      ['Fake messages that try to steal information are called…', ['Phishing', 'Typing', 'Browsing', 'Printing'], 0],
      ['Which one is an output device?', ['Keyboard', 'Mouse', 'Microphone', 'Monitor'], 3],
      ['If someone is unkind to you online, you should…', ['Reply angrily', 'Tell a trusted adult', 'Ignore it forever', 'Share your password'], 1]
    ]
  }
];
LEVELS.forEach(L => {
  L.lessons = L.lessons.map(([t, icon, p, kp, kpt]) => ({ t, icon, p, kp, kpt }));
  L.lessons.push(L.id === 2
    ? { t: 'Typing Practice', icon: '⌨️', type: 'typing' }
    : { t: L.id === 8 ? 'Final Quiz' : 'Practice Quiz', icon: '📋', type: 'quiz' });
});

const PASSAGES = [
  'Technology helps us learn and grow. Small steps make big dreams come true.',
  'A computer has a monitor, a keyboard, a mouse and a CPU. We use them every day to learn.',
  'Practice every day and your typing speed will grow. Be patient and keep going.',
  'The internet helps us find information. Always stay safe and never share your password.'
];

/* ---------------- progress, XP, badges ---------------- */
function getProg(u = who()) { return (LS.get(K.prog, {})[u]) || {}; }
function markLesson(levelId, n) {
  const all = LS.get(K.prog, {}); const u = who();
  all[u] = all[u] || {}; const arr = all[u][levelId] || [];
  if (!arr.includes(n)) { arr.push(n); all[u][levelId] = arr; LS.set(K.prog, all); }
}
function bestWpm(u = who()) { return Math.max(0, ...LS.get(K.typing, []).filter(t => t.user === u).map(t => t.wpm)); }
function stats(u = who()) {
  const prog = getProg(u);
  const att = LS.get(K.att, []).filter(a => a.user === u);
  const bestBy = {};
  att.forEach(a => { bestBy[a.level] = Math.max(bestBy[a.level] || 0, a.correct); });
  const lessons = Object.values(prog).reduce((s, a) => s + a.length, 0);
  const fullLevels = Object.values(prog).filter(a => a.length >= 5).length;
  const pct = lv => bestBy[lv] != null ? bestBy[lv] * 10 : 0;
  const best = Math.max(0, ...att.map(a => Math.round(a.correct / a.total * 100)));
  const wpm = bestWpm(u);
  const xp = lessons * 5 + Object.values(bestBy).reduce((s, v) => s + v * 10, 0) + wpm * 2;
  const topLevel = Math.max(1, ...Object.keys(prog).map(Number), ...att.map(a => a.level));
  const avg = att.length ? Math.round(att.reduce((s, a) => s + a.correct / a.total * 100, 0) / att.length) : 0;
  return { prog, att, lessons, fullLevels, best, wpm, xp, topLevel, avg, safe: pct(7), final: pct(8) };
}
const BADGES = [
  { ico: '🌱', name: 'First Steps', desc: 'Finish your first lesson', t: s => s.lessons >= 1 },
  { ico: '📝', name: 'Quiz Starter', desc: 'Take your first quiz', t: s => s.att.length >= 1 },
  { ico: '🌟', name: 'High Scorer', desc: 'Score 80% or more in a quiz', t: s => s.best >= 80 },
  { ico: '🏆', name: 'Perfect 10', desc: 'Score 100% in a quiz', t: s => s.best >= 100 },
  { ico: '⌨️', name: 'Speedy Typist', desc: 'Type 20 words per minute', t: s => s.wpm >= 20 },
  { ico: '🎓', name: 'Level Master', desc: 'Finish all lessons of a level', t: s => s.fullLevels >= 1 },
  { ico: '🛡️', name: 'Safe Surfer', desc: 'Score 70% in Cyber Safety quiz', t: s => s.safe >= 70 },
  { ico: '👑', name: 'Champion', desc: 'Score 80% in the Final Challenge', t: s => s.final >= 80 }
];
const earned = (u = who()) => { const s = stats(u); return BADGES.filter(b => b.t(s)).map(b => b.name); };
const rankTitle = xp => xp < 50 ? 'Beginner' : xp < 150 ? 'Explorer' : xp < 300 ? 'Achiever' : 'Digital Star';
const badgesHTML = () => { const e = earned(); return `<div class="badges">${BADGES.map(b => `<span class="badge ${e.includes(b.name) ? '' : 'off'}" title="${esc(b.name)} – ${esc(b.desc)}">${b.ico}</span>`).join('')}</div>`; };

/* ---------------- illustrations (original, inline SVG) ---------------- */
function girlSVG() {
  return `<svg viewBox="0 0 340 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A smiling student using a laptop">
  <ellipse cx="170" cy="280" rx="160" ry="7" fill="#0002"/>
  <rect x="4" y="232" width="332" height="16" rx="6" fill="#b9733b"/><rect x="18" y="248" width="304" height="30" fill="#8f5527"/>
  <path d="M104 96 q-26 40 -16 104 q2 14 -2 28" stroke="#15151f" stroke-width="15" fill="none" stroke-linecap="round"/>
  <path d="M96 220 l-10 12 M92 220 l-12 8" stroke="#e8a21a" stroke-width="5" stroke-linecap="round"/>
  <path d="M96 232 V150 q0 -26 30 -30 h50 q30 4 30 30 v82z" fill="#fff"/>
  <path d="M112 232 V164 h78 v68z" fill="#2c5db0"/><rect x="118" y="132" width="12" height="38" rx="3" fill="#2c5db0"/><rect x="172" y="132" width="12" height="38" rx="3" fill="#2c5db0"/>
  <path d="M138 122 l13 16 l13 -16z" fill="#fff" stroke="#dfe6f2" stroke-width="1.5"/>
  <rect x="138" y="104" width="26" height="24" rx="6" fill="#e9a57c"/>
  <circle cx="151" cy="80" r="35" fill="#f5b891"/>
  <path d="M115 84 a36 36 0 0 1 72 0 q-6 -20 -22 -24 q-20 8 -42 6 q-6 6 -8 18z" fill="#15151f"/>
  <path d="M116 80 q2 -20 20 -28" stroke="#15151f" stroke-width="8" fill="none" stroke-linecap="round"/>
  <ellipse cx="139" cy="86" rx="3.2" ry="4" fill="#2a1a12"/><ellipse cx="166" cy="86" rx="3.2" ry="4" fill="#2a1a12"/>
  <path d="M141 99 q11 11 23 0" stroke="#b5563a" stroke-width="3" fill="#fff" stroke-linecap="round"/>
  <circle cx="132" cy="97" r="6" fill="#f08f8f" opacity=".4"/><circle cx="173" cy="97" r="6" fill="#f08f8f" opacity=".4"/>
  <path d="M184 150 L226 208" stroke="#fff" stroke-width="22" stroke-linecap="round"/>
  <circle cx="230" cy="212" r="11" fill="#f5b891"/>
  <path d="M214 232 l8 -78 q1 -8 9 -8 h82 q8 0 8 8 l-4 78z" fill="#4e5f86"/>
  <path d="M224 226 l7 -68 h72 l-4 68z" fill="#9bcaff"/>
  <path d="M236 176 h40 M236 190 h56 M236 204 h30" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/>
  <rect x="200" y="230" width="140" height="9" rx="4" fill="#a7b1c6"/>
  <g transform="translate(28 190)"><rect x="0" y="22" width="26" height="22" rx="4" fill="#243a7a"/><rect x="6" y="2" width="4" height="24" fill="#2f9e6a"/><rect x="13" y="6" width="4" height="20" fill="#f58220"/><rect x="20" y="0" width="4" height="26" fill="#1e7bf2"/></g>
  <rect x="42" y="220" width="52" height="12" rx="2" fill="#1e7bf2"/><rect x="46" y="212" width="46" height="9" rx="2" fill="#7a4be0"/>
</svg>`;
}
function computerSVG() {
  return `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A desktop computer">
  <rect x="150" y="60" width="62" height="110" rx="6" fill="#3b4256"/><rect x="160" y="74" width="42" height="8" rx="2" fill="#222a3b"/><rect x="160" y="90" width="42" height="8" rx="2" fill="#222a3b"/><circle cx="181" cy="138" r="7" fill="#4aa3ff"/>
  <rect x="30" y="20" width="132" height="94" rx="8" fill="#2d3550"/><rect x="38" y="28" width="116" height="78" rx="3" fill="#3c9bff"/>
  <path d="M38 80 q30 -30 58 -8 t58 -10 v36 h-116z" fill="#ffffff33"/>
  <rect x="88" y="114" width="16" height="24" fill="#2d3550"/><rect x="66" y="136" width="60" height="9" rx="4" fill="#2d3550"/>
  <rect x="42" y="156" width="118" height="22" rx="5" fill="#2d3550"/>
  <path d="M52 164 h98 M52 170 h98" stroke="#7c87a8" stroke-width="3" stroke-dasharray="6 3"/>
  <ellipse cx="196" cy="176" rx="12" ry="9" fill="#2d3550"/>
  <path d="M232 70 l14 -6 M236 100 l16 0 M232 130 l14 6" stroke="#2b6cff" stroke-width="3" stroke-linecap="round"/>
  <path d="M22 70 l-12 -4 M20 100 l-14 0" stroke="#2b6cff" stroke-width="3" stroke-linecap="round"/>
</svg>`;
}
const girlCheer = () => girlSVG();

/* ---------------- router ---------------- */
let cleanup = null;
const VIEWS = {};
function route() {
  if (cleanup) { try { cleanup(); } catch { /* ignore */ } cleanup = null; }
  const [page, ...args] = (location.hash.replace(/^#\/?/, '') || 'home').split('/');
  const view = VIEWS[page] || VIEWS.home;
  const navKey = { level: 'levels', result: 'quiz' }[page] || page;
  $$('#nav a').forEach(a => a.classList.toggle('on', a.dataset.nav === navKey));
  $('#nav').classList.remove('open');
  view(...args);
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);
const go = h => { location.hash = h; };

/* ---------------- reusable pieces ---------------- */
function levelCard(L) {
  const done = (getProg()[L.id] || []).length;
  return `<div class="lvl-card" style="--c:${L.color}">
    <div class="lvl-top"><div class="num" style="--c:${L.color}">${L.id}</div><h3>Level ${L.id} – ${esc(L.short)}</h3></div>
    <p>${esc(L.desc)}</p>
    <div class="bar" style="--c:${L.color}"><i style="width:${done / 5 * 100}%"></i></div>
    <small>${done} of 5 lessons done</small>
    <a class="btn btn-c" style="--c:${L.color}" href="#/level/${L.id}/${Math.min(done + 1, 5)}">${done ? 'Continue' : 'Start'} Level ${L.id} →</a>
  </div>`;
}

/* ---------------- HOME ---------------- */
VIEWS.home = () => {
  app(`
  <section class="hero">
    <div>
      <div class="tag">LEARN &nbsp;•&nbsp; PRACTICE &nbsp;•&nbsp; GROW</div>
      <h1>Basic Computer Skills<br><span>for Rural School Students</span></h1>
      <p>Build your digital skills, gain confidence and create a brighter future with simple, step-by-step computer lessons designed just for you.</p>
      <a class="btn btn-primary" href="#/level/1/1">Start Learning &nbsp;→</a>
    </div>
    <div class="hero-art"><div class="script">Small<br>Steps<br>Big Dreams</div>${girlSVG()}</div>
  </section>
  <section class="card features">
    <div class="feat"><div class="ico" style="background:#dcecff">🖥️</div><div><h4>Easy Learning</h4><p>Simple language and step-by-step lessons.</p></div></div>
    <div class="feat"><div class="ico" style="background:#d6f3e3">⚙️</div><div><h4>Hands-on Practice</h4><p>Try what you learn with interactive exercises.</p></div></div>
    <div class="feat"><div class="ico" style="background:#fff0b8">📋</div><div><h4>Quick Quizzes</h4><p>Test your knowledge and track your progress.</p></div></div>
    <div class="feat"><div class="ico" style="background:#e7dcff">🏆</div><div><h4>Earn Rewards</h4><p>Collect XP and badges. Climb the leaderboard!</p></div></div>
    <div class="feat"><div class="ico" style="background:#ffd9e6">👩‍🎓</div><div><h4>For Rural Students</h4><p>Bridging the digital divide and opening new opportunities.</p></div></div>
  </section>
  <h2 class="sec-title">Learning Levels</h2>
  <p class="sec-sub">Start from the basics and move step by step to become a confident computer user.</p>
  <div class="levels">${LEVELS.map(levelCard).join('')}</div>`);
};

/* ---------------- LEVELS ---------------- */
VIEWS.levels = () => {
  const s = stats();
  app(`<h2 class="sec-title" style="margin-top:6px">Learning Levels</h2>
  <p class="sec-sub">Start from the basics and move step by step to become a confident computer user.
  &nbsp;<b>${s.xp} XP</b> • ${rankTitle(s.xp)}</p>
  <div class="levels">${LEVELS.map(levelCard).join('')}</div>`);
};

/* ---------------- LEVEL / LESSON ---------------- */
function levelSide(L, n) {
  const prog = getProg()[L.id] || [];
  return `<aside class="side"><a class="back" href="#/levels">← Back to Levels</a>
    <div class="side-head"><div class="num" style="--c:${L.color}">${L.id}</div><div><h3>Level ${L.id} – ${esc(L.short)}</h3><p>${esc(L.desc)}</p></div></div>
    <ul class="steps">${L.lessons.map((ls, i) => `<li><a href="#/level/${L.id}/${i + 1}" class="${i + 1 === n ? 'on' : ''}"><span class="dot ${prog.includes(i + 1) && i + 1 !== n ? 'ok' : ''}">${prog.includes(i + 1) && i + 1 !== n ? '✓' : i + 1}</span>${esc(ls.t)}</a></li>`).join('')}</ul></aside>`;
}
VIEWS.level = (id, num) => {
  const L = LEVELS[(+id || 1) - 1] || LEVELS[0];
  const n = Math.min(Math.max(+num || 1, 1), L.lessons.length);
  const ls = L.lessons[n - 1];
  markLesson(L.id, n);
  const prev = n > 1 ? `<a class="btn btn-ghost" href="#/level/${L.id}/${n - 1}">← Previous</a>` : '<span></span>';
  const next = n < L.lessons.length ? `<a class="btn btn-primary" href="#/level/${L.id}/${n + 1}">Next →</a>` : `<a class="btn btn-primary" href="#/levels">Finish ✓</a>`;
  let body;
  if (ls.type === 'typing') {
    body = `<section class="card practice" id="tpWrap">${typingHTML(PASSAGES[0], `Lesson ${n} of ${L.lessons.length}`)}
      <div class="cta-box"><p>Done practising? Test yourself with the ${esc(L.name.replace('Quiz 2 – ', ''))} quiz.</p><a class="btn btn-primary" href="#/quiz/${L.id}">Take the Quiz</a></div>
      <div class="lesson-foot">${prev}${next}</div></section>`;
  } else if (ls.type === 'quiz') {
    body = `<section class="card lesson"><div class="lesson-head"><div class="lesson-ico">${ls.icon}</div><div><small>Lesson ${n} of ${L.lessons.length}</small><h1>${esc(ls.t)}</h1></div></div>
      <p class="lead">You have finished the lessons of Level ${L.id}. Now check what you have learned with 10 quick questions.</p>
      <div class="cta-box"><h3>${esc(L.name)}</h3><p>10 questions • multiple choice • earn XP and badges</p><a class="btn btn-primary" href="#/quiz/${L.id}">Start Quiz →</a></div>
      <div class="lesson-foot">${prev}${next}</div></section>`;
  } else {
    body = `<section class="card lesson">
      <div class="lesson-top"><div>
        <div class="lesson-head"><div class="lesson-ico">${ls.icon}</div><div><small>Lesson ${n} of ${L.lessons.length}</small><h1>${esc(ls.t)}</h1></div></div>
        <p class="lead">${esc(ls.p)}</p></div>
        <div class="blob ${ls.icon === '🖥️' ? 'art' : ''}" aria-hidden="true">${ls.icon === '🖥️' ? computerSVG() : ls.icon}</div></div>
      <div class="kp"><h3><span>💡</span>${esc(ls.kpt)}</h3><ul>${ls.kp.map(([b, t]) => `<li><b>${esc(b)}</b> – ${esc(t)}</li>`).join('')}</ul></div>
      <div class="lesson-foot">${prev}${next}</div></section>`;
  }
  app(`<div class="layout">${levelSide(L, n)}<div>${body}</div></div>`);
  if (ls.type === 'typing') cleanup = mountTyping($('#tpWrap'), PASSAGES[0]);
};

/* ---------------- TYPING PRACTICE ---------------- */
function typingHTML(text, label) {
  const words = text.trim().split(/\s+/).length;
  return `<div class="practice-head"><div class="lesson-ico">⌨️</div><div><small>${esc(label)}</small><h1>Typing Practice</h1><p>Type the given text as accurately and quickly as possible.</p></div></div>
  <div class="tp-box"><h4>Practice Text</h4><div class="tp-text" aria-label="Text to type"></div></div>
  <div class="stats3">
    <div class="stat"><div class="si">🕐</div><div><small>Time</small><b class="t-time">01:00</b><em>/ 1 minute</em></div></div>
    <div class="stat"><div class="si">🔤</div><div><small>Words Typed</small><b class="t-words">0</b><em>/ ${words}</em></div></div>
    <div class="stat"><div class="si">🎯</div><div><small>Accuracy</small><b class="t-acc">100%</b><em>/ 100%</em></div></div>
  </div>
  <textarea class="tp-input" placeholder="Start typing here…" spellcheck="false" autocomplete="off" autocapitalize="off"></textarea>
  <div class="tp-actions"><button class="btn btn-primary tp-reset">⟳ Reset</button></div>
  <div class="tp-result" hidden></div>`;
}
function mountTyping(root, text) {
  const TOTAL = 60;
  const box = $('.tp-text', root), inp = $('.tp-input', root), res = $('.tp-result', root);
  const tTime = $('.t-time', root), tWords = $('.t-words', root), tAcc = $('.t-acc', root);
  box.innerHTML = [...text].map(c => `<span>${esc(c)}</span>`).join('');
  const spans = $$('span', box);
  let left, timer, started, done, ok;
  function reset() {
    clearInterval(timer); left = TOTAL; started = false; done = false; ok = 0;
    inp.value = ''; inp.disabled = false; res.hidden = true;
    spans.forEach((s, i) => s.className = i === 0 ? 'cur' : '');
    tTime.textContent = mmss(TOTAL); tWords.textContent = '0'; tAcc.textContent = '100%';
  }
  function finish() {
    if (done) return; done = true; clearInterval(timer); inp.disabled = true;
    const v = inp.value, elapsed = Math.max(1, TOTAL - left);
    const acc = v.length ? Math.round(ok / v.length * 100) : 0;
    const wpm = Math.round((ok / 5) / (elapsed / 60));
    const all = LS.get(K.typing, []); const before = bestWpm();
    all.push({ user: who(), wpm, acc, date: new Date().toISOString() }); LS.set(K.typing, all);
    const xp = Math.max(0, wpm) * 2;
    res.innerHTML = `🎉 Well done! Speed: <b>${wpm} WPM</b> • Accuracy: <b>${acc}%</b> • Time: <b>${mmss(elapsed)}</b>` +
      (wpm > before ? ' • 🌟 New personal best!' : '') + `<br><small>Your best speed counts for ${bestWpm() * 2} XP. Press Reset to try again.</small>`;
    res.hidden = false;
    if (xp) toast(`Typing speed: ${wpm} WPM`);
  }
  inp.addEventListener('input', () => {
    if (done) return;
    if (!started) { started = true; timer = setInterval(() => { left--; tTime.textContent = mmss(Math.max(0, left)); if (left <= 0) finish(); }, 1000); }
    const v = inp.value; ok = 0;
    spans.forEach((s, i) => {
      const c = v[i];
      if (c == null) s.className = i === v.length ? 'cur' : '';
      else { const good = c === text[i]; s.className = good ? 'ok' : 'bad'; if (good) ok++; }
    });
    tWords.textContent = v.trim() ? v.trim().split(/\s+/).length : 0;
    tAcc.textContent = (v.length ? Math.round(ok / v.length * 100) : 100) + '%';
    if (v.length >= text.length) finish();
  });
  $('.tp-reset', root).addEventListener('click', () => { reset(); inp.focus(); });
  reset();
  return () => clearInterval(timer);
}
VIEWS.practice = (num) => {
  const n = Math.min(Math.max(+num || 1, 1), PASSAGES.length);
  app(`<div class="layout"><aside class="side"><a class="back" href="#/levels">← Back to Levels</a>
    <div class="side-head"><div class="num" style="--c:#27a060">⌨</div><div><h3>Typing Practice</h3><p>Choose a text and type it as fast and as correctly as you can.</p></div></div>
    <ul class="steps">${PASSAGES.map((p, i) => `<li><a href="#/practice/${i + 1}" class="${i + 1 === n ? 'on' : ''}"><span class="dot">${i + 1}</span>Practice Text ${i + 1}</a></li>`).join('')}</ul></aside>
    <section class="card practice" id="tpWrap">${typingHTML(PASSAGES[n - 1], `Practice ${n} of ${PASSAGES.length}`)}</section></div>`);
  cleanup = mountTyping($('#tpWrap'), PASSAGES[n - 1]);
};

/* ---------------- QUIZ ---------------- */
let Q = null;
function quizSide(active) {
  const att = LS.get(K.att, []).filter(a => a.user === who());
  return `<aside class="side"><a class="back" href="#/quiz">← Back to Quizzes</a>
    <ul class="steps">${LEVELS.map(L => {
      const b = att.filter(a => a.level === L.id).map(a => a.correct * 10);
      return `<li><a href="#/quiz/${L.id}" class="${L.id === active ? 'on' : ''}"><span class="dot ${b.length ? 'ok' : ''}">${b.length ? '✓' : L.id}</span><span>${esc(L.name)}${b.length ? `<br><small style="color:#6b7694">Best: ${Math.max(...b)}%</small>` : ''}</span></a></li>`;
    }).join('')}</ul></aside>`;
}
VIEWS.quiz = (id, mode) => {
  if (id && mode === 'play') return quizPlay(+id);
  const L = LEVELS[(+id || 1) - 1] || LEVELS[0];
  const att = LS.get(K.att, []).filter(a => a.user === who() && a.level === L.id);
  const best = att.length ? Math.max(...att.map(a => a.correct * 10)) + '%' : '—';
  app(`<div class="layout">${quizSide(L.id)}<section class="card q-card">
    <div class="q-title"><div class="q-ico">📋</div><div><h1>${esc(L.name)}</h1><p style="color:var(--muted)">Test your knowledge and track your progress.</p></div></div>
    <div class="intro-grid"><div><b>10</b><span>Questions</span></div><div><b>10</b><span>Points each</span></div><div><b>${best}</b><span>Your best score</span></div></div>
    <p style="margin-bottom:18px">Read each question and choose the best answer. You can go back and change an answer before you submit.</p>
    <a class="btn btn-primary" href="#/quiz/${L.id}/play">Start Quiz →</a>
    <a class="btn btn-ghost" style="margin-left:8px" href="#/level/${L.id}/1">Revise the Lessons</a></section></div>`);
};
function quizPlay(id) {
  const L = LEVELS[id - 1] || LEVELS[0];
  if (!Q || Q.id !== L.id || Q.done) Q = { id: L.id, i: 0, ans: Array(L.quiz.length).fill(-1), start: Date.now(), done: false };
  const total = L.quiz.length;
  function draw() {
    const [q, opts] = L.quiz[Q.i];
    const last = Q.i === total - 1;
    app(`<div class="layout">${quizSide(L.id)}<section class="card q-card">
      <div class="q-meta"><span>${esc(L.name)}</span><span>Question ${Q.i + 1} of ${total} • ⏱ <span id="qt">${mmss((Date.now() - Q.start) / 1000)}</span></span></div>
      <div class="q-prog"><i style="width:${(Q.i + 1) / total * 100}%"></i></div>
      <div class="q-text">${Q.i + 1}. ${esc(q)}</div>
      <div class="opts">${opts.map((o, k) => `<button class="opt ${Q.ans[Q.i] === k ? 'sel' : ''}" data-k="${k}"><span class="l">${'ABCD'[k]}</span>${esc(o)}</button>`).join('')}</div>
      <div class="q-foot">${Q.i > 0 ? '<button class="btn btn-ghost" id="qp">← Previous</button>' : '<span></span>'}
        <button class="btn btn-primary" id="qn">${last ? 'Submit Quiz ✓' : 'Next →'}</button></div></section></div>`);
    $$('.opt').forEach(b => b.addEventListener('click', () => { Q.ans[Q.i] = +b.dataset.k; $$('.opt').forEach(x => x.classList.toggle('sel', x === b)); }));
    const p = $('#qp'); if (p) p.addEventListener('click', () => { Q.i--; draw(); });
    $('#qn').addEventListener('click', () => {
      if (!last) { Q.i++; draw(); return; }
      const un = Q.ans.filter(a => a < 0).length;
      if (un && !confirm(`You have ${un} unanswered question(s). Submit anyway?`)) return;
      submitQuiz(L);
    });
  }
  draw();
  const iv = setInterval(() => { const e = $('#qt'); if (e) e.textContent = mmss((Date.now() - Q.start) / 1000); }, 1000);
  cleanup = () => clearInterval(iv);
}
function submitQuiz(L) {
  const before = earned();
  const correct = L.quiz.reduce((s, q, i) => s + (Q.ans[i] === q[2] ? 1 : 0), 0);
  const attempt = { user: who(), level: L.id, correct, total: L.quiz.length, time: Math.round((Date.now() - Q.start) / 1000), date: new Date().toISOString(), answers: Q.ans.slice() };
  const all = LS.get(K.att, []); all.push(attempt); LS.set(K.att, all);
  attempt.newBadges = earned().filter(b => !before.includes(b));
  LS.set(K.last, attempt); Q.done = true; go('#/result');
}

/* ---------------- QUIZ RESULT ---------------- */
function smileysHTML() {
  const f = ['😞', '🙁', '😐', '🙂', '😄'];
  return `<div class="smileys">${f.map((e, i) => `<button class="sm" data-r="${i + 1}" aria-label="Rating ${i + 1}"><span>${e}</span>${i + 1}</button>`).join('')}</div>`;
}
function wireFeedback(ctx, after) {
  let rating = 0;
  $$('.sm').forEach(b => b.addEventListener('click', () => { rating = +b.dataset.r; $$('.sm').forEach(x => x.classList.toggle('on', x === b)); }));
  $('#fbSend').addEventListener('click', () => {
    const text = $('#fbText').value.trim();
    if (!rating) { toast('Please choose a rating first 🙂'); return; }
    const all = LS.get(K.fb, []);
    all.push({ user: who(), rating, text, ctx, date: new Date().toISOString() }); LS.set(K.fb, all);
    toast('Thank you for your feedback! 💙'); if (after) after();
  });
}
VIEWS.result = () => {
  const a = LS.get(K.last, null);
  if (!a) return go('#/quiz');
  const L = LEVELS[a.level - 1]; const pct = Math.round(a.correct / a.total * 100); const wrong = a.total - a.correct;
  const msg = pct >= 80 ? 'Great job!' : pct >= 50 ? 'Good try!' : 'Keep practising!';
  const rows = L.quiz.map((q, i) => {
    const mine = a.answers[i], good = mine === q[2];
    return `<tr><td>${i + 1}</td><td>${mine >= 0 ? 'ABCD'[mine] : '–'}</td><td>${'ABCD'[q[2]]}</td><td><span class="pill ${good ? 'ok' : 'no'}">${good ? '✓ Correct' : '✕ Wrong'}</span></td></tr>`;
  }).join('');
  const detail = L.quiz.map((q, i) => `<li>${esc(q[0])}<small>Correct answer: <b>${esc(q[1][q[2]])}</b>${a.answers[i] >= 0 && a.answers[i] !== q[2] ? ` • You chose: ${esc(q[1][a.answers[i]])}` : ''}</small></li>`).join('');
  app(`<div class="layout">${quizSide(L.id)}<div>
    <section class="card res-head"><div class="q-title"><div class="q-ico">✅</div><div><h1>Quiz Result</h1><p>${msg} Here is your result for <b>${esc(L.name)}</b>.</p></div></div><div class="well">${pct >= 80 ? 'Well<br>Done!' : 'Keep<br>Going!'}</div></section>
    ${a.newBadges && a.newBadges.length ? `<div class="newbadge">🎉 New badge${a.newBadges.length > 1 ? 's' : ''} earned: <b>${a.newBadges.map(esc).join(', ')}</b></div>` : ''}
    <section class="card res-stats">
      <div class="ring" style="--p:${pct}"><div><b>${pct}%</b><small>Score</small></div></div>
      <div class="rs"><i style="background:#27a060">✓</i><div><small>Correct Answers</small><b>${a.correct} / ${a.total}</b></div></div>
      <div class="rs"><i style="background:#e5484d">✕</i><div><small>Wrong Answers</small><b>${wrong} / ${a.total}</b></div></div>
      <div class="rs"><i style="background:#7a4be0">⏱</i><div><small>Time Taken</small><b>${mmss(a.time)}</b></div></div>
      <div class="rs"><i style="background:#f5b301">★</i><div><small>Total Points</small><b>${a.correct} / ${a.total}</b></div></div>
    </section>
    <div class="res-grid">
      <section class="card panel"><h3><span>📄</span>Question Review</h3><p class="sub">See your answers and learn from your mistakes.</p>
        <table><thead><tr><th>Q No.</th><th>Your Answer</th><th>Correct Answer</th><th>Result</th></tr></thead><tbody>${rows}</tbody></table>
        <details><summary>Show questions with correct answers</summary><ol>${detail}</ol></details></section>
      <div>
        <section class="card panel"><h3><span>💬</span>Your Feedback</h3><p class="sub">Tell us how your quiz experience was.</p>
          ${smileysHTML()}<textarea class="fb" id="fbText" placeholder="Share your thoughts (optional)…"></textarea>
          <button class="btn btn-primary" id="fbSend" style="width:100%">➤ Submit Feedback</button></section>
        <div class="note">⭐ <div><b>Every quiz makes you stronger!</b>Keep learning and reach new goals.</div></div>
      </div></div>
    <div class="res-actions"><a class="btn btn-primary" href="#/quiz/${L.id}/play" onclick="Q=null">Try Again</a>
      ${L.id < 8 ? `<a class="btn btn-ghost" href="#/quiz/${L.id + 1}">Next Quiz →</a>` : ''}
      <a class="btn btn-ghost" href="#/leaderboard/${L.id}">🏆 See Leaderboard</a></div>
  </div></div>`);
  wireFeedback(L.name);
};

/* ---------------- LEADERBOARD ---------------- */
const SEED_NAMES = ['Asha Kumari', 'Pooja Singh', 'Sneha Patel', 'Riya Sharma', 'Neha Yadav', 'Anjali Devi', 'Kavya Reddy', 'Meena Kumari'];
const SEED_SCORES = [100, 90, 90, 80, 70];
const SEED_DATES = ['2025-04-26', '2025-04-26', '2025-04-25', '2025-04-25', '2025-04-24'];
function boardFor(lv) {
  const rows = SEED_SCORES.map((sc, i) => ({ name: SEED_NAMES[(i + (lv - 1) * 2) % SEED_NAMES.length], pct: sc, date: SEED_DATES[i], real: 0 }));
  const best = {};
  LS.get(K.att, []).filter(a => a.level === lv).forEach(a => {
    const cur = best[a.user];
    if (!cur || a.correct > cur.correct || (a.correct === cur.correct && a.time < cur.time)) best[a.user] = a;
  });
  Object.values(best).forEach(a => rows.push({ name: a.user, pct: Math.round(a.correct / a.total * 100), date: a.date, real: 1, me: a.user === who() }));
  rows.sort((x, y) => y.pct - x.pct || x.real - y.real);
  return rows;
}
VIEWS.leaderboard = (lv) => {
  lv = Math.min(Math.max(+lv || 1, 1), 8);
  const rows = boardFor(lv); const s = stats();
  const myIdx = rows.findIndex(r => r.me);
  const medal = i => i < 3 ? `<span class="medal m${i + 1}">${i + 1}</span>` : `<b>${i + 1}</b>`;
  const note = myIdx >= 0 ? `⭐ You are ranked <b style="color:var(--blue)">${ordinal(myIdx + 1)} in Level ${lv}</b>. Keep going!`
    : `⭐ Take the <a href="#/quiz/${lv}" style="color:var(--blue);font-weight:600">Level ${lv} quiz</a> to join the leaderboard!`;
  app(`<div class="layout"><aside class="side"><a class="back" href="#/levels">← Back to Levels</a>
    <ul class="steps">${LEVELS.map(L => `<li><a href="#/level/${L.id}/1"><span class="dot">${L.id}</span>Level ${L.id} – ${esc(L.short)}</a></li>`).join('')}
    <li><a class="on" href="#/leaderboard"><span class="dot">🏆</span>Leaderboard</a></li><li><a href="#/feedback"><span class="dot">💬</span>Review &amp; Feedback</a></li></ul></aside>
    <div class="lb-grid">
      <section class="card lb"><div class="lb-head"><div class="lh"><div class="q-ico">🏆</div><div><h1>Leaderboard</h1><p>See how you rank and keep improving!</p></div></div>
        <div class="tabs">${LEVELS.map(L => `<a href="#/leaderboard/${L.id}" class="${L.id === lv ? 'on' : ''}">Level ${L.id}</a>`).join('')}</div></div>
        <div style="overflow-x:auto"><table><thead><tr><th>Rank</th><th>Student Name</th><th>Level</th><th>Score</th><th>Date</th></tr></thead>
        <tbody>${rows.slice(0, 10).map((r, i) => `<tr class="${r.me ? 'me' : ''}"><td>${medal(i)}</td><td>${esc(r.name)}${r.me ? ' <small>(you)</small>' : ''}</td><td><a href="#/level/${lv}/1">Level ${lv}</a></td><td><b>${r.pct}%</b></td><td>${fmtDate(r.date)}</td></tr>`).join('')}</tbody></table></div>
        <div class="rank-note">${note}</div></section>
      <div>
        <section class="card side-card art"><span class="script">Small Steps<br>Big Dreams</span>${girlCheer()}</section>
        <section class="card side-card"><h3>📊 Your Stats${user() ? '' : ' <small style="font-weight:400;color:var(--muted)">(Guest)</small>'}</h3>
          <div class="srow"><span>📄 Total Quizzes Taken</span><b>${s.att.length}</b></div>
          <div class="srow"><span>🎯 Average Score</span><b>${s.avg}%</b></div>
          <div class="srow"><span>⭐ Top Level Reached</span><b>Level ${s.topLevel}</b></div>
          <div class="srow"><span>⚡ XP (${rankTitle(s.xp)})</span><b>${s.xp}</b></div>
          <div class="srow"><span>⌨️ Best Typing Speed</span><b>${s.wpm} WPM</b></div>
          ${badgesHTML()}</section>
        <div class="keep">💙 Keep learning,<br>you're doing great!</div>
      </div></div></div>`);
};

/* ---------------- FEEDBACK ---------------- */
VIEWS.feedback = () => {
  const list = LS.get(K.fb, []).slice(-6).reverse();
  const avg = LS.get(K.fb, []).length ? (LS.get(K.fb, []).reduce((s, f) => s + f.rating, 0) / LS.get(K.fb, []).length).toFixed(1) : '–';
  app(`<h2 class="sec-title" style="margin-top:6px">Review &amp; Feedback</h2><p class="sec-sub">Tell us what you liked and how we can make learning easier for you.</p>
  <div class="fb-wrap">
    <section class="card panel"><h3><span>💬</span>Share your experience</h3><p class="sub">How was learning on this website?</p>
      ${smileysHTML()}<label class="l" for="fbText">Your message (optional)</label>
      <textarea class="fb" id="fbText" placeholder="Share your thoughts…"></textarea>
      <button class="btn btn-primary" id="fbSend" style="width:100%">➤ Submit Feedback</button></section>
    <section class="card panel"><h3><span>⭐</span>Recent feedback</h3><p class="sub">Average rating on this device: <b>${avg}</b> / 5</p>
      ${list.length ? list.map(f => `<div class="fb-item"><b>${'★'.repeat(f.rating)}${'☆'.repeat(5 - f.rating)}</b> <small>• ${esc(f.user)} • ${fmtDate(f.date)}${f.ctx ? ' • ' + esc(f.ctx) : ''}</small><div>${f.text ? esc(f.text) : '<small>(no message)</small>'}</div></div>`).join('') : '<p style="color:var(--muted);font-size:14px">No feedback yet. Be the first!</p>'}
    </section></div>`);
  wireFeedback('General', () => VIEWS.feedback());
};

/* ---------------- LOGIN / SIGN-UP / PROFILE ---------------- */
async function hash(s) {
  try { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('bcs:' + s)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join(''); }
  catch { let h = 0; for (const c of 'bcs:' + s) h = (h * 31 + c.charCodeAt(0)) | 0; return 'x' + h; }
}
const modal = html => { $('#modalBox').innerHTML = html; $('#modal').hidden = false; };
const closeModal = () => { $('#modal').hidden = true; };
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

function authModal(tab = 'login') {
  modal(`<h2>Welcome! 👋</h2><p style="color:var(--muted);font-size:14px">Save your progress, XP and badges.</p>
    <div class="m-tabs"><button class="${tab === 'login' ? 'on' : ''}" data-t="login">Login</button><button class="${tab === 'signup' ? 'on' : ''}" data-t="signup">Sign Up</button></div>
    <label class="l" for="aName">Student name</label><input class="fi" id="aName" maxlength="24" autocomplete="username">
    ${tab === 'signup' ? '<label class="l" for="aSchool">School / Village (optional)</label><input class="fi" id="aSchool" maxlength="40">' : ''}
    <label class="l" for="aPass">Password (at least 4 characters)</label><input class="fi" id="aPass" type="password" autocomplete="${tab === 'login' ? 'current-password' : 'new-password'}">
    <div class="err" id="aErr"></div>
    <button class="btn btn-primary" id="aGo" style="width:100%">${tab === 'login' ? 'Login' : 'Create Account'}</button>
    <button class="btn btn-ghost" id="aX" style="width:100%;margin-top:8px">Continue as Guest</button>`);
  $$('.m-tabs button').forEach(b => b.addEventListener('click', () => authModal(b.dataset.t)));
  $('#aX').addEventListener('click', closeModal);
  $('#aGo').addEventListener('click', async () => {
    const name = $('#aName').value.trim(), pass = $('#aPass').value, err = $('#aErr');
    if (name.length < 2) { err.textContent = 'Please enter your name (2+ letters).'; return; }
    if (pass.length < 4) { err.textContent = 'Password must be at least 4 characters.'; return; }
    if (name.toLowerCase() === 'guest') { err.textContent = 'Please choose another name.'; return; }
    const users = LS.get(K.users, {}); const key = name.toLowerCase(); const h = await hash(pass);
    if (tab === 'signup') {
      if (users[key]) { err.textContent = 'This name is already taken. Try logging in.'; return; }
      users[key] = { name, school: ($('#aSchool') || {}).value || '', h }; LS.set(K.users, users);
    } else if (!users[key] || users[key].h !== h) { err.textContent = 'Wrong name or password.'; return; }
    LS.set(K.session, users[key].name); closeModal(); refreshAuth(); toast(`Welcome, ${users[key].name}! 🎉`); route();
  });
  setTimeout(() => $('#aName') && $('#aName').focus(), 50);
}
function profileModal() {
  if (!user()) return authModal();
  const s = stats(); const e = earned();
  modal(`<h2>👤 ${esc(user())}</h2><p style="color:var(--muted);font-size:14px">${rankTitle(s.xp)} • ${s.xp} XP</p>
    <div class="intro-grid" style="margin:16px 0"><div><b>${s.lessons}</b><span>Lessons</span></div><div><b>${s.att.length}</b><span>Quizzes</span></div><div><b>${s.wpm}</b><span>Best WPM</span></div></div>
    <h3 style="font-size:15px">Badges (${e.length}/${BADGES.length})</h3>${badgesHTML()}
    <ul style="margin:14px 0 0 18px;font-size:12.5px;color:var(--muted)">${BADGES.map(b => `<li>${b.ico} <b>${esc(b.name)}</b> – ${esc(b.desc)}</li>`).join('')}</ul>
    <button class="btn btn-ghost" id="lo" style="width:100%;margin-top:18px">Logout</button>`);
  $('#lo').addEventListener('click', () => { localStorage.removeItem(K.session); closeModal(); refreshAuth(); toast('Logged out'); route(); });
}
function refreshAuth() {
  const u = user();
  $('#authBtn').textContent = u ? 'Logout' : 'Login / Sign Up';
  $('#profileBtn').title = u || 'Guest';
  $('#profileBtn').textContent = u ? u[0].toUpperCase() : '👤';
}
$('#authBtn').addEventListener('click', () => {
  if (user()) { localStorage.removeItem(K.session); refreshAuth(); toast('Logged out'); route(); } else authModal();
});
$('#profileBtn').addEventListener('click', profileModal);
$('#burger').addEventListener('click', () => $('#nav').classList.toggle('open'));

/* ---------------- start ---------------- */
refreshAuth();
route();
