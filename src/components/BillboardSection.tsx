import { useQuery } from "@tanstack/react-query";
import { getStats, getMatches } from "@/services/dataService";
import { Zap, Trophy, Users, CheckCircle, Clock } from "lucide-react";

const BillboardSection = () => {

    const { data: statsData } = useQuery({
        queryKey: ["stats"],
        queryFn: getStats,
        refetchInterval: 5000,
    });

    const { data: matchesData } = useQuery({
        queryKey: ["matches"],
        queryFn: getMatches,
        refetchInterval: 5000,
    });

    return (
        <section id="billboard" className="relative py-20 sm:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <Zap className="w-5 h-5 text-primary" />
                        <span className="font-heading text-sm font-bold uppercase tracking-widest text-primary">Live Stats</span>
                        <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black uppercase italic text-foreground">
                        The <span className="text-gradient">Billboard</span>
                    </h2>
                    <p className="font-body text-muted-foreground mt-3 max-w-md mx-auto">
                        Real-time leaderboard of students who have joined the matching pool
                    </p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    <StatCard icon={<Users className="w-5 h-5" />} value={statsData?.totalStudents || 0} label="Total Students" color="primary" />
                    <StatCard icon={<CheckCircle className="w-5 h-5" />} value={statsData?.totalMatched || 0} label="Matched" color="success" />
                    <StatCard icon={<Clock className="w-5 h-5" />} value={statsData?.totalWaiting || 0} label="Waiting" color="flame" />
                    <StatCard icon={<Trophy className="w-5 h-5" />} value={statsData?.totalTrios || 0} label="Trios Formed" color="electric" />
                </div>

                {/* Teams Grid */}
                <div className="space-y-8">
                    {matchesData && matchesData.length > 0 ? (
                        <div>
                            <h3 className="font-heading text-xl font-bold uppercase text-foreground mb-6 flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-primary" />
                                Matched Teams
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {matchesData.map((match: any, idx: number) => (
                                    <div key={match.id} className="bg-card border border-border p-6">
                                        <h4 className="font-heading text-lg font-bold uppercase mb-4">Team #{idx + 1}</h4>
                                        <div className="space-y-2 text-sm text-muted-foreground">
                                            <div>Student 1: {match.student_1_id}</div>
                                            <div>Student 2: {match.student_2_id}</div>
                                            <div>Student 3: {match.student_3_id}</div>
                                            <div className="text-xs mt-2">Matched: {new Date(match.matched_at).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-card border border-border p-12 text-center">
                            <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="font-heading text-lg font-bold uppercase text-foreground mb-2">
                                No Teams Yet
                            </h3>
                            <p className="font-body text-sm text-muted-foreground">
                                Teams will appear here once students are matched into trios
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

function StatCard({
    icon,
    value,
    label,
    color,
}: {
    icon: React.ReactNode;
    value: number;
    label: string;
    color: string;
}) {
    const colorMap: Record<string, string> = {
        primary: "border-t-primary text-primary",
        success: "border-t-success text-success",
        flame: "border-t-flame text-flame",
        electric: "border-t-electric text-electric",
    };
    const classes = colorMap[color] || colorMap.primary;

    return (
        <div className={`bg-card border border-border border-t-2 ${classes.split(" ")[0]} p-4 sm:p-6`}>
            <div className={`${classes.split(" ")[1]} mb-2`}>{icon}</div>
            <div className="font-heading text-2xl sm:text-3xl font-black text-foreground">{value}</div>
            <div className="font-body text-xs uppercase tracking-wider text-muted-foreground mt-1">{label}</div>
        </div>
    );
}


export default BillboardSection;