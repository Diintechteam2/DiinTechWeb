"use client";

import React, { useEffect, useState } from 'react';
import api from '@/admin_lib/api';
import {
  Plus,
  Search,
  ExternalLink,
  Edit3,
  Trash2,
  Calendar,
  Briefcase,
  X,
  Sparkles,
  Loader2
} from 'lucide-react';

const parseLines = (value: string) =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

const ensureString = (value: unknown) => (typeof value === 'string' ? value : '');

const ensureStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return parseLines(value.replace(/\r\n/g, '\n'));
  }

  return [];
};

const defaultProject = {
  name: '',
  slug: '',
  websiteUrl: '',
  logoUrl: '',
  lastUpdated: '',
  content: {
    introduction: '',
    informationCollect: {
      personal: [] as string[],
      userContent: [] as string[],
      deviceUsage: [] as string[]
    },
    howWeUse: [] as string[],
    dataSharing: [] as string[],
    dataSecurity: '',
    dataRetention: '',
    dataDeletion: { instruction: '', email: '', subject: '' },
    childrenPrivacy: '',
    thirdParty: '',
    changesToPolicy: '',
    imageProcessing: '',
    disclaimer: '',
    contactUs: { instruction: '', email: '' }
  },
  refundPolicy: {
    enabled: false,
    content: {
      introduction: '',
      eligibility: '',
      timeline: '',
      process: ''
    }
  },
  termsConditions: {
    enabled: false,
    content: {
      introduction: '',
      userAgreement: '',
      intellectualProperty: '',
      userConduct: '',
      limitationLiability: '',
      governingLaw: '',
      contactUs: ''
    }
  }
};

type ProjectForm = typeof defaultProject;
type ProjectRecord = ProjectForm & { _id?: string };

const defaultPromptInputs = {
  projectDescription: '',
  targetUsers: '',
  coreFeatures: '',
  dataCollected: '',
  thirdPartyServices: '',
  contactEmail: '',
  additionalNotes: '',
  hasAuthentication: false,
  hasUploads: false,
  usesAI: false,
  hasPayments: false,
  generateRefundPolicy: false,
  refundBuffer: '24 hours',
  gatewayTat: '5-7 business days',
  refundRules: '',
  generateTerms: false,
  termsNotes: ''
};

type PromptInputs = typeof defaultPromptInputs;

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<ProjectRecord | null>(null);
  const [formData, setFormData] = useState<ProjectForm>(defaultProject);
  const [promptInputs, setPromptInputs] = useState<PromptInputs>(defaultPromptInputs);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [aiProvider, setAiProvider] = useState<'openai' | 'gemini'>('gemini');

  const fetchProjects = async () => {
    try {
      const response = await api.get('projects');
      setProjects(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleEdit = (project: ProjectRecord) => {
    setCurrentProject(project);
    setFormData({
      ...defaultProject,
      ...project,
      content: {
        ...defaultProject.content,
        ...(project.content || {}),
        informationCollect: {
          ...defaultProject.content.informationCollect,
          ...(project.content?.informationCollect || {}),
          personal: ensureStringArray(project.content?.informationCollect?.personal),
          userContent: ensureStringArray(project.content?.informationCollect?.userContent),
          deviceUsage: ensureStringArray(project.content?.informationCollect?.deviceUsage)
        },
        dataDeletion: {
          ...defaultProject.content.dataDeletion,
          ...(project.content?.dataDeletion || {}),
          instruction: ensureString(project.content?.dataDeletion?.instruction),
          email: ensureString(project.content?.dataDeletion?.email),
          subject: ensureString(project.content?.dataDeletion?.subject)
        },
        contactUs: {
          ...defaultProject.content.contactUs,
          ...(project.content?.contactUs || {}),
          instruction: ensureString(project.content?.contactUs?.instruction),
          email: ensureString(project.content?.contactUs?.email)
        },
        introduction: ensureString(project.content?.introduction),
        howWeUse: ensureStringArray(project.content?.howWeUse),
        dataSharing: ensureStringArray(project.content?.dataSharing),
        dataSecurity: ensureString(project.content?.dataSecurity),
        dataRetention: ensureString(project.content?.dataRetention),
        childrenPrivacy: ensureString(project.content?.childrenPrivacy),
        thirdParty: ensureString(project.content?.thirdParty),
        changesToPolicy: ensureString(project.content?.changesToPolicy),
        imageProcessing: ensureString(project.content?.imageProcessing),
        disclaimer: ensureString(project.content?.disclaimer)
      },
      refundPolicy: {
        ...defaultProject.refundPolicy,
        ...(project.refundPolicy || {}),
        content: {
          ...defaultProject.refundPolicy.content,
          ...(project.refundPolicy?.content || {}),
          introduction: ensureString(project.refundPolicy?.content?.introduction),
          eligibility: ensureString(project.refundPolicy?.content?.eligibility),
          timeline: ensureString(project.refundPolicy?.content?.timeline),
          process: ensureString(project.refundPolicy?.content?.process)
        }
      },
      termsConditions: {
        ...defaultProject.termsConditions,
        ...(project.termsConditions || {}),
        content: {
          ...defaultProject.termsConditions.content,
          ...(project.termsConditions?.content || {}),
          introduction: ensureString(project.termsConditions?.content?.introduction),
          userAgreement: ensureString(project.termsConditions?.content?.userAgreement),
          intellectualProperty: ensureString(project.termsConditions?.content?.intellectualProperty),
          userConduct: ensureString(project.termsConditions?.content?.userConduct),
          limitationLiability: ensureString(project.termsConditions?.content?.limitationLiability),
          governingLaw: ensureString(project.termsConditions?.content?.governingLaw),
          contactUs: ensureString(project.termsConditions?.content?.contactUs)
        }
      }
    });
    setPromptInputs({
      ...defaultPromptInputs,
      contactEmail:
        project.content?.contactUs?.email ||
        project.content?.dataDeletion?.email ||
        '',
      generateRefundPolicy: !!project.refundPolicy?.enabled,
      refundRules: project.refundPolicy?.content?.eligibility || '',
      generateTerms: !!project.termsConditions?.enabled,
      termsNotes: project.termsConditions?.content?.introduction || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      await api.delete(`projects/${id}`);
      fetchProjects();
    } catch {
      alert('Failed to delete project');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentProject) {
        await api.put(`projects/${currentProject._id!}`, formData);
      } else {
        await api.post('projects', formData);
      }

      setIsModalOpen(false);
      setCurrentProject(null);
      setFormData(defaultProject);
      fetchProjects();
    } catch (err: unknown) {
      const message =
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : 'Failed to save project';
      alert(message);
    }
  };

  const handleGenerateDraft = async () => {
    if (!formData.name.trim()) {
      alert('Project name is required to generate the AI draft.');
      return;
    }

    if (!formData.websiteUrl.trim()) {
      alert('Website URL is required to generate the AI draft.');
      return;
    }

    setIsGeneratingDraft(true);

    try {
      const response = await api.post('projects/generate-privacy-draft', {
        projectName: formData.name,
        websiteUrl: formData.websiteUrl,
        promptInputs,
        provider: aiProvider
      });

      const generatedContent = response.data?.data?.content;
      const generatedRefund = response.data?.data?.refundPolicy;
      const generatedTerms = response.data?.data?.termsConditions;

      if (!generatedContent) {
        throw new Error('Draft content not found in AI response');
      }

      setFormData((prev) => ({
        ...prev,
        lastUpdated: prev.lastUpdated || new Date().toLocaleDateString(),
        content: {
          ...prev.content,
          introduction: ensureString(generatedContent.introduction),
          informationCollect: {
            personal: ensureStringArray(generatedContent.informationCollect?.personal),
            userContent: ensureStringArray(generatedContent.informationCollect?.userContent),
            deviceUsage: ensureStringArray(generatedContent.informationCollect?.deviceUsage)
          },
          howWeUse: ensureStringArray(generatedContent.howWeUse),
          dataSharing: ensureStringArray(generatedContent.dataSharing),
          dataSecurity: ensureString(generatedContent.dataSecurity),
          dataRetention: ensureString(generatedContent.dataRetention),
          dataDeletion: {
            instruction: ensureString(generatedContent.dataDeletion?.instruction),
            email: ensureString(generatedContent.dataDeletion?.email) || promptInputs.contactEmail || '',
            subject: ensureString(generatedContent.dataDeletion?.subject)
          },
          childrenPrivacy: ensureString(generatedContent.childrenPrivacy),
          thirdParty: ensureString(generatedContent.thirdParty),
          changesToPolicy: ensureString(generatedContent.changesToPolicy),
          imageProcessing: ensureString(generatedContent.imageProcessing),
          disclaimer: ensureString(generatedContent.disclaimer),
          contactUs: {
            instruction: ensureString(generatedContent.contactUs?.instruction),
            email: ensureString(generatedContent.contactUs?.email) || promptInputs.contactEmail || ''
          }
        },
        refundPolicy: {
          enabled: !!generatedRefund?.enabled,
          content: {
            introduction: ensureString(generatedRefund?.content?.introduction),
            eligibility: ensureString(generatedRefund?.content?.eligibility),
            timeline: ensureString(generatedRefund?.content?.timeline),
            process: ensureString(generatedRefund?.content?.process)
          }
        },
        termsConditions: {
          enabled: !!generatedTerms?.enabled,
          content: {
            introduction: ensureString(generatedTerms?.content?.introduction),
            userAgreement: ensureString(generatedTerms?.content?.userAgreement),
            intellectualProperty: ensureString(generatedTerms?.content?.intellectualProperty),
            userConduct: ensureString(generatedTerms?.content?.userConduct),
            limitationLiability: ensureString(generatedTerms?.content?.limitationLiability),
            governingLaw: ensureString(generatedTerms?.content?.governingLaw),
            contactUs: ensureString(generatedTerms?.content?.contactUs)
          }
        }
      }));

      if (promptInputs.contactEmail) {
        setPromptInputs((prev) => ({ ...prev }));
      }
    } catch (err: unknown) {
      const message =
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : err instanceof Error
            ? err.message
            : 'Failed to generate AI draft';
      alert(message);
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-white p-8 font-bold">Loading Projects...</div>;

  const modalTextareaClass =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white overflow-auto scrollbar-hide";

  const renderProjectLogo = (project: ProjectRecord) => {
    if (project.logoUrl) {
      return (
        <img
          src={project.logoUrl}
          alt={`${project.name} logo`}
          className="w-12 h-12 rounded-2xl object-cover border border-blue-500/20 bg-white/5"
        />
      );
    }

    return (
      <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center border border-blue-500/20">
        <Briefcase className="w-6 h-6 text-blue-500" />
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-gray-400">Manage every privacy-policy field that exists in the frontend data file.</p>
        </div>
        <button
          onClick={() => {
            setCurrentProject(null);
            setFormData(defaultProject);
            setPromptInputs(defaultPromptInputs);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all"
        >
          <Plus className="w-5 h-5" /> Add Project
        </button>
      </div>

      <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 text-white pl-11 text-sm placeholder:text-gray-600"
          />
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 bg-white/5 border border-dashed border-white/20 rounded-3xl">
          <Search className="w-10 h-10 text-white/20 mx-auto mb-4" />
          <p className="text-gray-400">No projects found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project._id} className="group bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/[0.08] transition-all">
              <div className="flex justify-between items-start mb-6">
                {renderProjectLogo(project)}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(project)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(project._id!)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-1">{project.name}</h3>
              <p className="text-sm text-gray-400 mb-4 font-mono">/{project.slug}</p>
              <p className="text-sm text-gray-500 line-clamp-3 min-h-[72px]">{project.content?.introduction}</p>

              <div className="mt-6 pt-4 border-t border-white/5 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{project.lastUpdated || 'No date set'}</span>
                </div>
                <div className="flex items-center gap-2 text-blue-400">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="truncate">{project.websiteUrl || 'No website set'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f1115] border border-white/10 rounded-3xl w-full max-w-6xl max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="p-8 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#0f1115] z-10">
              <div>
                <h2 className="text-2xl font-bold text-white">{currentProject ? 'Edit Project' : 'Add Project'}</h2>
                <p className="text-sm text-gray-400">All privacy-policy fields are editable from here.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-8 space-y-8 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <label className="space-y-2 block">
                  <span className="text-sm font-semibold text-gray-300">Project Name</span>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                  />
                </label>
                <label className="space-y-2 block">
                  <span className="text-sm font-semibold text-gray-300">Slug</span>
                  <input
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                  />
                </label>
                <label className="space-y-2 block">
                  <span className="text-sm font-semibold text-gray-300">Website URL</span>
                  <input
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                  />
                </label>
                <label className="space-y-2 block">
                  <span className="text-sm font-semibold text-gray-300">Last Updated</span>
                  <input
                    value={formData.lastUpdated}
                    onChange={(e) => setFormData({ ...formData, lastUpdated: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                  />
                </label>

                <div className="space-y-2 block xl:col-span-4 border-t border-white/5 pt-4">
                  <span className="text-sm font-semibold text-gray-300">Project Logo</span>
                  <div className="flex flex-col md:flex-row gap-6 items-stretch">
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData({ ...formData, logoUrl: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="flex-1 min-h-[110px] border-2 border-dashed border-white/10 hover:border-blue-500/40 hover:bg-white/[0.01] rounded-2xl flex flex-col items-center justify-center p-4 transition-all cursor-pointer relative"
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData({ ...formData, logoUrl: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Briefcase className="w-7 h-7 text-gray-500 mb-1" />
                      <p className="text-xs text-gray-400 text-center">
                        <span className="text-blue-400 font-semibold">Click to upload logo</span> or drag and drop image here
                      </p>
                      <p className="text-[10px] text-gray-600 text-center mt-1">PNG, JPG, SVG or WebP</p>
                    </div>

                    <div className="flex-1 flex flex-col justify-between gap-3">
                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-gray-400 block">Or Paste External Logo URL</span>
                        <input
                          value={formData.logoUrl.startsWith('data:') ? '' : formData.logoUrl}
                          onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                          placeholder="https://example.com/logo.png"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs placeholder:text-gray-500"
                        />
                      </div>
                      {formData.logoUrl && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, logoUrl: '' })}
                          className="w-full border border-red-500/20 hover:bg-red-500/10 text-red-400 text-xs py-3 rounded-xl transition-all font-semibold"
                        >
                          Remove Logo Image
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/[0.06] p-5 space-y-5">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-400" />
                      AI Privacy Draft Generator
                    </h3>
                    <p className="text-sm text-gray-400">
                      Provide the context below along with the project name and URL. Generating the draft will automatically populate the privacy fields below.
                    </p>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    {/* Model Switcher */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-1 flex items-center">
                      <button
                        type="button"
                        onClick={() => setAiProvider('openai')}
                        className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                          aiProvider === 'openai'
                            ? 'bg-blue-600 text-white shadow'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        OpenAI
                      </button>
                      <button
                        type="button"
                        onClick={() => setAiProvider('gemini')}
                        className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                          aiProvider === 'gemini'
                            ? 'bg-blue-600 text-white shadow'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Gemini
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleGenerateDraft}
                      disabled={isGeneratingDraft}
                      className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl font-semibold"
                    >
                      {isGeneratingDraft ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      {isGeneratingDraft ? 'Generating Draft...' : 'Generate AI Draft'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  <label className="space-y-2 block">
                    <span className="text-sm font-semibold text-gray-300">Project Description</span>
                    <textarea
                      rows={3}
                      value={promptInputs.projectDescription}
                      onChange={(e) => setPromptInputs({ ...promptInputs, projectDescription: e.target.value })}
                      className={modalTextareaClass}
                      placeholder="What does the project/app do?"
                    />
                  </label>
                  <label className="space-y-2 block">
                    <span className="text-sm font-semibold text-gray-300">Target Users</span>
                    <textarea
                      rows={3}
                      value={promptInputs.targetUsers}
                      onChange={(e) => setPromptInputs({ ...promptInputs, targetUsers: e.target.value })}
                      className={modalTextareaClass}
                      placeholder="What type of users use this app?"
                    />
                  </label>
                  <label className="space-y-2 block">
                    <span className="text-sm font-semibold text-gray-300">Core Features</span>
                    <textarea
                      rows={3}
                      value={promptInputs.coreFeatures}
                      onChange={(e) => setPromptInputs({ ...promptInputs, coreFeatures: e.target.value })}
                      className={modalTextareaClass}
                      placeholder="Main features or workflows"
                    />
                  </label>
                  <label className="space-y-2 block">
                    <span className="text-sm font-semibold text-gray-300">Data Collected</span>
                    <textarea
                      rows={3}
                      value={promptInputs.dataCollected}
                      onChange={(e) => setPromptInputs({ ...promptInputs, dataCollected: e.target.value })}
                      className={modalTextareaClass}
                      placeholder="Email, phone, images, prompts, payment data, analytics..."
                    />
                  </label>
                  <label className="space-y-2 block">
                    <span className="text-sm font-semibold text-gray-300">Third-Party Services</span>
                    <textarea
                      rows={3}
                      value={promptInputs.thirdPartyServices}
                      onChange={(e) => setPromptInputs({ ...promptInputs, thirdPartyServices: e.target.value })}
                      className={modalTextareaClass}
                      placeholder="Google Analytics, Razorpay, Firebase, Cloudinary, OpenAI, etc."
                    />
                  </label>
                  <label className="space-y-2 block">
                    <span className="text-sm font-semibold text-gray-300">Contact Email</span>
                    <input
                      value={promptInputs.contactEmail}
                      onChange={(e) => setPromptInputs({ ...promptInputs, contactEmail: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                      placeholder="privacy@yourdomain.com"
                    />
                  </label>
                  <label className="space-y-2 block xl:col-span-2">
                    <span className="text-sm font-semibold text-gray-300">Additional Notes</span>
                    <textarea
                      rows={3}
                      value={promptInputs.additionalNotes}
                      onChange={(e) => setPromptInputs({ ...promptInputs, additionalNotes: e.target.value })}
                      className={modalTextareaClass}
                      placeholder="Any specific legal/business notes to include in the draft"
                    />
                  </label>
                </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-3">
                  {[
                    { key: 'hasAuthentication', label: 'Includes Login / Signup' },
                    { key: 'hasUploads', label: 'Includes Image / File uploads' },
                    { key: 'usesAI', label: 'Generates AI output' },
                    { key: 'hasPayments', label: 'Includes Payments / Subscriptions' },
                    { key: 'generateRefundPolicy', label: 'Generate Refund Policy?' },
                    { key: 'generateTerms', label: 'Generate Terms?' }
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={promptInputs[item.key as keyof PromptInputs] as boolean}
                        onChange={(e) =>
                           setPromptInputs({
                             ...promptInputs,
                             [item.key]: e.target.checked
                           })
                        }
                        className="h-4 w-4 rounded border-white/20 bg-transparent"
                      />
                      <span className="text-sm text-gray-300">{item.label}</span>
                    </label>
                  ))}
                </div>

                {promptInputs.generateRefundPolicy && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-white/5 pt-4 mt-3">
                    <label className="space-y-2 block">
                      <span className="text-sm font-semibold text-gray-300">Company Processing Buffer</span>
                      <input
                        value={promptInputs.refundBuffer}
                        onChange={(e) => setPromptInputs({ ...promptInputs, refundBuffer: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                        placeholder="e.g. 24 hours"
                      />
                    </label>
                    <label className="space-y-2 block">
                      <span className="text-sm font-semibold text-gray-300">Payment Gateway TAT</span>
                      <input
                        value={promptInputs.gatewayTat}
                        onChange={(e) => setPromptInputs({ ...promptInputs, gatewayTat: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                        placeholder="e.g. 5-7 business days"
                      />
                    </label>
                    <label className="space-y-2 block md:col-span-2">
                      <span className="text-sm font-semibold text-gray-300">Refund Rules & Eligibility Guidelines</span>
                      <textarea
                        rows={3}
                        value={promptInputs.refundRules}
                        onChange={(e) => setPromptInputs({ ...promptInputs, refundRules: e.target.value })}
                        className={modalTextareaClass}
                        placeholder="e.g. Non-refundable if AI tokens/credits are consumed. Full refund on unused balance."
                      />
                    </label>
                  </div>
                )}

                {promptInputs.generateTerms && (
                  <div className="grid grid-cols-1 gap-5 border-t border-white/5 pt-4 mt-3">
                    <label className="space-y-2 block">
                      <span className="text-sm font-semibold text-gray-300">Additional Terms & Conditions Guidelines</span>
                      <textarea
                        rows={3}
                        value={promptInputs.termsNotes}
                        onChange={(e) => setPromptInputs({ ...promptInputs, termsNotes: e.target.value })}
                        className={modalTextareaClass}
                        placeholder="e.g. Must be 18+ to use. All content generated remains property of the user, but we are not liable for copyright infringement."
                      />
                    </label>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-gray-300 mb-3">Logo Preview</p>
                <div className="flex items-center gap-4">
                  {renderProjectLogo({
                    ...formData,
                    _id: currentProject?._id
                  })}
                  <div className="text-sm text-gray-400">
                    {formData.logoUrl
                      ? 'This logo will be displayed on the card.'
                      : 'If the logo URL/path is empty, a default icon will be displayed.'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <label className="space-y-2 block xl:col-span-2">
                  <span className="text-sm font-semibold text-gray-300">Introduction</span>
                  <textarea
                    rows={4}
                    value={formData.content.introduction}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        content: { ...formData.content, introduction: e.target.value }
                      })
                    }
                    className={modalTextareaClass}
                  />
                </label>

                <label className="space-y-2 block">
                  <span className="text-sm font-semibold text-gray-300">Personal Info List</span>
                  <textarea
                    rows={5}
                    value={ensureStringArray(formData.content.informationCollect.personal).join('\n')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        content: {
                          ...formData.content,
                          informationCollect: {
                            ...formData.content.informationCollect,
                            personal: parseLines(e.target.value)
                          }
                        }
                      })
                    }
                    className={modalTextareaClass}
                  />
                </label>
                <label className="space-y-2 block">
                  <span className="text-sm font-semibold text-gray-300">User Content List</span>
                  <textarea
                    rows={5}
                    value={ensureStringArray(formData.content.informationCollect.userContent).join('\n')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        content: {
                          ...formData.content,
                          informationCollect: {
                            ...formData.content.informationCollect,
                            userContent: parseLines(e.target.value)
                          }
                        }
                      })
                    }
                    className={modalTextareaClass}
                  />
                </label>
                <label className="space-y-2 block">
                  <span className="text-sm font-semibold text-gray-300">Device & Usage List</span>
                  <textarea
                    rows={5}
                    value={ensureStringArray(formData.content.informationCollect.deviceUsage).join('\n')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        content: {
                          ...formData.content,
                          informationCollect: {
                            ...formData.content.informationCollect,
                            deviceUsage: parseLines(e.target.value)
                          }
                        }
                      })
                    }
                    className={modalTextareaClass}
                  />
                </label>
                <label className="space-y-2 block">
                  <span className="text-sm font-semibold text-gray-300">How We Use</span>
                  <textarea
                    rows={5}
                    value={ensureStringArray(formData.content.howWeUse).join('\n')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        content: { ...formData.content, howWeUse: parseLines(e.target.value) }
                      })
                    }
                    className={modalTextareaClass}
                  />
                </label>
                <label className="space-y-2 block xl:col-span-2">
                  <span className="text-sm font-semibold text-gray-300">Data Sharing</span>
                  <textarea
                    rows={4}
                    value={ensureStringArray(formData.content.dataSharing).join('\n')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        content: { ...formData.content, dataSharing: parseLines(e.target.value) }
                      })
                    }
                    className={modalTextareaClass}
                  />
                </label>
                <label className="space-y-2 block">
                  <span className="text-sm font-semibold text-gray-300">Data Security</span>
                  <textarea
                    rows={4}
                    value={formData.content.dataSecurity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        content: { ...formData.content, dataSecurity: e.target.value }
                      })
                    }
                    className={modalTextareaClass}
                  />
                </label>
                <label className="space-y-2 block">
                  <span className="text-sm font-semibold text-gray-300">Data Retention</span>
                  <textarea
                    rows={4}
                    value={formData.content.dataRetention}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        content: { ...formData.content, dataRetention: e.target.value }
                      })
                    }
                    className={modalTextareaClass}
                  />
                </label>
                <label className="space-y-2 block">
                  <span className="text-sm font-semibold text-gray-300">Deletion Instruction</span>
                  <textarea
                    rows={3}
                    value={formData.content.dataDeletion.instruction}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        content: {
                          ...formData.content,
                          dataDeletion: { ...formData.content.dataDeletion, instruction: e.target.value }
                        }
                      })
                    }
                    className={modalTextareaClass}
                  />
                </label>
                <label className="space-y-2 block">
                  <span className="text-sm font-semibold text-gray-300">Deletion Email</span>
                  <input
                    value={formData.content.dataDeletion.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        content: {
                          ...formData.content,
                          dataDeletion: { ...formData.content.dataDeletion, email: e.target.value }
                        }
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                  />
                </label>
                <label className="space-y-2 block">
                  <span className="text-sm font-semibold text-gray-300">Deletion Email Subject</span>
                  <input
                    value={formData.content.dataDeletion.subject}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        content: {
                          ...formData.content,
                          dataDeletion: { ...formData.content.dataDeletion, subject: e.target.value }
                        }
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                  />
                </label>
                <label className="space-y-2 block">
                  <span className="text-sm font-semibold text-gray-300">{"Children's Privacy"}</span>
                  <textarea
                    rows={4}
                    value={formData.content.childrenPrivacy}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        content: { ...formData.content, childrenPrivacy: e.target.value }
                      })
                    }
                    className={modalTextareaClass}
                  />
                </label>
                <label className="space-y-2 block">
                  <span className="text-sm font-semibold text-gray-300">Third-Party Services</span>
                  <textarea
                    rows={4}
                    value={formData.content.thirdParty}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        content: { ...formData.content, thirdParty: e.target.value }
                      })
                    }
                    className={modalTextareaClass}
                  />
                </label>
                <label className="space-y-2 block">
                  <span className="text-sm font-semibold text-gray-300">Image Processing</span>
                  <textarea
                    rows={4}
                    value={formData.content.imageProcessing}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        content: { ...formData.content, imageProcessing: e.target.value }
                      })
                    }
                    className={modalTextareaClass}
                  />
                </label>
                <label className="space-y-2 block">
                  <span className="text-sm font-semibold text-gray-300">AI Disclaimer</span>
                  <textarea
                    rows={4}
                    value={formData.content.disclaimer}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        content: { ...formData.content, disclaimer: e.target.value }
                      })
                    }
                    className={modalTextareaClass}
                  />
                </label>
                <label className="space-y-2 block xl:col-span-2">
                  <span className="text-sm font-semibold text-gray-300">Changes To Policy</span>
                  <textarea
                    rows={3}
                    value={formData.content.changesToPolicy}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        content: { ...formData.content, changesToPolicy: e.target.value }
                      })
                    }
                    className={modalTextareaClass}
                  />
                </label>
                <label className="space-y-2 block">
                  <span className="text-sm font-semibold text-gray-300">Contact Instruction</span>
                  <textarea
                    rows={3}
                    value={formData.content.contactUs.instruction}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        content: {
                          ...formData.content,
                          contactUs: { ...formData.content.contactUs, instruction: e.target.value }
                        }
                      })
                    }
                    className={modalTextareaClass}
                  />
                </label>
                <label className="space-y-2 block">
                  <span className="text-sm font-semibold text-gray-300">Contact Email</span>
                  <input
                    value={formData.content.contactUs.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        content: {
                          ...formData.content,
                          contactUs: { ...formData.content.contactUs, email: e.target.value }
                        }
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                  />
                </label>
                <div className="xl:col-span-2 border-t border-white/5 pt-8 mt-4 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-md font-bold text-white">Refund & Cancellation Policy</h4>
                      <p className="text-xs text-gray-500">Enable and modify the refund policy details for this project.</p>
                    </div>
                    <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.refundPolicy?.enabled || false}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            refundPolicy: {
                              ...formData.refundPolicy,
                              enabled: e.target.checked,
                              content: formData.refundPolicy?.content || { introduction: '', eligibility: '', timeline: '', process: '' }
                            }
                          })
                        }
                        className="h-4 w-4 rounded border-white/20 bg-transparent"
                      />
                      <span className="text-sm text-gray-300">Enable Refund Policy</span>
                    </label>
                  </div>

                  {formData.refundPolicy?.enabled && (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-4">
                      <label className="space-y-2 block xl:col-span-2">
                        <span className="text-sm font-semibold text-gray-300">Refund Introduction</span>
                        <textarea
                          rows={3}
                          value={formData.refundPolicy.content?.introduction || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              refundPolicy: {
                                ...formData.refundPolicy,
                                content: { ...formData.refundPolicy.content, introduction: e.target.value }
                              }
                            })
                          }
                          className={modalTextareaClass}
                        />
                      </label>
                      <label className="space-y-2 block">
                        <span className="text-sm font-semibold text-gray-300">Refund Eligibility Guidelines</span>
                        <textarea
                          rows={4}
                          value={formData.refundPolicy.content?.eligibility || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              refundPolicy: {
                                ...formData.refundPolicy,
                                content: { ...formData.refundPolicy.content, eligibility: e.target.value }
                              }
                            })
                          }
                          className={modalTextareaClass}
                        />
                      </label>
                      <label className="space-y-2 block">
                        <span className="text-sm font-semibold text-gray-300">Refund Timeline & Gateway Delay</span>
                        <textarea
                          rows={4}
                          value={formData.refundPolicy.content?.timeline || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              refundPolicy: {
                                ...formData.refundPolicy,
                                content: { ...formData.refundPolicy.content, timeline: e.target.value }
                              }
                            })
                          }
                          className={modalTextareaClass}
                        />
                      </label>
                      <label className="space-y-2 block xl:col-span-2">
                        <span className="text-sm font-semibold text-gray-300">Refund Process Instructions</span>
                        <textarea
                          rows={4}
                          value={formData.refundPolicy.content?.process || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              refundPolicy: {
                                ...formData.refundPolicy,
                                content: { ...formData.refundPolicy.content, process: e.target.value }
                              }
                            })
                          }
                          className={modalTextareaClass}
                        />
                      </label>
                    </div>
                  )}
                </div>

                <div className="xl:col-span-2 border-t border-white/5 pt-8 mt-4 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-md font-bold text-white">Terms & Conditions Policy</h4>
                      <p className="text-xs text-gray-500">Enable and modify the terms & conditions details for this project.</p>
                    </div>
                    <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.termsConditions?.enabled || false}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            termsConditions: {
                              ...formData.termsConditions,
                              enabled: e.target.checked,
                              content: formData.termsConditions?.content || { introduction: '', userAgreement: '', intellectualProperty: '', userConduct: '', limitationLiability: '', governingLaw: '', contactUs: '' }
                            }
                          })
                        }
                        className="h-4 w-4 rounded border-white/20 bg-transparent"
                      />
                      <span className="text-sm text-gray-300">Enable Terms & Conditions</span>
                    </label>
                  </div>

                  {formData.termsConditions?.enabled && (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-4">
                      <label className="space-y-2 block xl:col-span-2">
                        <span className="text-sm font-semibold text-gray-300">Terms Introduction</span>
                        <textarea
                          rows={3}
                          value={formData.termsConditions.content?.introduction || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              termsConditions: {
                                ...formData.termsConditions,
                                content: { ...formData.termsConditions.content, introduction: e.target.value }
                              }
                            })
                          }
                          className={modalTextareaClass}
                        />
                      </label>
                      <label className="space-y-2 block">
                        <span className="text-sm font-semibold text-gray-300">User Agreement / Eligibility</span>
                        <textarea
                          rows={4}
                          value={formData.termsConditions.content?.userAgreement || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              termsConditions: {
                                ...formData.termsConditions,
                                content: { ...formData.termsConditions.content, userAgreement: e.target.value }
                              }
                            })
                          }
                          className={modalTextareaClass}
                        />
                      </label>
                      <label className="space-y-2 block">
                        <span className="text-sm font-semibold text-gray-300">Intellectual Property Rights</span>
                        <textarea
                          rows={4}
                          value={formData.termsConditions.content?.intellectualProperty || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              termsConditions: {
                                ...formData.termsConditions,
                                content: { ...formData.termsConditions.content, intellectualProperty: e.target.value }
                              }
                            })
                          }
                          className={modalTextareaClass}
                        />
                      </label>
                      <label className="space-y-2 block">
                        <span className="text-sm font-semibold text-gray-300">User Conduct & Guidelines</span>
                        <textarea
                          rows={4}
                          value={formData.termsConditions.content?.userConduct || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              termsConditions: {
                                ...formData.termsConditions,
                                content: { ...formData.termsConditions.content, userConduct: e.target.value }
                              }
                            })
                          }
                          className={modalTextareaClass}
                        />
                      </label>
                      <label className="space-y-2 block">
                        <span className="text-sm font-semibold text-gray-300">Limitation of Liability</span>
                        <textarea
                          rows={4}
                          value={formData.termsConditions.content?.limitationLiability || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              termsConditions: {
                                ...formData.termsConditions,
                                content: { ...formData.termsConditions.content, limitationLiability: e.target.value }
                              }
                            })
                          }
                          className={modalTextareaClass}
                        />
                      </label>
                      <label className="space-y-2 block">
                        <span className="text-sm font-semibold text-gray-300">Governing Law</span>
                        <textarea
                          rows={3}
                          value={formData.termsConditions.content?.governingLaw || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              termsConditions: {
                                ...formData.termsConditions,
                                content: { ...formData.termsConditions.content, governingLaw: e.target.value }
                              }
                            })
                          }
                          className={modalTextareaClass}
                        />
                      </label>
                      <label className="space-y-2 block">
                        <span className="text-sm font-semibold text-gray-300">Support / Contact Channel</span>
                        <textarea
                          rows={3}
                          value={formData.termsConditions.content?.contactUs || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              termsConditions: {
                                ...formData.termsConditions,
                                content: { ...formData.termsConditions.content, contactUs: e.target.value }
                              }
                            })
                          }
                          className={modalTextareaClass}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl font-semibold text-gray-400 hover:text-white hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold"
                >
                  {currentProject ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
