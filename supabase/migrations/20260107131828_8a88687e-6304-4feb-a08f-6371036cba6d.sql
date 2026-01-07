-- Create blog posts table
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT,
  category TEXT NOT NULL,
  author_name TEXT NOT NULL DEFAULT 'DevForge Team',
  author_image TEXT,
  published BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  read_time INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Public read access for published posts only
CREATE POLICY "Published blog posts are viewable by everyone" 
ON public.blog_posts FOR SELECT USING (published = true);

-- Insert sample blog posts
INSERT INTO public.blog_posts (title, slug, excerpt, content, cover_image, category, author_name, published, featured, read_time) VALUES
('The Ultimate Guide to E-Commerce Success in 2024', 'ecommerce-success-guide-2024', 'Learn the strategies and tactics that successful e-commerce businesses are using to thrive in the competitive online marketplace.', '## Introduction

E-commerce continues to evolve at a rapid pace. In this comprehensive guide, we''ll explore the key strategies that are driving success for online businesses in 2024.

## 1. Mobile-First Design

With over 70% of e-commerce traffic coming from mobile devices, having a mobile-optimized store is no longer optional. Here''s what you need to focus on:

- Fast loading times (under 3 seconds)
- Easy navigation with thumb-friendly buttons
- Simplified checkout process
- Progressive Web App (PWA) features

## 2. Personalization at Scale

Customers expect personalized experiences. Use AI and machine learning to:

- Recommend products based on browsing history
- Personalize email marketing campaigns
- Create dynamic landing pages
- Offer personalized discounts

## 3. Omnichannel Presence

Be where your customers are:

- Social commerce on Instagram and TikTok
- Marketplace presence (Amazon, eBay)
- Physical pop-up experiences
- Unified inventory management

## Conclusion

Success in e-commerce requires a holistic approach. Focus on customer experience, leverage technology, and stay adaptable to changing trends.', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200', 'E-Commerce', 'Sarah Chen', true, true, 8),

('Why Your Business Needs a Custom Website in 2024', 'custom-website-benefits-2024', 'Discover why template websites are holding your business back and how a custom solution can drive growth and conversions.', '## The Template Trap

While website templates seem like a cost-effective solution, they often limit your business potential. Let''s explore why custom websites are worth the investment.

## Stand Out From Competition

Generic templates mean generic experiences. A custom website allows you to:

- Create unique brand experiences
- Implement custom functionality
- Optimize for your specific audience
- Build trust through professional design

## Performance Matters

Custom websites can be optimized for:

- Faster loading speeds
- Better SEO performance
- Improved user experience
- Higher conversion rates

## Scalability

As your business grows, your website should too. Custom solutions offer:

- Flexible architecture
- Easy integration with new tools
- Custom feature development
- Future-proof technology stack

## The ROI of Custom Development

While the initial investment is higher, custom websites typically deliver:

- 40% higher conversion rates
- 60% lower bounce rates
- Better brand perception
- Long-term cost savings

## Conclusion

Investing in a custom website is investing in your business''s future. The right development partner can help you create a digital experience that drives real results.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200', 'Web Development', 'Michael Torres', true, true, 6),

('Shopify vs WooCommerce: Which Platform is Right for You?', 'shopify-vs-woocommerce-2024', 'A comprehensive comparison of the two leading e-commerce platforms to help you make the right choice for your online store.', '## The Great E-Commerce Debate

Choosing between Shopify and WooCommerce is one of the most important decisions you''ll make for your online store. Let''s break down the key differences.

## Ease of Use

**Shopify:** 
- Fully hosted solution
- User-friendly dashboard
- Quick setup (hours, not days)
- Built-in support

**WooCommerce:**
- Requires WordPress knowledge
- More technical setup
- Greater learning curve
- Self-managed hosting

## Customization

**Shopify:**
- Theme-based customization
- Limited code access
- App marketplace for features

**WooCommerce:**
- Unlimited customization
- Full code access
- Thousands of plugins

## Pricing

**Shopify:** $29-$299/month + transaction fees
**WooCommerce:** Free plugin + hosting ($10-$100/month) + extensions

## Our Recommendation

- Choose **Shopify** if you want simplicity and quick launch
- Choose **WooCommerce** if you need full control and customization

## Conclusion

Both platforms can power successful stores. The right choice depends on your technical comfort level, budget, and customization needs.', 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=1200', 'E-Commerce', 'Emily Johnson', true, false, 7),

('10 UI/UX Trends Shaping Web Design', 'ui-ux-trends-2024', 'Stay ahead of the curve with these cutting-edge design trends that are transforming user experiences across the web.', '## Design is Evolving

User expectations are higher than ever. Here are the trends defining modern web design.

## 1. Micro-interactions

Small animations that provide feedback and delight users:
- Button hover effects
- Loading animations
- Form validation feedback
- Scroll-triggered animations

## 2. Dark Mode

No longer optional - users expect dark mode options for:
- Reduced eye strain
- Battery savings on OLED screens
- Modern aesthetic appeal

## 3. 3D Elements

Subtle 3D effects add depth:
- Floating cards
- Parallax scrolling
- 3D illustrations
- Interactive product views

## 4. Minimalist Navigation

Less is more:
- Hidden menus
- Gesture-based navigation
- Sticky, compact headers
- Bottom navigation on mobile

## 5. Bold Typography

Typography as a design element:
- Large, impactful headlines
- Variable fonts
- Creative text layouts
- Animated text effects

## Conclusion

Staying current with design trends helps create experiences that feel modern and engaging. But remember: trends should serve your users, not distract them.', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200', 'Design', 'Alex Rivera', true, false, 5),

('How to Optimize Your Website for Core Web Vitals', 'core-web-vitals-optimization', 'Master Google''s Core Web Vitals metrics to improve your search rankings and deliver better user experiences.', '## Understanding Core Web Vitals

Google''s Core Web Vitals are essential metrics that measure user experience. Let''s dive into how to optimize each one.

## LCP - Largest Contentful Paint

Target: Under 2.5 seconds

**Optimization strategies:**
- Optimize and compress images
- Use lazy loading
- Implement CDN
- Minimize render-blocking resources

## FID - First Input Delay

Target: Under 100 milliseconds

**Optimization strategies:**
- Break up long JavaScript tasks
- Use web workers
- Minimize third-party scripts
- Implement code splitting

## CLS - Cumulative Layout Shift

Target: Under 0.1

**Optimization strategies:**
- Set explicit dimensions for images
- Reserve space for ads
- Avoid inserting content above existing content
- Use transform animations

## Tools for Measurement

- Google PageSpeed Insights
- Lighthouse
- Chrome DevTools
- Search Console

## Conclusion

Optimizing Core Web Vitals improves both SEO rankings and user experience. Start with the biggest impact items and iterate from there.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200', 'Web Development', 'David Kim', true, true, 6),

('Building a Successful Shopify Store: A Complete Checklist', 'shopify-store-checklist', 'Everything you need to launch and grow a profitable Shopify store, from setup to scaling.', '## Your Shopify Success Roadmap

Launching a Shopify store involves many moving parts. Use this checklist to ensure nothing falls through the cracks.

## Pre-Launch Checklist

### Store Setup
- [ ] Choose and customize your theme
- [ ] Set up your domain
- [ ] Configure shipping zones and rates
- [ ] Set up payment gateways
- [ ] Create essential pages (About, Contact, FAQ)

### Products
- [ ] Write compelling product descriptions
- [ ] Optimize product images
- [ ] Set up product variants
- [ ] Configure inventory tracking
- [ ] Create collections

### Legal & Policies
- [ ] Privacy policy
- [ ] Terms of service
- [ ] Return policy
- [ ] Cookie consent

## Launch Day

- [ ] Test checkout process
- [ ] Verify email notifications
- [ ] Check mobile responsiveness
- [ ] Set up analytics
- [ ] Announce on social media

## Post-Launch

- [ ] Monitor and respond to orders
- [ ] Collect customer reviews
- [ ] Analyze traffic and sales
- [ ] A/B test key pages
- [ ] Plan marketing campaigns

## Conclusion

A successful Shopify launch requires preparation. Follow this checklist and you''ll be set up for success from day one.', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200', 'E-Commerce', 'Sarah Chen', true, false, 10);