import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, Zap, Shield, ArrowRight, ArrowLeft, HelpCircle } from 'lucide-react';
import { axiosInstance } from '../config/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Pricing() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get('/users/me');
        setUser(res.data);
      } catch (err) {}
    };
    const fetchSettings = async () => {
      try {
        const { data } = await axiosInstance.get('/settings');
        setSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchUser();
    fetchSettings();
  }, []);

  const handleRazorpayMock = async (planName, price) => {
    try {
      const res = await axiosInstance.post('/payments/order', {
        amount: price,
        plan: planName.toLowerCase() === 'professional' ? 'pro' : 'enterprise',
        extraCerts: 0,
        billingCycle
      });

      if (!res.data.keyId) {
        alert("Razorpay is not configured on the backend. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env file to enable actual payments.");
        return;
      }

      const options = {
        key: res.data.keyId,
        amount: res.data.order.amount,
        currency: "INR",
        name: "Authra",
        description: `Upgrade to ${planName}`,
        order_id: res.data.order.id,
        handler: async function (response) {
          try {
            const verifyRes = await axiosInstance.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: planName.toLowerCase() === 'professional' ? 'pro' : 'enterprise',
              billingCycle
            });
            if (verifyRes.data.success) {
              alert("Payment successful! Your plan has been upgraded.");
              navigate('/dashboard');
            }
          } catch (err) {
            console.error(err);
            alert("Payment verification failed: " + (err.response?.data?.message || err.message));
          }
        },
        theme: {
          color: "#7387C5",
        },
      };

      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
          const rzp = new window.Razorpay(options);
          rzp.open();
        };
        document.body.appendChild(script);
      } else {
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error initiating payment.");
    }
  };

  const faqs = [
    {
      question: "Are there any setup fees?",
      answer: "No, there are zero setup fees or hidden costs on any of our plans."
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer: "Absolutely! You can change your plan at any time. Prorated charges or credits will automatically be applied to your account."
    },
    {
      question: "What happens if I exceed my certificate limit?",
      answer: "If you are on the Free plan, you'll need to upgrade to issue more certificates. If you're on the Pro plan, you can purchase additional certificates at ₹10 per 100 certificates."
    },
    {
      question: "Do you offer custom integrations?",
      answer: "Yes, our Enterprise plan includes dedicated support for custom integrations with your existing HR, LMS, or university systems."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Pricing | Authra</title>
      </Helmet>
      
      <Navbar />

      <main className="min-h-screen pt-[120px] pb-20 px-6 relative bg-authra-bg-light dark:bg-authra-bg-dark text-authra-text-light dark:text-authra-text-dark">
        {/* Background Effects */}
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-brand-steel/10 dark:bg-brand-steel/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="absolute top-[40%] right-[10%] w-[600px] h-[600px] bg-brand-periwinkle/10 dark:bg-brand-periwinkle/5 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-authra-text-light dark:text-white tracking-tight">
              Simple, transparent pricing
            </h1>
            <p className="text-lg md:text-xl text-authra-text-sec-light dark:text-authra-text-sec-dark max-w-2xl mx-auto mb-10">
              Choose the perfect plan for your organization. Issue verifiable credentials effortlessly, whether you're just starting or scaling up. Regular user accounts are 100% free forever.
            </p>
            
            {/* Billing Toggle */}
            <div className="inline-flex items-center p-1.5 bg-white dark:bg-[#111522] border border-authra-border-light dark:border-[#2A3155] rounded-full shadow-sm">
              <button 
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${billingCycle === 'monthly' ? 'bg-brand-steel text-white shadow-md' : 'text-authra-text-sec-light dark:text-authra-text-sec-dark hover:text-authra-text-light dark:hover:text-white'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${billingCycle === 'yearly' ? 'bg-brand-steel text-white shadow-md' : 'text-authra-text-sec-light dark:text-authra-text-sec-dark hover:text-authra-text-light dark:hover:text-white'}`}
              >
                Yearly <span className="text-[10px] ml-1 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">Save 20%</span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center mb-24">
            
            {settings?.pricingPlans?.map((plan, idx) => (
              <div 
                key={idx} 
                className={`${plan.isPopular ? 'bg-gradient-to-b from-brand-steel/10 to-transparent dark:from-[#1A2035] dark:to-[#0D0F16] border-2 border-brand-steel transform md:-translate-y-4' : 'bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-[#2A3155]'} rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow relative flex flex-col h-full ${plan.isPopular ? 'h-[105%]' : ''}`}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-steel text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 uppercase tracking-wide">
                    <Zap className="w-3.5 h-3.5" /> Most Popular
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-authra-text-light dark:text-white mb-2">{plan.name}</h3>
                  <p className="text-authra-text-sec-light dark:text-authra-text-sec-dark text-sm">{plan.description}</p>
                </div>
                
                <div className="mb-8">
                  {plan.monthlyPrice === -1 ? (
                    <div className="flex items-end gap-2 mb-1">
                      <span className="text-4xl font-bold text-authra-text-light dark:text-white">Custom</span>
                    </div>
                  ) : (
                    <div className="flex items-end gap-2 mb-1">
                      <span className="text-4xl font-bold text-authra-text-light dark:text-white">
                        ₹{billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                      </span>
                      <span className="text-authra-text-sec-light dark:text-authra-text-sec-dark font-medium mb-1">/ month</span>
                    </div>
                  )}
                  {plan.monthlyPrice !== -1 && billingCycle === 'yearly' && <p className="text-xs text-brand-steel font-medium mb-2">Billed annually</p>}
                </div>
                
                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-brand-steel shrink-0 mt-0.5" />
                      <span className="text-sm text-authra-text-light dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  onClick={() => {
                    if (plan.monthlyPrice === -1) {
                      navigate('/contact');
                    } else {
                      user ? handleRazorpayMock(plan.name, billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice * 12) : navigate('/signup')
                    }
                  }}
                  className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${plan.isPopular ? 'bg-brand-steel text-white hover:shadow-lg hover:shadow-brand-steel/30' : 'bg-gray-100 dark:bg-white/5 text-authra-text-light dark:text-white hover:bg-gray-200 dark:hover:bg-white/10'}`}
                >
                  {plan.monthlyPrice === -1 ? (
                    <><Shield className="w-4 h-4" /> Contact Sales</>
                  ) : user ? (
                    plan.monthlyPrice === 0 ? (user.plan === 'free' || !user.plan ? 'Current Plan' : 'Go to Dashboard') : `Upgrade to ${plan.name} `
                  ) : (
                    'Get Started'
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Feature Comparison Table */}
          <div className="max-w-5xl mx-auto mb-24 overflow-x-auto">
            <h2 className="text-3xl font-bold text-center mb-10 text-authra-text-light dark:text-white">Compare Features</h2>
            <div className="min-w-[800px] bg-white dark:bg-[#111522] rounded-3xl border border-authra-border-light dark:border-[#2A3155] overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-authra-bg-light dark:bg-[#0D0F16]">
                    <th className="p-6 font-semibold text-authra-text-sec-light dark:text-authra-text-sec-dark border-b border-authra-border-light dark:border-[#2A3155]">Features</th>
                    <th className="p-6 font-bold text-authra-text-light dark:text-white border-b border-authra-border-light dark:border-[#2A3155] w-1/4">Starter</th>
                    <th className="p-6 font-bold text-brand-steel border-b border-authra-border-light dark:border-[#2A3155] w-1/4">Professional</th>
                    <th className="p-6 font-bold text-authra-text-light dark:text-white border-b border-authra-border-light dark:border-[#2A3155] w-1/4">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-authra-text-light dark:text-gray-300">
                  <tr>
                    <td className="p-6 border-b border-authra-border-light dark:border-[#2A3155] font-medium">Monthly Issuance Limit</td>
                    <td className="p-6 border-b border-authra-border-light dark:border-[#2A3155]">100</td>
                    <td className="p-6 border-b border-authra-border-light dark:border-[#2A3155]">1,000</td>
                    <td className="p-6 border-b border-authra-border-light dark:border-[#2A3155]">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="p-6 border-b border-authra-border-light dark:border-[#2A3155] font-medium">API Access</td>
                    <td className="p-6 border-b border-authra-border-light dark:border-[#2A3155] text-authra-text-sec-light">—</td>
                    <td className="p-6 border-b border-authra-border-light dark:border-[#2A3155]">Full Access</td>
                    <td className="p-6 border-b border-authra-border-light dark:border-[#2A3155]">Custom Limits</td>
                  </tr>
                  <tr>
                    <td className="p-6 border-b border-authra-border-light dark:border-[#2A3155] font-medium">Custom Branding</td>
                    <td className="p-6 border-b border-authra-border-light dark:border-[#2A3155] text-authra-text-sec-light">—</td>
                    <td className="p-6 border-b border-authra-border-light dark:border-[#2A3155]"><CheckCircle2 className="w-5 h-5 text-brand-steel" /></td>
                    <td className="p-6 border-b border-authra-border-light dark:border-[#2A3155]"><CheckCircle2 className="w-5 h-5 text-brand-steel" /></td>
                  </tr>
                  <tr>
                    <td className="p-6 border-b border-authra-border-light dark:border-[#2A3155] font-medium">Extra Certificates</td>
                    <td className="p-6 border-b border-authra-border-light dark:border-[#2A3155] text-authra-text-sec-light">Must Upgrade</td>
                    <td className="p-6 border-b border-authra-border-light dark:border-[#2A3155]">₹10 / 100 certs</td>
                    <td className="p-6 border-b border-authra-border-light dark:border-[#2A3155]">Included</td>
                  </tr>
                  <tr>
                    <td className="p-6 border-b border-authra-border-light dark:border-[#2A3155] font-medium">Support</td>
                    <td className="p-6 border-b border-authra-border-light dark:border-[#2A3155]">Community</td>
                    <td className="p-6 border-b border-authra-border-light dark:border-[#2A3155]">Priority Email</td>
                    <td className="p-6 border-b border-authra-border-light dark:border-[#2A3155]">Dedicated Manager</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQs */}
          <div className="max-w-3xl mx-auto mb-20">
            <div className="flex items-center justify-center gap-3 mb-10">
              <HelpCircle className="w-6 h-6 text-brand-steel" />
              <h2 className="text-3xl font-bold text-center text-authra-text-light dark:text-white">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-6">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white dark:bg-[#111522] border border-authra-border-light dark:border-[#2A3155] rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-authra-text-light dark:text-white mb-2">{faq.question}</h4>
                  <p className="text-authra-text-sec-light dark:text-authra-text-sec-dark text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
      
      <Footer />
    </>
  );
}
