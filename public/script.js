// ============================================
// Digital Habit Architect — Frontend Logic
// ============================================

// === Background Particles ===
function initParticles() {
    const container = document.getElementById('bgParticles');
    if (!container) return;
    const count = 40;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (6 + Math.random() * 6) + 's';
        particle.style.width = (2 + Math.random() * 3) + 'px';
        particle.style.height = particle.style.width;

        // Random colors from palette
        const colors = [
            'rgba(124, 58, 237, 0.6)',
            'rgba(6, 182, 212, 0.5)',
            'rgba(167, 139, 250, 0.4)',
            'rgba(103, 232, 249, 0.4)',
            'rgba(16, 185, 129, 0.3)',
        ];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        container.appendChild(particle);
    }
}

// === Store last plan for copying ===
let lastPlanData = null;

// === Generate Habit Plan ===
async function generatePlan() {
    const badHabit = document.getElementById('badHabit').value.trim();
    const goal = document.getElementById('goal').value.trim();
    const btn = document.getElementById('generateBtn');
    const errorContainer = document.getElementById('errorContainer');
    const resultsSection = document.getElementById('resultsSection');

    // Validation
    if (!badHabit) {
        showError('Please enter a bad habit you want to break.');
        document.getElementById('badHabit').focus();
        return;
    }
    if (!goal) {
        showError('Please enter your goal.');
        document.getElementById('goal').focus();
        return;
    }

    // Hide previous results/errors
    errorContainer.style.display = 'none';
    resultsSection.style.display = 'none';

    // Toggle button state
    btn.disabled = true;
    btn.querySelector('.btn-content').style.display = 'none';
    btn.querySelector('.btn-loader').style.display = 'flex';

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bad_habit: badHabit, goal: goal }),
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.detail || `Server error (${response.status})`);
        }

        const data = await response.json();
        lastPlanData = data;
        renderResults(data);

    } catch (err) {
        showError(err.message || 'Something went wrong. Please try again.');
    } finally {
        btn.disabled = false;
        btn.querySelector('.btn-content').style.display = 'flex';
        btn.querySelector('.btn-loader').style.display = 'none';
    }
}

// === Render Results ===
function renderResults(data) {
    const resultsSection = document.getElementById('resultsSection');

    // Update summary
    document.getElementById('summaryHabit').textContent = data.bad_habit;
    document.getElementById('summaryGoal').textContent = data.goal;
    document.getElementById('durationText').textContent = `Generated in ${data.duration}s`;

    // Build timeline steps
    const timeline = document.getElementById('stepsTimeline');
    timeline.innerHTML = '';

    data.plan.forEach((step) => {
        const stepEl = document.createElement('div');
        stepEl.className = 'timeline-step';
        stepEl.innerHTML = `
            <div class="step-dot step-${step.step_number}">${step.step_number}</div>
            <div class="step-card">
                <div class="step-header">
                    <span class="step-number">Step ${step.step_number}</span>
                </div>
                <h3 class="step-title">${escapeHtml(step.title)}</h3>
                <p class="step-description">${escapeHtml(step.description)}</p>
                <div class="habit-formula">
                    <div class="formula-label">Tiny Habit Recipe</div>
                    <div class="formula-parts">
                        <span class="formula-keyword">After I</span>
                        <span class="formula-text">${escapeHtml(step.anchor)}</span>
                        <span class="formula-arrow">→</span>
                        <span class="formula-keyword">I will</span>
                        <span class="formula-text">${escapeHtml(step.tiny_behavior)}</span>
                    </div>
                </div>
                <div class="celebration-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    Celebrate: ${escapeHtml(step.celebration)}
                </div>
            </div>
        `;
        timeline.appendChild(stepEl);
    });

    // Show motivation
    if (data.motivation) {
        const motivCard = document.getElementById('motivationCard');
        document.getElementById('motivationText').textContent = data.motivation;
        motivCard.style.display = 'block';
    }

    // Show results
    resultsSection.style.display = 'block';

    // Smooth scroll to results
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// === Show Error ===
function showError(message) {
    const container = document.getElementById('errorContainer');
    document.getElementById('errorMessage').textContent = message;
    container.style.display = 'flex';
}

// === Reset Form ===
function resetForm() {
    document.getElementById('badHabit').value = '';
    document.getElementById('goal').value = '';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('errorContainer').style.display = 'none';
    document.getElementById('motivationCard').style.display = 'none';
    lastPlanData = null;

    document.getElementById('inputSection').scrollIntoView({
        behavior: 'smooth',
        block: 'start',
    });

    document.getElementById('badHabit').focus();
}

// === Copy Plan as Text ===
function copyPlan() {
    if (!lastPlanData) return;

    const d = lastPlanData;
    let text = `🧠 DIGITAL HABIT ARCHITECT — Your Tiny Habits Plan\n`;
    text += `${'═'.repeat(50)}\n\n`;
    text += `❌ Bad Habit: ${d.bad_habit}\n`;
    text += `⭐ Goal: ${d.goal}\n\n`;

    d.plan.forEach((step) => {
        text += `── Step ${step.step_number}: ${step.title} ──\n`;
        text += `${step.description}\n\n`;
        text += `📌 Tiny Habit Recipe:\n`;
        text += `   After I ${step.anchor} → I will ${step.tiny_behavior}\n\n`;
        text += `🎉 Celebrate: ${step.celebration}\n\n`;
    });

    if (d.motivation) {
        text += `${'─'.repeat(50)}\n`;
        text += `🔥 ${d.motivation}\n`;
    }

    navigator.clipboard.writeText(text).then(() => {
        showToast('Plan copied to clipboard!');
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Plan copied to clipboard!');
    });
}

// === Toast Notification ===
function showToast(message) {
    // Remove existing toast
    const existing = document.querySelector('.copy-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'copy-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 2500);
}

// === Escape HTML ===
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// === Enter key support ===
document.addEventListener('DOMContentLoaded', () => {
    initParticles();

    // Enter key triggers generation
    ['badHabit', 'goal'].forEach((id) => {
        document.getElementById(id).addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                generatePlan();
            }
        });
    });
});
