# Dashboard UI Guide

## Visual Layout

### Main Dashboard Page

```
┌────────────────────────────────────────────────────────────────────┐
│                      LIVE DASHBOARD                                │
│  Manage all your portfolio content with live updates               │
└────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│ [Projects (5)] [Experiences (3)] [Certifications (8)] [Blog (12)]   │
│ [Messages (2)]                                                        │
└──────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  [+ Add Project]                                                   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  Title                  │ Technologies │ Status │ Featured   │  │
│  ├─────────────────────────────────────────────────────────────┤  │
│  │ E-commerce Platform    │ React, Node  │Published │ ✓        │  │
│  │ Full-stack e-commerce  │ +2 more      │          │          │  │
│  ├─────────────────────────────────────────────────────────────┤  │
│  │ Portfolio Website      │ Next.js      │ Draft   │         │  │
│  │ Personal portfolio     │              │          │          │  │
│  ├─────────────────────────────────────────────────────────────┤  │
│  │ ...more items...                                            │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  [✏️] [🗑️]  ...  [✏️] [🗑️]  ...                                    │
│                                                                      │
└────────────────────────────────────────────────────────────────────┘
```

## Projects Tab Layout

### Table View
```
┌──────────────────────────────────────────────────────────────────┐
│                                                                    │
│  [+ Add Project]                                                 │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Title              Technologies   Status      Featured       │ │
│  ├────────────────────────────────────────────────────────────┤ │
│  │ Project Name       React, TS     [Published]  [☐]        [✏️] [🗑️]
│  │ Short description  +1 more                                 │ │
│  ├────────────────────────────────────────────────────────────┤ │
│  │ Another Project    Next.js        [Draft]     [☑]        [✏️] [🗑️]
│  └────────────────────────────────────────────────────────────┘ │
│                                                                    │
└──────────────────────────────────────────────────────────────────┘
```

### Add Project Form
```
┌────────────────────────────────────────────────────────────┐
│                                                              │
│  Title *                                  Status            │
│  [_____________________________]        [Published    ▼]    │
│                                                              │
│  Description                                                │
│  [_________________________________________________________]│
│  [_________________________________________________________]│
│                                                              │
│  Image URL                    Technologies                 │
│  [_____________________]    [React, TS, Tailwind]          │
│                                                              │
│  Live URL                     GitHub URL                    │
│  [_____________________]    [_____________________]         │
│                                                              │
│  [☐] Mark as featured                                       │
│                                                              │
│  [Create Project]                                           │
│                                                              │
└────────────────────────────────────────────────────────────┘
```

## Experiences Tab Layout

### Card View
```
┌────────────────────────────────────────────────────────────┐
│                                                              │
│  [+ Add Experience]                                        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Software Engineer at Tech Company         [✏️] [🗑️]  │ │
│  │                                                        │ │
│  │ Start Date: Jan 2020    End Date: Current    Location │ │
│  │ Status: [Published]                                   │ │
│  │                                                        │ │
│  │ Led development of microservices architecture...      │ │
│  │                                                        │ │
│  │ Responsibilities:                                      │ │
│  │ • Designed REST APIs                                  │ │
│  │ • Mentored junior developers                          │ │
│  │ +1 more                                               │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Project Manager at Company       [✏️] [🗑️]           │ │
│  │ ...                                                    │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                              │
└────────────────────────────────────────────────────────────┘
```

## Certifications Tab Layout

### Grid View
```
┌────────────────────────────────────────────────────────────┐
│                                                              │
│  [+ Add Certification]                                     │
│                                                              │
│  ┌──────────────────────────┬──────────────────────────┐  │
│  │ AWS Solutions Architect  │ JavaScript Advanced    │  │
│  │ Amazon Web Services      │ Udemy                  │  │
│  │ Certificate              │ Course                 │  │
│  │ Earned: Jan 2023         │ Earned: May 2022       │  │
│  │ Skills: AWS, EC2, S3     │ Skills: JS, React      │  │
│  │ [✏️] [🗑️]               │ [✏️] [🗑️]             │  │
│  │ [Verify] [PDF]           │ [Verify] [PDF]         │  │
│  └──────────────────────────┴──────────────────────────┘  │
│                                                              │
│  ...more certifications...                                 │
│                                                              │
└────────────────────────────────────────────────────────────┘
```

## Blog Posts Tab Layout

### Table View
```
┌──────────────────────────────────────────────────────────────┐
│                                                                │
│  [+ Add Blog Post]                                            │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Title            Slug            Status      Published │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ Getting Started  getting-started [Published] Jan 2024 [✏️] [🗑️]
│  │ With Next.js 16                                          │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ React Best      react-patterns  [Draft]     Not Yet   [✏️] [🗑️]
│  │ Practices                                               │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

## Messages Tab Layout

### Expandable List View
```
┌──────────────────────────────────────────────────────────────┐
│                                                                │
│  Unread: 3  │  Total: 15                                     │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ ● John Smith                           [📧] [📦] [🗑️]  │ │
│  │   john@example.com                                      │ │
│  │   Subject: Project Inquiry                              │ │
│  │   Received: 2024-04-05 10:30 AM                         │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Jane Doe                                [📧] [📦] [🗑️]  │ │
│  │   jane@example.com                                      │ │
│  │   Subject: Collaboration Opportunity                    │ │
│  │   Received: 2024-04-04 03:15 PM                         │ │
│  │                                                           │ │
│  │ ╔════════════════════════════════════════════════════╗ │ │
│  │ ║ Hi Chiranjivi,                                    ║ │ │
│  │ ║                                                    ║ │ │
│  │ ║ I'm interested in collaborating on a project...   ║ │ │
│  │ ║                                                    ║ │ │
│  │ ║ Best regards,                                     ║ │ │
│  │ ║ Jane                                              ║ │ │
│  │ ╚════════════════════════════════════════════════════╝ │ │
│  │                                                           │ │
│  │ Replied: None                                            │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

## Color Scheme

### Light Mode
```
Background:       #f8f8f8 (Almost white)
Card:            #ffffff (White)
Foreground:      #242424 (Near black)
Primary:         #5e4aab (Purple)
Secondary:       #f3f3f3 (Light gray)
Muted:           #f5f5f5 (Very light gray)
Border:          #e8e8e8 (Light border)
Success:         Green for published
Warning:         Yellow for draft
Error:           Red for archived/delete
```

### Dark Mode
```
Background:      #1a1a2e (Dark blue)
Card:            #282d45 (Darker blue)
Foreground:      #e8e8e8 (Light text)
Primary:         #a79df5 (Light purple)
Secondary:       #3a3f5c (Muted dark)
Muted:           #2a2f47 (Darker muted)
Border:          #3a3f5c (Dark border)
```

## Interactive Elements

### Buttons
```
Primary Button (Actions)
┌──────────────────────┐
│ + Add Project        │  Blue background, white text
└──────────────────────┘

Secondary Button (Alternatives)
┌──────────────────────┐
│ Cancel               │  Gray background, dark text
└──────────────────────┘

Icon Buttons (Quick Actions)
[✏️] Edit    [🗑️] Delete    [📧] Read    [📦] Archive
```

### Status Badges
```
Published    [Green background, green text]
Draft        [Yellow background, yellow text]
Archived     [Red background, red text]
```

### Checkboxes
```
☐ Unchecked (Featured)
☑ Checked (Featured)
```

## Responsive Breakpoints

### Mobile (< 768px)
- Single column layout
- Stacked forms
- Hamburger menu for sidebar
- Touch-friendly buttons

### Tablet (768px - 1024px)
- 2 column layout where appropriate
- Larger touch targets
- Optimized spacing

### Desktop (> 1024px)
- Full multi-column layouts
- Hover effects on buttons
- Sidebar always visible
- Expanded form fields

## Accessibility Features

✅ Keyboard Navigation
- Tab through all form fields
- Enter to submit
- Escape to close modals

✅ Screen Reader Support
- Alt text for all images
- Proper heading hierarchy
- Form labels associated with inputs
- ARIA labels where needed

✅ Color Contrast
- All text meets WCAG AA standards
- Icons paired with text
- Color not sole indicator

✅ Focus Indicators
- Clear focus rings on all interactive elements
- Visual feedback on interactions

## Animations & Transitions

- Smooth tab switching (200ms)
- Fade in/out on load/delete
- Hover effects on buttons
- Disabled state styling

---

## Tips for Best Experience

1. **Use Full Width** - Maximize browser window for best layout
2. **Mobile Friendly** - Works great on phones too
3. **Dark Mode** - Toggle in settings for night work
4. **Keyboard Shortcuts** - Tab through, Enter to submit
5. **Real-time Watch** - Open two windows side-by-side

---

All UI follows **Tailwind CSS v4** with design tokens for consistency and theming support.
