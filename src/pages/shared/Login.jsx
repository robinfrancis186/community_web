import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Shield, School, ArrowRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import logo from '../../assets/logo.png';

const Login = () => {
    const navigate = useNavigate();

    const roles = [
        {
            id: 'member',
            title: 'Member',
            description: 'Students, Ambassadors, Innovators',
            icon: Users,
            path: '/member/dashboard',
            color: 'bg-blue-500'
        },
        {
            id: 'campus',
            title: 'Campus Rep',
            description: 'Faculty Coordinators, Campus Ambassadors',
            icon: School,
            path: '/campus/dashboard',
            color: 'bg-purple-500'
        },
        {
            id: 'admin',
            title: 'Admin',
            description: 'Core STRIDE Team',
            icon: Shield,
            path: '/admin/dashboard',
            color: 'bg-red-500'
        }
    ];

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                    <img src={logo} alt="STRIDE" className="h-16 w-auto mb-6" />
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">STRIDE</span>
                    </h1>
                    <p className="text-xl text-slate-500 mb-8">
                        A unified platform for inclusive innovation. Connect, learn, and create impact together.
                    </p>
                    <div className="flex gap-4">
                        <Button variant="outline">Learn More</Button>
                        <Button variant="ghost">Contact Support</Button>
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="text-sm text-slate-500 uppercase tracking-wider font-bold mb-2">Select your role to login</p>
                    {roles.map((role) => (
                        <Card
                            key={role.id}
                            className="p-4 cursor-pointer group transition-all hover:scale-[1.02]"
                            hover
                            onClick={() => navigate(role.path)}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-slate-900 ${role.color}`}>
                                    <role.icon size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{role.title}</h3>
                                    <p className="text-sm text-slate-500">{role.description}</p>
                                </div>
                                <ArrowRight className="text-slate-400 group-hover:text-primary transition-colors" />
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Login;
