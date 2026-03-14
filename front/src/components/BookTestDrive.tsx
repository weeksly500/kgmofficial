'use client';

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, User, Check, Loader2, Phone, Car } from "lucide-react";
import { API_ENDPOINTS } from "@/utils/apiConfig";
import { useLanguage } from "@/contexts/LanguageContext";
import enTranslations from "@/messages/en.json";
import frTranslations from "@/messages/fr.json";

const BookTestDrive = () => {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const t = language === 'fr' ? frTranslations : enTranslations;
  const bookTestDrive = (t as any)?.bookTestDrive || {};

  // Models list
  const models = [
    { id: 'tivoli', name: (t as any)?.models?.modelNames?.tivoli || "TIVOLI" },
    { id: 'torres', name: (t as any)?.models?.modelNames?.torres || "TORRES" },
    { id: 'torres-evx', name: (t as any)?.models?.modelNames?.torresEvx || "TORRES EVX" },
    { id: 'torres-hybrid', name: (t as any)?.models?.modelNames?.torresHybrid || "TORRES HYBRID" },
    { id: 'rexton', name: (t as any)?.models?.modelNames?.rexton || "REXTON" },
    { id: 'musso-grand', name: (t as any)?.models?.modelNames?.mussoGrand || "GRAND MUSSO" },
  ];

  // Get model from URL parameter
  const modelFromUrl = searchParams?.get('model') || '';

  // Form state
  const [formData, setFormData] = useState({
    model: "",
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    message: "",
  });

  // Pre-select model from URL parameter on component mount
  useEffect(() => {
    if (modelFromUrl) {
      // Validate model ID against valid model IDs
      const validModelIds = ['tivoli', 'torres', 'torres-evx', 'torres-hybrid', 'rexton', 'musso-grand'];
      if (validModelIds.includes(modelFromUrl)) {
        setFormData(prev => ({ ...prev, model: modelFromUrl }));
      }
    }
  }, [modelFromUrl]);
  const [formErrors, setFormErrors] = useState({
    model: "",
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {
      model: "",
      nom: "",
      prenom: "",
      telephone: "",
      email: "",
      message: "",
    };
    let isValid = true;

    if (!formData.model.trim()) {
      errors.model = bookTestDrive.errors?.modelRequired || "Model selection is required";
      isValid = false;
    }

    if (!formData.nom.trim()) {
      errors.nom = bookTestDrive.errors?.lastNameRequired || "Last name is required";
      isValid = false;
    } else if (formData.nom.trim().length < 2) {
      errors.nom = bookTestDrive.errors?.lastNameMin || "Last name must be at least 2 characters";
      isValid = false;
    }

    if (!formData.prenom.trim()) {
      errors.prenom = bookTestDrive.errors?.firstNameRequired || "First name is required";
      isValid = false;
    } else if (formData.prenom.trim().length < 2) {
      errors.prenom = bookTestDrive.errors?.firstNameMin || "First name must be at least 2 characters";
      isValid = false;
    }

    const phoneRegex = /^[+]?[\d\s\-()]{6,20}$/;
    if (!formData.telephone.trim()) {
      errors.telephone = bookTestDrive.errors?.phoneRequired || "Phone number is required";
      isValid = false;
    } else if (!phoneRegex.test(formData.telephone.trim())) {
      errors.telephone = bookTestDrive.errors?.phoneInvalid || "Please enter a valid phone number";
      isValid = false;
    }

    // Email is optional, but if provided, validate it
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = bookTestDrive.errors?.emailInvalid || "Please enter a valid email address";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setFormErrors({
      model: "",
      nom: "",
      prenom: "",
      telephone: "",
      email: "",
      message: "",
    });

    try {
      const response = await fetch(API_ENDPOINTS.TEST_DRIVE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Check if response is ok before parsing JSON
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("Failed to parse JSON response:", jsonError);
        setFormErrors({
          model: "",
          nom: "",
          prenom: "",
          telephone: "",
          email: "Server error. Please try again later.",
          message: "",
        });
        return;
      }

      if (!response.ok) {
        // Handle validation errors
        if (data.errors) {
          const apiErrors: any = {};
          Object.keys(data.errors).forEach((key) => {
            apiErrors[key] = Array.isArray(data.errors[key])
              ? data.errors[key][0]
              : data.errors[key];
          });
          setFormErrors((prev) => ({ ...prev, ...apiErrors }));
        } else {
          setFormErrors({
            model: "",
            nom: "",
            prenom: "",
            telephone: "",
            email: data.message || bookTestDrive.errors?.submitError || "An error occurred. Please try again.",
            message: "",
          });
        }
        return;
      }

      // Success
      setSubmitSuccess(true);
      setFormData({
        model: "",
        nom: "",
        prenom: "",
        telephone: "",
        email: "",
        message: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error: any) {
      console.error("Form submission error:", error);
      console.error("API URL:", API_ENDPOINTS.TEST_DRIVE);
      
      // More specific error messages
      let errorMessage = bookTestDrive.errors?.connectionError || "Connection error. Please check your connection and try again.";
      
      if (error instanceof TypeError && error.message.includes("fetch")) {
        errorMessage = "Unable to connect to server. Please check your internet connection.";
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      setFormErrors({
        model: "",
        nom: "",
        prenom: "",
        telephone: "",
        email: errorMessage,
        message: "",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Title */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
            {bookTestDrive.title || "Book your test drive"}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">
            {bookTestDrive.subtitle || "Which model would you like to test?"}
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {submitSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-8"
              >
                <motion.div
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#2D294E] flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Check className="w-8 h-8 text-white" />
                </motion.div>
                <p className="text-gray-900 font-semibold text-lg mb-1">
                  {bookTestDrive.successTitle || "Thank you!"}
                </p>
                <p className="text-gray-600 text-sm">
                  {bookTestDrive.successMessage || "We will contact you to confirm your appointment."}
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Model Selection */}
                <div>
                  <label htmlFor="book-test-drive-model" className="block text-gray-900 font-semibold mb-3">
                    {bookTestDrive.modelLabel || "Model"}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Car className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="book-test-drive-model"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3.5 bg-white border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2D294E] focus:border-[#2D294E] transition-all appearance-none ${
                        formErrors.model
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="" className="bg-white text-gray-900">
                        {bookTestDrive.selectModel || "Select a model"}
                      </option>
                      {models.map((model) => (
                        <option
                          key={model.id}
                          value={model.id}
                          className="bg-white text-gray-900"
                        >
                          {model.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {formErrors.model && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1.5 text-xs text-red-600 pl-1"
                    >
                      {formErrors.model}
                    </motion.p>
                  )}
                </div>

                {/* Personal Information Section */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-gray-900 font-semibold text-lg mb-2">
                    {bookTestDrive.personalInfoTitle || "Personal Information"}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">
                    {bookTestDrive.personalInfoSubtitle || "We will contact you to confirm your appointment"}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Last Name */}
                    <div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="nom"
                          value={formData.nom}
                          onChange={handleInputChange}
                          placeholder={bookTestDrive.lastNamePlaceholder || "Last Name"}
                          className={`w-full pl-12 pr-4 py-3.5 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D294E] focus:border-[#2D294E] transition-all ${
                            formErrors.nom
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300"
                          }`}
                        />
                      </div>
                      {formErrors.nom && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1.5 text-xs text-red-600 pl-1"
                        >
                          {formErrors.nom}
                        </motion.p>
                      )}
                    </div>

                    {/* First Name */}
                    <div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="prenom"
                          value={formData.prenom}
                          onChange={handleInputChange}
                          placeholder={bookTestDrive.firstNamePlaceholder || "First Name"}
                          className={`w-full pl-12 pr-4 py-3.5 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D294E] focus:border-[#2D294E] transition-all ${
                            formErrors.prenom
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300"
                          }`}
                        />
                      </div>
                      {formErrors.prenom && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1.5 text-xs text-red-600 pl-1"
                        >
                          {formErrors.prenom}
                        </motion.p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          name="telephone"
                          value={formData.telephone}
                          onChange={handleInputChange}
                          placeholder={bookTestDrive.phonePlaceholder || "Phone"}
                          className={`w-full pl-12 pr-4 py-3.5 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D294E] focus:border-[#2D294E] transition-all ${
                            formErrors.telephone
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300"
                          }`}
                        />
                      </div>
                      {formErrors.telephone && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1.5 text-xs text-red-600 pl-1"
                        >
                          {formErrors.telephone}
                        </motion.p>
                      )}
                    </div>

                    {/* Email (optional) */}
                    <div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder={`${bookTestDrive.emailPlaceholder || "E-mail"} (${bookTestDrive.optional || "optional"})`}
                          className={`w-full pl-12 pr-4 py-3.5 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D294E] focus:border-[#2D294E] transition-all ${
                            formErrors.email
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300"
                          }`}
                        />
                      </div>
                      {formErrors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1.5 text-xs text-red-600 pl-1"
                        >
                          {formErrors.email}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  {/* Message (optional) */}
                  <div className="mt-4">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={`${bookTestDrive.messagePlaceholder || "Message"} (${bookTestDrive.optional || "optional"})`}
                      rows={4}
                      className={`w-full px-4 py-3.5 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D294E] focus:border-[#2D294E] transition-all resize-none ${
                        formErrors.message
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {formErrors.message && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1.5 text-xs text-red-600 pl-1"
                      >
                        {formErrors.message}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 bg-[#2D294E] text-white font-semibold rounded-lg hover:bg-[#3a3458] focus:outline-none focus:ring-2 focus:ring-[#2D294E] focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
                  whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{bookTestDrive.submitting || "Submitting..."}</span>
                    </>
                  ) : (
                    <span>{bookTestDrive.submitButton || "SUBMIT"}</span>
                  )}
                </motion.button>

                {/* Privacy Policy */}
                <p className="text-xs text-gray-500 text-center">
                  {bookTestDrive.privacyText || "By submitting this form, you accept our privacy policy"}
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default BookTestDrive;

