"use client"

import { motion } from "framer-motion"
import { Check, Zap, Crown, Rocket } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import { SparklesCore } from "@/components/sparkles"

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for trying out our platform",
    icon: Zap,
    color: "from-blue-500 to-cyan-500",
    features: ["5 papers per month", "Basic presentations", "Standard templates", "Email support", "PDF export"],
    limitations: ["Watermarked outputs", "Limited customization"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Professional",
    price: "$29",
    period: "/month",
    description: "For researchers and academics",
    icon: Crown,
    color: "from-purple-500 to-pink-500",
    features: [
      "50 papers per month",
      "All content types",
      "Premium templates",
      "Priority support",
      "All export formats",
      "Custom branding",
      "Advanced analytics",
    ],
    limitations: [],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "For teams and institutions",
    icon: Rocket,
    color: "from-orange-500 to-red-500",
    features: [
      "Unlimited papers",
      "Team collaboration",
      "Custom integrations",
      "Dedicated support",
      "White-label solution",
      "API access",
      "Advanced security",
      "Custom training",
    ],
    limitations: [],
    cta: "Contact Sales",
    popular: false,
  },
]

const faqs = [
  {
    question: "What file formats do you support?",
    answer: "We support PDF, DOC, DOCX, TXT, and even scanned documents with OCR processing.",
  },
  {
    question: "How accurate is the AI analysis?",
    answer:
      "Our AI achieves 95%+ accuracy in extracting key insights and maintains the original meaning of your research.",
  },
  {
    question: "Can I customize the output formats?",
    answer: "Yes! Professional and Enterprise plans include custom templates and branding options.",
  },
  {
    question: "Is my research data secure?",
    answer: "Absolutely. We use enterprise-grade encryption and never store your documents after processing.",
  },
]

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <div className="h-full w-full absolute inset-0 z-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={50}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      <div className="relative z-10">
        <Navbar />

        <div className="container mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Simple, Transparent
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                {" "}
                Pricing
              </span>
            </h1>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto">
              Choose the perfect plan for your research needs. Start free and upgrade as you grow.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm">Most Popular</div>
                  </div>
                )}
                <Card
                  className={`bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 h-full ${
                    plan.popular ? "border-purple-500/50 shadow-lg shadow-purple-500/20" : ""
                  }`}
                >
                  <CardHeader className="text-center">
                    <div
                      className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center mb-4`}
                    >
                      <plan.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-gray-400 mb-4">{plan.description}</CardDescription>
                    <div className="text-center">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      {plan.period && <span className="text-gray-400">{plan.period}</span>}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-gray-300">
                          <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                      {plan.limitations.map((limitation, limitationIndex) => (
                        <li key={limitationIndex} className="flex items-center text-gray-500">
                          <div className="w-5 h-5 mr-3 flex-shrink-0 flex items-center justify-center">
                            <div className="w-1 h-1 bg-gray-500 rounded-full" />
                          </div>
                          {limitation}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? "bg-purple-600 hover:bg-purple-700 text-white"
                          : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <Card key={index} className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center mt-16"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">Still Have Questions?</h3>
              <p className="text-gray-400 mb-6">
                Our team is here to help you choose the right plan for your research needs.
              </p>
              <Button size="lg" variant="outline" className="text-white border-purple-500 hover:bg-purple-500/20">
                Contact Support
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
