
import React, { useState } from 'react';
import { submitComplaint } from '../services/api';

const ComplaintPage: React.FC = () => {
    const [content, setContent] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            alert('请输入投诉或建议内容');
            return;
        }

        setSubmitting(true);
        try {
            await submitComplaint(content, contactInfo);
            setSubmitted(true);
            setContent('');
            setContactInfo('');
        } catch (error) {
            alert('提交失败，请稍后重试');
        } finally {
            setSubmitting(false);
        }
    };

    const handleBack = () => {
        window.history.back();
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center px-4">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-8 md:p-12 max-w-lg w-full text-center">
                    <div className="text-gold text-5xl mb-6">✓</div>
                    <h2 className="text-2xl font-bold text-white mb-4">提交成功</h2>
                    <p className="text-gray-400 mb-8">感谢您的反馈，我们会尽快处理！</p>
                    <button
                        onClick={handleBack}
                        className="px-8 py-3 bg-primary text-white rounded-sm hover:bg-primary/80 transition-colors"
                    >
                        返回首页
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black py-16 px-4">
            <div className="max-w-2xl mx-auto">
                {/* 返回按钮 */}
                <button
                    onClick={handleBack}
                    className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
                >
                    <span className="material-symbols-outlined mr-2">arrow_back</span>
                    返回
                </button>

                {/* 标题 */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">投诉建议</h1>
                    <p className="text-gray-400">您的意见对我们非常重要，我们会认真对待每一条反馈</p>
                </div>

                {/* 表单 */}
                <form onSubmit={handleSubmit} className="bg-[#0a0a0a] border border-white/10 rounded-lg p-6 md:p-8">
                    <div className="mb-6">
                        <label className="block text-white text-sm font-medium mb-2">
                            投诉/建议内容 <span className="text-primary">*</span>
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="请详细描述您的问题或建议..."
                            rows={6}
                            className="w-full bg-black border border-white/10 rounded-sm px-4 py-3 text-white placeholder-gray-600 focus:border-primary focus:outline-none resize-none"
                            maxLength={2000}
                        />
                        <div className="text-right text-gray-600 text-xs mt-1">{content.length}/2000</div>
                    </div>

                    <div className="mb-8">
                        <label className="block text-white text-sm font-medium mb-2">
                            联系方式（选填）
                        </label>
                        <input
                            type="text"
                            value={contactInfo}
                            onChange={(e) => setContactInfo(e.target.value)}
                            placeholder="QQ号/手机号/邮箱，方便我们联系您"
                            className="w-full bg-black border border-white/10 rounded-sm px-4 py-3 text-white placeholder-gray-600 focus:border-primary focus:outline-none"
                            maxLength={100}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className={`w-full py-4 rounded-sm text-white font-bold tracking-widest transition-all ${submitting
                                ? 'bg-gray-600 cursor-not-allowed'
                                : 'bg-primary hover:bg-primary/80'
                            }`}
                    >
                        {submitting ? '提交中...' : '提交反馈'}
                    </button>
                </form>

                {/* 提示 */}
                <div className="mt-8 text-center text-gray-600 text-sm">
                    <p>我们承诺：所有投诉建议将在24小时内处理</p>
                </div>
            </div>
        </div>
    );
};

export default ComplaintPage;
