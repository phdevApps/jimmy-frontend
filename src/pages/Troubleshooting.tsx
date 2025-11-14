
import React from 'react';
import { AlertTriangle, Wrench, HelpCircle, Phone } from 'lucide-react';

const Troubleshooting = () => {
  const troubleshootingSteps = [
    {
      icon: <Wrench className="h-8 w-8 text-blue-600" />,
      title: "Device Won't Turn On",
      steps: [
        "Check if the device is properly charged",
        "Ensure the power button is pressed and held for 3 seconds",
        "Try a different power outlet",
        "Contact support if the issue persists"
      ]
    },
    {
      icon: <AlertTriangle className="h-8 w-8 text-red-600" />,
      title: "Poor Suction Performance",
      steps: [
        "Empty the dust container",
        "Clean or replace the filter",
        "Check for blockages in the nozzle",
        "Ensure all parts are properly assembled"
      ]
    },
    {
      icon: <HelpCircle className="h-8 w-8 text-green-600" />,
      title: "Unusual Noise",
      steps: [
        "Turn off the device immediately",
        "Check for foreign objects in the brush roll",
        "Inspect the dust container for damage",
        "Contact customer service for inspection"
      ]
    },
    {
      icon: <Phone className="h-8 w-8 text-purple-600" />,
      title: "Battery Issues",
      steps: [
        "Charge the device for at least 4 hours",
        "Check if the charging dock is properly connected",
        "Clean the charging contacts",
        "Battery may need replacement after 2-3 years"
      ]
    }
  ];

  const commonSolutions = [
    {
      problem: "Device overheating",
      solution: "Allow the device to cool down for 30 minutes. Ensure air vents are not blocked."
    },
    {
      problem: "Error codes on display",
      solution: "Refer to your user manual for specific error code meanings and solutions."
    },
    {
      problem: "Brush roll not spinning",
      solution: "Remove any hair or debris wrapped around the brush. Check if brush roll is properly installed."
    },
    {
      problem: "Device won't charge",
      solution: "Check charging cable and adapter. Clean charging contacts with a dry cloth."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Troubleshooting Guide</h1>
          <p className="text-xl text-blue-100">Quick solutions for common issues</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Troubleshooting Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {troubleshootingSteps.map((step, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                {step.icon}
                <h2 className="text-xl font-bold text-gray-900 ml-3">{step.title}</h2>
              </div>
              <ol className="space-y-2">
                {step.steps.map((stepItem, stepIndex) => (
                  <li key={stepIndex} className="flex items-start">
                    <span className="bg-blue-600 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      {stepIndex + 1}
                    </span>
                    <span className="text-gray-600">{stepItem}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        {/* Common Solutions */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Solutions</h2>
          <div className="space-y-6">
            {commonSolutions.map((item, index) => (
              <div key={index} className="border-l-4 border-blue-600 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">{item.problem}</h3>
                <p className="text-gray-600">{item.solution}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
          <p className="text-gray-600 mb-6">If these solutions don't resolve your issue, our support team is here to help.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/pages/contact"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Contact Support
            </a>
            <a
              href="/pages/avada-faqs"
              className="inline-block bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              View FAQs
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Troubleshooting;
