import { useQuery } from "@tanstack/react-query";
import { getWaitingPool } from "@/services/dataService";
import { Clock, Users, Eye, Hash } from "lucide-react";
import { useState } from "react";

const WaitingPoolSection = () => {
    const [showAll, setShowAll] = useState(false);

    const { data: poolEntries, isLoading } = useQuery({
        queryKey: ["waitingPool"],
        queryFn: getWaitingPool,
        refetchInterval: 5000,
    });

    const entries = poolEntries || [];
    const visibleEntries = showAll ? entries : entries.slice(0, 8);
    const remaining = entries.length - 8;

    return (
        <section id="pool" className="relative py-20 sm:py-28">
            {/* Subtle background */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/3 blur-[200px]" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <Clock className="w-5 h-5 text-flame" />
                        <span className="font-heading text-sm font-bold uppercase tracking-widest text-flame">
                            In Queue
                        </span>
                        <Clock className="w-5 h-5 text-flame" />
                    </div>
                    <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black uppercase italic text-foreground">
                        The Waiting <span className="text-gradient">Pool</span>
                    </h2>
                    <p className="font-body text-muted-foreground mt-3 max-w-md mx-auto">
                        Students waiting to be matched into trios. Join the pool and you'll appear here!
                    </p>
                </div>

                {/* Pool Grid */}
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {visibleEntries.map((entry: any) => (
                                <PoolCard key={entry.id} entry={entry} />
                            ))}

                            {/* View More card */}
                            {!showAll && remaining > 0 && (
                                <button
                                    onClick={() => setShowAll(true)}
                                    className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-electric/40 hover:border-electric bg-card/50 hover:bg-electric/5 transition-all min-h-[160px]"
                                >
                                    <Eye className="w-6 h-6 text-electric" />
                                    <span className="font-heading text-sm font-bold uppercase text-electric">
                                        View +{remaining} Others
                                    </span>
                                </button>
                            )}
                        </div>

                        {showAll && entries.length > 8 && (
                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={() => setShowAll(false)}
                                    className="font-body text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Show Less
                                </button>
                            </div>
                        )}
                    </>
                )}

                <div className="text-center mt-8">
                    <span className="font-body text-xs text-muted-foreground">
                        {entries.length} students currently waiting to be matched
                    </span>
                </div>
            </div>
        </section>
    );
};

function PoolCard({ entry }: { entry: any }) {
    const yearColorMap: Record<string, string> = {
        "1st Year": "border-t-primary",
        "2nd Year": "border-t-electric",
        "3rd Year": "border-t-flame",
    };

    const yearBgMap: Record<string, string> = {
        "1st Year": "bg-primary/15 text-primary",
        "2nd Year": "bg-electric/15 text-electric",
        "3rd Year": "bg-flame/15 text-flame",
    };

    const topColor = yearColorMap[entry.student.year_level] || "border-t-border";
    const badgeColor = yearBgMap[entry.student.year_level] || "bg-muted text-muted-foreground";

    return (
        <div className={`bg-card border border-border border-t-2 ${topColor} p-5 hover:bg-muted/30 transition-colors group`}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-muted-foreground" />
                    </div>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                    <Hash className="w-3 h-3" />
                    <span className="font-heading text-xs font-bold">{entry.position}</span>
                </div>
            </div>

            <h4 className="font-heading text-sm font-bold text-foreground uppercase tracking-wide group-hover:text-primary transition-colors">
                {entry.student.full_name}
            </h4>

            <div className="flex items-center justify-between mt-3">
                <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm ${badgeColor}`}>
                    {entry.student.year_level}
                </span>
                <span className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">
                    {entry.student.faculty}
                </span>
            </div>
        </div>
    );
}

export default WaitingPoolSection;
