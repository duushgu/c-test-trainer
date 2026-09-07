export interface RawPassageData {
  id: string;
  title: string;
  domain: string;
  difficulty: 'B2' | 'C1' | 'C2';
  batteryId: string;
  batteryTitle: string;
  rawText: string;
}

export const PRESET_BATTERIES = [
  {
    id: 'battery-1',
    title: 'Battery 1: Theoretical Physics & Mathematical Sciences',
    description: 'Quantum mechanics, general relativity, nonlinear dynamics, and statistical physics.',
    difficulty: 'C1/C2',
  },
  {
    id: 'battery-2',
    title: 'Battery 2: Computer Science & Computational Logic',
    description: 'Turing computability, deep learning architectures, cryptography, and complexity theory.',
    difficulty: 'C1',
  },
  {
    id: 'battery-3',
    title: 'Battery 3: Quantitative Economics & Game Theory',
    description: 'Nash equilibrium, market efficiency, monetary policy, and behavioral dynamics.',
    difficulty: 'B2/C1',
  },
  {
    id: 'battery-4',
    title: 'Battery 4: Cognitive Science & Scientific Philosophy',
    description: 'Epistemology, paradigm shifts, neuroplasticity, and human decision-making under uncertainty.',
    difficulty: 'C1/C2',
  },
];

export const RAW_PASSAGES: RawPassageData[] = [
  // --- BATTERY 1: Physics & Math ---
  {
    id: 'phys-01',
    batteryId: 'battery-1',
    batteryTitle: 'Theoretical Physics & Mathematics',
    title: 'Quantum Superposition and Measurement',
    domain: 'Quantum Physics',
    difficulty: 'C1',
    rawText: `Quantum mechanics represents one of the greatest triumphs of modern theoretical physics. At microscopic scales, physical systems exhibit behaviors that thoroughly contradict our everyday classical intuition. Elementary particles can exist in superpositions of multiple distinct states until an external interaction forces a definitive collapse. This probabilistic mathematical framework revolutionized our foundational understanding of atomic spectra and covalent bonding. Today, quantum information science promises to transform modern computing, cryptographic security, and optical communications forever.`,
  },
  {
    id: 'phys-02',
    batteryId: 'battery-1',
    batteryTitle: 'Theoretical Physics & Mathematics',
    title: 'General Relativity and Curved Spacetime',
    domain: 'Astrophysics',
    difficulty: 'C1',
    rawText: `Einstein formulated general relativity by interpreting gravitation not as an invisible force but as the geometric curvature of four-dimensional spacetime. Massive astronomical bodies like stars and black holes warp the surrounding metric tensor, causing freely moving matter and electromagnetic radiation to follow curved geodesics. Precise astronomical observations of gravitational lensing and orbital perihelion precession continuously confirm these tensor equations with astonishing numerical precision. Gravitational wave detectors have further opened an entirely novel window into cataclysmic astrophysical collisions throughout the observable universe.`,
  },
  {
    id: 'phys-03',
    batteryId: 'battery-1',
    batteryTitle: 'Theoretical Physics & Mathematics',
    title: 'Entropy and the Second Law of Thermodynamics',
    domain: 'Thermodynamics',
    difficulty: 'B2',
    rawText: `The second law of thermodynamics establishes a fundamental asymmetry between the past and the future. In any isolated thermodynamic system, the macroscopic quantity known as entropy will spontaneously tend toward a maximum equilibrium value over time. Ludwig Boltzmann demonstrated that thermodynamic entropy is directly proportional to the statistical multiplicity of microscopic microstates corresponding to a given macrostate. Macroscopic physical systems exhibit an irreversible tendency toward thermodynamic equilibrium because disordered microscopic configurations vastly outnumber ordered arrangements. While individual particle trajectories remain strictly time-symmetric under microscopic dynamical laws, thermal fluctuations cannot spontaneously reverse macroscopic dissipation in large ensembles.`,
  },
  {
    id: 'phys-04',
    batteryId: 'battery-1',
    batteryTitle: 'Theoretical Physics & Mathematics',
    title: 'Chaos Theory and Deterministic Systems',
    domain: 'Applied Mathematics',
    difficulty: 'C1',
    rawText: `Deterministic chaos describes complex dynamical systems whose long-term behavioral trajectories exhibit extreme sensitivity to initial conditions. Often popularized as the butterfly effect, minute perturbations in the initial parameters of nonlinear differential equations can yield dramatically divergent numerical outcomes. Edward Lorenz originally discovered this phenomenon while attempting to construct simplified mathematical simulations of atmospheric convection patterns. Trajectories within bounded phase space continually fold and stretch around strange attractors with fractional fractal Hausdorff dimensions. Although the underlying governing equations are entirely deterministic and devoid of random noise, accurate long-range weather forecasting remains fundamentally bounded by unavoidable measurement uncertainties.`,
  },
  {
    id: 'phys-05',
    batteryId: 'battery-1',
    batteryTitle: 'Theoretical Physics & Mathematics',
    title: 'Prime Numbers and Cryptographic Algorithms',
    domain: 'Number Theory',
    difficulty: 'C2',
    rawText: `Prime numbers constitute the fundamental atomic building blocks of natural numbers through the fundamental theorem of arithmetic. Despite their elementary definition, the global distribution of primes across the real number line remains one of the deepest enigmas in pure mathematics. The famous Riemann hypothesis postulates that all non-trivial complex zeros of the zeta function possess a real part precisely equal to one-half. Contemporary asymmetrical public-key cryptography heavily relies upon the computational intractability of decomposing enormous composite integers into their constituent prime factors.`,
  },

  // --- BATTERY 2: Computer Science & AI ---
  {
    id: 'cs-01',
    batteryId: 'battery-2',
    batteryTitle: 'Computer Science & Computational Logic',
    title: 'The Church-Turing Thesis and Computability',
    domain: 'Theoretical Computer Science',
    difficulty: 'C1',
    rawText: `Alan Turing formalized the conceptual foundation of automated computation by introducing theoretical tape-manipulating machines. His mathematical model demonstrated that any algorithmic procedure capable of being mechanically computed can be executed by a universal Turing machine. Crucially, Turing also proved that certain profound decision problems, most notably the halting problem, are provably undecidable by any conceivable finite algorithm. Recursive function theory developed by Alonzo Church established an equivalent characterization of computability through lambda calculus transformations. This monumental mathematical discovery decisively established rigorous theoretical boundaries regarding what mechanical computational devices can ever compute.`,
  },
  {
    id: 'cs-02',
    batteryId: 'battery-2',
    batteryTitle: 'Computer Science & Computational Logic',
    title: 'Deep Neural Networks and Representation Learning',
    domain: 'Artificial Intelligence',
    difficulty: 'C1',
    rawText: `Modern machine learning has transitioned from manual feature engineering toward deep hierarchical representation learning. Multi-layered artificial neural networks progressively transform raw input tensors into increasingly abstract semantic representations through parameterized nonlinear activation functions. Backpropagation utilizes the differential calculus chain rule to compute loss gradients across millions of interconnected weight matrices during optimization. Stochastic gradient descent systematically guides these expansive numerical parameters toward favorable local minima across high-dimensional non-convex loss surfaces. While empirical performance in natural language processing and computer vision has exceeded historical benchmarks, fully interpreting intermediate latent representations remains an active area of contemporary research.`,
  },
  {
    id: 'cs-03',
    batteryId: 'battery-2',
    batteryTitle: 'Computer Science & Computational Logic',
    title: 'Algorithmic Complexity and P versus NP',
    domain: 'Computational Complexity',
    difficulty: 'C2',
    rawText: `The relationship between polynomial-time verifiable problems and polynomial-time solvable problems constitutes the central open problem in computer science. The complexity class P contains decision problems solvable by a deterministic algorithm within polynomial running time, whereas NP encompasses problems whose proposed solutions can merely be verified in polynomial time. Theoretical computer scientists broadly conjecture that P does not equal NP, implying that verifying an existing mathematical proof is intrinsically easier than discovering one from scratch. Resolving this foundational conjecture would have immense practical consequences for modern optimization and cryptographic security.`,
  },
  {
    id: 'cs-04',
    batteryId: 'battery-2',
    batteryTitle: 'Computer Science & Computational Logic',
    title: 'Distributed Systems and Consensus Protocols',
    domain: 'Distributed Computing',
    difficulty: 'C1',
    rawText: `Designing resilient distributed computer networks requires coordinating independent computational nodes over inherently unreliable communication channels. The fundamental consensus problem entails getting independent servers to agree upon a single consistent state despite network partitions, message delays, and hardware failures. Seminal theoretical results demonstrate that achieving deterministic distributed consensus in an asynchronous environment is formally impossible if even a single node is prone to unannounced crashes. Practical distributed algorithms like Paxos and Raft overcome these theoretical limitations by introducing partially synchronous timing assumptions and majority quorum voting.`,
  },
  {
    id: 'cs-05',
    batteryId: 'battery-2',
    batteryTitle: 'Computer Science & Computational Logic',
    title: 'Information Theory and Channel Capacity',
    domain: 'Information Theory',
    difficulty: 'C1',
    rawText: `Claude Shannon founded mathematical communication theory by quantifying the fundamental limits of data compression and reliable transmission over noisy channels. He defined information entropy as the expected mathematical value of uncertainty contained in a stochastic source message. Shannon demonstrated that error-free data communication is achievable up to a definitive theoretical channel capacity through appropriate error-correcting codes. Source coding theorems rigorously establish the minimum average number of binary digits required to represent messages without irreversible loss. This revolutionary analytical formulation bridged abstract probability theory with electrical engineering, laying the vital theoretical substrate for modern digital telecommunications.`,
  },

  // --- BATTERY 3: Quantitative Economics & Finance ---
  {
    id: 'econ-01',
    batteryId: 'battery-3',
    batteryTitle: 'Quantitative Economics & Game Theory',
    title: 'Game Theory and the Nash Equilibrium',
    domain: 'Microeconomics',
    difficulty: 'B2',
    rawText: `Game theory analyzes strategic interpersonal interactions where the outcome for each participant depends upon the collective decisions of all agents. John Nash mathematically proved that every finite game with a finite number of players possesses at least one strategic equilibrium in mixed strategies. In a Nash equilibrium, no individual economic actor can unilaterally improve their expected payoff by changing their chosen strategy while other players keep theirs fixed. Dominant strategy incentives frequently drive rational agents into suboptimal collective dilemmas, illustrating why cooperation often breaks down without binding legal agreements. This analytical paradigm fundamentally transformed modern antitrust economics, auction design, international trade diplomacy, and evolutionary biology.`,
  },
  {
    id: 'econ-02',
    batteryId: 'battery-3',
    batteryTitle: 'Quantitative Economics & Game Theory',
    title: 'The Efficient Market Hypothesis',
    domain: 'Financial Economics',
    difficulty: 'B2',
    rawText: `The efficient market hypothesis asserts that asset prices in liquid financial exchanges reflect all currently available relevant information. According to this theoretical framework, future price movements are driven purely by unpredictable newly arriving news events, causing asset prices to resemble a stochastic random walk. Consequently, individual investment managers cannot systematically generate risk-adjusted excess returns over extended horizons without assuming disproportionately higher portfolio volatility. While empirical market anomalies and behavioral phenomena challenge extreme versions of this theory, it remains the baseline benchmark for financial market regulation.`,
  },
  {
    id: 'econ-03',
    batteryId: 'battery-3',
    batteryTitle: 'Quantitative Economics & Game Theory',
    title: 'Behavioral Biases and Prospect Theory',
    domain: 'Behavioral Economics',
    difficulty: 'C1',
    rawText: `Traditional neoclassical economic theory assumes that human decision makers act as perfectly rational utility-maximizing agents. However, extensive experimental research conducted by Daniel Kahneman and Amos Tversky revealed systematic deviations from normative economic rationality. Their prospect theory demonstrated that human psychology exhibits profound loss aversion, meaning the psychological pain of losing wealth is significantly more acute than the pleasure of equivalent gains. Furthermore, individuals consistently misestimate low-probability events, displaying non-linear decision weighting and cognitive framing effects when confronting economic uncertainty. Cognitive heuristics simplify complex probabilistic judgments but introduce predictable systematic errors into financial valuation decisions.`,
  },
  {
    id: 'econ-04',
    batteryId: 'battery-3',
    batteryTitle: 'Quantitative Economics & Game Theory',
    title: 'Monetary Policy and Central Banking',
    domain: 'Macroeconomics',
    difficulty: 'C1',
    rawText: `Central banks manage sovereign monetary policy to pursue macroeconomic objectives such as price stability and sustainable economic employment. By adjusting short-term benchmark interest rates and executing open market asset operations, monetary authorities influence overall liquidity conditions across the banking system. The complex transmission mechanism channels interest rate adjustments through commercial credit markets, exchange rates, and business investment sentiment. When benchmark interest rates approach the effective lower bound, central banks frequently deploy unconventional balance sheet expansion policies to sustain aggregate economic demand.`,
  },
  {
    id: 'econ-05',
    batteryId: 'battery-3',
    batteryTitle: 'Quantitative Economics & Game Theory',
    title: 'Option Pricing and Continuous-Time Stochastic Calculus',
    domain: 'Quantitative Finance',
    difficulty: 'C2',
    rawText: `The Black-Scholes-Merton mathematical model revolutionized financial derivatives valuation by formulating a closed-form analytical solution for European options. The derivation relies upon constructing a continuously rebalanced riskless hedge portfolio comprising the underlying asset and a risk-free bond. Under the mathematical assumption that underlying asset prices follow geometric Brownian motion with constant volatility, the option price satisfies a second-order parabolic partial differential equation. This continuous-time quantitative methodology spurred explosive growth in global derivatives trading and established mathematical financial engineering as an independent discipline.`,
  },

  // --- BATTERY 4: Cognitive Science & Philosophy ---
  {
    id: 'phil-01',
    batteryId: 'battery-4',
    batteryTitle: 'Cognitive Science & Scientific Philosophy',
    title: 'Epistemology and Scientific Revolutions',
    domain: 'Philosophy of Science',
    difficulty: 'C1',
    rawText: `Thomas Kuhn revolutionized the historical philosophy of scientific progress by introducing the conceptual framework of paradigm shifts. Rather than advancing through continuous linear accumulation of empirical facts, normal scientific research operates within universally acknowledged conceptual frameworks. When accumulating experimental anomalies resist resolution within the prevailing consensus, the discipline experiences a profound epistemological crisis. Revolutionary scientific transitions occur through gestalt shifts rather than purely objective algorithmic verifications of observational propositions. Kuhn argued that competing historical paradigms are fundamentally incommensurable because opposing scientific communities evaluate experimental observations using mutually divergent conceptual vocabularies.`,
  },
  {
    id: 'phil-02',
    batteryId: 'battery-4',
    batteryTitle: 'Cognitive Science & Scientific Philosophy',
    title: 'Neuroplasticity and Memory Consolidation',
    domain: 'Cognitive Neuroscience',
    difficulty: 'C1',
    rawText: `Modern cognitive neuroscience has thoroughly debunked the historical dogma that the adult human brain is structurally rigid and immutable. Neuroplasticity refers to the biological capacity of neuronal networks to physically reorganize their structural architecture and synaptic strength in response to environmental learning. Long-term potentiation strengthens synaptic transmission across frequently stimulated pathways, creating durable cellular substrates for cognitive retention. Memory consolidation describes the gradual physiological process whereby fragile newly acquired short-term memories transform into stable long-term neocortical representations. During slow-wave sleep, coordinated neural replay between the hippocampus and cerebral cortex systematically reinforces enduring mnemonic pathways.`,
  },
  {
    id: 'phil-03',
    batteryId: 'battery-4',
    batteryTitle: 'Cognitive Science & Scientific Philosophy',
    title: 'The Chinese Room Argument and Strong AI',
    domain: 'Philosophy of Mind',
    difficulty: 'C2',
    rawText: `John Searle formulated the famous Chinese room thought experiment to challenge the philosophical claim that computational symbol manipulation constitutes genuine intentional understanding. In his hypothetical thought experiment, an English-speaking human locked inside a room follows a comprehensive formal rulebook to manipulate complex Chinese ideograms without comprehending their semantic meaning. Although external observers receive indistinguishable conversational responses, the internal operator performs formal mechanical operations without subjective semantic comprehension. Searle argued that syntactic processing can never be sufficient for generating authentic human semantic understanding or consciousness. Consequently, computational simulations of cognitive processes cannot be equated with the actual biological mental phenomena they merely model.`,
  },
  {
    id: 'phil-04',
    batteryId: 'battery-4',
    batteryTitle: 'Cognitive Science & Scientific Philosophy',
    title: 'Linguistic Relativity and Cognitive Representation',
    domain: 'Linguistics',
    difficulty: 'B2',
    rawText: `The linguistic relativity hypothesis posits that the structural grammatical categories of a spoken language profoundly influence the habitual cognitive perceptions of its native speakers. While extreme versions suggesting language strictly imprisons human thought have been broadly rejected, subtle cognitive influences have been empirically documented in spatial orientation and color discrimination. Speakers of languages requiring explicit cardinal directions frequently maintain a continuous subconscious awareness of geographic orientation that relative-direction speakers do not exhibit. These comparative psychological findings highlight the intricate reciprocal relationship between cultural linguistic conventions and fundamental sensory perception.`,
  },
  {
    id: 'phil-05',
    batteryId: 'battery-4',
    batteryTitle: 'Cognitive Science & Scientific Philosophy',
    title: 'The Hard Problem of Consciousness',
    domain: 'Philosophy of Mind',
    difficulty: 'C2',
    rawText: `David Chalmers famously distinguished between the relatively straightforward technical questions of cognitive neurobiology and the hard problem of subjective consciousness. Easy scientific problems involve explaining objective cognitive functions, such as sensory discrimination, memory recall, and attentional focus. In sharp contrast, the hard problem questions why the physical execution of information processing inside biological brains is accompanied by subjective phenomenal experience at all. Explaining functional behavioral mechanisms leaves an explanatory gap regarding why subjective qualia accompany neural dynamics. Why should complex electro-chemical interactions give rise to the inner qualitative feeling of experiencing redness or experiencing acute physical pain?`,
  },
];
