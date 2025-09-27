import { json, type MetaFunction } from '@remix-run/cloudflare';
import { Button } from '~/components/ui/Button';
import { Card } from '~/components/ui/Card';
import BackgroundRays from '~/components/ui/BackgroundRays';

export const meta: MetaFunction = () => {
  return [
    { title: 'Pricing - Code Launch' },
    { name: 'description', content: 'Choose your Code Launch plan - AI code generation platform' }
  ];
};

export const loader = () => json({});

export default function Pricing() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started with AI code generation',
      features: [
        '5 projects per month',
        'Basic AI code generation',
        'Community support',
        'Standard templates',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$19',
      period: 'per month',
      description: 'Ideal for professional developers and small teams',
      features: [
        'Unlimited projects',
        'Advanced AI models',
        'Priority support',
        'Custom templates',
        'GitHub integration',
        'Export to multiple platforms',
      ],
      cta: 'Start Pro Trial',
      popular: true,
    },
    {
      name: 'Team',
      price: '$49',
      period: 'per month',
      description: 'Built for teams and organizations',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'Advanced analytics',
        'Custom AI training',
        'Enterprise security',
        'Dedicated support',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <BackgroundRays />

      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Choose Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-500 via-accent-400 to-purple-400 ml-3">
                Plan
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Unlock the full potential of AI-powered code generation with plans designed for every developer and team.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <Card
                key={plan.name}
                className={`relative p-8 bg-slate-900/50 border-slate-700/50 backdrop-blur-sm ${
                  plan.popular
                    ? 'ring-2 ring-accent-500/50 scale-105 bg-gradient-to-b from-slate-900/80 to-slate-900/60'
                    : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-accent-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-slate-400 ml-2">/{plan.period}</span>
                  </div>
                  <p className="text-slate-300 text-sm">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-accent-500 mr-3 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full py-3 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-accent-500 to-purple-500 hover:from-accent-600 hover:to-purple-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-600'
                  }`}
                >
                  {plan.cta}
                </Button>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Frequently Asked Questions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Can I switch plans anytime?
                  </h3>
                  <p className="text-slate-300">
                    Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Is there a free trial?
                  </h3>
                  <p className="text-slate-300">
                    The Pro plan includes a 14-day free trial. No credit card required to start.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    What payment methods do you accept?
                  </h3>
                  <p className="text-slate-300">
                    We accept all major credit cards, PayPal, and bank transfers for enterprise customers.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Do you offer refunds?
                  </h3>
                  <p className="text-slate-300">
                    Yes, we offer a 30-day money-back guarantee for all paid plans.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}