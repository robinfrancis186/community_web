import React, { useEffect, useMemo, useState } from 'react';
import {
    AlertCircle,
    Book,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    HelpCircle,
    LifeBuoy,
    Loader2,
    Send,
    Shield,
    Users,
    Search
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useHelpCenter } from '../../hooks/useHelp';

const ICON_MAP = {
    HelpCircle,
    Shield,
    Book,
    Users,
    LifeBuoy,
};

const StatusPill = ({ status }) => {
    const styles = {
        open: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300',
        in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
        resolved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300',
    };

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${styles[status] || styles.open}`}>
            {status.replace('_', ' ')}
        </span>
    );
};

const FaqItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-slate-200 dark:border-slate-700 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-4 flex items-center justify-between text-left focus:outline-none group"
            >
                <span className="font-medium text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                    {question}
                </span>
                {isOpen ? (
                    <ChevronUp className="text-slate-400 group-hover:text-primary" size={20} />
                ) : (
                    <ChevronDown className="text-slate-400 group-hover:text-primary" size={20} />
                )}
            </button>
            {isOpen && (
                <div className="pb-4 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {answer}
                </div>
            )}
        </div>
    );
};

const Help = () => {
    const {
        categories,
        supportRequests,
        loading,
        submitting,
        error,
        submitSupportRequest,
    } = useHelpCenter();

    const [activeCategory, setActiveCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        categoryId: '',
        title: '',
        description: '',
    });
    const [formStatus, setFormStatus] = useState(null);

    useEffect(() => {
        if (!activeCategory && categories.length > 0) {
            setActiveCategory(categories[0].id);
        }
    }, [categories, activeCategory]);

    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filteredCategories = useMemo(() => {
        if (!normalizedSearch) {
            return categories;
        }
        return categories
            .map((category) => {
                const filteredArticles = category.articles.filter((article) => {
                    const haystack = `${article.question} ${article.answer} ${article.tags?.join(' ')}`.toLowerCase();
                    return haystack.includes(normalizedSearch);
                });
                return { ...category, articles: filteredArticles };
            })
            .filter((category) => category.articles.length > 0);
    }, [categories, normalizedSearch]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFormStatus(null);
    };

    const handleSupportSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.description.trim()) {
            setFormStatus({ type: 'error', message: 'Please add a short title and description.' });
            return;
        }

        const { success } = await submitSupportRequest({
            categoryId: formData.categoryId || null,
            title: formData.title,
            description: formData.description,
        });

        if (success) {
            setFormStatus({ type: 'success', message: 'Thanks! We received your request.' });
            setFormData({ categoryId: '', title: '', description: '' });
        } else {
            setFormStatus({ type: 'error', message: 'Unable to send request right now. Please try again.' });
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex flex-col gap-4">
                <div>
                    <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                        <LifeBuoy size={16} />
                        Assistance Hub
                    </p>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Help & Support</h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Search FAQs, get live assistance, or raise a support ticket—everything you need to stay unstuck.
                    </p>
                </div>
                <div className="relative max-w-lg">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search for a topic, e.g. profile picture, direct messages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                </div>
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 flex items-center gap-3">
                    <AlertCircle size={20} />
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {loading ? (
                <Card className="p-8 flex items-center gap-4 justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span className="text-sm text-slate-500">Loading help center...</span>
                </Card>
            ) : (
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {filteredCategories.length === 0 ? (
                            <Card className="p-8 text-center">
                                <p className="text-slate-500">No results found. Try another search term.</p>
                            </Card>
                        ) : (
                            filteredCategories.map((section) => {
                                const IconComponent = ICON_MAP[section.icon] || HelpCircle;
                                return (
                                    <Card key={section.id} className="p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                                <IconComponent size={20} />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                                                    {section.name}
                                                </h2>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{section.description}</p>
                                            </div>
                                        </div>
                                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {section.articles.map((faq) => (
                                                <FaqItem key={faq.id} question={faq.question} answer={faq.answer} />
                                            ))}
                                            {section.articles.length === 0 && (
                                                <p className="text-sm text-slate-500 py-4">No matches in this category.</p>
                                            )}
                                        </div>
                                    </Card>
                                );
                            })
                        )}
                    </div>

                    <div className="space-y-6">
                        <Card className="p-6 space-y-5 sticky top-24">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-primary/10 text-primary">
                                    <LifeBuoy size={18} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        Ask the STRIDE Team
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                        We usually respond within 1 business day.
                                    </p>
                                </div>
                            </div>

                            {formStatus && (
                                <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${formStatus.type === 'success'
                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
                                    : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                                    }`}>
                                    {formStatus.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                    {formStatus.message}
                                </div>
                            )}

                            <form className="space-y-4" onSubmit={handleSupportSubmit}>
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                                        Topic
                                    </label>
                                    <select
                                        name="categoryId"
                                        value={formData.categoryId}
                                        onChange={handleFormChange}
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                                    >
                                        <option value="">General question</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleFormChange}
                                        placeholder="e.g. Unable to upload avatar"
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                                        Describe your question
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleFormChange}
                                        rows={4}
                                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                                        placeholder="Share as much detail as possible. Links and screenshots help."
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-full justify-center"
                                    icon={submitting ? Loader2 : Send}
                                    disabled={submitting}
                                >
                                    {submitting ? 'Sending...' : 'Send to Support'}
                                </Button>
                            </form>
                        </Card>

                        <Card className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Your Requests</h3>
                                {supportRequests.length > 0 && (
                                    <span className="text-xs font-semibold text-slate-400 uppercase">
                                        {supportRequests.length} active
                                    </span>
                                )}
                            </div>

                            {supportRequests.length === 0 ? (
                                <p className="text-sm text-slate-500">
                                    You haven’t opened any support requests yet.
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {supportRequests.slice(0, 4).map((request) => (
                                        <div key={request.id} className="border border-slate-100 dark:border-slate-800 rounded-xl p-4">
                                            <div className="flex items-center justify-between gap-2 mb-2">
                                                <StatusPill status={request.status} />
                                                <span className="text-xs text-slate-400">
                                                    {new Date(request.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{request.title}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                {request.category}
                                            </p>
                                            <p className="text-xs text-slate-400 line-clamp-2 mt-2">
                                                {request.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Help;
