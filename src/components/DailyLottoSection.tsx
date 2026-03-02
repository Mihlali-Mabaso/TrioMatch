import { useState, useEffect, useCallback, useRef } from "react";
import { Timer, Sparkles, CheckCircle, AlertTriangle } from "lucide-react";
import { runMatchingAlgorithm } from "@/services/dataService";
import { useQueryClient } from "@tanstack/react-query";

const MATCH_RAN_KEY = "triomatch_match_ran";

function get10MinPeriodKey(): string {
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const hourStr = now.getHours().toString().padStart(2, "0");
    const period = Math.floor(now.getMinutes() / 10);
    return `${dateStr}-${hourStr}-${period}`;
}

function getTimeUntilNext10Minutes(): { minutes: number; seconds: number } {
    const now = new Date();
    const next10 = new Date(now);
    const currentMinutes = now.getMinutes();
    const nextMinuteMark = Math.floor(currentMinutes / 10) * 10 + 10;

    if (nextMinuteMark >= 60) {
        next10.setHours(now.getHours() + 1, 0, 0, 0);
    } else {
        next10.setSeconds(0, 0);
        next10.setMinutes(nextMinuteMark);
    }

    const diff = next10.getTime() - now.getTime();
    return {
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
    };
}

const MatchingSection = () => {
    const [countdown, setCountdown] = useState(getTimeUntilNext10Minutes());
    const [isMatching, setIsMatching] = useState(false);
    const [matchResult, setMatchResult] = useState<{ type: "success" | "info" | "error"; message: string } | null>(null);
    const queryClient = useQueryClient();
    const lastPeriodRef = useRef(get10MinPeriodKey());

    const invalidateAll = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ["stats"] });
        queryClient.invalidateQueries({ queryKey: ["matches"] });
        queryClient.invalidateQueries({ queryKey: ["waitingPool"] });
        queryClient.invalidateQueries({ queryKey: ["billboard"] });
    }, [queryClient]);

    const doMatch = useCallback(async (source: string) => {
        if (isMatching) return;
        setIsMatching(true);
        setMatchResult(null);
        console.log(`[${source}] Running matching algorithm...`);

        try {
            const result = await runMatchingAlgorithm();
            console.log(`[${source}] Matching result:`, result);

            if (result && result.teams_formed > 0) {
                setMatchResult({ type: "success", message: `${result.teams_formed} team(s) matched successfully!` });
            } else {
                setMatchResult({ type: "info", message: result?.message || "No teams could be formed — need at least 1 student per year level." });
            }
        } catch (err: any) {
            console.error(`[${source}] Matching failed:`, err);
            setMatchResult({ type: "error", message: err?.message || "Matching failed. Check console for details." });
        }

        invalidateAll();
        setIsMatching(false);
    }, [isMatching, invalidateAll]);

    // Auto-match when 10-min period changes
    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(getTimeUntilNext10Minutes());

            const currentPeriod = get10MinPeriodKey();
            if (currentPeriod !== lastPeriodRef.current) {
                lastPeriodRef.current = currentPeriod;

                const alreadyRan = localStorage.getItem(MATCH_RAN_KEY);
                if (alreadyRan !== currentPeriod) {
                    localStorage.setItem(MATCH_RAN_KEY, currentPeriod);
                    doMatch("auto-timer");
                }
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [doMatch]);

    const pad = (n: number) => n.toString().padStart(2, "0");

    return (
        <section id="lotto" className="relative py-20 sm:py-28 bg-primary overflow-hidden">
            <div className="absolute inset-0 dot-pattern" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <Timer className="w-5 h-5 text-primary-foreground" />
                        <span className="font-heading text-sm font-bold uppercase tracking-widest text-primary-foreground/70">
                            Auto Matching
                        </span>
                        <Timer className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black uppercase italic text-primary-foreground">
                        Match <span className="text-foreground">Timer</span>
                    </h2>
                    <p className="font-body text-primary-foreground/70 mt-3 max-w-md mx-auto">
                        Students are automatically matched into trios every 10 minutes. You can also trigger matching manually.
                    </p>
                </div>

                {/* Countdown display */}
                <div className="flex flex-col items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center bg-primary-foreground/10 border border-primary-foreground/20 px-8 py-6">
                            <span className="font-heading text-5xl sm:text-6xl font-black text-primary-foreground">
                                {pad(countdown.minutes)}
                            </span>
                            <span className="font-body text-xs uppercase tracking-widest text-primary-foreground/60 mt-1">Minutes</span>
                        </div>
                        <span className="font-heading text-4xl font-black text-primary-foreground/50">:</span>
                        <div className="flex flex-col items-center bg-primary-foreground/10 border border-primary-foreground/20 px-8 py-6">
                            <span className="font-heading text-5xl sm:text-6xl font-black text-primary-foreground">
                                {pad(countdown.seconds)}
                            </span>
                            <span className="font-body text-xs uppercase tracking-widest text-primary-foreground/60 mt-1">Seconds</span>
                        </div>
                    </div>

                    <p className="font-body text-sm text-primary-foreground/50 uppercase tracking-wider">
                        Until next automatic matching cycle
                    </p>

                    {/* Match Now button */}
                    <button
                        onClick={() => doMatch("manual")}
                        disabled={isMatching}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-flame hover:bg-flame/90 text-flame-foreground font-heading text-sm font-black uppercase tracking-wider transition-all disabled:opacity-60 mt-2"
                    >
                        {isMatching ? (
                            <>
                                <div className="w-5 h-5 border-2 border-flame-foreground border-t-transparent rounded-full animate-spin" />
                                Matching Students...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                Match Now
                            </>
                        )}
                    </button>

                    {/* Result feedback */}
                    {matchResult && (
                        <div className={`mt-4 inline-flex items-center gap-3 px-6 py-3 border animate-slide-up ${matchResult.type === "success"
                                ? "bg-success/20 border-success/40 text-success"
                                : matchResult.type === "error"
                                    ? "bg-destructive/20 border-destructive/40 text-destructive"
                                    : "bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground"
                            }`}>
                            {matchResult.type === "success" ? (
                                <CheckCircle className="w-5 h-5" />
                            ) : matchResult.type === "error" ? (
                                <AlertTriangle className="w-5 h-5" />
                            ) : (
                                <Timer className="w-5 h-5" />
                            )}
                            <span className="font-heading text-sm font-bold uppercase">
                                {matchResult.message}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default MatchingSection;
