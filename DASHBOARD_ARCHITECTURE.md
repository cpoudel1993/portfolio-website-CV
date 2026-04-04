# Dashboard Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js)                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Dashboard Page (/protected/dashboard)      │  │
│  │                                                        │  │
│  │  [Projects] [Experiences] [Certs] [Blog] [Messages]  │  │
│  └──────────────────────────────────────────────────────┘  │
│                              │                               │
│         ┌────────────────────┼────────────────────┐         │
│         ▼                    ▼                    ▼         │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐  │
│  │Projects     │     │Experiences  │     │Certifications│ │
│  │Table        │     │Table        │     │Table        │  │
│  │+ Form       │     │+ Form       │     │+ Form       │  │
│  └─────────────┘     └─────────────┘     └─────────────┘  │
│         │                    │                    │         │
│         └────────────────────┼────────────────────┘         │
│                              │                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │        useRealtimeData Hook (Real-time Updates)     │  │
│  │  - Listens to postgres_changes events              │  │
│  │  - Updates local state automatically               │  │
│  │  - Handles INSERT, UPDATE, DELETE                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                              │                               │
└──────────────────────────────┼───────────────────────────────┘
                               │
                               │ HTTP/WebSocket
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              SUPABASE CLIENT (@supabase/supabase-js)        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Database Operations:              Real-time Channel:       │
│  - Insert                          - Subscribe to events    │
│  - Select                          - Listen for changes     │
│  - Update                          - Broadcast updates      │
│  - Delete                                                   │
│  - RLS Policies                                             │
│                                                               │
└──────────────────────────────────────────────────────────────┘
                               │
                               │ PostgREST API / Real-time
                               ▼
┌──────────────────────────────────────────────────────────────┐
│           SUPABASE BACKEND (PostgreSQL Database)             │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  Tables:                      Real-time Subscriptions:       │
│  ├─ projects                  ├─ supabase_realtime          │
│  ├─ experiences               │  (postgres_changes)          │
│  ├─ certifications            │  - INSERT events            │
│  ├─ blog_posts                │  - UPDATE events            │
│  ├─ messages                  │  - DELETE events            │
│  ├─ profiles                  │                              │
│  ├─ analytics                 Row Level Security (RLS):     │
│  └─ settings                  ├─ User-owned data            │
│                               ├─ Auto-filtering             │
│  Features:                    ├─ Secure by default          │
│  ├─ Foreign Keys              └─ No SQL injection           │
│  ├─ Indexes                                                  │
│  ├─ Triggers                                                 │
│  └─ Constraints                                              │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

## Data Flow for CRUD Operations

### CREATE (Adding New Item)
```
User clicks "+ Add Project"
    ↓
Form appears with input fields
    ↓
User fills out and submits form
    ↓
createProject() in lib/db.ts
    ↓
supabase.from('projects').insert([projectData])
    ↓
Server validates and stores in database
    ↓
PostgreSQL publishes INSERT event
    ↓
Real-time subscription receives event
    ↓
useRealtimeData hook updates local state
    ↓
Component re-renders with new item at top of list ✓
```

### READ (Loading Data)
```
Dashboard page loads
    ↓
loadAllData() called
    ↓
Promise.all([
  getProjects(),
  getExperiences(),
  getCertifications(),
  getBlogPosts(),
  getMessages()
])
    ↓
All tables fetched in parallel
    ↓
State updated with data
    ↓
Tables render with items ✓
```

### UPDATE (Editing Item)
```
User clicks edit button
    ↓
updateProject(id, updates)
    ↓
supabase.from('projects').update(updates).eq('id', id)
    ↓
Server updates record in database
    ↓
PostgreSQL publishes UPDATE event
    ↓
Real-time subscription receives event
    ↓
useRealtimeData hook updates local state
    ↓
Component re-renders with updated values ✓
```

### DELETE (Removing Item)
```
User clicks delete button
    ↓
Confirmation dialog appears
    ↓
User confirms deletion
    ↓
deleteProject(id)
    ↓
supabase.from('projects').delete().eq('id', id)
    ↓
Server removes record from database
    ↓
PostgreSQL publishes DELETE event
    ↓
Real-time subscription receives event
    ↓
useRealtimeData hook removes from local state
    ↓
Component re-renders without deleted item ✓
```

## Real-time Synchronization

### Multi-Device Synchronization
```
Device A (Desktop)              Device B (Phone)
└─ Dashboard Open              └─ Dashboard Open
   │                              │
   └─ Supabase Client            └─ Supabase Client
      │                             │
      └──────────────┬─────────────┘
                     │
              Shared Database
              PostgreSQL
                     │
      ┌──────────────┴─────────────┐
      │                            │
   Device A                    Device B
   Real-time Channel         Real-time Channel
   Receives: UPDATE              Receives: UPDATE
   Updates: Local State          Updates: Local State
   Re-renders: List              Re-renders: List
   Result: INSTANT SYNC ✓
```

## Component Hierarchy

```
/protected/dashboard
│
├─ ProjectsTable
│  ├─ ProjectForm (create/edit)
│  └─ Item rows (view/edit/delete)
│
├─ ExperiencesTable
│  ├─ ExperienceForm (create/edit)
│  └─ Item cards (view/edit/delete)
│
├─ CertificationsTable
│  ├─ CertificationForm (create/edit)
│  └─ Item cards (view/edit/delete)
│
├─ BlogPostsTable
│  ├─ BlogPostForm (create/edit)
│  └─ Item rows (view/edit/delete)
│
└─ MessagesTable
   ├─ Message list (expandable)
   └─ Message actions (read/archive/delete)
```

## State Management Flow

```
Dashboard Page State:
├─ userId (from auth)
├─ activeTab (which section)
├─ projects (from Supabase)
├─ experiences (from Supabase)
├─ certifications (from Supabase)
├─ blogPosts (from Supabase)
├─ messages (from Supabase)
└─ isLoading (initial load)
    │
    └─ useRealtimeData Hook
       └─ Subscribes to postgres_changes
          └─ Updates parent state on events
             └─ Components re-render with new data
```

## Security Architecture

```
Supabase Authentication
├─ User logs in with email/password
└─ Session created with JWT token
   │
   └─ JWT included in all requests
      │
      └─ Database Row Level Security (RLS)
         │
         ├─ Projects: auth.uid() = user_id ✓
         ├─ Experiences: auth.uid() = user_id ✓
         ├─ Certifications: auth.uid() = user_id ✓
         ├─ Blog Posts: auth.uid() = user_id ✓
         ├─ Messages: auth.role() = 'authenticated' ✓
         └─ Settings: auth.uid() = user_id ✓
            │
            └─ Result: Users can ONLY see their own data
               No SQL injection possible
               No privilege escalation
```

## Performance Optimizations

### Database Level
```
Indexes Created:
├─ projects(user_id) - Fast user filtering
├─ projects(status) - Fast status filtering
├─ experiences(user_id) - Fast retrieval
├─ certifications(user_id) - Fast retrieval
├─ blog_posts(user_id) - Fast retrieval
├─ blog_posts(slug) - Unique constraint
├─ messages(is_read) - Fast unread filtering
└─ analytics(created_at) - Time-based queries
```

### Frontend Level
```
Parallel Loading:
└─ Promise.all([
   getProjects(),
   getExperiences(),
   getCertifications(),
   getBlogPosts(),
   getMessages()
]) - All load simultaneously

Real-time Efficiency:
└─ Only changed items trigger re-renders
   Non-affected components stay stable
   No full page refreshes needed
```

## Error Handling & Resilience

```
Network Error
    │
    ├─ Retry mechanism in Supabase client
    ├─ Graceful error messages to user
    ├─ Console logging for debugging
    └─ State remains consistent

Validation Error
    │
    ├─ Field validation in forms
    ├─ Database constraint checks
    ├─ Error messages displayed
    └─ User prompted to fix

Permission Error (RLS)
    │
    ├─ User can't access other's data
    ├─ Query returns empty/permission error
    ├─ User stays in dashboard
    └─ No sensitive data exposed
```

---

This architecture ensures:
- ✅ Real-time data synchronization
- ✅ Secure data isolation (RLS)
- ✅ Instant UI updates
- ✅ Optimal performance
- ✅ No SQL injection risks
- ✅ Seamless multi-device experience
