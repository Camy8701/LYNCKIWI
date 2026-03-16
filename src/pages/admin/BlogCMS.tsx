// KYSS Vision — Admin Blog CMS (US-060)
import { useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { Loader2, Plus, Edit, Trash2, Eye } from "lucide-react"
import AdminLayout from "@/components/AdminLayout"
import { supabase } from "@/integrations/supabase/client"

type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  published: boolean
  created_at: string
}

export default function BlogCMS() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", content: "", published: false })
  const [saving, setSaving] = useState(false)

  const fetchPosts = async () => {
    const { data } = await supabase.from("blog_posts").select("id,title,slug,excerpt,published,created_at").order("created_at", { ascending: false })
    setPosts((data as BlogPost[]) || [])
    setLoading(false)
  }

  useEffect(() => { fetchPosts() }, [])

  const handleSave = async () => {
    setSaving(true)
    await supabase.from("blog_posts").insert([{ ...form }])
    await fetchPosts()
    setShowForm(false)
    setForm({ title: "", slug: "", excerpt: "", content: "", published: false })
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return
    await supabase.from("blog_posts").delete().eq("id", id)
    setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  const handleTogglePublish = async (id: string, current: boolean) => {
    await supabase.from("blog_posts").update({ published: !current }).eq("id", id)
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, published: !current } : p))
  }

  return (
    <>
      <Helmet><title>Blog CMS — Admin | KYSS Vision</title></Helmet>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Blog CMS</h1>
              <p className="text-muted-foreground text-sm mt-1">Manage KYSS blog posts.</p>
            </div>
            <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
              <Plus className="w-4 h-4" /> New Post
            </button>
          </div>

          {showForm && (
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-foreground">New Blog Post</h2>
              {[
                { key: "title", label: "Title", type: "text", placeholder: "Post title" },
                { key: "slug", label: "Slug", type: "text", placeholder: "post-url-slug" },
                { key: "excerpt", label: "Excerpt", type: "text", placeholder: "Short summary..." },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
                  <input type={f.type} value={(form as any)[f.key]} onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))} placeholder={f.placeholder} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              ))}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Content (Markdown)</label>
                <textarea value={form.content} onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))} rows={8} placeholder="Write your post in Markdown..." className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="published" checked={form.published} onChange={(e) => setForm((prev) => ({ ...prev, published: e.target.checked }))} className="rounded" />
                <label htmlFor="published" className="text-sm text-foreground">Publish immediately</label>
              </div>
              <div className="flex gap-3">
                <button onClick={handleSave} disabled={saving || !form.title || !form.slug} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors">
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null} Save Post
                </button>
                <button onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-border text-foreground rounded-lg text-sm hover:bg-muted transition-colors">Cancel</button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : posts.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-10 text-center">
              <p className="text-muted-foreground">No blog posts yet. Create your first post.</p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    {["Title", "Slug", "Status", "Created", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                      <td className="px-4 py-3 font-medium text-foreground">{post.title}</td>
                      <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{post.slug}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleTogglePublish(post.id, post.published)} className={`px-2 py-0.5 rounded-full text-xs font-medium ${post.published ? "bg-green-400/10 text-green-400" : "bg-muted text-muted-foreground"}`}>
                          {post.published ? "Published" : "Draft"}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(post.created_at).toLocaleDateString("en-NZ")}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="text-muted-foreground hover:text-foreground"><Eye className="w-4 h-4" /></button>
                          <button className="text-muted-foreground hover:text-foreground"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(post.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  )
}
