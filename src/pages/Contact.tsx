import React, { useState } from 'react';
import { Mail, Send, CheckCircle2 } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import CalculatorCard from '../components/CalculatorCard';
import SEOManager from '../components/SEOManager';
import Button from '../components/Button';

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xzdnrven";

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  privacy?: string;
  form?: string;
}

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('General Question');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [privacyChecked, setPrivacyChecked] = useState(false);
  
  // Honeypot anti-spam field
  const [website, setWebsite] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const breadcrumbs = [{ label: 'Contact Us', path: '/contact' }];
  const canonicalUrl = typeof window !== 'undefined' ? `${window.location.origin}/contact` : '';

  const seoData = {
    title: 'Contact Us - CalcNest Help & Feedback',
    description: 'Get in touch with the CalcNest team. Send us your tool suggestions, feature requests, error reports, or feedback.',
    canonicalUrl,
  };

  const validateForm = (): boolean => {
    const tempErrors: FormErrors = {};
    let isValid = true;

    if (!name.trim()) {
      tempErrors.name = 'Full Name is required.';
      isValid = false;
    } else if (name.trim().length < 2) {
      tempErrors.name = 'Name must be at least 2 characters.';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      tempErrors.email = 'Email Address is required.';
      isValid = false;
    } else if (!emailRegex.test(email)) {
      tempErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    if (!subject.trim()) {
      tempErrors.subject = 'Subject is required.';
      isValid = false;
    } else if (subject.trim().length < 5) {
      tempErrors.subject = 'Subject must be at least 5 characters.';
      isValid = false;
    }

    if (!message.trim()) {
      tempErrors.message = 'Message is required.';
      isValid = false;
    } else if (message.length < 20) {
      tempErrors.message = 'Message must be at least 20 characters.';
      isValid = false;
    } else if (message.length > 1000) {
      tempErrors.message = 'Message cannot exceed 1000 characters.';
      isValid = false;
    }

    if (!privacyChecked) {
      tempErrors.privacy = 'You must accept the Privacy Policy to proceed.';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // 1. Check honeypot field
    if (website) {
      // Silently ignore bot submissions and act as successful
      setSubmitted(true);
      return;
    }

    // 2. Client-side Validation
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 3. Fallback handle if endpoint is not pasted yet
      if (!FORMSPREE_ENDPOINT) {
        console.warn("Formspree endpoint is empty. Simulating success state.");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setSubmitted(true);
        return;
      }

      // 4. Production fetch call targeting the Formspree Endpoint
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          category,
          subject,
          message
        })
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const data = await response.json();
        setErrors({ form: data.error || 'Oops! There was a problem submitting your form.' });
      }
    } catch (err) {
      setErrors({ form: 'An unexpected error occurred. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setCategory('General Question');
    setSubject('');
    setMessage('');
    setPrivacyChecked(false);
    setWebsite('');
    setErrors({});
    setSubmitted(false);
  };

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-blue-700">
      <SEOManager metadata={seoData} />
      
      <div className="max-w-4xl mx-auto">
        <Breadcrumb items={breadcrumbs} id="contact-breadcrumb" />

        <div className="text-center mt-6 mb-10">
          <h1 className="text-3xl sm:text-4xl font-sans font-extrabold text-blue-800 mb-4 tracking-tight">
            Contact <span className="text-blue-700">CalcNest</span>
          </h1>
          <p className="text-blue-700 font-sans font-semibold max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Have a suggestion for a new calculator or need to report a calculation bug? Reach out to our engineering support team directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 space-y-6">
            <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl">
              <h3 className="font-sans font-bold text-lg text-blue-800 mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-700" /> Get in Touch
              </h3>
              <p className="text-sm text-gray-500 font-sans leading-relaxed mb-4">
                We are actively looking to add new calculators! If you have formulas, sheets, or models that you would like translated into polished tools, share them with us.
              </p>
              <div className="space-y-3 font-sans text-sm text-gray-600">
                <div className="flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>Average response time: 24-48 hours</span>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            <CalculatorCard id="contact-form-card" title="Send a Message" description="We appreciate your valuable feedback.">
              {submitted ? (
                <div className="text-center py-8 space-y-4">
                  <CheckCircle2 className="h-14 w-14 text-green-500 mx-auto animate-bounce" />
                  <h3 className="text-xl font-sans font-bold text-blue-800">Message Sent Successfully</h3>
                  <p className="text-sm text-gray-500 max-w-sm mx-auto font-sans leading-relaxed">
                    Thank you for contacting CalcNest. We appreciate your feedback and will reply as soon as possible.
                  </p>
                  <Button
                    id="new-msg-btn"
                    variant="secondary"
                    onClick={handleReset}
                    className="mt-4"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {/* Honeypot field disguised layout-wise */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="contact-website">Leave this field blank</label>
                    <input
                      id="contact-website"
                      type="text"
                      name="website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-semibold text-gray-400 font-sans mb-1">
                      Full Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      autoComplete="name"
                      placeholder="e.g. Alex Carter"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      aria-invalid={errors.name ? "true" : "false"}
                      className={`w-full font-sans text-sm text-gray-900 bg-white border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-2.5 outline-hidden focus:border-blue-300`}
                    />
                    {errors.name && <p className="text-xs text-red-600 font-sans mt-1 font-medium">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-semibold text-gray-400 font-sans mb-1">
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="e.g. alex@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-invalid={errors.email ? "true" : "false"}
                      className={`w-full font-sans text-sm text-gray-900 bg-white border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-2.5 outline-hidden focus:border-blue-300`}
                    />
                    {errors.email && <p className="text-xs text-red-600 font-sans mt-1 font-medium">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="contact-category" className="block text-xs font-semibold text-gray-400 font-sans mb-1">
                      Category *
                    </label>
                    <select
                      id="contact-category"
                      name="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full font-sans text-sm text-gray-900 bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-hidden focus:border-blue-300"
                    >
                      <option value="General Question">General Question</option>
                      <option value="Bug Report">Bug Report</option>
                      <option value="Calculator Error">Calculator Error</option>
                      <option value="Feature Request">Feature Request</option>
                      <option value="Business Inquiry">Business Inquiry</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Advertising">Advertising</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-semibold text-gray-400 font-sans mb-1">
                      Subject *
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      name="subject"
                      autoComplete="off"
                      placeholder="Briefly describe your message"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      aria-invalid={errors.subject ? "true" : "false"}
                      className={`w-full font-sans text-sm text-gray-900 bg-white border ${errors.subject ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-2.5 outline-hidden focus:border-blue-300`}
                    />
                    {errors.subject && <p className="text-xs text-red-600 font-sans mt-1 font-medium">{errors.subject}</p>}
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label htmlFor="contact-message" className="block text-xs font-semibold text-gray-400 font-sans">
                        Message *
                      </label>
                      <span className="text-xs font-sans text-gray-400">
                        {message.length} / 1000
                      </span>
                    </div>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      placeholder="Describe your request, details, or suggestions..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      maxLength={1000}
                      aria-invalid={errors.message ? "true" : "false"}
                      className={`w-full font-sans text-sm text-gray-900 bg-white border ${errors.message ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-2.5 outline-hidden focus:border-blue-300 resize-none`}
                    />
                    {errors.message && <p className="text-xs text-red-600 font-sans mt-1 font-medium">{errors.message}</p>}
                  </div>

                  <div>
                    <div className="flex items-start gap-2.5 mt-2">
                      <input
                        id="contact-privacy"
                        type="checkbox"
                        name="privacy"
                        checked={privacyChecked}
                        onChange={(e) => setPrivacyChecked(e.target.checked)}
                        aria-invalid={errors.privacy ? "true" : "false"}
                        className="mt-1 rounded-sm border-gray-300 text-blue-700 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                      />
                      <label htmlFor="contact-privacy" className="text-xs font-sans font-medium text-gray-500 select-none cursor-pointer leading-relaxed">
                        I agree to the website privacy policy and consent to the collection and data management details specified therein. *
                      </label>
                    </div>
                    {errors.privacy && <p className="text-xs text-red-600 font-sans mt-1 font-medium">{errors.privacy}</p>}
                  </div>

                  {errors.form && <p className="text-xs text-red-600 font-sans font-medium bg-red-50 p-2.5 rounded-xl border border-red-100">{errors.form}</p>}

                  <Button
                    id="submit-contact-btn"
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" /> <span>Send Message</span>
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CalculatorCard>
          </div>
        </div>
      </div>
    </main>
  );
}