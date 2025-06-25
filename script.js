document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selections ---
    const tumblerWrappers = document.querySelectorAll('.tumbler-wrapper');
    const themeSwitcher = document.getElementById('theme-switcher');
    const musicToggle = document.getElementById('music-toggle');
    const backgroundMusic = document.getElementById('background-music');
    const body = document.body;
    const quoteText = document.getElementById('quote-text');
    const dateContainer = document.getElementById('date-container');
    const tumblerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--tumbler-height'));

    // --- Data and State ---
    const quotes = [
        { text: "Time is what we want most, but what we use worst.", author: "William Penn" },
        { text: "The two most powerful warriors are patience and time.", author: "Leo Tolstoy" },
        { text: "Time is a created thing. To say 'I don't have time,' is like saying, 'I don't want to.'", author: "Lao Tzu" },
        { text: "The future is something which everyone reaches at the rate of sixty minutes an hour, whatever he does, whoever he is.", author: "C.S. Lewis" },
        { text: "A man who dares to waste one hour of time has not discovered the value of life.", author: "Charles Darwin" },
        { text: "Your time is limited, so don’t waste it living someone else’s life.", author: "Steve Jobs" }
    ];
    let currentQuoteIndex = -1;
    let lastDate = null;

    // --- SVG Icons ---
    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    const musicOnIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>`;
    const musicOffIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>`;

    // --- Functions ---

    /**
     * Toggles the music player on and off.
     */
    function toggleMusic() {
        if (backgroundMusic.paused) {
            backgroundMusic.play().catch(error => console.error("Audio play failed:", error));
            musicToggle.innerHTML = musicOnIcon;
        } else {
            backgroundMusic.pause();
            musicToggle.innerHTML = musicOffIcon;
        }
    }

    /**
     * Updates the date display if the day has changed.
     */
    function updateDate() {
        const now = new Date();
        const dateString = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        if (dateString !== lastDate) {
            dateContainer.textContent = dateString;
            lastDate = dateString;
        }
    }

    /**
     * Fades out the old quote and fades in a new random one.
     */
    function showNewQuote() {
        quoteText.classList.remove('visible');
        setTimeout(() => {
            let newIndex;
            do { newIndex = Math.floor(Math.random() * quotes.length); } while (newIndex === currentQuoteIndex);
            currentQuoteIndex = newIndex;
            const quote = quotes[currentQuoteIndex];
            quoteText.innerHTML = `"${quote.text}" <span class="quote-author">- ${quote.author}</span>`;
            quoteText.classList.add('visible');
        }, 1000); // Wait for the fade-out to complete
    }
    
    /**
     * Sets the color theme for the page (light/dark).
     * @param {boolean} isDark - True to set the dark theme, false for light.
     */
    function setTheme(isDark) {
         body.classList.toggle('dark', isDark);
         themeSwitcher.innerHTML = isDark ? sunIcon : moonIcon;
         const waveUses = document.querySelectorAll('.waves .parallax > use');
         if(isDark){
            waveUses[0].setAttribute('fill', 'rgba(40, 43, 46, 0.7)');
            waveUses[1].setAttribute('fill', 'rgba(40, 43, 46, 0.5)');
            waveUses[2].setAttribute('fill', 'rgba(40, 43, 46, 0.3)');
         } else {
            waveUses[0].setAttribute('fill', 'rgba(255,255,255,0.7)');
            waveUses[1].setAttribute('fill', 'rgba(255,255,255,0.5)');
            waveUses[2].setAttribute('fill', 'rgba(255,255,255,0.3)');
         }
    }

    /**
     * Creates the number strips and scale ticks for each tumbler unit.
     */
    function setupTumblers() {
        tumblerWrappers.forEach(wrapper => {
            const stripContainer = wrapper.querySelector('.tumbler-strip-container');
            const scaleContainer = wrapper.querySelector('.scale-container');
            const strip = document.createElement('div');
            strip.classList.add('tumbler-strip');
            const part = wrapper.dataset.timePart;
            let maxDigit = 9;
            if (part === 'h1') maxDigit = 2;
            if (part === 'm1' || part === 's1') maxDigit = 5;
            for (let i = 0; i <= maxDigit; i++) {
                const numberEl = document.createElement('div');
                numberEl.classList.add('number');
                numberEl.textContent = i;
                strip.appendChild(numberEl);
                if (scaleContainer) {
                    const tickEl = document.createElement('div');
                    tickEl.classList.add('tick');
                    scaleContainer.appendChild(tickEl);
                }
            }
            stripContainer.appendChild(strip);
        });
    }

    /**
     * Updates a single tumbler to the specified value.
     * @param {string} part - The identifier for the tumbler (e.g., 'h1', 'm2').
     * @param {string} value - The digit to display.
     */
    function updateTumbler(part, value) {
        const tumblerWrapper = document.querySelector(`[data-time-part="${part}"]`);
        if (!tumblerWrapper) return;
        const tumblerStrip = tumblerWrapper.querySelector('.tumbler-strip');
        const valueIndex = parseInt(value, 10);
        const yOffset = -valueIndex * tumblerHeight;
        tumblerStrip.style.transform = `translateY(${yOffset}px)`;
        const numbers = tumblerStrip.querySelectorAll('.number');
        const activeColor = getComputedStyle(body).getPropertyValue('--text-color-active');
        const inactiveColor = getComputedStyle(body).getPropertyValue('--text-color');
        numbers.forEach((num, index) => {
            if (index === valueIndex) {
                num.style.color = activeColor;
                num.style.fontWeight = '600';
            } else {
                num.style.color = inactiveColor;
                num.style.fontWeight = '400';
            }
        });
    }

    /**
     * The main clock update loop, called every second.
     */
    function updateClock() {
        const now = new Date();
        const hoursStr = String(now.getHours()).padStart(2, '0');
        const minutesStr = String(now.getMinutes()).padStart(2, '0');
        const secondsStr = String(now.getSeconds()).padStart(2, '0');
        updateTumbler('h1', hoursStr[0]);
        updateTumbler('h2', hoursStr[1]);
        updateTumbler('m1', minutesStr[0]);
        updateTumbler('m2', minutesStr[1]);
        updateTumbler('s1', secondsStr[0]);
        updateTumbler('s2', secondsStr[1]);
    }
    
    // --- Initial Setup and Event Listeners ---
    
    // Set up event listeners
    musicToggle.addEventListener('click', toggleMusic);
    themeSwitcher.addEventListener('click', () => setTheme(!body.classList.contains('dark')));

    // Determine and set initial theme
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark);
    
    // Build the clock UI
    setupTumblers();

    // Start all intervals and initial function calls
    updateClock();
    setInterval(updateClock, 1000);
    
    updateDate();
    setInterval(updateDate, 60000); // Check for a new date every minute
    
    showNewQuote();
    setInterval(showNewQuote, 10000); // Change quote every 10 seconds
});
