import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  RotateCcw, 
  Sliders, 
  Cpu, 
  Activity, 
  Info, 
  BarChart, 
  Terminal, 
  Server, 
  Send, 
  Database, 
  Sparkles, 
  RefreshCw, 
  Layers, 
  ShieldCheck,
  Check,
  Trash2
} from 'lucide-react';

interface SortingStep {
  type: 'compare' | 'swap' | 'overwrite' | 'pivot';
  indices: [number, number] | [number];
  values?: number[];
}

export default function CSLab() {
  const [algorithm, setAlgorithm] = useState<'bubble' | 'quick' | 'merge'>('quick');
  const [arraySize, setArraySize] = useState<number>(30);
  const [array, setArray] = useState<number[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(50); // ms delay
  const [compares, setCompares] = useState<number>(0);
  const [swaps, setSwaps] = useState<number>(0);
  
  // Highlighting states during playback
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [swappingIndices, setSwappingIndices] = useState<number[]>([]);
  const [pivotIndex, setPivotIndex] = useState<number>(-1);
  const [isSorted, setIsSorted] = useState<boolean>(false);

  // Telemetry & Mentor State Variables
  const [labTab, setLabTab] = useState<'visualizer' | 'advisor'>('visualizer');
  const [telemetry, setTelemetry] = useState<any>(null);
  const [packetLogs, setPacketLogs] = useState<any[]>([]);
  const [advisorTopic, setAdvisorTopic] = useState<string>('lsm');
  const [advisorPrompt, setAdvisorPrompt] = useState<string>('');
  const [advisorResponse, setAdvisorResponse] = useState<string>('');
  const [advisorLoading, setAdvisorLoading] = useState<boolean>(false);
  const [telemetryError, setTelemetryError] = useState<string>('');

  const stepsRef = useRef<SortingStep[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch server diagnostic metrics
  const fetchTelemetry = async () => {
    try {
      setTelemetryError('');
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setTelemetry(data);
      } else {
        setTelemetryError('Server API unreachable');
      }
    } catch (e) {
      console.error("Telemetry fetch error:", e);
      setTelemetryError('Server offline / CORS filter blocked');
    }
  };

  // Fetch persistent messages list (Packet Log)
  const fetchPacketLogs = async () => {
    try {
      const res = await fetch('/api/contact/list');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setPacketLogs(data.packets);
        }
      }
    } catch (e) {
      console.error("Packet log fetch error:", e);
    }
  };

  // Delete message packet on the server
  const deletePacket = async (id: string) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setPacketLogs((prev) => prev.filter((p) => p.id !== id));
        fetchTelemetry(); // refresh count
      }
    } catch (e) {
      console.error("Packet delete error:", e);
    }
  };

  // Query AI Mentor
  const handleQueryAdvisor = async (e?: FormEvent, customTopic?: string) => {
    if (e) e.preventDefault();
    const activeTopic = customTopic || advisorTopic;
    if (activeTopic === 'custom' && !advisorPrompt) return;

    setAdvisorLoading(true);
    setAdvisorResponse('');

    try {
      const response = await fetch('/api/gemini/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: activeTopic === 'custom' ? undefined : activeTopic,
          prompt: activeTopic === 'custom' ? advisorPrompt : undefined,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setAdvisorResponse(data.text || '');
      } else {
        setAdvisorResponse(`[SYSTEM_FAILURE] ${data.message || 'Advisor evaluation error.'}`);
      }
    } catch (err) {
      console.error('Advisor fetch error:', err);
      setAdvisorResponse('[ERROR] Connection refused: Could not transmit query packet to server.');
    } finally {
      setAdvisorLoading(false);
    }
  };

  // Run initial polls and interval
  useEffect(() => {
    fetchTelemetry();
    fetchPacketLogs();
    const interval = setInterval(() => {
      fetchTelemetry();
    }, 12000); // Poll health every 12s
    return () => clearInterval(interval);
  }, []);

  // Generate a random array
  const generateNewArray = (size: number = arraySize) => {
    stopVisualization();
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 80) + 15);
    setArray(newArray);
    setIsSorted(false);
    setCompares(0);
    setSwaps(0);
    setCurrentStepIndex(-1);
    setComparingIndices([]);
    setSwappingIndices([]);
    setPivotIndex(-1);
    stepsRef.current = [];
  };

  // Generate array on mount or size change
  useEffect(() => {
    generateNewArray(arraySize);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [arraySize]);

  // Stop visualization
  const stopVisualization = () => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Precompute sorting steps based on selected algorithm
  const startVisualization = () => {
    if (isPlaying) {
      stopVisualization();
      return;
    }

    if (isSorted) {
      // Re-generate before starting
      const freshArray = [...array];
      // Quick scramble or just restart from current array but reset metrics
      setIsSorted(false);
      setCompares(0);
      setSwaps(0);
    }

    const steps: SortingStep[] = [];
    const arrCopy = [...array];

    if (algorithm === 'bubble') {
      runBubbleSort(arrCopy, steps);
    } else if (algorithm === 'quick') {
      runQuickSort(arrCopy, 0, arrCopy.length - 1, steps);
    } else if (algorithm === 'merge') {
      runMergeSort(arrCopy, 0, arrCopy.length - 1, steps);
    }

    stepsRef.current = steps;
    setIsPlaying(true);
    setCurrentStepIndex(0);
    playSteps(steps, 0);
  };

  // Step-by-step playback engine
  const playSteps = (steps: SortingStep[], startIndex: number) => {
    let index = startIndex;
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      if (index >= steps.length) {
        stopVisualization();
        setIsSorted(true);
        setComparingIndices([]);
        setSwappingIndices([]);
        setPivotIndex(-1);
        return;
      }

      const step = steps[index];
      setCurrentStepIndex(index);

      // Apply the visual step
      if (step.type === 'compare') {
        setComparingIndices(step.indices as number[]);
        setSwappingIndices([]);
        setCompares((prev) => prev + 1);
      } else if (step.type === 'swap') {
        setSwappingIndices(step.indices as number[]);
        setComparingIndices([]);
        setSwaps((prev) => prev + 1);
        
        // Mutate array state
        const [idx1, idx2] = step.indices as [number, number];
        setArray((prev) => {
          const newArr = [...prev];
          const temp = newArr[idx1];
          newArr[idx1] = newArr[idx2];
          newArr[idx2] = temp;
          return newArr;
        });
      } else if (step.type === 'overwrite') {
        setSwappingIndices([]);
        setComparingIndices([]);
        setSwaps((prev) => prev + 1); // Track overwrite as an operation
        const [idx, val] = step.indices as [number, number];
        setArray((prev) => {
          const newArr = [...prev];
          newArr[idx] = val;
          return newArr;
        });
      } else if (step.type === 'pivot') {
        setPivotIndex(step.indices[0]);
      }

      index++;
    }, speed);
  };

  // Adjust speed during active playback
  useEffect(() => {
    if (isPlaying && stepsRef.current.length > 0 && currentStepIndex < stepsRef.current.length) {
      playSteps(stepsRef.current, currentStepIndex);
    }
  }, [speed]);

  // Bubble Sort Simulation
  const runBubbleSort = (arr: number[], steps: SortingStep[]) => {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        steps.push({ type: 'compare', indices: [j, j + 1] });
        if (arr[j] > arr[j + 1]) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          steps.push({ type: 'swap', indices: [j, j + 1] });
        }
      }
    }
  };

  // Quick Sort Simulation
  const runQuickSort = (arr: number[], low: number, high: number, steps: SortingStep[]) => {
    if (low < high) {
      const pIdx = partition(arr, low, high, steps);
      runQuickSort(arr, low, pIdx - 1, steps);
      runQuickSort(arr, pIdx + 1, high, steps);
    }
  };

  const partition = (arr: number[], low: number, high: number, steps: SortingStep[]): number => {
    const pivot = arr[high];
    steps.push({ type: 'pivot', indices: [high] });
    let i = low - 1;

    for (let j = low; j < high; j++) {
      steps.push({ type: 'compare', indices: [j, high] });
      if (arr[j] < pivot) {
        i++;
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        steps.push({ type: 'swap', indices: [i, j] });
      }
    }
    const temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    steps.push({ type: 'swap', indices: [i + 1, high] });
    return i + 1;
  };

  // Merge Sort Simulation
  const runMergeSort = (arr: number[], l: number, r: number, steps: SortingStep[]) => {
    if (l < r) {
      const m = Math.floor((l + r) / 2);
      runMergeSort(arr, l, m, steps);
      runMergeSort(arr, m + 1, r, steps);
      merge(arr, l, m, r, steps);
    }
  };

  const merge = (arr: number[], l: number, m: number, r: number, steps: SortingStep[]) => {
    const n1 = m - l + 1;
    const n2 = r - m;
    const L = arr.slice(l, m + 1);
    const R = arr.slice(m + 1, r + 1);

    let i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
      steps.push({ type: 'compare', indices: [l + i, m + 1 + j] });
      if (L[i] <= R[j]) {
        arr[k] = L[i];
        steps.push({ type: 'overwrite', indices: [k, L[i]] });
        i++;
      } else {
        arr[k] = R[j];
        steps.push({ type: 'overwrite', indices: [k, R[j]] });
        j++;
      }
      k++;
    }

    while (i < n1) {
      arr[k] = L[i];
      steps.push({ type: 'overwrite', indices: [k, L[i]] });
      i++;
      k++;
    }

    while (j < n2) {
      arr[k] = R[j];
      steps.push({ type: 'overwrite', indices: [k, R[j]] });
      j++;
      k++;
    }
  };

  // Get algorithm descriptions and complexities
  const getAlgoDetails = () => {
    switch (algorithm) {
      case 'bubble':
        return {
          title: "Bubble Sort",
          timeWorst: "O(N²)",
          timeBest: "O(N)",
          space: "O(1)",
          concept: "Repeatedly steps through the array, compares adjacent elements and swaps them if they are in the wrong order. It is stable and in-place.",
        };
      case 'quick':
        return {
          title: "Quick Sort",
          timeWorst: "O(N²)",
          timeBest: "O(N log N)",
          space: "O(log N)",
          concept: "Divide-and-conquer algorithm. Picks a pivot element, partitions the array around it, and recursively sorts the sub-arrays. It is typically fast and highly cache-friendly.",
        };
      case 'merge':
        return {
          title: "Merge Sort",
          timeWorst: "O(N log N)",
          timeBest: "O(N log N)",
          space: "O(N)",
          concept: "Stable divide-and-conquer algorithm. Divides the input array in halves, calls itself on each half, and merges the two sorted halves back together.",
        };
    }
  };

  const details = getAlgoDetails();

  return (
    <section id="cs-lab" className="py-20 bg-brand-card border-t border-brand-border">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-accent-primary mb-2">
            <Cpu className="w-5 h-5 animate-pulse" />
            <span className="text-xs uppercase tracking-widest font-mono font-semibold">Interactive Systems Laboratory</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight text-brand-charcoal">
            Systems Sandbox & Telemetry
          </h2>
          <p className="mt-3 text-brand-muted max-w-2xl text-sm md:text-base leading-relaxed font-sans">
            A low-level laboratory showing off hardware, algorithms, and microservices in real-time. Toggle between our in-browser visualizer and our real-time backend telemetry center.
          </p>
        </div>

        {/* Labs Tab Toggle */}
        <div className="flex space-x-2 p-1 aesthetic-frame max-w-md mb-8">
          <button
            id="tab-select-visualizer"
            onClick={() => setLabTab('visualizer')}
            className={`flex-1 py-2 px-4 rounded-lg text-xs font-mono font-medium flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              labTab === 'visualizer'
                ? 'bg-brand-charcoal text-brand-cream shadow-md'
                : 'text-brand-muted hover:text-brand-charcoal'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Algorithm Visualizer</span>
          </button>
          
          <button
            id="tab-select-advisor"
            onClick={() => { setLabTab('advisor'); fetchTelemetry(); fetchPacketLogs(); }}
            className={`flex-1 py-2 px-4 rounded-lg text-xs font-mono font-medium flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              labTab === 'advisor'
                ? 'bg-brand-charcoal text-brand-cream shadow-md'
                : 'text-brand-muted hover:text-brand-charcoal'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>AI Advisor & Telemetry</span>
          </button>
        </div>

        {labTab === 'visualizer' ? (
          /* ======================================================== */
          /* TAB 1: VISUALIZER (OLD SORTING GRID) */
          /* ======================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
            
            {/* Main Visualizer Stage */}
            <div className="lg:col-span-8 aesthetic-frame p-6 shadow-xs flex flex-col justify-between h-[480px]">
              {/* Stage Header */}
              <div className="flex items-center justify-between border-b border-brand-border pb-4 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-accent-primary animate-ping" />
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-brand-muted">
                    Array Status: {isPlaying ? 'Active Execution' : isSorted ? 'Fully Sorted' : 'Idle State'}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-xs font-mono text-brand-muted">
                  <div className="flex items-center space-x-1.5">
                    <Activity className="w-3.5 h-3.5" />
                    <span>Compares: <strong className="text-brand-charcoal">{compares}</strong></span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <BarChart className="w-3.5 h-3.5" />
                    <span>Operations: <strong className="text-brand-charcoal">{swaps}</strong></span>
                  </div>
                </div>
              </div>

              {/* Bars Canvas Container */}
              <div className="flex-1 flex items-end justify-between items-stretch h-[280px] px-2 pt-2 gap-[2px] bg-white/90 rounded-lg shadow-inner">
                {array.map((value, idx) => {
                  let barColor = "bg-slate-300 hover:bg-slate-400";
                  if (comparingIndices.includes(idx)) {
                    barColor = "bg-slate-800";
                  } else if (swappingIndices.includes(idx)) {
                    barColor = "bg-accent-primary";
                  } else if (idx === pivotIndex) {
                    barColor = "bg-amber-500";
                  } else if (isSorted) {
                    barColor = "bg-emerald-500/80";
                  }

                  return (
                    <div key={idx} className="flex-1 flex flex-col justify-end h-full">
                      <motion.div
                        style={{ height: `${value}%` }}
                        className={`w-full rounded-t-xs transition-colors duration-100 ${barColor}`}
                        layoutId={`bar-${idx}`}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Interactive Control Panel */}
              <div className="mt-6 pt-4 border-t border-brand-border flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    id="btn-play-visualization"
                    onClick={startVisualization}
                    className="px-4 py-2 bg-brand-charcoal text-brand-cream hover:bg-accent-primary rounded-lg font-mono text-xs font-medium flex items-center space-x-1.5 transition-colors duration-200 cursor-pointer"
                  >
                    <Play className={`w-3.5 h-3.5 ${isPlaying ? 'rotate-90 fill-current' : 'fill-current'}`} />
                    <span>{isPlaying ? 'Pause' : 'Execute'}</span>
                  </button>
                  
                  <button
                    id="btn-reset-visualization"
                    onClick={() => generateNewArray()}
                    className="p-2 aesthetic-frame hover:bg-brand-cream rounded-lg text-brand-charcoal transition-colors duration-200 cursor-pointer"
                    title="Generate Random Array"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Size Slider */}
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-[11px] text-brand-muted">Size: {arraySize}</span>
                  <input
                    id="slider-array-size"
                    type="range"
                    min="10"
                    max="60"
                    value={arraySize}
                    onChange={(e) => setArraySize(Number(e.target.value))}
                    disabled={isPlaying}
                    className="w-24 md:w-32 accent-accent-primary bg-brand-border h-1 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Speed Controller */}
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-[11px] text-brand-muted">Interval: {speed}ms</span>
                  <input
                    id="slider-visualizer-speed"
                    type="range"
                    min="5"
                    max="300"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-24 md:w-32 accent-accent-primary bg-brand-border h-1 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Sidebar - Algorithm Specifications */}
            <div className="lg:col-span-4 flex flex-col gap-6 animate-fade-in">
              <div className="aesthetic-frame p-4 flex flex-col gap-2">
                <span className="font-mono text-[10px] text-brand-muted uppercase tracking-widest px-2 mb-1 block">Select Primitive</span>
                
                <button
                  id="btn-select-quick"
                  onClick={() => { setAlgorithm('quick'); generateNewArray(); }}
                  disabled={isPlaying}
                  className={`w-full p-3 rounded-lg text-left border transition-all duration-200 cursor-pointer ${
                    algorithm === 'quick'
                      ? 'border-accent-primary bg-accent-secondary text-brand-charcoal'
                      : 'border-transparent hover:bg-brand-cream text-brand-muted hover:text-brand-charcoal'
                  }`}
                >
                  <div className="font-display text-sm font-semibold">Quick Sort</div>
                  <div className="font-mono text-[11px] opacity-80 mt-0.5">Average: O(N log N)</div>
                </button>

                <button
                  id="btn-select-merge"
                  onClick={() => { setAlgorithm('merge'); generateNewArray(); }}
                  disabled={isPlaying}
                  className={`w-full p-3 rounded-lg text-left border transition-all duration-200 cursor-pointer ${
                    algorithm === 'merge'
                      ? 'border-accent-primary bg-accent-secondary text-brand-charcoal'
                      : 'border-transparent hover:bg-brand-cream text-brand-muted hover:text-brand-charcoal'
                  }`}
                >
                  <div className="font-display text-sm font-semibold">Merge Sort</div>
                  <div className="font-mono text-[11px] opacity-80 mt-0.5">Worst-Case: O(N log N)</div>
                </button>

                <button
                  id="btn-select-bubble"
                  onClick={() => { setAlgorithm('bubble'); generateNewArray(); }}
                  disabled={isPlaying}
                  className={`w-full p-3 rounded-lg text-left border transition-all duration-200 cursor-pointer ${
                    algorithm === 'bubble'
                      ? 'border-accent-primary bg-accent-secondary text-brand-charcoal'
                      : 'border-transparent hover:bg-brand-cream text-brand-muted hover:text-brand-charcoal'
                  }`}
                >
                  <div className="font-display text-sm font-semibold">Bubble Sort</div>
                  <div className="font-mono text-[11px] opacity-80 mt-0.5">Average: O(N²)</div>
                </button>
              </div>

              <div className="aesthetic-frame p-5">
                <div className="flex items-center space-x-2 border-b border-brand-border pb-3 mb-4">
                  <Info className="w-4 h-4 text-accent-primary" />
                  <h3 className="font-display text-sm font-semibold text-brand-charcoal">Complexity Reference</h3>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="aesthetic-frame p-2.5 text-center">
                    <div className="text-[10px] uppercase font-mono tracking-wider text-brand-muted">Best Time</div>
                    <div className="text-xs font-mono font-bold text-brand-charcoal mt-1">{details.timeBest}</div>
                  </div>
                  <div className="aesthetic-frame p-2.5 text-center">
                    <div className="text-[10px] uppercase font-mono tracking-wider text-brand-muted">Worst Time</div>
                    <div className="text-xs font-mono font-bold text-accent-primary mt-1">{details.timeWorst}</div>
                  </div>
                  <div className="aesthetic-frame p-2.5 text-center">
                    <div className="text-[10px] uppercase font-mono tracking-wider text-brand-muted">Aux Space</div>
                    <div className="text-xs font-mono font-bold text-brand-charcoal mt-1">{details.space}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-mono text-[11px] text-brand-muted uppercase tracking-wider">Concept Profile</h4>
                  <p className="text-xs text-brand-muted leading-relaxed font-sans bg-brand-cream/50 p-3 rounded-lg aesthetic-frame">
                    {details.concept}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* TAB 2: AI ADVISOR & TELEMETRY PANEL */
          /* ======================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
            
            {/* Terminal View */}
            <div className="lg:col-span-8 aesthetic-frame p-5 md:p-6 shadow-2xl flex flex-col justify-between min-h-[480px]">
              
              {/* Terminal Header */}
              <div className="flex items-center justify-between border-b border-brand-border pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-emerald-500 animate-pulse" />
                  <span className="font-mono text-xs font-bold text-stone-300 uppercase tracking-wider">
                    AuraMentor AI Terminal v1.0.4
                  </span>
                </div>
                <div className="flex space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
              </div>

              {/* Terminal Screen Output */}
              <div className="flex-1 bg-brand-cream border border-stone-900 rounded-lg p-4 font-mono text-xs text-stone-300 overflow-y-auto max-h-[300px] space-y-3 leading-relaxed custom-scrollbar min-h-[250px]">
                {advisorResponse ? (
                  <div className="space-y-2 whitespace-pre-wrap select-text selection:bg-emerald-500 selection:text-black">
                    <div className="text-emerald-500 font-bold flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AURAMENTOR COMPILING ANALYSIS:</span>
                    </div>
                    <div className="pl-4 border-l-2 border-brand-border text-stone-300">
                      {advisorResponse}
                    </div>
                  </div>
                ) : advisorLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 text-stone-500 space-y-3 h-full min-h-[200px]">
                    <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
                    <span className="text-brand-muted font-bold text-[10px] tracking-widest text-center">TRANSMITTING PACKETS & GENERATING MODEL EVALUATION VIA GEMINI...</span>
                  </div>
                ) : (
                  <div className="text-brand-muted space-y-2">
                    <p className="text-stone-300 font-bold text-emerald-500">[SYSTEM READY] AuraMentor Online.</p>
                    <p>Select a predefined core systems engineering topic below or choose the custom option to write your own queries. All compilations run server-side and request structured evaluation using Gemini 3.5-flash.</p>
                    <p className="text-[11px] text-emerald-500/60 font-semibold">[CONSOLE READY] Enter prompt payload below to dispatch transaction.</p>
                  </div>
                )}
              </div>

              {/* Terminal Inputs Form */}
              <form onSubmit={handleQueryAdvisor} className="mt-5 pt-4 border-t border-brand-border/60 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Select preset topic */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] font-mono text-stone-500 uppercase">Topic Payload</label>
                    <select
                      value={advisorTopic}
                      onChange={(e) => setAdvisorTopic(e.target.value)}
                      disabled={advisorLoading}
                      className="bg-brand-cream border border-brand-border focus:border-emerald-500 text-stone-300 rounded-lg p-2 font-mono text-xs outline-none cursor-pointer"
                    >
                      <option value="lsm">LSM-Tree compaction strategies (Leveled vs Size-Tiered)</option>
                      <option value="cache">Cache-conscious structures & data alignment</option>
                      <option value="consensus">Raft consensus & log replication mechanics</option>
                      <option value="indexing">B-Trees vs LSM-Trees vs Hash Indexes</option>
                      <option value="custom">-- Custom Payload Prompt --</option>
                    </select>
                  </div>

                  {/* Pre-fill Action Button if preset */}
                  {advisorTopic !== 'custom' && (
                    <div className="flex items-end">
                      <button
                        type="button"
                        id="btn-evaluate-preset"
                        disabled={advisorLoading}
                        onClick={() => handleQueryAdvisor(undefined, advisorTopic)}
                        className="w-full bg-[#1A1817] hover:bg-[#1A1817] text-stone-300 hover:text-emerald-500 border border-brand-border rounded-lg py-2.5 font-mono text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Compile Preset Topic</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Custom Input prompt if 'custom' selected */}
                {advisorTopic === 'custom' && (
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-500 font-bold font-mono text-xs select-none">$</span>
                    <input
                      type="text"
                      required
                      value={advisorPrompt}
                      onChange={(e) => setAdvisorPrompt(e.target.value)}
                      placeholder="e.g., How does Leveled Compaction minimize read amplification?"
                      className="flex-1 bg-brand-cream border border-brand-border focus:border-emerald-500 text-stone-300 rounded-lg px-3 py-2 font-mono text-xs outline-none"
                    />
                    <button
                      type="submit"
                      id="btn-submit-advisor-prompt"
                      disabled={advisorLoading || !advisorPrompt}
                      className="bg-emerald-600 hover:bg-emerald-500 text-black font-bold px-4 py-2 rounded-lg font-mono text-xs transition-colors flex items-center space-x-1 cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      <span>Post</span>
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Sidebar: Diagnostics & Database Logs */}
            <div className="lg:col-span-4 flex flex-col gap-6 font-mono text-xs animate-fade-in">
              
              {/* Telemetry Block */}
              <div className="aesthetic-frame p-5 text-brand-muted">
                <div className="flex items-center space-x-2 border-b border-brand-border pb-3 mb-4 text-stone-200">
                  <Database className="w-4 h-4 text-orange-500" />
                  <h3 className="font-display text-sm font-semibold">Systems Telemetry</h3>
                </div>

                {telemetryError ? (
                  <div className="p-3 bg-red-950/40 border border-red-900 rounded-lg text-red-400 text-[11px] mb-2 flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span>Diagnostics Offline: {telemetryError}</span>
                  </div>
                ) : telemetry ? (
                  <div className="space-y-3.5">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-[#181615] border border-brand-border rounded-lg p-2.5">
                        <span className="text-[10px] text-stone-500 block uppercase">NODE VERSION</span>
                        <strong className="text-stone-200 font-bold mt-1 block">{telemetry.nodeVersion}</strong>
                      </div>
                      <div className="bg-[#181615] border border-brand-border rounded-lg p-2.5">
                        <span className="text-[10px] text-stone-500 block uppercase">OS PLATFORM</span>
                        <strong className="text-stone-200 font-bold mt-1 block capitalize">{telemetry.platform}</strong>
                      </div>
                    </div>

                    <div className="bg-[#181615] border border-brand-border rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center text-[10px] text-stone-500 uppercase">
                        <span>Buffer Heap Memory</span>
                        <span className="text-orange-400 font-bold">{(telemetry.memoryUsage.heapUsed / 1024 / 1024).toFixed(1)} MB used</span>
                      </div>
                      <div className="w-full bg-stone-900 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-orange-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (telemetry.memoryUsage.heapUsed / telemetry.memoryUsage.heapTotal) * 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] text-stone-600">
                        <span>ALLOCATED: {(telemetry.memoryUsage.heapTotal / 1024 / 1024).toFixed(1)} MB</span>
                        <span>RSS: {(telemetry.memoryUsage.rss / 1024 / 1024).toFixed(1)} MB</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-[11px] text-brand-muted font-mono">
                      <div className="flex justify-between py-1 border-b border-stone-900">
                        <span>CPU Socket State:</span>
                        <span className="text-emerald-500 font-semibold">LISTENING</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-900">
                        <span>Server Uptime:</span>
                        <span className="text-stone-200 font-semibold">{Math.floor(telemetry.uptime)}s</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-900">
                        <span>Active Connections:</span>
                        <span className="text-stone-200 font-semibold">{telemetry.telemetry.activeSockets} IP</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Packets Persisted:</span>
                        <span className="text-stone-200 font-semibold">{packetLogs.length} ACK</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-stone-600 flex flex-col items-center justify-center space-y-2">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Synthesizing systems statistics...</span>
                  </div>
                )}
              </div>

              {/* Message Packet Log (File Persistence View!) */}
              <div className="aesthetic-frame p-5 text-brand-muted">
                <div className="flex items-center justify-between border-b border-brand-border pb-3 mb-4">
                  <div className="flex items-center space-x-2 text-stone-200">
                    <Layers className="w-4 h-4 text-emerald-500" />
                    <h3 className="font-display text-sm font-semibold">Contact Packet Log</h3>
                  </div>
                  <button 
                    id="btn-refresh-packets"
                    onClick={fetchPacketLogs}
                    className="p-1 border border-brand-border hover:border-stone-700 rounded text-brand-muted hover:text-stone-200 cursor-pointer"
                    title="Refresh Log"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5 max-h-[180px] overflow-y-auto custom-scrollbar">
                  {packetLogs.length === 0 ? (
                    <p className="text-[10px] text-stone-600 text-center py-6 italic">No contact packets transmitted to disk.</p>
                  ) : (
                    packetLogs.map((p, idx) => (
                      <div key={p.id || idx} className="bg-[#181615] border border-brand-border/80 rounded-lg p-2.5 space-y-1 text-[11px] relative group hover:border-emerald-500/40 transition-colors">
                        <div className="flex justify-between items-start">
                          <strong className="text-stone-200 block truncate max-w-[130px] font-semibold">{p.name}</strong>
                          <span className="text-[9px] text-stone-500">{new Date(p.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <span className="text-[9px] text-emerald-500 font-mono block">[{p.subject.toUpperCase()}] {p.email}</span>
                        <p className="text-brand-muted line-clamp-2 text-[10px] leading-normal">{p.message}</p>
                        
                        {/* Delete Packet button */}
                        <button
                          id={`btn-delete-packet-${p.id}`}
                          onClick={() => deletePacket(p.id)}
                          className="absolute right-2.5 bottom-2.5 p-1 bg-stone-900/80 border border-brand-border hover:border-red-900 text-stone-500 hover:text-red-400 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Purge Disk Packet"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
                <div className="text-[9px] text-stone-600 text-center mt-3 border-t border-stone-900 pt-2 flex items-center justify-center space-x-1 select-none">
                  <ShieldCheck className="w-3 h-3 text-emerald-500/50" />
                  <span>Durable File Persistence (/server.ts:messages.json)</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}
