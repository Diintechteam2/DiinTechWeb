"use client";

import React, { useEffect, useState } from 'react';
import api from '@/admin_lib/api';
import { FileText, RefreshCcw, Save } from 'lucide-react';

type PipeRecord = Record<string, string>;
type PrivacyTemplateSections = typeof defaultSiteContent.privacyPolicyTemplate.sections;

const defaultSiteContent = {
  header: {
    solutionMenu: [] as PipeRecord[],
    industryMenu: [] as PipeRecord[],
    navLinks: [] as PipeRecord[],
    contactButtonText: '',
    ctaButtonText: ''
  },
  logoCloud: {
    introText: '',
    logos: [] as PipeRecord[]
  },
  differenceSection: {
    badgeText: '',
    titleLineOne: '',
    titleHighlight: '',
    description: '',
    traditionalTitle: '',
    diinTitle: '',
    comparisons: [] as PipeRecord[]
  },
  agenticSection: {
    badgeText: '',
    title: '',
    description: '',
    features: [] as PipeRecord[]
  },
  solutionsSection: {
    badgeText: '',
    title: '',
    description: '',
    primaryButtonText: ''
  },
  industriesSection: {
    badgeText: '',
    title: '',
    description: ''
  },
  technologySection: {
    badgeText: '',
    titleLineOne: '',
    titleHighlight: '',
    description: '',
    techStack: [] as PipeRecord[],
    architectureTitle: '',
    architectureFeatures: [] as string[],
    securityTitle: '',
    securityDescription: ''
  },
  processSection: {
    badgeText: '',
    title: '',
    description: '',
    steps: [] as PipeRecord[]
  },
  whyDiinSection: {
    badgeText: '',
    title: '',
    description: '',
    reasons: [] as PipeRecord[]
  },
  ctaSection: {
    titleLineOne: '',
    titleHighlight: '',
    description: '',
    primaryButton: { text: '', link: '' },
    secondaryButton: { text: '', link: '' },
    trustIndicators: [] as string[]
  },
  footer: {
    brandText: '',
    description: '',
    solutionLinks: [] as PipeRecord[],
    companyLinks: [] as PipeRecord[],
    legalLinks: [] as PipeRecord[],
    copyrightText: ''
  },
  projectsPage: {
    backLinkText: '',
    titlePrefix: '',
    titleHighlight: '',
    description: '',
    visitWebsiteLabel: '',
    privacyPolicyLabel: ''
  },
  privacyPolicyTemplate: {
    breadcrumbProjectsLabel: '',
    breadcrumbPolicyLabel: '',
    complianceBadgeText: '',
    titlePrefix: '',
    organizationLine: '',
    effectiveDateLabel: '',
    sections: {
      introduction: '',
      informationWeCollect: '',
      personalSubheading: '',
      userContentSubheading: '',
      deviceUsageSubheading: '',
      howWeUse: '',
      imageProcessing: '',
      dataSharing: '',
      dataSecurity: '',
      dataRetention: '',
      userDataDeletion: '',
      requestEmailLabel: '',
      subjectLabel: '',
      childrenPrivacy: '',
      thirdPartyServices: '',
      aiDisclaimer: '',
      changesToPolicy: '',
      contactUs: ''
    }
  }
};

const parseLines = (value: string) =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

const parsePipeObjects = (value: string, keys: string[]): PipeRecord[] =>
  parseLines(value).map((line) => {
    const parts = line.split('|').map((part) => part.trim());
    return keys.reduce((acc: PipeRecord, key, index) => {
      acc[key] = parts[index] || '';
      return acc;
    }, {} as PipeRecord);
  });

const serializePipeObjects = (items: PipeRecord[] = [], keys: string[]) =>
  items.map((item) => keys.map((key) => item?.[key] || '').join(' | ')).join('\n');

const mergeSiteContent = (incoming?: Partial<typeof defaultSiteContent>) => ({
  ...defaultSiteContent,
  ...incoming,
  header: { ...defaultSiteContent.header, ...(incoming?.header || {}) },
  logoCloud: { ...defaultSiteContent.logoCloud, ...(incoming?.logoCloud || {}) },
  differenceSection: { ...defaultSiteContent.differenceSection, ...(incoming?.differenceSection || {}) },
  agenticSection: { ...defaultSiteContent.agenticSection, ...(incoming?.agenticSection || {}) },
  solutionsSection: { ...defaultSiteContent.solutionsSection, ...(incoming?.solutionsSection || {}) },
  industriesSection: { ...defaultSiteContent.industriesSection, ...(incoming?.industriesSection || {}) },
  technologySection: { ...defaultSiteContent.technologySection, ...(incoming?.technologySection || {}) },
  processSection: { ...defaultSiteContent.processSection, ...(incoming?.processSection || {}) },
  whyDiinSection: { ...defaultSiteContent.whyDiinSection, ...(incoming?.whyDiinSection || {}) },
  ctaSection: {
    ...defaultSiteContent.ctaSection,
    ...(incoming?.ctaSection || {}),
    primaryButton: {
      ...defaultSiteContent.ctaSection.primaryButton,
      ...(incoming?.ctaSection?.primaryButton || {})
    },
    secondaryButton: {
      ...defaultSiteContent.ctaSection.secondaryButton,
      ...(incoming?.ctaSection?.secondaryButton || {})
    }
  },
  footer: { ...defaultSiteContent.footer, ...(incoming?.footer || {}) },
  projectsPage: { ...defaultSiteContent.projectsPage, ...(incoming?.projectsPage || {}) },
  privacyPolicyTemplate: {
    ...defaultSiteContent.privacyPolicyTemplate,
    ...(incoming?.privacyPolicyTemplate || {}),
    sections: {
      ...defaultSiteContent.privacyPolicyTemplate.sections,
      ...(incoming?.privacyPolicyTemplate?.sections || {})
    }
  }
});

function SectionCard({
  title,
  description,
  children,
  action
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        </div>
        {action ? <div className="sm:shrink-0 sm:self-start">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="space-y-2 block">
      <span className="text-sm font-semibold text-gray-300">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  rows = 4,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="space-y-2 block">
      <span className="text-sm font-semibold text-gray-300">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 resize-y"
      />
    </label>
  );
}

function TwoColSectionInputs({
  items,
  values,
  onChange
}: {
  items: Array<{ key: keyof PrivacyTemplateSections; label: string }>;
  values: PrivacyTemplateSections;
  onChange: (key: keyof PrivacyTemplateSections, value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map((item) => (
        <Input
          key={item.key}
          label={item.label}
          value={values[item.key]}
          onChange={(value) => onChange(item.key, value)}
        />
      ))}
    </div>
  );
}

export default function SiteContentPage() {
  const [content, setContent] = useState(defaultSiteContent);
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await api.get('site-content');
        setContent(mergeSiteContent(response.data.data));
      } catch (err) {
        console.error('Failed to fetch site content', err);
        setContent(defaultSiteContent);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleSaveSection = async (sectionName: string) => {
    setSavingSection(sectionName);
    try {
      await api.put('site-content', content);
      alert(`${sectionName} updated successfully!`);
      } catch {
        alert(`Failed to update ${sectionName}`);
      } finally {
        setSavingSection(null);
    }
  };

  const renderSectionSaveButton = (sectionName: string) => (
    <button
      type="button"
      onClick={() => handleSaveSection(sectionName)}
      disabled={savingSection !== null}
      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(37,99,235,0.25)] disabled:opacity-50 disabled:hover:bg-blue-600"
    >
      {savingSection === sectionName ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
      {savingSection === sectionName ? 'Saving...' : 'Save'}
    </button>
  );

  if (loading) return <div className="text-white p-8 font-bold">Loading Site Content...</div>;

  return (
    <div className="space-y-8 text-left">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Site Content</h1>
          <p className="text-gray-400 max-w-3xl">
            This page manages the static homepage, header, footer, and projects listing copy. Use one line per item in list fields. Pipe format examples are shown in the placeholders.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl text-sm text-gray-300">
          <FileText className="w-4 h-4 text-blue-400" />
          Frontend content mirror
        </div>
      </div>

      <div className="space-y-8">
        <SectionCard
          title="Header"
          description="Navigation menus and primary header buttons."
          action={renderSectionSaveButton('Header')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Contact Button Text"
              value={content.header.contactButtonText}
              onChange={(value) => setContent({ ...content, header: { ...content.header, contactButtonText: value } })}
            />
            <Input
              label="CTA Button Text"
              value={content.header.ctaButtonText}
              onChange={(value) => setContent({ ...content, header: { ...content.header, ctaButtonText: value } })}
            />
          </div>
          <Textarea
            label="Solution Menu"
            rows={5}
            value={serializePipeObjects(content.header.solutionMenu, ['label', 'href', 'description'])}
            onChange={(value) =>
              setContent({
                ...content,
                header: { ...content.header, solutionMenu: parsePipeObjects(value, ['label', 'href', 'description']) }
              })
            }
            placeholder="AI Sales Agents | /#solutions | Autonomous lead qualification and revenue optimization"
          />
          <Textarea
            label="Industry Menu"
            rows={4}
            value={serializePipeObjects(content.header.industryMenu, ['label', 'href'])}
            onChange={(value) =>
              setContent({
                ...content,
                header: { ...content.header, industryMenu: parsePipeObjects(value, ['label', 'href']) }
              })
            }
            placeholder="Education & EdTech | /#industries"
          />
          <Textarea
            label="Simple Nav Links"
            rows={3}
            value={serializePipeObjects(content.header.navLinks, ['label', 'href'])}
            onChange={(value) =>
              setContent({
                ...content,
                header: { ...content.header, navLinks: parsePipeObjects(value, ['label', 'href']) }
              })
            }
            placeholder="About | /#about"
          />
        </SectionCard>

        <SectionCard
          title="Logo Cloud"
          description="Trusted-by line and logo placeholders."
          action={renderSectionSaveButton('Logo Cloud')}
        >
          <Input
            label="Intro Text"
            value={content.logoCloud.introText}
            onChange={(value) => setContent({ ...content, logoCloud: { ...content.logoCloud, introText: value } })}
          />
          <Textarea
            label="Logos"
            rows={6}
            value={serializePipeObjects(content.logoCloud.logos, ['name', 'initials'])}
            onChange={(value) =>
              setContent({
                ...content,
                logoCloud: { ...content.logoCloud, logos: parsePipeObjects(value, ['name', 'initials']) }
              })
            }
            placeholder="TechCorp | TC"
          />
        </SectionCard>

        <SectionCard
          title="Diin Difference"
          description="About section heading and comparison grid."
          action={renderSectionSaveButton('Diin Difference')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Badge Text"
              value={content.differenceSection.badgeText}
              onChange={(value) => setContent({ ...content, differenceSection: { ...content.differenceSection, badgeText: value } })}
            />
            <Input
              label="Traditional Column Title"
              value={content.differenceSection.traditionalTitle}
              onChange={(value) => setContent({ ...content, differenceSection: { ...content.differenceSection, traditionalTitle: value } })}
            />
            <Input
              label="Title Line One"
              value={content.differenceSection.titleLineOne}
              onChange={(value) => setContent({ ...content, differenceSection: { ...content.differenceSection, titleLineOne: value } })}
            />
            <Input
              label="Diin Column Title"
              value={content.differenceSection.diinTitle}
              onChange={(value) => setContent({ ...content, differenceSection: { ...content.differenceSection, diinTitle: value } })}
            />
          </div>
          <Input
            label="Title Highlight"
            value={content.differenceSection.titleHighlight}
            onChange={(value) => setContent({ ...content, differenceSection: { ...content.differenceSection, titleHighlight: value } })}
          />
          <Textarea
            label="Description"
            value={content.differenceSection.description}
            onChange={(value) => setContent({ ...content, differenceSection: { ...content.differenceSection, description: value } })}
          />
          <Textarea
            label="Comparisons"
            rows={5}
            value={serializePipeObjects(content.differenceSection.comparisons, ['traditional', 'diin'])}
            onChange={(value) =>
              setContent({
                ...content,
                differenceSection: {
                  ...content.differenceSection,
                  comparisons: parsePipeObjects(value, ['traditional', 'diin'])
                }
              })
            }
            placeholder="Rule-based workflows | Goal-driven intelligence"
          />
        </SectionCard>

        <SectionCard
          title="Agentic AI"
          description="Section heading and four feature cards."
          action={renderSectionSaveButton('Agentic AI')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Badge Text"
              value={content.agenticSection.badgeText}
              onChange={(value) => setContent({ ...content, agenticSection: { ...content.agenticSection, badgeText: value } })}
            />
            <Input
              label="Section Title"
              value={content.agenticSection.title}
              onChange={(value) => setContent({ ...content, agenticSection: { ...content.agenticSection, title: value } })}
            />
          </div>
          <Textarea
            label="Description"
            value={content.agenticSection.description}
            onChange={(value) => setContent({ ...content, agenticSection: { ...content.agenticSection, description: value } })}
          />
          <Textarea
            label="Feature Cards"
            rows={6}
            value={serializePipeObjects(content.agenticSection.features, ['icon', 'title', 'description'])}
            onChange={(value) =>
              setContent({
                ...content,
                agenticSection: {
                  ...content.agenticSection,
                  features: parsePipeObjects(value, ['icon', 'title', 'description'])
                }
              })
            }
            placeholder="Brain | Autonomous Decision-Making | AI systems capable of independent decision-making..."
          />
        </SectionCard>

        <SectionCard
          title="Solutions Section Wrapper"
          description="Section-level heading and CTA text for the solutions area."
          action={renderSectionSaveButton('Solutions Section Wrapper')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Badge Text"
              value={content.solutionsSection.badgeText}
              onChange={(value) => setContent({ ...content, solutionsSection: { ...content.solutionsSection, badgeText: value } })}
            />
            <Input
              label="Primary Button Text"
              value={content.solutionsSection.primaryButtonText}
              onChange={(value) => setContent({ ...content, solutionsSection: { ...content.solutionsSection, primaryButtonText: value } })}
            />
          </div>
          <Input
            label="Section Title"
            value={content.solutionsSection.title}
            onChange={(value) => setContent({ ...content, solutionsSection: { ...content.solutionsSection, title: value } })}
          />
          <Textarea
            label="Description"
            value={content.solutionsSection.description}
            onChange={(value) => setContent({ ...content, solutionsSection: { ...content.solutionsSection, description: value } })}
          />
        </SectionCard>

        <SectionCard
          title="Industries Section Wrapper"
          description="Section-level heading and intro text for industries."
          action={renderSectionSaveButton('Industries Section Wrapper')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Badge Text"
              value={content.industriesSection.badgeText}
              onChange={(value) => setContent({ ...content, industriesSection: { ...content.industriesSection, badgeText: value } })}
            />
            <Input
              label="Section Title"
              value={content.industriesSection.title}
              onChange={(value) => setContent({ ...content, industriesSection: { ...content.industriesSection, title: value } })}
            />
          </div>
          <Textarea
            label="Description"
            value={content.industriesSection.description}
            onChange={(value) => setContent({ ...content, industriesSection: { ...content.industriesSection, description: value } })}
          />
        </SectionCard>

        <SectionCard
          title="Technology"
          description="Tech stack, architecture bullets, and security card copy."
          action={renderSectionSaveButton('Technology')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Badge Text"
              value={content.technologySection.badgeText}
              onChange={(value) => setContent({ ...content, technologySection: { ...content.technologySection, badgeText: value } })}
            />
            <Input
              label="Architecture Card Title"
              value={content.technologySection.architectureTitle}
              onChange={(value) => setContent({ ...content, technologySection: { ...content.technologySection, architectureTitle: value } })}
            />
            <Input
              label="Title Line One"
              value={content.technologySection.titleLineOne}
              onChange={(value) => setContent({ ...content, technologySection: { ...content.technologySection, titleLineOne: value } })}
            />
            <Input
              label="Title Highlight"
              value={content.technologySection.titleHighlight}
              onChange={(value) => setContent({ ...content, technologySection: { ...content.technologySection, titleHighlight: value } })}
            />
          </div>
          <Textarea
            label="Description"
            value={content.technologySection.description}
            onChange={(value) => setContent({ ...content, technologySection: { ...content.technologySection, description: value } })}
          />
          <Textarea
            label="Tech Stack"
            rows={6}
            value={serializePipeObjects(content.technologySection.techStack, ['icon', 'label'])}
            onChange={(value) =>
              setContent({
                ...content,
                technologySection: {
                  ...content.technologySection,
                  techStack: parsePipeObjects(value, ['icon', 'label'])
                }
              })
            }
            placeholder="Cpu | Large Language Models (LLMs)"
          />
          <Textarea
            label="Architecture Features"
            rows={6}
            value={(content.technologySection.architectureFeatures || []).join('\n')}
            onChange={(value) =>
              setContent({
                ...content,
                technologySection: {
                  ...content.technologySection,
                  architectureFeatures: parseLines(value)
                }
              })
            }
            placeholder="Modular & Scalable"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Security Title"
              value={content.technologySection.securityTitle}
              onChange={(value) => setContent({ ...content, technologySection: { ...content.technologySection, securityTitle: value } })}
            />
            <Textarea
              label="Security Description"
              rows={3}
              value={content.technologySection.securityDescription}
              onChange={(value) => setContent({ ...content, technologySection: { ...content.technologySection, securityDescription: value } })}
            />
          </div>
        </SectionCard>

        <SectionCard
          title="Process"
          description="Timeline steps shown on the homepage."
          action={renderSectionSaveButton('Process')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Badge Text"
              value={content.processSection.badgeText}
              onChange={(value) => setContent({ ...content, processSection: { ...content.processSection, badgeText: value } })}
            />
            <Input
              label="Section Title"
              value={content.processSection.title}
              onChange={(value) => setContent({ ...content, processSection: { ...content.processSection, title: value } })}
            />
          </div>
          <Textarea
            label="Description"
            value={content.processSection.description}
            onChange={(value) => setContent({ ...content, processSection: { ...content.processSection, description: value } })}
          />
          <Textarea
            label="Steps"
            rows={7}
            value={serializePipeObjects(content.processSection.steps, ['icon', 'number', 'title', 'description'])}
            onChange={(value) =>
              setContent({
                ...content,
                processSection: {
                  ...content.processSection,
                  steps: parsePipeObjects(value, ['icon', 'number', 'title', 'description'])
                }
              })
            }
            placeholder="Search | 01 | Discovery & Strategy | Deep dive into your business processes..."
          />
        </SectionCard>

        <SectionCard
          title="Why Diin"
          description="Reasons grid section."
          action={renderSectionSaveButton('Why Diin')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Badge Text"
              value={content.whyDiinSection.badgeText}
              onChange={(value) => setContent({ ...content, whyDiinSection: { ...content.whyDiinSection, badgeText: value } })}
            />
            <Input
              label="Section Title"
              value={content.whyDiinSection.title}
              onChange={(value) => setContent({ ...content, whyDiinSection: { ...content.whyDiinSection, title: value } })}
            />
          </div>
          <Textarea
            label="Description"
            value={content.whyDiinSection.description}
            onChange={(value) => setContent({ ...content, whyDiinSection: { ...content.whyDiinSection, description: value } })}
          />
          <Textarea
            label="Reason Cards"
            rows={8}
            value={serializePipeObjects(content.whyDiinSection.reasons, ['icon', 'title', 'description'])}
            onChange={(value) =>
              setContent({
                ...content,
                whyDiinSection: {
                  ...content.whyDiinSection,
                  reasons: parsePipeObjects(value, ['icon', 'title', 'description'])
                }
              })
            }
            placeholder="Clock | 6+ Years of Excellence | Battle-tested expertise in AI and software development."
          />
        </SectionCard>

        <SectionCard
          title="CTA Section"
          description="Final homepage CTA copy, buttons, and trust indicators."
          action={renderSectionSaveButton('CTA Section')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Title Line One"
              value={content.ctaSection.titleLineOne}
              onChange={(value) => setContent({ ...content, ctaSection: { ...content.ctaSection, titleLineOne: value } })}
            />
            <Input
              label="Title Highlight"
              value={content.ctaSection.titleHighlight}
              onChange={(value) => setContent({ ...content, ctaSection: { ...content.ctaSection, titleHighlight: value } })}
            />
            <Input
              label="Primary Button Text"
              value={content.ctaSection.primaryButton.text}
              onChange={(value) =>
                setContent({
                  ...content,
                  ctaSection: {
                    ...content.ctaSection,
                    primaryButton: { ...content.ctaSection.primaryButton, text: value }
                  }
                })
              }
            />
            <Input
              label="Primary Button Link"
              value={content.ctaSection.primaryButton.link}
              onChange={(value) =>
                setContent({
                  ...content,
                  ctaSection: {
                    ...content.ctaSection,
                    primaryButton: { ...content.ctaSection.primaryButton, link: value }
                  }
                })
              }
            />
            <Input
              label="Secondary Button Text"
              value={content.ctaSection.secondaryButton.text}
              onChange={(value) =>
                setContent({
                  ...content,
                  ctaSection: {
                    ...content.ctaSection,
                    secondaryButton: { ...content.ctaSection.secondaryButton, text: value }
                  }
                })
              }
            />
            <Input
              label="Secondary Button Link"
              value={content.ctaSection.secondaryButton.link}
              onChange={(value) =>
                setContent({
                  ...content,
                  ctaSection: {
                    ...content.ctaSection,
                    secondaryButton: { ...content.ctaSection.secondaryButton, link: value }
                  }
                })
              }
            />
          </div>
          <Textarea
            label="Description"
            value={content.ctaSection.description}
            onChange={(value) => setContent({ ...content, ctaSection: { ...content.ctaSection, description: value } })}
          />
          <Textarea
            label="Trust Indicators"
            rows={4}
            value={(content.ctaSection.trustIndicators || []).join('\n')}
            onChange={(value) =>
              setContent({
                ...content,
                ctaSection: { ...content.ctaSection, trustIndicators: parseLines(value) }
              })
            }
            placeholder="No commitment required"
          />
        </SectionCard>

        <SectionCard
          title="Footer"
          description="Footer descriptive content and link groups. Contact data remains in General Settings."
          action={renderSectionSaveButton('Footer')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Brand Text"
              value={content.footer.brandText}
              onChange={(value) => setContent({ ...content, footer: { ...content.footer, brandText: value } })}
            />
            <Input
              label="Copyright Text"
              value={content.footer.copyrightText}
              onChange={(value) => setContent({ ...content, footer: { ...content.footer, copyrightText: value } })}
              placeholder="Use {{year}} where needed"
            />
          </div>
          <Textarea
            label="Footer Description"
            value={content.footer.description}
            onChange={(value) => setContent({ ...content, footer: { ...content.footer, description: value } })}
          />
          <Textarea
            label="Solution Links"
            rows={5}
            value={serializePipeObjects(content.footer.solutionLinks, ['label', 'href'])}
            onChange={(value) =>
              setContent({
                ...content,
                footer: { ...content.footer, solutionLinks: parsePipeObjects(value, ['label', 'href']) }
              })
            }
            placeholder="AI Sales Agents | /#solutions"
          />
          <Textarea
            label="Company Links"
            rows={5}
            value={serializePipeObjects(content.footer.companyLinks, ['label', 'href'])}
            onChange={(value) =>
              setContent({
                ...content,
                footer: { ...content.footer, companyLinks: parsePipeObjects(value, ['label', 'href']) }
              })
            }
            placeholder="About Us | /#about"
          />
          <Textarea
            label="Legal Links"
            rows={4}
            value={serializePipeObjects(content.footer.legalLinks, ['label', 'href'])}
            onChange={(value) =>
              setContent({
                ...content,
                footer: { ...content.footer, legalLinks: parsePipeObjects(value, ['label', 'href']) }
              })
            }
            placeholder="Privacy Policy | /#legal"
          />
        </SectionCard>

        <SectionCard
          title="Projects Listing Page"
          description="Copy for the projects index page."
          action={renderSectionSaveButton('Projects Listing Page')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Back Link Text"
              value={content.projectsPage.backLinkText}
              onChange={(value) => setContent({ ...content, projectsPage: { ...content.projectsPage, backLinkText: value } })}
            />
            <Input
              label="Title Prefix"
              value={content.projectsPage.titlePrefix}
              onChange={(value) => setContent({ ...content, projectsPage: { ...content.projectsPage, titlePrefix: value } })}
            />
            <Input
              label="Title Highlight"
              value={content.projectsPage.titleHighlight}
              onChange={(value) => setContent({ ...content, projectsPage: { ...content.projectsPage, titleHighlight: value } })}
            />
            <Input
              label="Visit Website Label"
              value={content.projectsPage.visitWebsiteLabel}
              onChange={(value) => setContent({ ...content, projectsPage: { ...content.projectsPage, visitWebsiteLabel: value } })}
            />
            <Input
              label="Privacy Policy Label"
              value={content.projectsPage.privacyPolicyLabel}
              onChange={(value) => setContent({ ...content, projectsPage: { ...content.projectsPage, privacyPolicyLabel: value } })}
            />
          </div>
          <Textarea
            label="Description"
            value={content.projectsPage.description}
            onChange={(value) => setContent({ ...content, projectsPage: { ...content.projectsPage, description: value } })}
          />
        </SectionCard>

        <SectionCard
          title="Privacy Policy Template"
          description="Static wrapper labels used around each project's privacy-policy data."
          action={renderSectionSaveButton('Privacy Policy Template')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Breadcrumb Projects Label"
              value={content.privacyPolicyTemplate.breadcrumbProjectsLabel}
              onChange={(value) => setContent({ ...content, privacyPolicyTemplate: { ...content.privacyPolicyTemplate, breadcrumbProjectsLabel: value } })}
            />
            <Input
              label="Breadcrumb Policy Label"
              value={content.privacyPolicyTemplate.breadcrumbPolicyLabel}
              onChange={(value) => setContent({ ...content, privacyPolicyTemplate: { ...content.privacyPolicyTemplate, breadcrumbPolicyLabel: value } })}
            />
            <Input
              label="Compliance Badge Text"
              value={content.privacyPolicyTemplate.complianceBadgeText}
              onChange={(value) => setContent({ ...content, privacyPolicyTemplate: { ...content.privacyPolicyTemplate, complianceBadgeText: value } })}
            />
            <Input
              label="Title Prefix"
              value={content.privacyPolicyTemplate.titlePrefix}
              onChange={(value) => setContent({ ...content, privacyPolicyTemplate: { ...content.privacyPolicyTemplate, titlePrefix: value } })}
            />
            <Input
              label="Organization Line"
              value={content.privacyPolicyTemplate.organizationLine}
              onChange={(value) => setContent({ ...content, privacyPolicyTemplate: { ...content.privacyPolicyTemplate, organizationLine: value } })}
            />
            <Input
              label="Effective Date Label"
              value={content.privacyPolicyTemplate.effectiveDateLabel}
              onChange={(value) => setContent({ ...content, privacyPolicyTemplate: { ...content.privacyPolicyTemplate, effectiveDateLabel: value } })}
            />
          </div>
          <TwoColSectionInputs
            items={[
              { key: 'introduction', label: 'Introduction Label' },
              { key: 'informationWeCollect', label: 'Information We Collect Label' },
              { key: 'personalSubheading', label: 'Personal Subheading' },
              { key: 'userContentSubheading', label: 'User Content Subheading' },
              { key: 'deviceUsageSubheading', label: 'Device & Usage Subheading' },
              { key: 'howWeUse', label: 'How We Use Label' },
              { key: 'imageProcessing', label: 'Image Processing Label' },
              { key: 'dataSharing', label: 'Data Sharing Label' },
              { key: 'dataSecurity', label: 'Data Security Label' },
              { key: 'dataRetention', label: 'Data Retention Label' },
              { key: 'userDataDeletion', label: 'User Data Deletion Label' },
              { key: 'requestEmailLabel', label: 'Request Email Label' },
              { key: 'subjectLabel', label: 'Subject Label' },
              { key: 'childrenPrivacy', label: "Children's Privacy Label" },
              { key: 'thirdPartyServices', label: 'Third-Party Services Label' },
              { key: 'aiDisclaimer', label: 'AI Disclaimer Label' },
              { key: 'changesToPolicy', label: 'Changes To Policy Label' },
              { key: 'contactUs', label: 'Contact Us Label' }
            ]}
            values={content.privacyPolicyTemplate.sections}
            onChange={(key, value) =>
              setContent({
                ...content,
                privacyPolicyTemplate: {
                  ...content.privacyPolicyTemplate,
                  sections: {
                    ...content.privacyPolicyTemplate.sections,
                    [key]: value
                  }
                }
              })
            }
          />
        </SectionCard>

      </div>
    </div>
  );
}
