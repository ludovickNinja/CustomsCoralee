const versionsContainer = document.getElementById('versions-container');
const versionTemplate = document.getElementById('version-template');
const addVersionButton = document.getElementById('add-version');
const quoteForm = document.getElementById('quote-form');
const accountInput = quoteForm?.querySelector('input[name="account"]');
const modeButtons = [...document.querySelectorAll('.mode-btn')];
const pageButtons = [...document.querySelectorAll('.side-nav-btn')];
const projectsTableBody = document.getElementById('projects-table-body');
const projectFiltersForm = document.getElementById('project-filters');
const projectSearchInput = document.getElementById('project-search');
const projectStatusFilter = document.getElementById('project-status-filter');
const clearProjectFiltersButton = document.getElementById('clear-project-filters');
const projectResultsMeta = document.getElementById('project-results-meta');
const versionDetailMeta = document.getElementById('version-detail-meta');
const designBriefFields = document.getElementById('design-brief-fields');
const designBriefFiles = document.getElementById('design-brief-files');
const renderingsEmptyState = document.getElementById('renderings-empty-state');
const renderingsContent = document.getElementById('renderings-content');
const renderingsViewerLink = document.getElementById('renderings-viewer-link');
const renderingsViewerFrame = document.getElementById('renderings-viewer-frame');
const renderingsGallery = document.getElementById('renderings-gallery');
const renderingsSpecSheet = document.getElementById('renderings-spec-sheet');
const versionPricing = document.getElementById('version-pricing');
const discussionThread = document.getElementById('discussion-thread');
const discussionForm = document.getElementById('discussion-form');
const discussionInput = document.getElementById('discussion-input');
const backToProjectsButton = document.getElementById('back-to-projects');
const customerView = document.getElementById('customer-view');
const adminView = document.getElementById('admin-view');
const factoryView = document.getElementById('factory-view');
const adminQueueBody = document.getElementById('admin-queue-body');
const adminSummaryMeta = document.getElementById('admin-summary-meta');
const adminDetailMeta = document.getElementById('admin-detail-meta');
const adminDesignBriefFields = document.getElementById('admin-design-brief-fields');
const adminDetailForm = document.getElementById('admin-detail-form');
const adminStatusInput = document.getElementById('admin-status-input');
const adminAssignedFactoryField = document.getElementById('admin-assigned-factory-field');
const adminAssignedFactoryInput = document.getElementById('admin-assigned-factory-input');
const adminStyleSkuInput = document.getElementById('admin-style-sku-input');
const adminMetalInput = document.getElementById('admin-metal-input');
const adminSizeInput = document.getElementById('admin-size-input');
const adminStoneDescriptionInput = document.getElementById('admin-stone-description-input');
const adminInstructionsInput = document.getElementById('admin-instructions-input');
const adminNeedRenderingsInput = document.getElementById('admin-need-renderings-input');
const adminNeedViewerInput = document.getElementById('admin-need-viewer-input');
const factoryStatusInput = document.getElementById('factory-status-input');
const adminRenderingName = document.getElementById('admin-rendering-name');
const adminMessageInput = document.getElementById('admin-message-input');
const adminConversationThread = document.getElementById('admin-conversation-thread');
const adminRenderingsList = document.getElementById('admin-renderings-list');
const adminPricingTotal = document.getElementById('admin-pricing-total');
const adminPricingBreakdown = document.getElementById('admin-pricing-breakdown');
const adminPricingTimeline = document.getElementById('admin-pricing-timeline');
const factoryQueueBody = document.getElementById('factory-queue-body');
const factoryFiltersForm = document.getElementById('factory-filters');
const factorySearchInput = document.getElementById('factory-search');
const factoryStatusFilter = document.getElementById('factory-status-filter');
const factoryDetailMeta = document.getElementById('factory-detail-meta');
const factoryDesignBriefFields = document.getElementById('factory-design-brief-fields');
const factoryDetailForm = document.getElementById('factory-detail-form');
const factoryGoldWeightInput = document.getElementById('factory-gold-weight');
const factoryTotalPriceInput = document.getElementById('factory-total-price');
const factoryFinishedMeasurementsInput = document.getElementById('factory-finished-measurements');
const factorySpecSheetInput = document.getElementById('factory-spec-sheet');
const factoryViewerLinkInput = document.getElementById('factory-viewer-link');
const factoryFiveAnglesRenderInput = document.getElementById('factory-five-angles-render');
const factoryDiamondBreakdownBody = document.getElementById('factory-diamond-breakdown-body');
const factoryAddDiamondRowButton = document.getElementById('factory-add-diamond-row');
const factoryStoneSummary = document.getElementById('factory-stone-summary');
const factoryShapeConfigTrigger = document.getElementById('factory-shape-config-trigger');
const factoryShapeConfigPanel = document.getElementById('factory-shape-config-panel');
const factoryShapeConfigOptions = document.getElementById('factory-shape-config-options');
const factoryShapeConfigClose = document.getElementById('factory-shape-config-close');

const accountNames = {
  account1: 'Account 1',
  account2: 'Account 2',
  admin: 'Admin',
  factory: 'Factory',
};

let currentMode = 'account1';
let versionCount = 0;
let nextQuoteNumber = 80010;
let nextReferenceNumber = 50100;
let activeVersionContext = null;
let activeFactoryContext = null;

const availableShapeOptions = ['RD', 'PR', 'PS', 'EM', 'RT', 'OV', 'MQ', 'BG', 'TB', 'HM', 'TP', 'Other'];
const selectedShapeOptions = new Set(availableShapeOptions);

const projectFilterState = {
  search: '',
  status: '',
};

const factoryFilterState = {
  search: '',
  status: '',
};


const ADMIN_PROJECT_STATUSES = ['Received', 'Reviewed', 'Assigned', 'QA', 'Revision', 'Ready', 'Sent'];
const FACTORY_PROJECT_STATUSES = ['Received', 'Reviewed', 'In Progress', 'Revision', 'Completed'];
const ASSIGNABLE_FACTORIES = ['InHouse', 'Factory1', 'Factory2'];

function getDefaultAdminStatus() {
  return ADMIN_PROJECT_STATUSES[0];
}

function getDefaultFactoryStatus() {
  return FACTORY_PROJECT_STATUSES[0];
}

function normalizeStatus(currentStatus, allowedStatuses, fallbackStatus) {
  return allowedStatuses.includes(currentStatus) ? currentStatus : fallbackStatus;
}

function ensureDesignBrief(reference) {
  if (!reference.designBrief) {
    reference.designBrief = {};
  }

  if (!reference.designBrief.customerDeadline) {
    reference.designBrief.customerDeadline = '';
  }

  reference.designBrief.needToProvide = reference.designBrief.needToProvide || {
    renderings: false,
    viewer3d: false,
  };
}

function ensureReferenceStatuses(reference) {
  if (!reference) {
    return;
  }

  ensureDesignBrief(reference);
  reference.adminStatus = normalizeStatus(reference.adminStatus || reference.status, ADMIN_PROJECT_STATUSES, getDefaultAdminStatus());
  reference.factoryStatus = normalizeStatus(reference.factoryStatus, FACTORY_PROJECT_STATUSES, getDefaultFactoryStatus());
  reference.assignedFactory = ASSIGNABLE_FACTORIES.includes(reference.assignedFactory) ? reference.assignedFactory : '';
  reference.status = reference.adminStatus;
}

function getAdminStatus(reference) {
  ensureReferenceStatuses(reference);
  return reference.adminStatus;
}

function getFactoryStatus(reference) {
  ensureReferenceStatuses(reference);
  return reference.factoryStatus;
}

function setAdminStatus(reference, nextStatus) {
  ensureReferenceStatuses(reference);
  reference.adminStatus = normalizeStatus(nextStatus, ADMIN_PROJECT_STATUSES, reference.adminStatus);
  reference.status = reference.adminStatus;
}

function setFactoryStatus(reference, nextStatus) {
  ensureReferenceStatuses(reference);
  reference.factoryStatus = normalizeStatus(nextStatus, FACTORY_PROJECT_STATUSES, reference.factoryStatus);
}

function syncAssignedFactoryField(nextStatus, assignedFactory = '') {
  if (!adminAssignedFactoryField || !adminAssignedFactoryInput) {
    return;
  }

  const shouldRequire = nextStatus === 'Assigned';
  adminAssignedFactoryField.classList.remove('hidden');
  adminAssignedFactoryInput.required = shouldRequire;
  adminAssignedFactoryInput.value = assignedFactory;
}

function getStatusOptionsMarkup(statuses, selectedStatus) {
  return statuses
    .map((status) => `<option value="${status}" ${status === selectedStatus ? 'selected' : ''}>${status}</option>`)
    .join('');
}

const ongoingProjects = [
  {
    quoteNumber: 'Q80001',
    account: 'account1',
    customerRequest: 'PO-6604',
    salesPersonName: 'Emma Campbell',
    updatedAt: '2026-03-12',
    references: [
      {
        referenceNumber: 'R50001',
        versionLabel: 'Version 1',
        status: 'Reviewed',
        factoryStatus: 'Reviewed',
        adminRenderings: ['solitaire_v1_render_front.png'],
        designBrief: {
          styleSku: 'SOL-ALPHA-01',
          metal: '14K White Gold',
          size: '6.75',
          stoneDescription: '1.25ct round center, hidden halo with VS melees',
          instructions: 'Maintain six-prong look while reducing basket height by 0.4mm.',
          files: ['engagement_reference_front.jpg', 'solitaire_v1_notes.pdf'],
        },
        pricing: {
          estimatedTotal: '$2,460',
          unitBreakdown: 'Gold + labor: $1,980, setting labor: $480',
          timeline: 'Estimate valid for 7 days. Delivery target: 6 business days.',
        },
        discussion: [],
      },
      {
        referenceNumber: 'R50002',
        versionLabel: 'Version 2',
        status: 'Revision',
        factoryStatus: 'Revision',
        adminRenderings: [],
        designBrief: {
          styleSku: 'SOL-ALPHA-02',
          metal: '14K White Gold',
          size: '7',
          stoneDescription: '1.5ct elongated cushion center, hidden halo',
          instructions: 'Match cathedral shoulders to approved sample while preserving comfort fit.',
          files: ['solitaire_v2_angle.jpg', 'solitaire_v2_stone_specs.pdf'],
        },
        pricing: {
          estimatedTotal: '$2,780',
          unitBreakdown: 'Gold + labor: $2,180, setting labor: $600',
          timeline: 'Pending center stone details from customer to finalize estimate.',
        },
        discussion: [],
      },
    ],
  },
  {
    quoteNumber: 'Q80002',
    account: 'account2',
    customerRequest: 'HALO-V2',
    salesPersonName: 'Noah Tremblay',
    updatedAt: '2026-03-13',
    references: [
      {
        referenceNumber: 'R50003',
        versionLabel: 'Version 1',
        status: 'Assigned',
        assignedFactory: 'Factory1',
        factoryStatus: 'In Progress',
        adminRenderings: ['halo_v2_preview_admin.png'],
        designBrief: {
          styleSku: 'HALO-V2-A',
          metal: 'Platinum',
          size: '5.5',
          stoneDescription: 'Round halo, micro-pave split shank',
          instructions: 'Slimmer profile compared to previous production by 8%.',
          files: ['halo_model_v1.3dm', 'customer_markup.pdf'],
        },
        pricing: {
          estimatedTotal: '$3,120',
          unitBreakdown: 'Platinum casting: $2,540, labor/polish: $580',
          timeline: 'Rendering + quote pack ETA: 2 business days.',
        },
        discussion: [],
      },
      {
        referenceNumber: 'R50004',
        versionLabel: 'Version 2',
        status: 'QA',
        factoryStatus: 'In Progress',
        adminRenderings: ['halo_v2_variant_side.png'],
        designBrief: {
          styleSku: 'HALO-V2-B',
          metal: 'Platinum',
          size: '5.75',
          stoneDescription: 'Oval halo, pave shoulders, hidden bridge accents',
          instructions: 'Increase halo clearance for 8x6 oval center while keeping low profile.',
          files: ['halo_v2_variant.3dm', 'oval_halo_notes.pdf'],
        },
        pricing: {
          estimatedTotal: '$3,360',
          unitBreakdown: 'Platinum casting: $2,690, labor/polish: $670',
          timeline: 'Final validation in progress with production team.',
        },
        discussion: [],
      },
      {
        referenceNumber: 'R50005',
        versionLabel: 'Version 3',
        status: 'Sent',
        factoryStatus: 'Completed',
        adminRenderings: [],
        designBrief: {
          styleSku: 'HALO-V2-C',
          metal: 'Platinum',
          size: '6',
          stoneDescription: 'Oval halo with cathedral shoulders and hidden halo',
          instructions: 'Prepare package for internal approval with alternate shank thicknesses.',
          files: ['halo_v2_v3_markup.pdf', 'halo_v2_v3_comparison.png'],
        },
        pricing: {
          estimatedTotal: '$3,480',
          unitBreakdown: 'Platinum casting: $2,760, labor/polish: $720',
          timeline: 'Awaiting internal sign-off before customer release.',
        },
        discussion: [],
      },
    ],
  },
  {
    quoteNumber: 'Q80003',
    account: 'account1',
    customerRequest: 'Olivia & Ethan',
    salesPersonName: 'Sofia Nguyen',
    updatedAt: '2026-03-14',
    references: [
      {
        referenceNumber: 'R50006',
        versionLabel: 'Version 1',
        status: 'Revision',
        factoryStatus: 'Revision',
        adminRenderings: [],
        designBrief: {
          styleSku: 'PD-SIGN-02',
          metal: '18K Yellow Gold',
          size: 'N/A',
          stoneDescription: 'Updated bail and thicker edge profile',
          instructions: 'Lock this version and generate release packet.',
          files: ['pendant_v2_render.jpg', 'pendant_v2_dimensions.pdf'],
        },
        pricing: {
          estimatedTotal: '$1,240',
          unitBreakdown: 'Material: $860, labor + finishing: $380',
          timeline: 'Release package can be sent today.',
        },
        discussion: [],
      },
      {
        referenceNumber: 'R50007',
        versionLabel: 'Version 2',
        status: 'Ready',
        factoryStatus: 'Completed',
        adminRenderings: ['pendant_signature_v2_front.png'],
        designBrief: {
          styleSku: 'PD-SIGN-03',
          metal: '18K Yellow Gold',
          size: 'N/A',
          stoneDescription: 'Tapered silhouette with thicker edge profile and brushed center panel',
          instructions: 'Version approved pending final quote release and timeline confirmation.',
          files: ['pendant_v3_render.jpg', 'pendant_v3_dimensions.pdf'],
        },
        pricing: {
          estimatedTotal: '$1,360',
          unitBreakdown: 'Material: $940, labor + finishing: $420',
          timeline: 'Release package ready to send today.',
        },
        discussion: [],
      },
    ],
  },
  {
    quoteNumber: 'Q80004',
    account: 'account2',
    customerRequest: 'Mia Chen',
    salesPersonName: 'Avery Patel',
    updatedAt: '2026-03-15',
    references: [
      {
        referenceNumber: 'R50008',
        versionLabel: 'Version 1',
        status: 'Reviewed',
        factoryStatus: 'Reviewed',
        adminRenderings: ['bezel_flora_v1_top.png'],
        designBrief: {
          styleSku: 'BZ-FLORA-01',
          metal: '14K Rose Gold',
          size: '6.25',
          stoneDescription: 'Bezel-set marquise center with floral shoulder motif',
          instructions: 'Keep low profile for daily wear and preserve petal spacing.',
          files: ['bezel_flora_v1.3dm', 'flora_inspo_sheet.pdf'],
        },
        pricing: {
          estimatedTotal: '$2,140',
          unitBreakdown: 'Gold + labor: $1,700, finishing: $440',
          timeline: 'CAD review in queue for design team.',
        },
        discussion: [],
      },
      {
        referenceNumber: 'R50009',
        versionLabel: 'Version 2',
        status: 'Ready',
        factoryStatus: 'Completed',
        adminRenderings: ['bezel_flora_v2_front.png'],
        designBrief: {
          styleSku: 'BZ-FLORA-02',
          metal: '14K Rose Gold',
          size: '6.25',
          stoneDescription: 'Bezel-set marquise center with simplified shoulder petals',
          instructions: 'Use slimmer bezel wall and lock this version for release.',
          files: ['bezel_flora_v2_notes.pdf', 'bezel_flora_v2_angles.jpg'],
        },
        pricing: {
          estimatedTotal: '$2,080',
          unitBreakdown: 'Gold + labor: $1,660, finishing: $420',
          timeline: 'Quote package can be released today.',
        },
        discussion: [],
      },
    ],
  },
  {
    quoteNumber: 'Q80005',
    account: 'account1',
    customerRequest: 'PO-9321 / OVAL-TRIO',
    salesPersonName: 'Maya Chen',
    updatedAt: '2026-03-16',
    references: [
      {
        referenceNumber: 'R50010',
        versionLabel: 'Version 1',
        status: 'Assigned',
        assignedFactory: 'InHouse',
        factoryStatus: 'In Progress',
        adminRenderings: [],
        designBrief: {
          styleSku: 'OV-TRIO-01',
          metal: '18K White Gold',
          size: '6.5',
          stoneDescription: 'Oval center with tapered baguette side stones',
          instructions: 'Maintain flush-fit against wedding band with raised gallery.',
          files: ['oval_trio_v1.pdf', 'oval_trio_ref.jpg'],
        },
        pricing: {
          estimatedTotal: '$2,980',
          unitBreakdown: 'Gold + labor: $2,360, setting + finish: $620',
          timeline: 'Rendering in progress, expected by tomorrow.',
        },
        discussion: [],
      },
      {
        referenceNumber: 'R50011',
        versionLabel: 'Version 2',
        status: 'Revision',
        factoryStatus: 'Revision',
        adminRenderings: [],
        designBrief: {
          styleSku: 'OV-TRIO-02',
          metal: '18K White Gold',
          size: '6.5',
          stoneDescription: 'Oval center with trapezoid side stones and hidden halo',
          instructions: 'Hold pricing until final center stone measurements are confirmed.',
          files: ['oval_trio_v2_notes.pdf', 'oval_trio_v2_comparison.png'],
        },
        pricing: {
          estimatedTotal: '$3,180',
          unitBreakdown: 'Gold + labor: $2,500, setting + finish: $680',
          timeline: 'Pending customer-provided center stone specs.',
        },
        discussion: [],
      },
    ],
  },
];

function getDefaultFactoryDetails() {
  return {
    goldWeight: '',
    totalPrice: '',
    finishedMeasurementsCad: '',
    specSheet: '',
    viewerLink: '',
    fiveAnglesRender: [],
    diamondBreakdown: [
      { quantity: '', shape: '', measurements: '', quality: '', tcw: '', cost: '' },
    ],
  };
}

function ensureFactoryDetails(reference) {
  if (!reference.factoryDetails) {
    reference.factoryDetails = getDefaultFactoryDetails();
    return;
  }

  if (!Array.isArray(reference.factoryDetails.fiveAnglesRender)) {
    const legacyRenderValue = reference.factoryDetails.fiveAnglesRender;
    reference.factoryDetails.fiveAnglesRender = legacyRenderValue
      ? legacyRenderValue.split(',').map((item) => item.trim()).filter(Boolean)
      : [];
  }

  if (!Array.isArray(reference.factoryDetails.diamondBreakdown) || !reference.factoryDetails.diamondBreakdown.length) {
    reference.factoryDetails.diamondBreakdown = [
      { quantity: '', shape: '', measurements: '', quality: '', tcw: '', cost: '' },
    ];
  }
}


function createPlaceholderRenderData(referenceNumber, angleLabel) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#eff6ff" />
          <stop offset="100%" stop-color="#dbeafe" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" rx="36" fill="url(#bg)" />
      <circle cx="400" cy="315" r="140" fill="none" stroke="#64748b" stroke-width="24" />
      <ellipse cx="400" cy="220" rx="84" ry="64" fill="#f8fafc" stroke="#94a3b8" stroke-width="14" />
      <text x="400" y="505" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" fill="#1e293b">${referenceNumber} • ${angleLabel}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function renderVersionRenderings(reference) {
  if (!renderingsEmptyState || !renderingsContent || !renderingsViewerFrame || !renderingsGallery || !renderingsSpecSheet || !renderingsViewerLink) {
    return;
  }

  ensureReferenceStatuses(reference);
  ensureFactoryDetails(reference);
  syncPricingBreakdownFromFactory(reference);
  const details = reference.factoryDetails;
  const hasViewer = Boolean(details.viewerLink);
  const hasGallery = Array.isArray(details.fiveAnglesRender) && details.fiveAnglesRender.length > 0;
  const hasSpecSheet = Boolean(details.specSheet);
  const hasRenderings = hasViewer || hasGallery || hasSpecSheet;

  renderingsEmptyState.classList.toggle('hidden', hasRenderings);
  renderingsContent.classList.toggle('hidden', !hasRenderings);

  if (hasViewer) {
    renderingsViewerLink.href = details.viewerLink;
    renderingsViewerLink.classList.remove('hidden');
    renderingsViewerFrame.innerHTML = `<iframe src="${details.viewerLink}" title="Factory rendering viewer" loading="lazy" referrerpolicy="no-referrer"></iframe>`;
  } else {
    renderingsViewerLink.classList.add('hidden');
    renderingsViewerLink.removeAttribute('href');
    renderingsViewerFrame.innerHTML = '<p class="renderings-placeholder">Viewer link will appear here after the factory uploads it.</p>';
  }

  if (hasGallery) {
    renderingsGallery.innerHTML = details.fiveAnglesRender
      .map(
        (item, index) => `
          <figure class="render-angle-card">
            <img src="${item.url || item}" alt="${item.label || `Render angle ${index + 1}`}" loading="lazy" />
            <figcaption>${item.label || `Angle ${index + 1}`}</figcaption>
          </figure>
        `
      )
      .join('');
  } else {
    renderingsGallery.innerHTML = '<p class="renderings-placeholder">Five render angles will appear here after the factory uploads them.</p>';
  }

  if (hasSpecSheet) {
    const isUrl = /^https?:/i.test(details.specSheet);
    renderingsSpecSheet.innerHTML = isUrl
      ? `<a href="${details.specSheet}" target="_blank" rel="noopener noreferrer">Open spec sheet</a>`
      : `<p>${details.specSheet}</p>`;
  } else {
    renderingsSpecSheet.innerHTML = '<p class="renderings-placeholder">Spec sheet not uploaded yet.</p>';
  }
}

ongoingProjects[0].references[0].factoryDetails = {
  goldWeight: '8.4g',
  totalPrice: '$2,460',
  finishedMeasurementsCad: 'solitaire_v1_final.3dm',
  specSheet: 'solitaire_v1_spec_sheet.pdf',
  viewerLink: 'https://viewer.crownring.com/?id=boahqydCRq-qH-WcXZyLaQ',
  fiveAnglesRender: [
    { label: 'Front View', url: createPlaceholderRenderData('R50001', 'Front View') },
    { label: 'Profile View', url: createPlaceholderRenderData('R50001', 'Profile View') },
    { label: 'Top View', url: createPlaceholderRenderData('R50001', 'Top View') },
    { label: 'Perspective View', url: createPlaceholderRenderData('R50001', 'Perspective View') },
    { label: 'Detail View', url: createPlaceholderRenderData('R50001', 'Detail View') },
  ],
  diamondBreakdown: [
    { quantity: '1', shape: 'Round', measurements: '1.25ct', quality: 'VS1 / F', tcw: '1.25', cost: '$1,240' },
  ],
};

const expandedQuotes = new Set(ongoingProjects.slice(0, 1).map((project) => project.quoteNumber));

function updateVersionTitles() {
  const cards = [...versionsContainer.querySelectorAll('.version-card')];

  cards.forEach((card, index) => {
    card.querySelector('.version-title').textContent = `Version ${index + 1}`;
    card.querySelector('.remove-btn').hidden = cards.length === 1;
  });
}

function createVersionCard() {
  versionCount += 1;
  const fragment = versionTemplate.content.cloneNode(true);
  const card = fragment.querySelector('.version-card');

  card.dataset.versionId = String(versionCount);
  card.querySelector('.remove-btn').addEventListener('click', () => {
    card.remove();
    updateVersionTitles();
  });

  versionsContainer.appendChild(fragment);
  updateVersionTitles();
}

function focusNextInputOnEnter(event) {
  if (event.key !== 'Enter') {
    return;
  }

  const target = event.target;
  const isTextInput =
    target instanceof HTMLInputElement &&
    ['text', 'email', 'number', 'search', 'tel', 'url'].includes(target.type);

  if (!isTextInput) {
    return;
  }

  event.preventDefault();

  const focusable = [...quoteForm.querySelectorAll('input, textarea, button, select')].filter(
    (element) => !element.disabled && element.type !== 'hidden'
  );

  const index = focusable.indexOf(target);
  if (index >= 0 && index < focusable.length - 1) {
    focusable[index + 1].focus();
  }
}

function setMode(mode) {
  currentMode = mode;

  modeButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.mode === mode);
  });

  if (accountInput) {
    accountInput.value = accountNames[mode] || accountNames.account1;
  }

  if (customerView && adminView && factoryView) {
    const isAdminMode = mode === 'admin';
    const isFactoryMode = mode === 'factory';
    customerView.classList.toggle('hidden', isAdminMode || isFactoryMode);
    adminView.classList.toggle('hidden', !isAdminMode);
    factoryView.classList.toggle('hidden', !isFactoryMode);
  }

  renderOngoingProjects();

  if (mode === 'admin') {
    renderAdminQueue();
  } else if (mode === 'factory') {
    renderFactoryQueue();
  } else {
    setPage('home');
  }
}

function setPage(page) {
  [...document.querySelectorAll('.customer-page')].forEach((pageElement) => {
    pageElement.classList.toggle('active', pageElement.id === `page-${page}`);
  });

  pageButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.page === page);
  });
}

function formatDate(value) {
  const date = new Date(`${value}T12:00:00`);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getLatestReferenceStatus(project) {
  const latestReference = project.references[project.references.length - 1];
  return latestReference ? getAdminStatus(latestReference) : 'No status';
}

function getDiscussionMarkup(messages) {
  if (!messages.length) {
    return '<p class="discussion-empty">No messages yet. Start the discussion to request changes.</p>';
  }

  return messages
    .map(
      (item) => `
      <article class="chat-message ${item.author === 'Admin' ? 'from-team' : 'from-customer'}">
        <p class="chat-message-meta">
          <strong>${item.author}</strong>
          <span>${item.timestamp}</span>
        </p>
        <p class="chat-message-body">${item.message}</p>
      </article>
    `
    )
    .join('');
}

function getVisibleProjects() {
  if (currentMode === 'admin' || currentMode === 'factory') {
    return ongoingProjects;
  }

  return ongoingProjects.filter((project) => project.account === currentMode);
}

function getProjectByContext() {
  if (!activeVersionContext) {
    return {};
  }

  const project = ongoingProjects.find((candidate) => candidate.quoteNumber === activeVersionContext.quoteNumber);
  const reference = project?.references.find(
    (candidate) => candidate.referenceNumber === activeVersionContext.referenceNumber
  );

  return { project, reference };
}

function renderAdminAssets(reference) {
  if (!adminRenderingsList) {
    return;
  }

  if (!reference || !reference.adminRenderings.length) {
    adminRenderingsList.innerHTML = '<li>No admin renderings uploaded for this version.</li>';
    return;
  }

  adminRenderingsList.innerHTML = reference.adminRenderings.map((file) => `<li>${file}</li>`).join('');
}

function formatNeedToProvide(needToProvide = {}) {
  const selections = [];

  if (needToProvide.renderings) selections.push('Renderings');
  if (needToProvide.viewer3d) selections.push('3D Viewer');

  return selections.length ? selections.join(', ') : '—';
}

function getDesignBriefEntries(reference, includeAccount = false, accountName = '') {
  const briefEntries = [];

  if (includeAccount) {
    briefEntries.push(['Account', accountName || '—']);
  }

  briefEntries.push(
    ['Style / SKU', reference.designBrief.styleSku || '—'],
    ['Metal/Color', reference.designBrief.metal || '—'],
    ['Finger Size', reference.designBrief.size || '—'],
    ['Center Stone Dimensions/Carat Weight/Description', reference.designBrief.stoneDescription || '—'],
    ['Customer Deadline', reference.designBrief.customerDeadline || '—'],
    ['Instructions', reference.designBrief.instructions || '—'],
    ['Need to Provide', formatNeedToProvide(reference.designBrief.needToProvide)],
  );

  return briefEntries;
}

function renderDesignBriefFields(container, entries) {
  if (!container) {
    return;
  }

  container.innerHTML = entries
    .map(([term, value]) => `<div><dt>${term}</dt><dd>${value}</dd></div>`)
    .join('');
}

function openVersionDetail(quoteNumber, referenceNumber) {
  const project = ongoingProjects.find((candidate) => candidate.quoteNumber === quoteNumber);
  if (!project) {
    return;
  }

  const reference = project.references.find((candidate) => candidate.referenceNumber === referenceNumber);
  if (!reference) {
    return;
  }

  ensureReferenceStatuses(reference);
  syncPricingBreakdownFromFactory(reference);

  activeVersionContext = { quoteNumber, referenceNumber };

  versionDetailMeta.textContent = `${project.quoteNumber} • ${reference.referenceNumber} (${reference.versionLabel}) • ${accountNames[project.account]} • ${project.customerRequest}`;

  const briefEntries = getDesignBriefEntries(reference, true, accountNames[project.account]);
  renderDesignBriefFields(designBriefFields, briefEntries);

  designBriefFiles.innerHTML = reference.designBrief.files.length
    ? reference.designBrief.files.map((file) => `<li>${file}</li>`).join('')
    : '<li>No files attached for this version.</li>';

  versionPricing.innerHTML = `
    <p><strong>Estimated Total:</strong> ${reference.pricing.estimatedTotal}</p>
    <p><strong>Breakdown:</strong> ${reference.pricing.unitBreakdown}</p>
    <p><strong>Timeline:</strong> ${reference.pricing.timeline}</p>
  `;

  discussionThread.innerHTML = getDiscussionMarkup(reference.discussion);
  renderVersionRenderings(reference);
  renderAdminAssets(reference);

  if (currentMode === 'admin') {
    if (adminStatusInput) {
      adminStatusInput.innerHTML = getStatusOptionsMarkup(ADMIN_PROJECT_STATUSES, getAdminStatus(reference));
    }
    syncAssignedFactoryField(getAdminStatus(reference), reference.assignedFactory);
    adminPricingTotal.value = reference.pricing.estimatedTotal;
    adminPricingBreakdown.value = reference.pricing.unitBreakdown;
    adminPricingTimeline.value = reference.pricing.timeline;
    adminDetailMeta.textContent = `${project.quoteNumber} • ${reference.referenceNumber} (${reference.versionLabel}) • ${project.customerRequest}`;
    if (adminStyleSkuInput) adminStyleSkuInput.value = reference.designBrief.styleSku || '';
    if (adminMetalInput) adminMetalInput.value = reference.designBrief.metal || '';
    if (adminSizeInput) adminSizeInput.value = reference.designBrief.size || '';
    if (adminStoneDescriptionInput) adminStoneDescriptionInput.value = reference.designBrief.stoneDescription || '';
    if (adminInstructionsInput) adminInstructionsInput.value = reference.designBrief.instructions || '';
    if (adminNeedRenderingsInput) adminNeedRenderingsInput.checked = Boolean(reference.designBrief.needToProvide?.renderings);
    if (adminNeedViewerInput) adminNeedViewerInput.checked = Boolean(reference.designBrief.needToProvide?.viewer3d);
    renderDesignBriefFields(adminDesignBriefFields, getDesignBriefEntries(reference));
    if (adminConversationThread) {
      adminConversationThread.innerHTML = getDiscussionMarkup(reference.discussion);
    }
  }

  setPage('version-detail');
}

function getAllReferencesForQueue() {
  return ongoingProjects.flatMap((project) =>
    project.references.map((reference) => ({ project, reference }))
  );
}

function renderAdminQueue() {
  if (!adminQueueBody || !adminSummaryMeta) {
    return;
  }

  const queueItems = getAllReferencesForQueue();
  const attentionCount = queueItems.filter(({ reference }) => !['Ready', 'Sent'].includes(getAdminStatus(reference))).length;

  adminSummaryMeta.textContent = `${queueItems.length} active reference(s) • ${attentionCount} needing attention`;

  adminQueueBody.innerHTML = queueItems
    .map(
      ({ project, reference }) => `
        <tr>
          <td><strong>${project.quoteNumber}</strong></td>
          <td>
            <strong>${reference.referenceNumber}</strong>
            <div class="queue-version-label">${reference.versionLabel}</div>
          </td>
          <td>${project.customerRequest}</td>
          <td>${project.salesPersonName}</td>
          <td><span class="status-chip">${getAdminStatus(reference)}</span></td>
          <td>
            <button
              type="button"
              class="link-btn"
              data-action="admin-open-reference"
              data-quote-number="${project.quoteNumber}"
              data-reference-number="${reference.referenceNumber}"
            >Open</button>
          </td>
        </tr>
      `
    )
    .join('');

  if (currentMode === 'admin' && !activeVersionContext && queueItems.length) {
    const [firstItem] = queueItems;
    openVersionDetail(firstItem.project.quoteNumber, firstItem.reference.referenceNumber);
  }
}


function getVisibleFactoryReferences() {
  const normalizedSearch = normalizeForSearch(factoryFilterState.search);

  return getAllReferencesForQueue().filter(({ project, reference }) => {
    const matchesStatus = !factoryFilterState.status || getFactoryStatus(reference) === factoryFilterState.status;

    if (!matchesStatus) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    return [
      project.quoteNumber,
      reference.referenceNumber,
      reference.versionLabel,
      project.customerRequest,
      project.salesPersonName,
      getFactoryStatus(reference),
    ]
      .filter(Boolean)
      .map((token) => token.toString().toLowerCase())
      .some((token) => token.includes(normalizedSearch));
  });
}

function syncFactoryStatusFilterOptions() {
  if (!factoryStatusFilter) {
    return;
  }

  const statusOptions = FACTORY_PROJECT_STATUSES;
  factoryStatusFilter.innerHTML = `
    <option value="">All statuses</option>
    ${statusOptions.map((status) => `<option value="${status}">${status}</option>`).join('')}
  `;
  factoryStatusFilter.value = factoryFilterState.status;
}

function formatStoneSummary(rows) {
  const summaryMap = new Map();

  rows.forEach((row) => {
    const quantity = Number.parseFloat(row.quantity);
    const tcw = Number.parseFloat(row.tcw);
    const shape = (row.shape || '').trim();
    const quality = (row.quality || '').trim();

    if (!shape || !quality || Number.isNaN(quantity) || Number.isNaN(tcw)) {
      return;
    }

    const key = `${shape}__${quality}`;
    const current = summaryMap.get(key) || { quantity: 0, tcw: 0, shape, quality };
    current.quantity += quantity;
    current.tcw += tcw;
    summaryMap.set(key, current);
  });

  return [...summaryMap.values()]
    .map((item) => `${item.quantity} ${item.shape} = ${Number(item.tcw.toFixed(2))}ct ${item.quality}`)
    .join(' • ');
}

function renderFactoryStoneSummary(rows) {
  if (!factoryStoneSummary) {
    return;
  }

  const summary = formatStoneSummary(rows);
  factoryStoneSummary.textContent = summary || 'Add quantity, shape, quality, and TCW to see the stone summary.';
}

function getMetalKarat(reference) {
  const metal = reference?.designBrief?.metal || '';
  const match = metal.match(/\b\d+K\b/i);
  return match ? match[0].toUpperCase() : metal.trim();
}

function buildPricingBreakdown(reference) {
  if (!reference) {
    return '';
  }

  ensureFactoryDetails(reference);
  const parts = [];
  const gramWeight = reference.factoryDetails.goldWeight?.trim();
  const metalKarat = getMetalKarat(reference);
  const diamondSummary = formatStoneSummary(reference.factoryDetails.diamondBreakdown || []);

  if (gramWeight) {
    parts.push(`Gram Weight: ${gramWeight}`);
  }

  if (metalKarat) {
    parts.push(`Metal Karat: ${metalKarat}`);
  }

  if (diamondSummary) {
    parts.push(`Diamond Summary: ${diamondSummary}`);
  }

  return parts.join(' • ');
}

function syncPricingBreakdownFromFactory(reference) {
  const nextBreakdown = buildPricingBreakdown(reference);
  if (nextBreakdown) {
    reference.pricing.unitBreakdown = nextBreakdown;
  }
}

function renderFactoryShapeConfig() {
  if (!factoryShapeConfigOptions) {
    return;
  }

  factoryShapeConfigOptions.innerHTML = availableShapeOptions
    .map((shape) => `
      <label class="shape-option">
        <input type="checkbox" value="${shape}" ${selectedShapeOptions.has(shape) ? 'checked' : ''} />
        <span>${shape}</span>
      </label>
    `)
    .join('');
}

function getShapeSelectMarkup(index, currentValue) {
  const selectedOptions = availableShapeOptions.filter((shape) => selectedShapeOptions.has(shape));
  const options = selectedOptions.includes(currentValue) || !currentValue
    ? selectedOptions
    : [...selectedOptions, currentValue];

  return `
    <select data-diamond-field="shape" data-index="${index}" required>
      <option value="">Select shape</option>
      ${options.map((shape) => `<option value="${shape}" ${shape === currentValue ? 'selected' : ''}>${shape}</option>`).join('')}
    </select>
  `;
}

function renderFactoryDiamondBreakdownRows(rows) {
  if (!factoryDiamondBreakdownBody) {
    return;
  }

  factoryDiamondBreakdownBody.innerHTML = rows
    .map(
      (row, index) => `
        <tr>
          <td><input type="text" data-diamond-field="quantity" data-index="${index}" value="${row.quantity || ''}" required /></td>
          <td>${getShapeSelectMarkup(index, row.shape || '')}</td>
          <td><input type="text" data-diamond-field="measurements" data-index="${index}" value="${row.measurements || ''}" required /></td>
          <td><input type="text" data-diamond-field="quality" data-index="${index}" value="${row.quality || ''}" required /></td>
          <td><input type="text" data-diamond-field="tcw" data-index="${index}" value="${row.tcw || ''}" required /></td>
          <td><input type="text" data-diamond-field="cost" data-index="${index}" value="${row.cost || ''}" required /></td>
        </tr>
      `
    )
    .join('');

  renderFactoryStoneSummary(rows);
}

function openFactoryReferenceDetail(quoteNumber, referenceNumber) {
  const project = ongoingProjects.find((candidate) => candidate.quoteNumber === quoteNumber);
  const reference = project?.references.find((candidate) => candidate.referenceNumber === referenceNumber);

  if (!project || !reference) {
    return;
  }

  ensureReferenceStatuses(reference);
  ensureFactoryDetails(reference);
  syncPricingBreakdownFromFactory(reference);
  const details = reference.factoryDetails;

  activeFactoryContext = { quoteNumber, referenceNumber };

  if (factoryDetailMeta) {
    factoryDetailMeta.textContent = `${project.quoteNumber} • ${reference.referenceNumber} (${reference.versionLabel}) • ${project.customerRequest}`;
  }
  renderDesignBriefFields(factoryDesignBriefFields, getDesignBriefEntries(reference));

  if (factoryStatusInput) {
    factoryStatusInput.innerHTML = getStatusOptionsMarkup(FACTORY_PROJECT_STATUSES, getFactoryStatus(reference));
  }
  if (factoryGoldWeightInput) factoryGoldWeightInput.value = details.goldWeight || '';
  if (factoryTotalPriceInput) factoryTotalPriceInput.value = details.totalPrice || '';
  if (factoryFinishedMeasurementsInput) factoryFinishedMeasurementsInput.value = details.finishedMeasurementsCad || '';
  if (factorySpecSheetInput) factorySpecSheetInput.value = details.specSheet || '';
  if (factoryViewerLinkInput) factoryViewerLinkInput.value = details.viewerLink || '';
  if (factoryFiveAnglesRenderInput) factoryFiveAnglesRenderInput.value = details.fiveAnglesRender.map((item) => item.label || item).join(', ');

  renderFactoryDiamondBreakdownRows(details.diamondBreakdown);
}

function renderFactoryQueue() {
  if (!factoryQueueBody) {
    return;
  }

  syncFactoryStatusFilterOptions();
  const visibleReferences = getVisibleFactoryReferences();

  if (!visibleReferences.length) {
    factoryQueueBody.innerHTML =
      '<tr><td class="empty-row" colspan="7">No custom requests match your current filters.</td></tr>';
    return;
  }

  factoryQueueBody.innerHTML = visibleReferences
    .map(
      ({ project, reference }) => `
        <tr>
          <td><strong>${project.quoteNumber}</strong></td>
          <td><strong>${reference.referenceNumber}</strong><div class="queue-version-label">${reference.versionLabel}</div></td>
          <td>${formatDate(project.updatedAt)}</td>
          <td>${project.customerRequest}</td>
          <td><span class="status-chip">${getFactoryStatus(reference)}</span></td>
          <td>${formatDate(project.updatedAt)}</td>
          <td>
            <div class="factory-table-actions">
              <button
                type="button"
                class="link-btn"
                data-action="factory-open-reference"
                data-quote-number="${project.quoteNumber}"
                data-reference-number="${reference.referenceNumber}"
              >View details</button>
              <button
                type="button"
                class="link-btn"
                data-action="factory-complete-reference"
                data-quote-number="${project.quoteNumber}"
                data-reference-number="${reference.referenceNumber}"
              >Mark completed</button>
            </div>
          </td>
        </tr>
      `
    )
    .join('');

  if (!activeFactoryContext && visibleReferences.length) {
    const [firstItem] = visibleReferences;
    openFactoryReferenceDetail(firstItem.project.quoteNumber, firstItem.reference.referenceNumber);
  }
}

function normalizeForSearch(value) {
  return value.toLowerCase().trim();
}

function getSearchableTokens(project) {
  const quoteTokens = [
    project.quoteNumber,
    project.customerRequest,
    project.salesPersonName,
    accountNames[project.account],
    getLatestReferenceStatus(project),
  ];

  const referenceTokens = project.references.flatMap((reference) => [
    reference.referenceNumber,
    reference.versionLabel,
    getAdminStatus(reference),
    reference.designBrief.styleSku,
    reference.designBrief.metal,
    reference.designBrief.size,
    reference.designBrief.stoneDescription,
    reference.designBrief.customerDeadline,
    reference.designBrief.instructions,
  ]);

  return [...quoteTokens, ...referenceTokens]
    .filter(Boolean)
    .map((token) => token.toString().toLowerCase());
}

function getUniqueStatuses(projects) {
  return [...new Set(projects.flatMap((project) => project.references.map((reference) => getAdminStatus(reference))))]
    .filter(Boolean)
    .sort((left, right) => left.localeCompare(right));
}

function syncStatusFilterOptions(visibleProjects) {
  if (!projectStatusFilter) {
    return;
  }

  const selectedStatus = projectFilterState.status;
  const statusOptions = ADMIN_PROJECT_STATUSES;

  projectStatusFilter.innerHTML = `
    <option value="">All statuses</option>
    ${statusOptions.map((status) => `<option value="${status}">${status}</option>`).join('')}
  `;

  projectStatusFilter.value = selectedStatus;
}

function getFilteredProjects() {
  const normalizedSearch = normalizeForSearch(projectFilterState.search);
  const visibleProjects = getVisibleProjects();

  return visibleProjects.filter((project) => {
    const matchesStatus =
      !projectFilterState.status || project.references.some((reference) => getAdminStatus(reference) === projectFilterState.status);

    if (!matchesStatus) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    return getSearchableTokens(project).some((token) => token.includes(normalizedSearch));
  });
}

function renderProjectResultsMeta(totalCount, filteredCount) {
  if (!projectResultsMeta) {
    return;
  }

  if (totalCount === 0) {
    projectResultsMeta.textContent = 'No quote requests have been submitted yet.';
    return;
  }

  if (filteredCount === totalCount) {
    projectResultsMeta.textContent = `Showing all ${totalCount} project(s).`;
    return;
  }

  projectResultsMeta.textContent = `Showing ${filteredCount} of ${totalCount} project(s).`;
}

function renderOngoingProjects() {
  if (!projectsTableBody) {
    return;
  }

  const visibleProjects = getVisibleProjects();
  syncStatusFilterOptions(visibleProjects);

  if (!visibleProjects.length) {
    projectsTableBody.innerHTML =
      '<tr><td class="empty-row" colspan="6">No quote requests have been submitted yet.</td></tr>';
    renderProjectResultsMeta(0, 0);
    return;
  }

  const filteredProjects = getFilteredProjects();
  renderProjectResultsMeta(visibleProjects.length, filteredProjects.length);

  if (!filteredProjects.length) {
    projectsTableBody.innerHTML =
      '<tr><td class="empty-row" colspan="6">No projects match your current search and filters.</td></tr>';
    return;
  }

  projectsTableBody.innerHTML = filteredProjects
    .map((project) => {
      const isExpanded = expandedQuotes.has(project.quoteNumber);
      const referencesMarkup = project.references
        .map(
          (reference) => `
            <li>
              <span class="reference-id">${reference.referenceNumber}</span>
              <span>${reference.versionLabel}</span>
              <span class="reference-status">${getAdminStatus(reference)}</span>
              <button
                type="button"
                class="link-btn"
                data-action="open-version-detail"
                data-quote-number="${project.quoteNumber}"
                data-reference-number="${reference.referenceNumber}"
              >View details</button>
            </li>
          `
        )
        .join('');

      return `
        <tr class="quote-row" data-quote-number="${project.quoteNumber}">
          <td>
            <button
              type="button"
              class="expand-btn"
              data-quote-number="${project.quoteNumber}"
              aria-expanded="${isExpanded}"
              aria-label="${isExpanded ? 'Collapse' : 'Expand'} ${project.quoteNumber}"
            >${isExpanded ? '▾' : '▸'}</button>
          </td>
          <td><strong>${project.quoteNumber}</strong></td>
          <td>${project.customerRequest}</td>
          <td>${project.salesPersonName}</td>
          <td>${project.references.length}</td>
          <td><span class="status-chip">${getLatestReferenceStatus(project)}</span></td>
        </tr>
        <tr class="reference-row ${isExpanded ? '' : 'hidden'}" data-reference-group="${project.quoteNumber}">
          <td></td>
          <td colspan="5">
            <div class="reference-group">
              <p><strong>Latest update:</strong> ${formatDate(project.updatedAt)}</p>
              <ul class="reference-list">
                ${referencesMarkup}
              </ul>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');
}

function getNextQuoteNumber() {
  const quoteNumber = `Q${nextQuoteNumber}`;
  nextQuoteNumber += 1;
  return quoteNumber;
}

function getNextReferenceNumber() {
  const referenceNumber = `R${nextReferenceNumber}`;
  nextReferenceNumber += 1;
  return referenceNumber;
}

function createProjectFromForm() {
  const formData = new FormData(quoteForm);
  const requestText = (formData.get('reference') || '').toString().trim() || 'General quote request';
  const salesPersonName = (formData.get('salespersonName') || '').toString().trim() || 'Not provided';
  const customerDeadline = (formData.get('customerDeadline') || '').toString().trim();

  const projectAccount = ['admin', 'factory'].includes(currentMode) ? 'account1' : currentMode;

  const versionCards = [...versionsContainer.querySelectorAll('.version-card')];
  const references = versionCards.map((card, index) => {
    const instructions = card.querySelector('[data-field="instructions"]').value.trim();
    const styleSku = card.querySelector('[data-field="styleSku"]').value.trim();
    const metal = card.querySelector('[data-field="metal"]').value.trim();
    const size = card.querySelector('[data-field="size"]').value.trim();
    const stoneDescription = card.querySelector('[data-field="stoneDescription"]').value.trim();
    const uploadInput = card.querySelector('[data-field="uploads"]');
    const files = [...uploadInput.files].map((file) => file.name);
    const needToProvide = {
      renderings: card.querySelector('[data-field="renderings"]').checked,
      viewer3d: card.querySelector('[data-field="viewer3d"]').checked,
    };

    return {
      referenceNumber: getNextReferenceNumber(),
      versionLabel: `Version ${index + 1}`,
      status: getDefaultAdminStatus(),
      factoryStatus: getDefaultFactoryStatus(),
      adminRenderings: [],
      designBrief: {
        styleSku,
        metal,
        size,
        stoneDescription,
        customerDeadline,
        instructions,
        files,
        needToProvide,
      },
      pricing: {
        estimatedTotal: 'Pending quote calculation',
        unitBreakdown: 'Will be generated by the pricing team.',
        timeline: 'Submitted and awaiting review.',
      },
      factoryDetails: getDefaultFactoryDetails(),
      discussion: [
        {
          author: currentMode === 'admin' ? 'Admin' : accountNames[projectAccount],
          message: 'New version submitted. Please review and share quote details.',
          timestamp: new Date().toLocaleString(),
        },
      ],
    };
  });

  const newProject = {
    quoteNumber: getNextQuoteNumber(),
    account: projectAccount,
    customerRequest: requestText,
    salesPersonName,
    updatedAt: new Date().toISOString().slice(0, 10),
    references,
  };

  ongoingProjects.unshift(newProject);
  expandedQuotes.add(newProject.quoteNumber);
  renderOngoingProjects();

  quoteForm.reset();
  if (accountInput) {
    accountInput.value = accountNames[currentMode];
  }

  versionsContainer.innerHTML = '';
  createVersionCard();

  setPage('projects');
  alert(`Quote ${newProject.quoteNumber} generated for ${accountNames[projectAccount]} with ${references.length} reference(s).`);
}

addVersionButton.addEventListener('click', createVersionCard);
quoteForm.addEventListener('keydown', focusNextInputOnEnter);
quoteForm.addEventListener('submit', (event) => {
  event.preventDefault();
  createProjectFromForm();
});

modeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setMode(button.dataset.mode);
  });
});

pageButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setPage(button.dataset.page);
  });
});

projectsTableBody?.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const expandButton = target.closest('.expand-btn');
  if (expandButton instanceof HTMLButtonElement) {
    const { quoteNumber } = expandButton.dataset;
    if (!quoteNumber) {
      return;
    }

    if (expandedQuotes.has(quoteNumber)) {
      expandedQuotes.delete(quoteNumber);
    } else {
      expandedQuotes.add(quoteNumber);
    }

    renderOngoingProjects();
    return;
  }

  const detailButton = target.closest('[data-action="open-version-detail"]');
  if (detailButton instanceof HTMLButtonElement) {
    const { quoteNumber, referenceNumber } = detailButton.dataset;
    if (quoteNumber && referenceNumber) {
      openVersionDetail(quoteNumber, referenceNumber);
    }
  }
});

adminQueueBody?.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const adminOpenButton = target.closest('[data-action="admin-open-reference"]');
  if (adminOpenButton instanceof HTMLButtonElement) {
    const { quoteNumber, referenceNumber } = adminOpenButton.dataset;
    if (quoteNumber && referenceNumber) {
      openVersionDetail(quoteNumber, referenceNumber);
    }
  }
});

factoryQueueBody?.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const factoryOpenButton = target.closest('[data-action="factory-open-reference"]');
  if (factoryOpenButton instanceof HTMLButtonElement) {
    const { quoteNumber, referenceNumber } = factoryOpenButton.dataset;
    if (quoteNumber && referenceNumber) {
      openFactoryReferenceDetail(quoteNumber, referenceNumber);
    }
    return;
  }

  const factoryCompleteButton = target.closest('[data-action="factory-complete-reference"]');
  if (factoryCompleteButton instanceof HTMLButtonElement) {
    const { quoteNumber, referenceNumber } = factoryCompleteButton.dataset;
    if (!quoteNumber || !referenceNumber) {
      return;
    }

    const project = ongoingProjects.find((candidate) => candidate.quoteNumber === quoteNumber);
    const reference = project?.references.find((candidate) => candidate.referenceNumber === referenceNumber);

    if (!project || !reference) {
      return;
    }

    setFactoryStatus(reference, 'Completed');
    project.updatedAt = new Date().toISOString().slice(0, 10);
    renderFactoryQueue();

    if (
      activeFactoryContext?.quoteNumber === quoteNumber
      && activeFactoryContext?.referenceNumber === referenceNumber
    ) {
      openFactoryReferenceDetail(quoteNumber, referenceNumber);
    }
  }
});

factoryAddDiamondRowButton?.addEventListener('click', () => {
  const project = ongoingProjects.find((candidate) => candidate.quoteNumber === activeFactoryContext?.quoteNumber);
  const reference = project?.references.find(
    (candidate) => candidate.referenceNumber === activeFactoryContext?.referenceNumber
  );

  if (!reference) {
    return;
  }

  ensureFactoryDetails(reference);
  reference.factoryDetails.diamondBreakdown.push({
    quantity: '',
    shape: '',
    measurements: '',
    quality: '',
    tcw: '',
    cost: '',
  });

  renderFactoryDiamondBreakdownRows(reference.factoryDetails.diamondBreakdown);
});

function handleFactoryDiamondBreakdownEdit(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLSelectElement)) {
    return;
  }

  const field = target.dataset.diamondField;
  const index = Number(target.dataset.index);

  if (!field || Number.isNaN(index) || !activeFactoryContext) {
    return;
  }

  const project = ongoingProjects.find((candidate) => candidate.quoteNumber === activeFactoryContext.quoteNumber);
  const reference = project?.references.find(
    (candidate) => candidate.referenceNumber === activeFactoryContext.referenceNumber
  );

  if (!reference) {
    return;
  }

  ensureFactoryDetails(reference);
  if (!reference.factoryDetails.diamondBreakdown[index]) {
    return;
  }

  reference.factoryDetails.diamondBreakdown[index][field] = target.value;
  renderFactoryStoneSummary(reference.factoryDetails.diamondBreakdown);
}

factoryDiamondBreakdownBody?.addEventListener('input', handleFactoryDiamondBreakdownEdit);
factoryDiamondBreakdownBody?.addEventListener('change', handleFactoryDiamondBreakdownEdit);

factoryDetailForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!activeFactoryContext) {
    return;
  }

  const project = ongoingProjects.find((candidate) => candidate.quoteNumber === activeFactoryContext.quoteNumber);
  const reference = project?.references.find(
    (candidate) => candidate.referenceNumber === activeFactoryContext.referenceNumber
  );

  if (!project || !reference) {
    return;
  }

  ensureFactoryDetails(reference);

  reference.factoryDetails.goldWeight = factoryGoldWeightInput?.value.trim() || '';
  reference.factoryDetails.totalPrice = factoryTotalPriceInput?.value.trim() || '';
  reference.factoryDetails.finishedMeasurementsCad = factoryFinishedMeasurementsInput?.value.trim() || '';
  reference.factoryDetails.specSheet = factorySpecSheetInput?.value.trim() || '';
  reference.factoryDetails.viewerLink = factoryViewerLinkInput?.value.trim() || '';
  const nextFactoryStatus = factoryStatusInput?.value;
  if (nextFactoryStatus) {
    setFactoryStatus(reference, nextFactoryStatus);
  }

  reference.factoryDetails.fiveAnglesRender = (factoryFiveAnglesRenderInput?.value || '')
    .split(',')
    .map((item, index) => item.trim())
    .filter(Boolean)
    .map((label, index) => ({ label, url: createPlaceholderRenderData(reference.referenceNumber, label || `Angle ${index + 1}`) }));

  syncPricingBreakdownFromFactory(reference);

  project.updatedAt = new Date().toISOString().slice(0, 10);
  renderFactoryQueue();
});

factoryShapeConfigTrigger?.addEventListener('click', () => {
  const isHidden = factoryShapeConfigPanel?.classList.contains('hidden');
  factoryShapeConfigPanel?.classList.toggle('hidden', !isHidden);
  factoryShapeConfigTrigger.setAttribute('aria-expanded', String(isHidden));
  if (isHidden) {
    renderFactoryShapeConfig();
  }
});

factoryShapeConfigClose?.addEventListener('click', () => {
  factoryShapeConfigPanel?.classList.add('hidden');
  factoryShapeConfigTrigger?.setAttribute('aria-expanded', 'false');
});

factoryShapeConfigOptions?.addEventListener('change', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement) || target.type !== 'checkbox') {
    return;
  }

  if (target.checked) {
    selectedShapeOptions.add(target.value);
  } else if (selectedShapeOptions.size > 1) {
    selectedShapeOptions.delete(target.value);
  } else {
    target.checked = true;
  }

  if (!activeFactoryContext) {
    return;
  }

  const project = ongoingProjects.find((candidate) => candidate.quoteNumber === activeFactoryContext.quoteNumber);
  const reference = project?.references.find((candidate) => candidate.referenceNumber === activeFactoryContext.referenceNumber);
  if (!reference) {
    return;
  }

  renderFactoryDiamondBreakdownRows(reference.factoryDetails.diamondBreakdown);
});

discussionForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const { reference, project } = getProjectByContext();
  if (!reference || !project) {
    return;
  }

  const message = discussionInput.value.trim();
  if (!message) {
    return;
  }

  reference.discussion.push({
    author: currentMode === 'admin' ? 'Admin' : accountNames[project.account],
    message,
    timestamp: new Date().toLocaleString(),
  });

  project.updatedAt = new Date().toISOString().slice(0, 10);
  discussionInput.value = '';
  discussionThread.innerHTML = getDiscussionMarkup(reference.discussion);
  renderOngoingProjects();
});

adminDetailForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (currentMode !== 'admin') {
    return;
  }

  const { reference, project } = getProjectByContext();
  if (!reference || !project) {
    return;
  }

  const nextStatus = adminStatusInput?.value;
  const nextAssignedFactory = adminAssignedFactoryInput?.value || '';
  if (nextStatus === 'Assigned' && !nextAssignedFactory) {
    alert('Please select the factory before marking this request as Assigned.');
    adminAssignedFactoryInput?.focus();
    return;
  }
  if (nextStatus) {
    setAdminStatus(reference, nextStatus);
  }
  reference.assignedFactory = nextAssignedFactory;

  const renderingName = adminRenderingName.value.trim();
  if (renderingName) {
    reference.adminRenderings.push(renderingName);
    adminRenderingName.value = '';
  }

  reference.designBrief.styleSku = adminStyleSkuInput?.value.trim() || '';
  reference.designBrief.metal = adminMetalInput?.value.trim() || reference.designBrief.metal;
  reference.designBrief.size = adminSizeInput?.value.trim() || '';
  reference.designBrief.stoneDescription = adminStoneDescriptionInput?.value.trim() || '';
  reference.designBrief.instructions = adminInstructionsInput?.value.trim() || reference.designBrief.instructions;
  reference.designBrief.needToProvide = {
    renderings: Boolean(adminNeedRenderingsInput?.checked),
    viewer3d: Boolean(adminNeedViewerInput?.checked),
  };

  reference.pricing.estimatedTotal = adminPricingTotal.value.trim() || reference.pricing.estimatedTotal;
  reference.pricing.unitBreakdown = adminPricingBreakdown.value.trim() || reference.pricing.unitBreakdown;
  reference.pricing.timeline = adminPricingTimeline.value.trim() || reference.pricing.timeline;

  const adminMessage = adminMessageInput.value.trim();
  if (adminMessage) {
    reference.discussion.push({
      author: 'Design Team',
      message: adminMessage,
      timestamp: new Date().toLocaleString(),
    });
    adminMessageInput.value = '';
  }

  project.updatedAt = new Date().toISOString().slice(0, 10);

  versionPricing.innerHTML = `
    <p><strong>Estimated Total:</strong> ${reference.pricing.estimatedTotal}</p>
    <p><strong>Breakdown:</strong> ${reference.pricing.unitBreakdown}</p>
    <p><strong>Timeline:</strong> ${reference.pricing.timeline}</p>
  `;

  renderDesignBriefFields(designBriefFields, getDesignBriefEntries(reference, true, accountNames[project.account]));
  renderDesignBriefFields(adminDesignBriefFields, getDesignBriefEntries(reference));

  renderOngoingProjects();
  renderAdminQueue();
  renderFactoryQueue();
  renderAdminAssets(reference);
  if (adminConversationThread) {
    adminConversationThread.innerHTML = getDiscussionMarkup(reference.discussion);
  }
});

adminStatusInput?.addEventListener('change', () => {
  const { reference } = getProjectByContext();
  syncAssignedFactoryField(adminStatusInput.value, reference?.assignedFactory || '');
});

backToProjectsButton?.addEventListener('click', () => {
  setPage('projects');
});

projectFiltersForm?.addEventListener('submit', (event) => {
  event.preventDefault();
});

projectSearchInput?.addEventListener('input', () => {
  projectFilterState.search = projectSearchInput.value;
  renderOngoingProjects();
});

projectStatusFilter?.addEventListener('change', () => {
  projectFilterState.status = projectStatusFilter.value;
  renderOngoingProjects();
});

clearProjectFiltersButton?.addEventListener('click', () => {
  projectFilterState.search = '';
  projectFilterState.status = '';

  if (projectSearchInput) {
    projectSearchInput.value = '';
  }

  if (projectStatusFilter) {
    projectStatusFilter.value = '';
  }

  renderOngoingProjects();
});


factoryFiltersForm?.addEventListener('submit', (event) => {
  event.preventDefault();
});

factorySearchInput?.addEventListener('input', () => {
  factoryFilterState.search = factorySearchInput.value;
  renderFactoryQueue();
});

factoryStatusFilter?.addEventListener('change', () => {
  factoryFilterState.status = factoryStatusFilter.value;
  renderFactoryQueue();
});

ongoingProjects.forEach((project) => project.references.forEach((reference) => ensureReferenceStatuses(reference)));

createVersionCard();
renderFactoryShapeConfig();
setMode('account1');
setPage('home');
renderOngoingProjects();
renderAdminQueue();
renderFactoryQueue();
