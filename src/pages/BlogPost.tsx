import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LiveChat } from '@/components/chat/LiveChat';
import { ArrowLeft, Calendar, Clock, User, Share2, Twitter, Linkedin, Facebook, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  category: string;
  author_name: string;
  author_image: string | null;
  read_time: number;
  created_at: string;
}

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string | null;
  category: string;
  read_time: number;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) return;

      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();

      if (!error && data) {
        setPost(data);

        // Fetch related posts from same category
        const { data: related } = await supabase
          .from('blog_posts')
          .select('id, title, slug, excerpt, cover_image, category, read_time')
          .eq('published', true)
          .eq('category', data.category)
          .neq('id', data.id)
          .limit(3);

        if (related) {
          setRelatedPosts(related);
        }
      }
      setLoading(false);
    }

    fetchPost();
  }, [slug]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(post?.title || '');

  // Simple markdown-like rendering for content
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let currentList: string[] = [];
    let listType: 'ul' | 'ol' | 'checklist' | null = null;

    const flushList = () => {
      if (currentList.length > 0 && listType) {
        if (listType === 'checklist') {
          elements.push(
            <ul key={elements.length} className="space-y-2 my-4">
              {currentList.map((item, i) => {
                const isChecked = item.startsWith('[x]');
                const text = item.replace(/^\[[ x]\] /, '');
                return (
                  <li key={i} className="flex items-start gap-2 text-muted-foreground">
                    <input type="checkbox" checked={isChecked} readOnly className="mt-1" />
                    {text}
                  </li>
                );
              })}
            </ul>
          );
        } else {
          const ListTag = listType === 'ol' ? 'ol' : 'ul';
          elements.push(
            <ListTag key={elements.length} className={`${listType === 'ol' ? 'list-decimal' : 'list-disc'} list-inside space-y-2 my-4 text-muted-foreground`}>
              {currentList.map((item, i) => <li key={i}>{item}</li>)}
            </ListTag>
          );
        }
        currentList = [];
        listType = null;
      }
    };

    lines.forEach((line, index) => {
      // Headers
      if (line.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={index} className="text-2xl font-bold text-foreground mt-8 mb-4">
            {line.replace('## ', '')}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={index} className="text-xl font-semibold text-foreground mt-6 mb-3">
            {line.replace('### ', '')}
          </h3>
        );
      }
      // Checklist items
      else if (line.match(/^- \[[ x]\]/)) {
        if (listType !== 'checklist') {
          flushList();
          listType = 'checklist';
        }
        currentList.push(line.replace(/^- /, ''));
      }
      // Unordered list items
      else if (line.startsWith('- ')) {
        if (listType !== 'ul') {
          flushList();
          listType = 'ul';
        }
        currentList.push(line.replace('- ', ''));
      }
      // Ordered list items
      else if (line.match(/^\d+\. /)) {
        if (listType !== 'ol') {
          flushList();
          listType = 'ol';
        }
        currentList.push(line.replace(/^\d+\. /, ''));
      }
      // Bold text handling and paragraphs
      else if (line.trim()) {
        flushList();
        // Process bold text
        const processedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
        elements.push(
          <p 
            key={index} 
            className="text-muted-foreground leading-relaxed my-4"
            dangerouslySetInnerHTML={{ __html: processedLine }}
          />
        );
      }
    });

    flushList();
    return elements;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="h-8 w-48 bg-muted rounded animate-pulse mb-4" />
              <div className="h-12 bg-muted rounded animate-pulse mb-4" />
              <div className="h-64 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/blog">Back to Blog</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Article Header */}
        <section className="py-12 lg:py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>
              
              <Badge variant="secondary" className="mb-4">{post.category}</Badge>
              
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl leading-tight">
                {post.title}
              </h1>
              
              <p className="mt-6 text-lg text-muted-foreground">
                {post.excerpt}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                    {post.author_image ? (
                      <img src={post.author_image} alt={post.author_name} className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <User className="h-5 w-5 text-accent-foreground" />
                    )}
                  </div>
                  <span className="font-medium text-foreground">{post.author_name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(post.created_at), 'MMMM d, yyyy')}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.read_time} min read
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cover Image */}
        {post.cover_image && (
          <div className="container mx-auto px-4 -mt-4">
            <div className="max-w-4xl mx-auto">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full rounded-xl shadow-soft aspect-video object-cover"
              />
            </div>
          </div>
        )}

        {/* Article Content */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <article className="prose prose-lg max-w-none">
                {renderContent(post.content)}
              </article>

              {/* Share */}
              <Separator className="my-12" />
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Share2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Share this article</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" asChild>
                    <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`} target="_blank" rel="noopener noreferrer">
                      <Twitter className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer">
                      <Facebook className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" onClick={copyLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-12 lg:py-16 bg-card">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl font-bold text-foreground mb-8">Related Articles</h2>
                <div className="grid gap-6 md:grid-cols-3">
                  {relatedPosts.map((related) => (
                    <Link key={related.id} to={`/blog/${related.slug}`}>
                      <Card className="group h-full overflow-hidden border-border bg-background transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={related.cover_image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'}
                            alt={related.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <CardContent className="p-4">
                          <Badge variant="secondary" className="mb-2 text-xs">{related.category}</Badge>
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 text-sm">
                            {related.title}
                          </h3>
                          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {related.read_time} min read
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <LiveChat />
    </div>
  );
}
