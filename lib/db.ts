import { createClient } from '@/lib/supabase/client'

export interface Project {
  id: string
  user_id: string
  title: string
  description: string | null
  image_url: string | null
  technologies: string[] | null
  live_url: string | null
  github_url: string | null
  featured: boolean
  status: 'draft' | 'published' | 'archived'
  created_at: string
  updated_at: string
}

export interface Experience {
  id: string
  user_id: string
  company: string
  position: string
  location: string | null
  start_date: string
  end_date: string | null
  description: string | null
  responsibilities: string[] | null
  is_current: boolean
  status: 'draft' | 'published' | 'archived'
  created_at: string
  updated_at: string
}

export interface Certification {
  id: string
  user_id: string
  title: string
  platform: string
  type: string | null
  date_earned: string | null
  duration: string | null
  skills: string[] | null
  cert_id: string | null
  pdf_url: string | null
  verify_url: string | null
  status: 'draft' | 'published' | 'archived'
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: string
  user_id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  cover_image: string | null
  tags: string[] | null
  status: 'draft' | 'published' | 'archived'
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  is_read: boolean
  is_archived: boolean
  replied_at: string | null
  created_at: string
}

// Projects
export async function getProjects() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as Project[]
}

export async function createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select()
  
  if (error) throw error
  return data[0] as Project
}

export async function updateProject(id: string, updates: Partial<Project>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0] as Project
}

export async function deleteProject(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('projects').delete().eq('id', id)
  
  if (error) throw error
}

// Experiences
export async function getExperiences() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .order('start_date', { ascending: false })
  
  if (error) throw error
  return data as Experience[]
}

export async function createExperience(experience: Omit<Experience, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('experiences')
    .insert([experience])
    .select()
  
  if (error) throw error
  return data[0] as Experience
}

export async function updateExperience(id: string, updates: Partial<Experience>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('experiences')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0] as Experience
}

export async function deleteExperience(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('experiences').delete().eq('id', id)
  
  if (error) throw error
}

// Certifications
export async function getCertifications() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('certifications')
    .select('*')
    .order('date_earned', { ascending: false })
  
  if (error) throw error
  return data as Certification[]
}

export async function createCertification(cert: Omit<Certification, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('certifications')
    .insert([cert])
    .select()
  
  if (error) throw error
  return data[0] as Certification
}

export async function updateCertification(id: string, updates: Partial<Certification>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('certifications')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0] as Certification
}

export async function deleteCertification(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('certifications').delete().eq('id', id)
  
  if (error) throw error
}

// Blog Posts
export async function getBlogPosts() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as BlogPost[]
}

export async function createBlogPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([post])
    .select()
  
  if (error) throw error
  return data[0] as BlogPost
}

export async function updateBlogPost(id: string, updates: Partial<BlogPost>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0] as BlogPost
}

export async function deleteBlogPost(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('blog_posts').delete().eq('id', id)
  
  if (error) throw error
}

// Messages
export async function getMessages() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as Message[]
}

export async function updateMessage(id: string, updates: Partial<Message>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('messages')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0] as Message
}

export async function deleteMessage(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('messages').delete().eq('id', id)
  
  if (error) throw error
}
