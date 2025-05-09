document.addEventListener('DOMContentLoaded', () => {
    // --- INITIALIZATION & PAGE NAVIGATION ---
    const splashTitle = document.getElementById('splash-title');
    if (splashTitle) {
        splashTitle.addEventListener('click', () => {
            showPage('page-auth');
            showAuthForm('login'); // Default to login form
        });
    }
    // Fallback if splash is skipped (optional, can be removed if click is primary)
    setTimeout(() => {
        if (document.getElementById('page-splash').classList.contains('active')) {
            showPage('page-auth');
        }
    }, 1500); // Reduced timeout

    // --- AUTH PAGE LOGIC (with basic validation) ---
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const btnLogin = document.getElementById('btnLogin');
    const btnSignup = document.getElementById('btnSignup');

    window.showAuthForm = (formType) => {
        document.getElementById('tab-login').classList.toggle('active', formType === 'login');
        document.getElementById('tab-signup').classList.toggle('active', formType === 'signup');
        if (loginForm) loginForm.classList.toggle('active-form', formType === 'login');
        if (signupForm) signupForm.classList.toggle('active-form', formType === 'signup');
    };

    window.togglePassword = (fieldId) => {
        const passwordField = document.getElementById(fieldId);
        if (!passwordField) return;
        const icon = passwordField.nextElementSibling;
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            if (icon) { icon.classList.remove('fa-eye'); icon.classList.add('fa-eye-slash'); }
        } else {
            passwordField.type = 'password';
            if (icon) { icon.classList.remove('fa-eye-slash'); icon.classList.add('fa-eye'); }
        }
    };

    const advocacyBadgeButtonsSignup = document.querySelectorAll('#signup-form .advocacy-badges .badge-btn');
    advocacyBadgeButtonsSignup.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('selected');
        });
    });

    // User Data Store 
    let currentUserData = {
        name: 'PowerPuff User',
        email: 'user@gmail.com',
        bio: 'Fighting crime, trying to shine!',
        quotes: '"Saving the world before bedtime!" - Blossom',
        aboutme: 'I believe in justice, fairness, and a world free from discrimination. Also, I like puppies.',
        advocacyBadges: [
            { name: "Gender", class: "gender" },
            { name: "Age", class: "age" }
        ]
    };

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    if (btnLogin) {
        btnLogin.addEventListener('click', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('login-email');
            const passwordInput = document.getElementById('login-password');
            if (!emailInput || !passwordInput) return;

            const email = emailInput.value;
            const password = passwordInput.value;

            if (!email || !password) {
                alert("Please enter both email and password.");
                return;
            }
            if (!isValidEmail(email)) {
                alert("Please enter a valid email address.");
                return;
            }
            console.log("Log In", email);
            showPage('page-main-app');
            setActiveAppPage('app-home'); // Default to home page after login
        });
    }

    if (btnSignup) {
        btnSignup.addEventListener('click', (e) => {
            e.preventDefault();
            const name = document.getElementById('signup-name')?.value;
            const email = document.getElementById('signup-email')?.value;
            const password = document.getElementById('signup-password')?.value;
            const confirmPassword = document.getElementById('signup-confirm-password')?.value;

            if (!name || !email || !password || !confirmPassword) {
                alert("Please fill in all required fields.");
                return;
            }
            if (!isValidEmail(email)) {
                alert("Please enter a valid email address.");
                return;
            }
            if (password.length < 8) {
                alert("Password must be at least 8 characters long.");
                return;
            }
            if (password !== confirmPassword) {
                alert("Passwords do not match.");
                return;
            }

            const selectedBadges = [];
            document.querySelectorAll('#signup-form .advocacy-badges .badge-btn.selected').forEach(badge => {
                selectedBadges.push({
                    name: badge.dataset.badge,
                    class: badge.classList[1]
                });
            });

            // Update currentUserData with signup details 
            currentUserData = {
                name: name,
                email: email,
                bio: document.getElementById('signup-bio')?.value || '',
                quotes: document.getElementById('signup-quotes')?.value || '',
                aboutme: document.getElementById('signup-aboutme')?.value || '',
                advocacyBadges: selectedBadges
            };

            console.log(" signup:", currentUserData);
            alert("Account created successfully!\nPlease log in.");
            showAuthForm('login'); 
            const loginEmailField = document.getElementById('login-email');
            if (loginEmailField) loginEmailField.value = email; 
            if (signupForm) signupForm.reset(); 
            advocacyBadgeButtonsSignup.forEach(b => b.classList.remove('selected')); 
        });
    }

    // --- MAIN APP LOGIC (Sidebar, Nav, Logout) ---
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const sidebar = document.getElementById('sidebar');
    const mainNavLinks = document.querySelectorAll('.main-nav .nav-link');
    const sidebarCategoryLinks = document.querySelectorAll('.sidebar .category-link');
    const appPages = document.querySelectorAll('.app-page');
    const appContentArea = document.querySelector('.app-content');

    if (hamburgerMenu && sidebar) {
        hamburgerMenu.addEventListener('click', () => sidebar.classList.toggle('open'));
    }
    if (appContentArea && sidebar && hamburgerMenu) {
        appContentArea.addEventListener('click', (e) => {
            if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !hamburgerMenu.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    }

    mainNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.dataset.page;
            if (pageId) setActiveAppPage(pageId);
            mainNavLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            if (sidebar) sidebar.classList.remove('open');
        });
    });

    sidebarCategoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const categoryKey = link.dataset.category;
            if (categoryKey) loadCategoryDetail(categoryKey);
            if (sidebar) sidebar.classList.remove('open');
        });
    });

    window.navigateToCategory = (categoryKey) => {
        if (categoryKey) loadCategoryDetail(categoryKey);
    };

    const btnLogoutSidebar = document.getElementById('btnLogoutSidebar');
    const btnLogoutSettings = document.getElementById('btnLogoutSettings');
    if (btnLogoutSidebar) btnLogoutSidebar.addEventListener('click', logout);
    if (btnLogoutSettings) btnLogoutSettings.addEventListener('click', logout);

    function logout() {
        console.log("Logging out");
        currentUserData = {}; // Reset user data
        showPage('page-auth');
        showAuthForm('login');
        const loginEmailField = document.getElementById('login-email');
        const loginPasswordField = document.getElementById('login-password');
        if (loginEmailField) loginEmailField.value = '';
        if (loginPasswordField) loginPasswordField.value = '';
        // Potentially clear localStorage if used for session/dark mode etc.
        // localStorage.removeItem('darkModeEnabled');
    }


    // --- HOME PAGE (Quotes & Category Boxes) ---
    const quotesDisplayHome = document.getElementById('quotesDisplayHome');
    const sampleQuotesForHome = [
        { text: "Darkness cannot drive out darkness: only light can do that. Hate cannot drive out hate: only love can do that.", author: "Martin Luther King Jr." },
        { text: "The time is always right to do what is right.", author: "Martin Luther King Jr." },
        { text: "No one is born hating another person because of the color of his skin, or his background, or his religion.", author: "Nelson Mandela" },
        { text: "If you want to lift yourself up, lift up someone else.", author: "Booker T. Washington" },
    ];

    function populateHomePageContent() {
        if (!quotesDisplayHome) return;
        quotesDisplayHome.innerHTML = '';
        const displayableQuotes = [];
        if (currentUserData && currentUserData.quotes) {
            displayableQuotes.push({ text: currentUserData.quotes, author: currentUserData.name || "You" });
        }
        sampleQuotesForHome.forEach(q => displayableQuotes.push(q));

        displayableQuotes.slice(0, 4).forEach(quote => {
            const quoteCard = document.createElement('div');
            quoteCard.className = 'quote-card';
            quoteCard.innerHTML = `
                <p>"${quote.text}"</p>
                <p class="author">- ${quote.author || 'Anonymous'}</p>
            `;
            quotesDisplayHome.appendChild(quoteCard);
        });
    }


    // --- PROFILE PAGE (Edit Functionality) ---
    const btnEditProfile = document.getElementById('btnEditProfile');
    const btnSaveProfile = document.getElementById('btnSaveProfile');
    const btnCancelEditProfile = document.getElementById('btnCancelEditProfile');

    const profileNameDisplay = document.getElementById('profileNameDisplay');
    const profileBioDisplay = document.getElementById('profileBioDisplay');
    const profileEmailDisplay = document.getElementById('profileEmailDisplay');
    const profilePasswordDisplay = document.getElementById('profilePasswordDisplay');
    const profileQuotesDisplay = document.getElementById('profileQuotesDisplay');
    const profileAboutMeDisplay = document.getElementById('profileAboutMeDisplay');
    const profileAdvocacyBadgesDisplayContainer = document.getElementById('profileAdvocacyBadgesDisplay');

    const profileNameInput = document.getElementById('profileNameInput');
    const profileBioInput = document.getElementById('profileBioInput');
    const profileEmailInput = document.getElementById('profileEmailInput');
    const profilePasswordInput = document.getElementById('profilePasswordInput');
    const profileConfirmPasswordInput = document.getElementById('profileConfirmPasswordInput');
    const profileQuotesInput = document.getElementById('profileQuotesInput');
    const profileAboutMeInput = document.getElementById('profileAboutMeInput');
    const profileAdvocacyBadgesEditContainer = document.getElementById('profileAdvocacyBadgesEdit');

    const profileViewModeElements = document.querySelectorAll('.profile-layout .view-mode');
    const profileEditModeElements = document.querySelectorAll('.profile-layout .edit-mode');

    let originalProfileDataForCancel = {};

    function populateProfileView(data) {
        if (!data) return;
        if (profileNameDisplay) profileNameDisplay.textContent = data.name || 'N/A';
        if (profileBioDisplay) profileBioDisplay.textContent = data.bio || 'N/A';
        if (profileEmailDisplay) profileEmailDisplay.textContent = data.email || 'N/A';
        if (profilePasswordDisplay) profilePasswordDisplay.textContent = "********";
        if (profileQuotesDisplay) profileQuotesDisplay.textContent = data.quotes || 'No quote set.';
        if (profileAboutMeDisplay) profileAboutMeDisplay.textContent = data.aboutme || 'No information provided.';
        if (profileAdvocacyBadgesDisplayContainer) renderProfileBadges(data.advocacyBadges || [], profileAdvocacyBadgesDisplayContainer, false);
    }

    function populateProfileEdit(data) {
        if (!data) return;
        if (profileNameInput) profileNameInput.value = data.name || '';
        if (profileBioInput) profileBioInput.value = data.bio || '';
        if (profileEmailInput) profileEmailInput.value = data.email || '';
        if (profilePasswordInput) profilePasswordInput.value = '';
        if (profileConfirmPasswordInput) profileConfirmPasswordInput.value = '';
        if (profileQuotesInput) profileQuotesInput.value = data.quotes || '';
        if (profileAboutMeInput) profileAboutMeInput.value = data.aboutme || '';
        if (profileAdvocacyBadgesEditContainer) renderProfileBadges(data.advocacyBadges || [], profileAdvocacyBadgesEditContainer, true);
    }

    function renderProfileBadges(badgesData, container, isEditable) {
        if (!container) return;
        container.innerHTML = '';
        const allBadgeTypes = [
            { name: "Gender", class: "gender" }, { name: "Religious", class: "religious" },
            { name: "Disability", class: "disability" }, { name: "Age", class: "age" },
            { name: "Sexual Orientation", class: "sexual-orientation" }, { name: "Appearance-Based", class: "appearance-based" }
        ];

        if (isEditable) {
            allBadgeTypes.forEach(badgeType => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = `badge-btn ${badgeType.class}`;
                btn.dataset.badge = badgeType.name;
                btn.textContent = badgeType.name;
                if (badgesData.some(b => b.name === badgeType.name)) {
                    btn.classList.add('selected');
                }
                btn.addEventListener('click', () => btn.classList.toggle('selected'));
                container.appendChild(btn);
            });
        } else {
            if (badgesData && badgesData.length > 0) {
                badgesData.forEach(badgeInfo => {
                    const badgeEl = document.createElement('span');
                    badgeEl.className = `badge-btn ${badgeInfo.class} selected readonly`;
                    badgeEl.textContent = badgeInfo.name;
                    container.appendChild(badgeEl);
                });
            } else {
                container.innerHTML = '<p class="no-badges-text">No advocacy badges selected.</p>';
            }
        }
    }

    function toggleProfileEditMode(isEditing) {
        profileViewModeElements.forEach(el => el.style.display = isEditing ? 'none' : (el.tagName === 'DIV' || el.tagName === 'H4' ? 'block' : 'inline'));
        profileEditModeElements.forEach(el => el.style.display = isEditing ? 'block' : 'none'); // Most inputs are block

        if (profileAdvocacyBadgesDisplayContainer) profileAdvocacyBadgesDisplayContainer.style.display = isEditing ? 'none' : 'flex';
        if (profileAdvocacyBadgesEditContainer) profileAdvocacyBadgesEditContainer.style.display = isEditing ? 'flex' : 'none';

        if (btnEditProfile) btnEditProfile.style.display = isEditing ? 'none' : 'inline-block';
        if (btnSaveProfile) btnSaveProfile.style.display = isEditing ? 'inline-block' : 'none';
        if (btnCancelEditProfile) btnCancelEditProfile.style.display = isEditing ? 'inline-block' : 'none';

        if (isEditing) {
            originalProfileDataForCancel = JSON.parse(JSON.stringify(currentUserData));
            populateProfileEdit(currentUserData);
        } else {
            populateProfileView(currentUserData);
        }
    }

    if (btnEditProfile) btnEditProfile.addEventListener('click', () => toggleProfileEditMode(true));
    if (btnCancelEditProfile) btnCancelEditProfile.addEventListener('click', () => {
        currentUserData = JSON.parse(JSON.stringify(originalProfileDataForCancel));
        toggleProfileEditMode(false);
    });

    if (btnSaveProfile) {
        btnSaveProfile.addEventListener('click', () => {
            if (!profileEmailInput) return;
            const newEmail = profileEmailInput.value;
            if (!isValidEmail(newEmail)) {
                alert("Please enter a valid email address for your profile.");
                return;
            }

            const newPassword = profilePasswordInput?.value;
            const confirmNewPassword = profileConfirmPasswordInput?.value;

            if (newPassword) {
                if (newPassword.length < 8) { alert("New password must be at least 8 characters long."); return; }
                if (newPassword !== confirmNewPassword) { alert("New passwords do not match."); return; }
                console.log("Password change requested ");
            }

            if (profileNameInput) currentUserData.name = profileNameInput.value;
            if (profileBioInput) currentUserData.bio = profileBioInput.value;
            currentUserData.email = newEmail;
            if (profileQuotesInput) currentUserData.quotes = profileQuotesInput.value;
            if (profileAboutMeInput) currentUserData.aboutme = profileAboutMeInput.value;

            const updatedBadges = [];
            if (profileAdvocacyBadgesEditContainer) {
                profileAdvocacyBadgesEditContainer.querySelectorAll('.badge-btn.selected').forEach(badge => {
                    updatedBadges.push({ name: badge.dataset.badge, class: badge.classList[1] });
                });
            }
            currentUserData.advocacyBadges = updatedBadges;

            console.log("Profile Saved:", currentUserData);
            alert("Profile updated successfully! ");
            toggleProfileEditMode(false);
            const homePageActive = document.getElementById('app-home')?.classList.contains('active');
            if (homePageActive) populateHomePageContent();
        });
    }


    // --- CHAT PAGE ---
    const chatInput = document.getElementById('chatInput');
    const sendChatBtn = document.getElementById('sendChatBtn');
    const chatMessagesContainer = document.querySelector('.chat-messages');
    const GEMINI_API_KEY = 'AIzaSyA9e1HzIohndyxiCFl9JJKITmoyHGc_z3k';
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    if (sendChatBtn && chatInput) {
        sendChatBtn.addEventListener('click', sendChatMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendChatMessage();
        });
    }

    async function sendChatMessage() {
        if (!chatInput || !chatMessagesContainer) return;
        const messageText = chatInput.value.trim();
        if (messageText === '') return;

        appendMessage(messageText, 'user-message');
        chatInput.value = '';
        chatInput.disabled = true;
        if(sendChatBtn) sendChatBtn.disabled = true;

        // Prepend a standard prompt for context if desired, or just send the user message
       
       

        try {
            const response = await fetch( {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: promptForBot
                        }]
                    }]
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Gemini API Error:', response.status, errorData);
                appendMessage(`Sorry, I encountered an error: ${errorData.error?.message || response.statusText}. Please try again.`, 'bot-message', true);
            } else {
                const data = await response.json();
                let botResponseText = "Sorry, I couldn't understand that."; // Default
                if (data.candidates && data.candidates.length > 0 &&
                    data.candidates[0].content && data.candidates[0].content.parts &&
                    data.candidates[0].content.parts.length > 0) {
                    botResponseText = data.candidates[0].content.parts[0].text;
                } else if (data.promptFeedback && data.promptFeedback.blockReason) {
                    botResponseText = `I cannot respond to this due to: ${data.promptFeedback.blockReason}. Please rephrase your question.`;
                     console.warn("Gemini API content blocked:", data.promptFeedback);
                }
                appendMessage(botResponseText, 'bot-message', true);
            }
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            appendMessage('Sorry, I had trouble connecting. Please check your internet and try again.', 'bot-message', true);
        } finally {
            chatInput.disabled = false;
            if(sendChatBtn) sendChatBtn.disabled = false;
            chatInput.focus();
        }
    }

    function appendMessage(text, type, isBot = false) {
        if (!chatMessagesContainer) return;
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type);
        if (isBot) {
            const icon = document.createElement('i');
            icon.className = 'fas fa-robot';
            messageDiv.appendChild(icon);
          
            const textNodeContainer = document.createElement('span');
            textNodeContainer.innerHTML = " " + text.replace(/\n/g, '<br>');
            messageDiv.appendChild(textNodeContainer);

        } else {
            messageDiv.textContent = text;
        }
        chatMessagesContainer.appendChild(messageDiv);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }


    // --- SETTINGS PAGE ---
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', () => {
            document.body.classList.toggle('dark-mode', darkModeToggle.checked);
            localStorage.setItem('darkModeEnabled', darkModeToggle.checked);
        });
        if (localStorage.getItem('darkModeEnabled') === 'true') {
            darkModeToggle.checked = true;
            document.body.classList.add('dark-mode');
        }
    }

    // --- CATEGORY DETAIL PAGE ---
    const categoryData = {
        gender: { title: "Gender", definition: "A deeply ingrained social construct that influences individual identities and societal expectations. It encompasses roles, expressions, and behaviors linked to masculinity, femininity, and non-binary identities, often shaped by cultural, historical, and personal factors.", impact: "Gender discrimination impacts individuals in employment, pay, opportunities, and can lead to harassment and violence. It limits potential and reinforces harmful stereotypes.", solution: "Solutions include promoting gender equality through education, challenging stereotypes, ensuring equal opportunities, enacting and enforcing anti-discrimination laws, and supporting gender diversity.", problems: "Pervasive stereotypes, unconscious bias, societal norms favoring specific genders, lack of representation in leadership, and inadequate legal protections contribute to gender discrimination.", laws: "Laws like Title VII of the Civil Rights Act (US) and various international conventions prohibit gender discrimination in employment and other areas. The Equal Pay Act addresses wage disparities.", qoutes: "“Gender equality is more than a goal in itself. It is a precondition for meeting the challenge of reducing poverty, promoting sustainable development and building good governance.” - Kofi Annan" },
        religious: { title: "Religious", definition: "The principles, traditions, and spiritual practices that define a person's faith, worldview, and moral compass. These beliefs can be rooted in organized religions such as Christianity, Islam, Hinduism, or Buddhism, or can reflect personal philosophies and spiritual connections beyond institutional structures.", impact: "Religious discrimination can lead to social exclusion, denial of employment or services, harassment, and violence. It infringes on freedom of belief and practice.", solution: "Promoting interfaith dialogue, education about different religions, ensuring freedom of religion and belief, and enforcing laws against religious discrimination are key solutions.", problems: "Religious intolerance, stereotypes, lack of understanding, political manipulation of religious differences, and extremist ideologies fuel religious discrimination.", laws: "Many countries have constitutional protections for freedom of religion and laws prohibiting discrimination based on religion in employment, housing, and public accommodations.", qoutes: "“Religious freedom is a cornerstone of a healthy society.” - [Attributed to many]" },
        disability: { title: "Disability", definition: "Any physical, intellectual, cognitive, sensory, or psychological condition that may impact an individual's ability to perform daily activities or participate fully in society. Disabilities can be visible or invisible, and societal attitudes, accessibility, and inclusion efforts play a crucial role in shaping the experiences of disabled individuals.", impact: "Discrimination against people with disabilities (ableism) results in barriers to education, employment, healthcare, transportation, and social participation, leading to exclusion and inequality.", solution: "Creating accessible environments, providing reasonable accommodations, promoting inclusive policies, challenging ableist stereotypes, and empowering individuals with disabilities are crucial.", problems: "Lack of accessibility, negative stereotypes, insufficient support services, societal stigma, and discriminatory practices in various sectors.", laws: "Laws like the Americans with Disabilities Act (ADA) in the US aim to prevent discrimination and ensure equal opportunities for people with disabilities.", qoutes: "“Disability is not a brave struggle or 'courage in the face of adversity.' Disability is an art. It's an ingenious way to live.” - Neil Marcus" },
        age: { title: "Age", definition: "The chronological stage of a person's life, influencing their rights, responsibilities, and societal expectations. Age impacts various aspects of life, including opportunities, health, and perspectives, and it can be a factor in age-based discrimination, such as ageism against both older adults and younger individuals.", impact: "Ageism impacts individuals across the lifespan, leading to stereotypes, prejudice, and discrimination in employment, healthcare, social inclusion, and media representation. It can affect financial stability, career opportunities, and overall well-being.", solution: "Solutions involve challenging ageist stereotypes, promoting intergenerational connections and programs, enforcing laws against age discrimination, encouraging lifelong learning, and valuing the contributions of all age groups.", problems: "Pervasive stereotypes about capabilities based on age, lack of awareness of ageism's impact, discriminatory workplace policies, and societal pressure for older individuals to 'step aside' or younger individuals to 'wait their turn.", laws: "Laws like the Age Discrimination in Employment Act (ADEA) in the US protect older workers. However, legal protections against ageism for younger people are less common, and enforcement can be challenging.", qoutes: "“Age is an issue of mind over matter. If you don’t mind, it doesn’t matter.” - Mark Twain" },
        'sexual-orientation': { title: "Sexual Orientation", definition: "The inherent and enduring pattern of emotional, romantic, or sexual attraction toward others. This spectrum includes heterosexual (attraction to the opposite sex), homosexual (same-sex attraction), bisexual (attraction to both sexes), pansexual (attraction independent of gender), and asexual (little to no sexual attraction), among other identities.", impact: "Discrimination based on sexual orientation can lead to harassment, violence, denial of rights (e.g., marriage, employment), mental health issues, and social stigmatization.", solution: "Legal protections, education to combat prejudice, promoting LGBTQ+ visibility and acceptance, and creating inclusive spaces are vital solutions.", problems: "Homophobia, biphobia, transphobia (often linked), societal norms assuming heterosexuality, lack of legal recognition, and religious or cultural prejudice.", laws: "An increasing number of countries and regions are enacting laws to protect against discrimination based on sexual orientation and recognize same-sex relationships.", qoutes: "“Openness may not completely disarm prejudice, but it’s a good place to start.” - Jason Collins" },
        'appearance-based': { title: "Appearance-Based", definition: "The judgments, biases, and stereotypes formed based on physical attributes such as body shape, skin tone, facial features, height, and clothing choices. Social norms often influence perceptions of beauty, acceptability, and status, making appearance-based discrimination an issue in many cultures.", impact: "Appearance-based discrimination can affect hiring, promotions, social interactions, and self-esteem. It includes issues like colorism, lookism, and weight bias.", solution: "Promoting body positivity, challenging narrow beauty standards, media literacy, and fostering a culture of respect for diverse appearances. Some jurisdictions are beginning to explore legal protections.", problems: "Societal pressure to conform to specific beauty ideals, media portrayals, unconscious biases, and lack of awareness about the impact of such discrimination.", laws: "Few explicit laws address general appearance-based discrimination, though some aspects (like discrimination based on hairstyles associated with race) are being addressed under racial discrimination laws in some places.", qoutes: "“Beauty begins the moment you decide to be yourself.” - Coco Chanel" }
    };
    const categorySubNavLinks = document.querySelectorAll('.category-sub-nav .sub-nav-link');

    categorySubNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = link.dataset.tab;
            const currentActiveLink = document.querySelector('.category-sub-nav .sub-nav-link.active');
            const currentActivePane = document.querySelector('.category-content .tab-pane.active');

            if (currentActiveLink) currentActiveLink.classList.remove('active');
            link.classList.add('active');
            if (currentActivePane) currentActivePane.classList.remove('active');
            const targetPane = document.getElementById(`tab-content-${tabId}`);
            if (targetPane) targetPane.classList.add('active');
        });
    });

    function loadCategoryDetail(categoryKey) {
        const data = categoryData[categoryKey];
        if (!data) { console.error("Category data not found for:", categoryKey); return; }

        const categoryTitleEl = document.getElementById('category-title');
        if (categoryTitleEl) categoryTitleEl.textContent = data.title;

        const definitionPane = document.getElementById('tab-content-definition');
        const impactPane = document.getElementById('tab-content-impact');
        const solutionPane = document.getElementById('tab-content-solution');
        const problemsPane = document.getElementById('tab-content-problems');
        const lawsPane = document.getElementById('tab-content-laws');
        const qoutesPane = document.getElementById('tab-content-qoutes'); // Matched spelling from mockup

        if (definitionPane) definitionPane.innerHTML = `<p>${data.definition || "Definition coming soon."}</p>`;
        if (impactPane) impactPane.innerHTML = `<p>${data.impact || "Impact details coming soon."}</p>`;
        if (solutionPane) solutionPane.innerHTML = `<p>${data.solution || "Solution ideas coming soon."}</p>`;
        if (problemsPane) problemsPane.innerHTML = `<p>${data.problems || "Problem analysis coming soon."}</p>`;
        if (lawsPane) lawsPane.innerHTML = `<p>${data.laws || "Relevant laws coming soon."}</p>`;
        if (qoutesPane) qoutesPane.innerHTML = data.qoutes ? `<blockquote>${data.qoutes.replace(/\n/g, '<br>')}</blockquote>` : "<p>No quotes available for this topic yet.</p>";

        const currentActiveLink = document.querySelector('.category-sub-nav .sub-nav-link.active');
        const currentActivePane = document.querySelector('.category-content .tab-pane.active');
        if (currentActiveLink) currentActiveLink.classList.remove('active');
        if (currentActivePane) currentActivePane.classList.remove('active');

        const defaultActiveLink = document.querySelector('.category-sub-nav .sub-nav-link[data-tab="definition"]');
        if (defaultActiveLink) defaultActiveLink.classList.add('active');
        if (definitionPane) definitionPane.classList.add('active');

        setActiveAppPage('app-category-detail');
    }

    // --- Helper Functions for Page & App Page Navigation ---
    function showPage(pageId) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const targetPage = document.getElementById(pageId);
        if (targetPage) targetPage.classList.add('active');
    }

    function setActiveAppPage(pageId) {
        appPages.forEach(p => p.classList.remove('active'));
        const targetAppPage = document.getElementById(pageId);
        if (targetAppPage) targetAppPage.classList.add('active');

        mainNavLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.page === pageId);
        });

        if (pageId === 'app-home') {
            populateHomePageContent();
        } else if (pageId === 'app-profile') {
            toggleProfileEditMode(false); // Ensure profile is in view mode
        }
    }

    // --- END
   
});