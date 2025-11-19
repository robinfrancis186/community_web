import React from 'react';
import { Download, Share2, Award } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const Certificates = () => {
    const certificates = [
        {
            id: 1,
            title: 'Disability Sensitization',
            date: 'Oct 15, 2025',
            id_code: 'STRIDE-2025-DS-001',
            image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=800&q=80' // Placeholder for cert image
        },
        {
            id: 2,
            title: 'Inclusive Design Workshop',
            date: 'Sep 20, 2025',
            id_code: 'STRIDE-2025-IDW-045',
            image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=800&q=80'
        }
    ];

    const badges = [
        { name: 'Early Adopter', icon: '🚀', color: 'bg-blue-500/20 text-blue-400' },
        { name: 'Design Champion', icon: '🎨', color: 'bg-purple-500/20 text-purple-400' },
        { name: 'Top Contributor', icon: '⭐', color: 'bg-yellow-500/20 text-yellow-400' },
        { name: 'Problem Solver', icon: '🧩', color: 'bg-green-500/20 text-green-400' },
    ];

    return (
        <div className="space-y-8">
            <section>
                <h1 className="text-3xl font-bold text-slate-900 mb-6">Your Achievements</h1>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {badges.map((badge, index) => (
                        <Card key={index} className="p-4 flex flex-col items-center justify-center text-center gap-2" hover>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${badge.color}`}>
                                {badge.icon}
                            </div>
                            <span className="font-bold text-slate-900 text-sm">{badge.name}</span>
                        </Card>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Certificates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {certificates.map((cert) => (
                        <Card key={cert.id} className="p-0 group" hover>
                            <div className="aspect-video bg-surface relative overflow-hidden">
                                {/* Placeholder for Certificate Preview */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 border-8 border-double border-slate-200 m-4">
                                    <Award size={48} className="text-primary mb-4" />
                                    <h3 className="text-xl font-serif font-bold text-slate-900 text-center">{cert.title}</h3>
                                    <p className="text-sm text-slate-500 mt-2">Awarded to Alex Johnson</p>
                                    <p className="text-xs text-gray-500 mt-1">on {cert.date}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-100 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-slate-500">Certificate ID</p>
                                    <p className="text-sm font-mono text-slate-900">{cert.id_code}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" icon={Download} />
                                    <Button variant="ghost" size="sm" icon={Share2} />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Certificates;
