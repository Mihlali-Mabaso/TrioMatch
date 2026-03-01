import { useState, useEffect, useCallback } from "react";
import { Sparkles, Timer } from "lucide-react";

const LOTTO_KEY = "triomatch_lotto";
const YEAR_LEVELS = ["1ST YEAR", "2ND YEAR", "3RD YEAR"];

interface LottoState {
    date: string;
    selectedBox: number | null;
    result: string | null;
}

function get12HourPeriodKey(): string {
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const period = now.getHours() < 12 ? "AM" : "PM";
    return `${dateStr}-${period}`;
}

function getLottoState(): LottoState | null {
    const raw = localStorage.getItem(LOTTO_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LottoState;
    if (parsed.date !== get12HourPeriodKey()) return null;
    return parsed;
}

function saveLottoState(state: LottoState) {
    localStorage.setItem(LOTTO_KEY, JSON.stringify(state));
}

function getTimeUntilNext12Hours(): { hours: number; minutes: number; seconds: number } {
    const now = new Date();
    const next12 = new Date(now);
    const currentHour = now.getHours();

    // Set to next 12-hour mark (either 12:00 or 00:00)
    if (currentHour < 12) {
        next12.setHours(12, 0, 0, 0);
    } else {
        next12.setHours(24, 0, 0, 0);
    }

    const diff = next12.getTime() - now.getTime();
    return {
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
    };
}

const DailyLottoSection = () => {
    const [selectedBox, setSelectedBox] = useState<number | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [countdown, setCountdown] = useState(getTimeUntilNext12Hours());
    const [hasPlayedToday, setHasPlayedToday] = useState(false);

    useEffect(() => {
        const saved = getLottoState();
        if (saved && saved.selectedBox !== null) {
            setSelectedBox(saved.selectedBox);
            setResult(saved.result);
            setHasPlayedToday(true);
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(getTimeUntilNext12Hours());
            // Check if 12-hour period has changed
            const saved = getLottoState();
            if (!saved && hasPlayedToday) {
                setHasPlayedToday(false);
                setSelectedBox(null);
                setResult(null);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [hasPlayedToday]);

    const handleSpin = useCallback((boxIndex: number) => {
        if (hasPlayedToday || isSpinning) return;

        setIsSpinning(true);
        setSelectedBox(boxIndex);

        // Random result
        const randomResult = YEAR_LEVELS[Math.floor(Math.random() * YEAR_LEVELS.length)];

        setTimeout(() => {
            setResult(randomResult);
            setIsSpinning(false);
            setHasPlayedToday(true);
            saveLottoState({
                date: get12HourPeriodKey(),
                selectedBox: boxIndex,
                result: randomResult,
            });
            console.log("Lotto result:", randomResult);
        }, 1500);
    }, [hasPlayedToday, isSpinning]);

    const pad = (n: number) => n.toString().padStart(2, "0");

    return (
        <section id="lotto" className="relative py-20 sm:py-28 bg-primary overflow-hidden">
            {/* Dot pattern */}
            <div className="absolute inset-0 dot-pattern" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-primary-foreground" />
                        <span className="font-heading text-sm font-bold uppercase tracking-widest text-primary-foreground/70">
                            Fun & Games
                        </span>
                        <Sparkles className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black uppercase italic text-primary-foreground">
                        Daily Lotto Spin
                    </h2>
                    <p className="font-body text-primary-foreground/70 mt-3 max-w-md mx-auto">
                        Pick a box and reveal the year level you win! One spin per day.
                    </p>
                </div>

                {/* Lotto Boxes */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto mb-12">
                    {YEAR_LEVELS.map((year, idx) => {
                        const isSelected = selectedBox === idx;
                        const isRevealed = isSelected && result !== null;
                        const isOtherSelected = selectedBox !== null && !isSelected;

                        return (
                            <button
                                key={year}
                                onClick={() => handleSpin(idx)}
                                disabled={hasPlayedToday || isSpinning}
                                className={`
                  relative aspect-square flex flex-col items-center justify-center gap-3
                  border-2 transition-all duration-300
                  ${isSelected && isSpinning ? "animate-spin-reveal border-primary-foreground bg-primary-foreground/10" : ""}
                  ${isRevealed ? "border-primary-foreground bg-primary-foreground/20 scale-105" : ""}
                  ${isOtherSelected ? "opacity-40 border-primary-foreground/30 bg-primary-foreground/5" : ""}
                  ${!hasPlayedToday && !isSpinning ? "border-primary-foreground/50 bg-primary-foreground/5 hover:border-primary-foreground hover:bg-primary-foreground/15 hover:scale-105 cursor-pointer" : ""}
                  ${hasPlayedToday && !isSelected ? "border-primary-foreground/20 bg-primary-foreground/5 cursor-default" : ""}
                `}
                            >
                                <span className="font-heading text-xs font-bold uppercase tracking-widest text-primary-foreground/60">
                                    {year}
                                </span>
                                <span className={`font-heading text-4xl sm:text-5xl font-black text-primary-foreground ${isRevealed ? "" : ""}`}>
                                    {isRevealed ? "🎉" : isSelected && isSpinning ? "..." : "???"}
                                </span>
                                {isRevealed && (
                                    <span className="font-heading text-sm font-bold uppercase text-primary-foreground">
                                        {result}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Result / Countdown */}
                <div className="text-center">
                    {hasPlayedToday && result && (
                        <div className="mb-6 animate-slide-up">
                            <p className="font-heading text-xl sm:text-2xl font-black uppercase text-primary-foreground">
                                You got: <span className="underline decoration-4 underline-offset-4">{result}</span>!
                            </p>
                            <p className="font-body text-sm text-primary-foreground/60 mt-2">Come back tomorrow for another spin</p>
                        </div>
                    )}

                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary-foreground/10 border border-primary-foreground/20">
                        <Timer className="w-5 h-5 text-primary-foreground/70" />
                        <span className="font-body text-sm font-semibold uppercase tracking-wider text-primary-foreground/70">
                            Next spin in (12h cycle)
                        </span>
                        <div className="flex items-center gap-1 font-heading text-lg font-black text-primary-foreground animate-countdown">
                            <span>{pad(countdown.hours)}</span>
                            <span className="text-primary-foreground/50">:</span>
                            <span>{pad(countdown.minutes)}</span>
                            <span className="text-primary-foreground/50">:</span>
                            <span>{pad(countdown.seconds)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DailyLottoSection;
