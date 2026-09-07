# English C-Test Master & Trainer

A modern, responsive, client-side web application designed to prepare for and simulate authentic **English C-Tests** (CEFR levels B2, C1, and C2) with automated scoring, academic & STEM passage batteries, an interactive custom text generator, and 1-click Anki Cloze export.

Live Web App: **[https://duushgu.github.io/c-test-trainer/](https://duushgu.github.io/c-test-trainer/)**

---

## What is a C-Test?

The C-Test is an integrative psycholinguistic testing method developed by Christine Klein-Braley and Ulrich Raatz. It measures comprehensive operational language competence and grammar/collocation fluency.

### The C-Principle (Mathematical Deletion Rule)
1. **Context Anchors**: Sentence 1 (lead-in) and the final sentence (lead-out) remain 100% intact.
2. **Cadence**: Starting from sentence 2, every second eligible word has its second half truncated.
3. **Partitioning**:
   - For a word of length $L \ge 3$:
     - Retained prefix length: $k = \lfloor L / 2 \rfloor$
     - Deleted suffix length: $g = \lceil L / 2 \rceil = L - k$
   - Short words ($L < 3$, e.g., *a*, *to*, *in*, *is*) and mid-sentence proper nouns are skipped.
   - Each passage provides exactly **20 gaps**.

---

## Features

- **4 Authentic Academic Batteries (20 Passages, 400 Gaps)**:
  - **Battery 1**: Theoretical Physics & Mathematical Sciences (Quantum Mechanics, General Relativity, Chaos Theory, Thermodynamics, Prime Cryptography).
  - **Battery 2**: Computer Science & Computational Logic (Turing Computability, Deep Neural Networks, Consensus Protocols, P vs NP, Shannon Information).
  - **Battery 3**: Quantitative Economics & Game Theory (Nash Equilibrium, Efficient Market Hypothesis, Prospect Theory, Monetary Policy, Black-Scholes).
  - **Battery 4**: Cognitive Science & Scientific Philosophy (Kuhn Paradigm Shifts, Neuroplasticity, Chinese Room Argument, Hard Problem of Consciousness).
- **Custom C-Test Generator**:
  - Paste any academic excerpt, research abstract, or newspaper article. The engine will tokenize and generate a C-Test on the fly.
- **Anki Spaced Repetition (SRS) Bridge**:
  - Automatically identifies all gaps you missed during the test.
  - Generates downloadable Anki Cloze `.txt` records with `{{c1::suffix}}` formatting, ready to import.
- **Exam Countdown Timer**:
  - 25:00 full-battery countdown or self-paced practice.
- **Auto-Advancing Keyboard Navigation**:
  - Automatically jumps to the next gap when you finish typing the required letter count. Supports `Backspace` backtracking and arrow navigation.
- **Zero Server Dependencies**:
  - 100% client-side SPA. Runs offline, stores progress in `localStorage`, zero tracking, zero ads.

---

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Tooling**: Vite 8 + TailwindCSS v4
- **Testing**: Vitest (Unit tests verifying word partitioning, cadence, and eligibility)
- **Icons & Animation**: Lucide Icons + Canvas Confetti
- **CI/CD**: GitHub Actions deploying to GitHub Pages

---

## Local Development

```bash
# Clone the repository
git clone https://github.com/duushgu/c-test-trainer.git
cd c-test-trainer

# Install dependencies
npm install

# Run unit test suite
npm test

# Run local development server
npm run dev

# Build production bundle
npm run build
```
