
import React, { useState, useRef } from 'react';
import { generateImage, editImage } from '../services/geminiService';
import { ImageResolution } from '../types';

// Fix: Use 'any' for aistudio on Window to avoid "All declarations must have identical modifiers" error
// with pre-existing global definitions in the environment.
declare global {
  interface Window {
    aistudio: any;
  }
}

const ImagePlayground: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'generate' | 'edit'>('generate');
  const [prompt, setPrompt] = useState('');
  const [resolution, setResolution] = useState<ImageResolution>('1K');
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Edit State
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const ensureApiKey = async () => {
    try {
      // Accessing via window.aistudio as defined in the global augmentation
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey();
      }
      return true;
    } catch (e) {
      console.error("API Key selection failed", e);
      return false;
    }
  };

  const handleAction = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const keyOk = await ensureApiKey();
      if (!keyOk) throw new Error("API Key is required for this model.");

      let resultUrl = '';
      if (activeTab === 'generate') {
        resultUrl = await generateImage(prompt, resolution);
      } else {
        if (!sourceImage) throw new Error("Please upload an image to edit.");
        resultUrl = await editImage(sourceImage, prompt);
      }
      setResultImage(resultUrl);
    } catch (err: any) {
      setError(err.message || "An error occurred during generation.");
      if (err.message?.includes("Requested entity was not found")) {
        // Reset key selection if it failed due to bad selection
        await window.aistudio.openSelectKey();
      }
    } finally {
      setLoading(false);
    }
  };

  const TabButton: React.FC<{ id: 'generate' | 'edit'; label: string }> = ({ id, label }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setResultImage(null);
        setError(null);
      }}
      className={`flex-1 py-3 text-sm font-semibold transition-all ${
        activeTab === id 
          ? 'text-blue-600 border-b-2 border-blue-600' 
          : 'text-gray-400 border-b-2 border-transparent hover:text-gray-600'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50/30">
      <div className="bg-white border-b px-6 flex">
        <TabButton id="generate" label="Generate Image" />
        <TabButton id="edit" label="Edit Image" />
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
        <div className="max-w-2xl w-full space-y-8">
          {/* Settings Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            {activeTab === 'edit' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Original Image</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-video w-full border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden relative group"
                >
                  {sourceImage ? (
                    <>
                      <img src={sourceImage} alt="Source" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm">
                        Click to Change Image
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6">
                      <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-400 text-xs font-medium">Click to upload an image</p>
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {activeTab === 'generate' ? 'Describe the image you want' : 'What changes should be made?'}
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={activeTab === 'generate' ? "A futuristic neon city with flying cars..." : "Change the sky to purple and add a moon..."}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none text-sm"
              />
            </div>

            {activeTab === 'generate' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Resolution</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['1K', '2K', '4K'] as ImageResolution[]).map(res => (
                    <button
                      key={res}
                      onClick={() => setResolution(res)}
                      className={`py-2 rounded-lg text-xs font-bold transition-all ${
                        resolution === res 
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {res}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleAction}
              disabled={loading || !prompt}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center space-x-2 ${
                loading || !prompt ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{activeTab === 'generate' ? 'Generating...' : 'Editing...'}</span>
                </>
              ) : (
                <span>{activeTab === 'generate' ? 'Generate Magic' : 'Apply Changes'}</span>
              )}
            </button>
            
            <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">
              Powered by Nano Banana Models
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center space-x-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Result Section */}
          {(resultImage || loading) && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white p-2 rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative group">
                <div className={`aspect-square w-full rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden ${loading ? 'animate-pulse' : ''}`}>
                  {loading ? (
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-400 font-medium text-sm">Consulting with AI...</p>
                    </div>
                  ) : (
                    <img src={resultImage!} alt="Generated output" className="w-full h-full object-cover" />
                  )}
                </div>
                {!loading && resultImage && (
                  <div className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-gray-900">Final Result</h4>
                        <p className="text-xs text-gray-500 italic mt-1">"{prompt}"</p>
                      </div>
                      <a 
                        href={resultImage} 
                        download={`ai-${activeTab}-${Date.now()}.png`}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagePlayground;
