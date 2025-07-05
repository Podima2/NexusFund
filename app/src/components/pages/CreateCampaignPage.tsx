import React, { useState } from 'react';
import { ArrowLeft, Upload, Calendar, Target, DollarSign, Globe, CheckCircle, AlertCircle } from 'lucide-react';
import { useWallet } from '../../hooks/useWallet';
import { supportedChains, stablecoins } from '../../data/chainConfig';
import { CustomSelect } from '../ui/CustomSelect';
import { createPublicClient, createWalletClient, http, parseUnits, custom } from 'viem';
import { baseSepolia } from 'viem/chains';

interface CreateCampaignPageProps {
  onNavigate: (page: 'dashboard' | 'explore' | 'create') => void;
}

// Contract ABI (from Nexusfund.sol, only createCampaign)
const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "goal", "type": "uint256" },
      { "internalType": "uint256", "name": "durationSeconds", "type": "uint256" },
      { "internalType": "string", "name": "title", "type": "string" },
      { "internalType": "string", "name": "description", "type": "string" },
      { "internalType": "string", "name": "category", "type": "string" },
      { "internalType": "string", "name": "imageUrl", "type": "string" },
      { "internalType": "string[]", "name": "tags", "type": "string[]" }
    ],
    "name": "createCampaign",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const CONTRACT_ADDRESS = "0x4951992d46fa57c50Cb7FcC9137193BE639A9bEE"; // Update if redeployed

export const CreateCampaignPage: React.FC<CreateCampaignPageProps> = ({ onNavigate }) => {
  const { address, isConnected, primaryWallet } = useWallet();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technology',
    targetAmount: '',
    currency: 'USDC',
    deadline: '',
    imageUrl: '',
    tags: [] as string[],
    chainId: 1 // Ethereum default
  });

  const [tagInput, setTagInput] = useState('');

  const categories = ['Technology', 'Healthcare', 'Environment', 'Education', 'Agriculture', 'Security'];
  
  // Convert arrays to options format for CustomSelect
  const categoryOptions = categories.map(cat => ({ value: cat, label: cat }));
  const currencyOptions = stablecoins.map(coin => ({ 
    value: coin.symbol, 
    label: `${coin.icon} ${coin.name} (${coin.symbol})` 
  }));
  const chainOptions = supportedChains.map(chain => ({ 
    value: chain.chainId.toString(), 
    label: `${chain.icon} ${chain.name}` 
  }));

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !address) {
      alert('Please connect your wallet first');
      return;
    }
    if (formData.currency !== 'USDC') {
      alert('Only USDC is supported for now.');
      return;
    }
    if (!formData.targetAmount || isNaN(Number(formData.targetAmount)) || Number(formData.targetAmount) <= 0) {
      alert('Please enter a valid target amount.');
      return;
    }
    if (!formData.deadline) {
      alert('Please select a deadline.');
      return;
    }

    if (!primaryWallet) {
      alert('Wallet provider not available. Please reconnect your wallet.');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Convert targetAmount to smallest units (USDC: 6 decimals)
      const goal = parseUnits(formData.targetAmount, 6);
      // Calculate durationSeconds
      const deadlineTs = new Date(formData.deadline).getTime();
      const nowTs = Date.now();
      const durationSeconds = Math.floor((deadlineTs - nowTs) / 1000);
      if (durationSeconds <= 0) {
        alert('Deadline must be in the future.');
        setIsSubmitting(false);
        return;
      }

      // Prepare viem wallet client using Privy provider
      const provider = await primaryWallet.getEthereumProvider();
      const client = createWalletClient({
        chain: baseSepolia,
        transport: custom(provider),
      });
      const account = address as `0x${string}`;

      // Send transaction
      const txHash = await client.writeContract({
        account,
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'createCampaign',
        args: [
          goal,
          durationSeconds,
          formData.title,
          formData.description,
          formData.category,
          formData.imageUrl,
          formData.tags
        ],
        chain: baseSepolia,
      });
      console.log('Campaign creation tx hash:', txHash);

      setSubmitStatus('success');
      setTimeout(() => {
        onNavigate('dashboard');
      }, 2000);
    } catch (error) {
      console.error('Failed to create campaign:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const isStepValid = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return formData.title && formData.description && formData.category;
      case 2:
        return formData.targetAmount && formData.currency && formData.deadline;
      case 3:
        return true; // Optional step
      default:
        return false;
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-8 max-w-md w-full text-center animate-scale-in">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Campaign Created! 🎉</h2>
          <p className="text-neutral-400 mb-6">
            Your campaign has been successfully created and is now live on the platform.
          </p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
          >
            View Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (submitStatus === 'error') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-8 max-w-md w-full text-center animate-scale-in">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Creation Failed</h2>
          <p className="text-neutral-400 mb-6">
            There was an error creating your campaign. Please try again.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => setSubmitStatus('idle')}
              className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
            >
              Try Again
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex-1 bg-gradient-to-r from-red-700 to-pink-700 hover:from-red-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8 animate-slide-up">
          {/* <button
            onClick={() => onNavigate('dashboard')}
            className="p-2 hover:bg-neutral-800 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-neutral-400" />
          </button> */}
          <div>
            <h1 className="text-3xl text-sharp text-white">CREATE CAMPAIGN</h1>
            <p className="text-neutral-400 font-medium">Launch your cross-chain crowdfunding campaign</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center space-x-2 mb-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                  i <= step ? 'bg-blue-600' : 'bg-neutral-800'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-neutral-400 font-bold tracking-wide">
            <span>BASIC INFO</span>
            <span>FUNDING</span>
            <span>DETAILS</span>
            <span>REVIEW</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-6 animate-slide-up">
                <h2 className="text-xl text-sharp text-white mb-6">Basic Information</h2>
                
                <div>
                  <label className="block text-sm font-semibold text-neutral-300 mb-3">
                    Campaign Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter a compelling title for your campaign"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-300 mb-3">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your project, its goals, and why people should support it"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-4 text-white placeholder-neutral-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none font-medium"
                    rows={6}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-300 mb-3">
                    Category *
                  </label>
                  <CustomSelect
                    value={formData.category}
                    onChange={(value) => handleInputChange('category', value)}
                    options={categoryOptions}
                    placeholder="Select a category"
                    required
                  />
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid(1)}
                  className="relative w-full bg-gradient-to-r from-neutral-800 to-neutral-700 hover:from-neutral-700 hover:to-neutral-600 disabled:from-neutral-900 disabled:to-neutral-900 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden group shadow-lg hover:shadow-xl hover:shadow-neutral-500/20 focus:outline-none tracking-wide"
                >
                  {/* Animated Border Gradient */}
                  <div className="absolute inset-0 rounded-xl p-[2px] bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-green-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-full h-full bg-gradient-to-r from-neutral-800 to-neutral-700 group-hover:from-neutral-700 group-hover:to-neutral-600 rounded-[10px] transition-all duration-300"></div>
                  </div>
                  
                  {/* Shiny Highlight Effect */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                  </div>
                  
                  {/* Inner Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-green-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <span className="relative z-10">
                  Continue to Funding Details
                  </span>
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-slide-up">
                <h2 className="text-xl text-sharp text-white mb-6">Funding Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-300 mb-3">
                      Target Amount *
                    </label>
                    <input
                      type="number"
                      value={formData.targetAmount}
                      onChange={(e) => handleInputChange('targetAmount', e.target.value)}
                      placeholder="100000"
                      min="1"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-300 mb-3">
                      Currency *
                    </label>
                    <CustomSelect
                      value={formData.currency}
                     onChange={(value) => handleInputChange('currency', value)}
                     options={currencyOptions}
                     placeholder="Select currency"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-300 mb-3">
                    Campaign Deadline *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-300 mb-3">
                    Primary Network *
                  </label>
                  <CustomSelect
                    value={formData.chainId.toString()}
                    onChange={(value) => handleInputChange('chainId', Number(value))}
                    options={chainOptions}
                    placeholder="Select network"
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition-all duration-200 font-bold hover:scale-[1.02] active:scale-[0.98] tracking-wide"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid(2)}
                    className="relative flex-1 bg-gradient-to-r from-neutral-800 to-neutral-700 hover:from-neutral-700 hover:to-neutral-600 disabled:from-neutral-900 disabled:to-neutral-900 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden group shadow-lg hover:shadow-xl hover:shadow-neutral-500/20 focus:outline-none tracking-wide"
                  >
                    {/* Animated Border Gradient */}
                    <div className="absolute inset-0 rounded-xl p-[2px] bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-green-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-full h-full bg-gradient-to-r from-neutral-800 to-neutral-700 group-hover:from-neutral-700 group-hover:to-neutral-600 rounded-[10px] transition-all duration-300"></div>
                    </div>
                    
                    {/* Shiny Highlight Effect */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                    </div>
                    
                    {/* Inner Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-green-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <span className="relative z-10">
                    Continue to Details
                    </span>
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-slide-up">
                <h2 className="text-xl text-sharp text-white mb-6">Additional Details</h2>
                
                <div>
                  <label className="block text-sm font-semibold text-neutral-300 mb-3">
                    Campaign Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-300 mb-3">
                    Tags
                  </label>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Add tags to help people find your campaign"
                        className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 font-medium"
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition-all duration-200 font-medium"
                      >
                        Add
                      </button>
                    </div>
                    
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map(tag => (
                          <span
                            key={tag}
                            className="flex items-center space-x-2 px-3 py-1 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-300 font-medium"
                          >
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="text-neutral-400 hover:text-red-400 transition-colors"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition-all duration-200 font-bold hover:scale-[1.02] active:scale-[0.98] tracking-wide"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="relative flex-1 bg-gradient-to-r from-neutral-800 to-neutral-700 hover:from-neutral-700 hover:to-neutral-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] overflow-hidden group shadow-lg hover:shadow-xl hover:shadow-neutral-500/20 focus:outline-none tracking-wide"
                  >
                    {/* Animated Border Gradient */}
                    <div className="absolute inset-0 rounded-xl p-[2px] bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-green-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    </div>
                    
                    {/* Shiny Highlight Effect */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                    </div>
                    
                    {/* Inner Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-green-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <span className="relative z-10">Review Campaign</span>
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 animate-slide-up">
                <h2 className="text-xl text-sharp text-white mb-6">Review & Launch</h2>
                
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{formData.title}</h3>
                    <p className="text-neutral-400">{formData.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-neutral-400">Target:</span>
                      <span className="text-white font-semibold ml-2">
                        ${Number(formData.targetAmount).toLocaleString()} {formData.currency}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-400">Category:</span>
                      <span className="text-white font-semibold ml-2">{formData.category}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400">Deadline:</span>
                      <span className="text-white font-semibold ml-2">
                        {new Date(formData.deadline).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-400">Blockchain:</span>
                      <span className="text-white font-semibold ml-2">
                        {supportedChains.find(c => c.chainId === formData.chainId)?.icon} {supportedChains.find(c => c.chainId === formData.chainId)?.name}
                      </span>
                    </div>
                  </div>

                  {formData.tags.length > 0 && (
                    <div>
                      <span className="text-neutral-400 text-sm">Tags:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded-lg text-xs text-neutral-300 font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-blue-950 border border-blue-800 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-white mb-3">Cross-Chain Features</h4>
                  <ul className="text-blue-300 space-y-2 text-sm font-medium">
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      <span>Supporters can pledge from any supported blockchain</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      <span>Funds are automatically bridged and held in escrow</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      <span>Atomic release when goal is met or refund if not</span>
                    </li>
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition-all duration-200 font-bold hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="relative flex-1 bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-600 hover:to-emerald-600 disabled:from-neutral-900 disabled:to-neutral-900 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 overflow-hidden group shadow-lg hover:shadow-xl hover:shadow-green-500/20 focus:outline-none"
                  >
                    {/* Animated Border Gradient */}
                    <div className="absolute inset-0 rounded-xl p-[2px] bg-gradient-to-r from-green-500/30 via-emerald-500/30 to-green-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-full h-full bg-gradient-to-r from-green-700 to-emerald-700 group-hover:from-green-600 group-hover:to-emerald-600 rounded-[10px] transition-all duration-300"></div>
                    </div>
                    
                    {/* Shiny Highlight Effect */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                    </div>
                    
                    {/* Inner Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-green-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {isSubmitting ? (
                      <div className="relative z-10 flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Creating Campaign...</span>
                      </div>
                    ) : (
                      <div className="relative z-10 flex items-center space-x-2">
                        <Target className="w-5 h-5" />
                        <span>Launch Campaign</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};