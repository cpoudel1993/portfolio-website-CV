# Live Dashboard Setup Guide

## Overview

Your portfolio now has a comprehensive live dashboard with real-time updates using Supabase. The dashboard allows you to manage all your portfolio content with instant live synchronization across all connected clients.

## Features

✅ **Real-time Updates** - Changes appear instantly across all tabs and devices
✅ **Live CRUD Operations** - Create, Read, Update, Delete all your portfolio content
✅ **Multiple Data Types** - Manage Projects, Experiences, Certifications, Blog Posts, and Messages
✅ **Responsive Design** - Works seamlessly on desktop and mobile devices
✅ **Database Integration** - All data persists in Supabase with Row Level Security (RLS)

## Architecture

### Database Tables
- **projects** - Your portfolio projects with technologies, links, and status
- **experiences** - Work experience with timeline and responsibilities
- **certifications** - Professional certifications and learning achievements
- **blog_posts** - Blog articles with slug, excerpt, and tags
- **messages** - Contact form submissions with read/archive status
- **profiles** - User profile information
- **analytics** - Page view tracking
- **settings** - Configuration settings

### Real-time Subscriptions

The dashboard uses Supabase's PostgreSQL Changes (postgres_changes) feature to listen to database events:
- **INSERT** - New items automatically appear at the top
- **UPDATE** - Changes are reflected instantly
- **DELETE** - Removed items disappear immediately

## How It Works

### 1. Initial Data Load
```typescript
// Loads all data from database on page load
const [projects, setProjects] = useState<Project[]>([])
await loadAllData() // Fetches all tables in parallel
```

### 2. Real-time Subscription
```typescript
// useRealtimeData hook handles subscription
useRealtimeData('projects', projects, setProjects)

// Listens for postgres_changes events on the projects table
// Updates local state when changes occur
```

### 3. CRUD Operations
```typescript
// Create
await createProject({ title, description, ... })

// Update
await updateProject(id, { title: 'New Title' })

// Delete
await deleteProject(id)
```

## File Structure

```
app/protected/
├── dashboard/
│   └── page.tsx                    # Main dashboard page
components/dashboard/
├── projects-table.tsx              # Projects management
├── project-form.tsx                # Project creation/editing
├── experiences-table.tsx           # Experiences management
├── certifications-table.tsx        # Certifications management
├── blog-posts-table.tsx            # Blog posts management
└── messages-table.tsx              # Messages management
hooks/
└── useRealtimeData.ts              # Real-time subscription hook
lib/
└── db.ts                           # Database utility functions
