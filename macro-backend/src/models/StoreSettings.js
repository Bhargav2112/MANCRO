import mongoose from 'mongoose';

const storeSettingsSchema = new mongoose.Schema({
  store_name: {
    type: String,
    required: true,
    default: 'MANCRO'
  },
  topbar_text: {
    type: String,
    trim: true,
    default: 'Get a Flat 10% Off on All Watches - Limited Time Only'
  },
  store_email: {
    type: String,
    trim: true,
    default: ''
  },
  store_phone: {
    type: String,
    trim: true,
    default: ''
  },
  whatsapp_number: {
    type: String,
    trim: true,
    default: ''
  },
  store_address: {
    type: String,
    trim: true,
    default: ''
  },
  instagram_url: {
    type: String,
    trim: true,
    default: ''
  },
  facebook_url: {
    type: String,
    trim: true,
    default: ''
  },
  twitter_url: {
    type: String,
    trim: true,
    default: ''
  },
  youtube_url: {
    type: String,
    trim: true,
    default: ''
  },
  logo_url: {
    type: String,
    trim: true,
    default: ''
  },
  banner_url: {
    type: String,
    trim: true,
    default: ''
  },
  for_him_image_url: {
    type: String,
    trim: true,
    default: ''
  },
  for_her_image_url: {
    type: String,
    trim: true,
    default: ''
  },
  about_text: {
    type: String,
    trim: true,
    default: ''
  },
  about_title: {
    type: String,
    trim: true,
    default: 'Creating watches that blend innovation'
  },
  about_description: {
    type: String,
    trim: true,
    default: 'We are committed to creating watches that seamlessly blend modern innovation with timeless craftsmanship. By combining advanced technology, premium materials, and thoughtful design, each timepiece is built to deliver precision, durability, and a refined aesthetic.'
  },
  counter1_val: {
    type: String,
    trim: true,
    default: '150+'
  },
  counter1_title: {
    type: String,
    trim: true,
    default: 'Limited Edition Releases'
  },
  counter1_desc: {
    type: String,
    trim: true,
    default: 'Our limited edition releases are crafted in small quantities to ensure uniqueness.'
  },
  counter2_val: {
    type: String,
    trim: true,
    default: '500+'
  },
  counter2_title: {
    type: String,
    trim: true,
    default: 'Premium Watch Designs'
  },
  counter2_desc: {
    type: String,
    trim: true,
    default: 'Our premium watch designs are crafted to deliver a perfect balance of elegance.'
  },
  counter3_val: {
    type: String,
    trim: true,
    default: '4.9/5'
  },
  counter3_title: {
    type: String,
    trim: true,
    default: 'Average Customer Score'
  },
  counter3_desc: {
    type: String,
    trim: true,
    default: 'Our high average customer rating reflects the trust and satisfaction of our clients.'
  },
  for_him_title: {
    type: String,
    trim: true,
    default: 'For Him'
  },
  for_him_desc: {
    type: String,
    trim: true,
    default: 'Discover Our New Watch Collection and Elevate Your Everyday Look.'
  },
  for_him_link: {
    type: String,
    trim: true,
    default: '/collection?category=Sport'
  },
  for_her_title: {
    type: String,
    trim: true,
    default: 'For Her'
  },
  for_her_desc: {
    type: String,
    trim: true,
    default: 'Discover Our New Watch Collection and Elevate Your Everyday Look.'
  },
  for_her_link: {
    type: String,
    trim: true,
    default: '/collection?category=Dress'
  },
  col1_title: {
    type: String,
    trim: true,
    default: 'Sports Watches'
  },
  col1_tag: {
    type: String,
    trim: true,
    default: 'Sport'
  },
  col1_image: {
    type: String,
    trim: true,
    default: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=600'
  },
  col1_desc: {
    type: String,
    trim: true,
    default: 'Discover Our New Watch Collection and Elevate Your Everyday Look.'
  },
  col2_title: {
    type: String,
    trim: true,
    default: 'Luxury Watches'
  },
  col2_tag: {
    type: String,
    trim: true,
    default: 'Heritage'
  },
  col2_image: {
    type: String,
    trim: true,
    default: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=600'
  },
  col2_desc: {
    type: String,
    trim: true,
    default: 'Discover Our New Watch Collection and Elevate Your Everyday Look.'
  },
  col3_title: {
    type: String,
    trim: true,
    default: 'Chronograph Watches'
  },
  col3_tag: {
    type: String,
    trim: true,
    default: 'Skeleton'
  },
  col3_image: {
    type: String,
    trim: true,
    default: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=600'
  },
  col3_desc: {
    type: String,
    trim: true,
    default: 'Discover Our New Watch Collection and Elevate Your Everyday Look.'
  },
  intro_video_url: {
    type: String,
    trim: true,
    default: 'https://demo.awaikenthemes.com/assets/videos/lemora-intro-video.mp4'
  },
  intro_video_title: {
    type: String,
    trim: true,
    default: 'witness the sanctuary of mechanical devotion'
  },
  intro_video_subtitle: {
    type: String,
    trim: true,
    default: 'A Legacy of Precision'
  },
  why_choose_image: {
    type: String,
    trim: true,
    default: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800'
  },
  why_choose_title: {
    type: String,
    trim: true,
    default: 'Designed for quality built for everyday confidence'
  },
  why_acc1_title: {
    type: String,
    trim: true,
    default: 'High-Quality Materials'
  },
  why_acc1_text: {
    type: String,
    trim: true,
    default: 'We use premium materials like scratchproof sapphire crystals, surgical-grade stainless steel, and hand-stitched alligator leather straps.'
  },
  why_acc2_title: {
    type: String,
    trim: true,
    default: 'Precision Chronometers'
  },
  why_acc2_text: {
    type: String,
    trim: true,
    default: 'Our timepieces are powered by highly precise automatic and hand-wound movements adjusted for ultimate accuracy.'
  },
  why_acc3_title: {
    type: String,
    trim: true,
    default: '2-Year International Warranty'
  },
  why_acc3_text: {
    type: String,
    trim: true,
    default: 'Every reference acquired from the vault is covered under a 2-year warranty and backed by our master watchmaking services.'
  },
  why_acc4_title: {
    type: String,
    trim: true,
    default: 'Bespoke Atelier Consultation'
  },
  why_acc4_text: {
    type: String,
    trim: true,
    default: 'Direct access to horology specialists to assist you with bespoke commissions and secure delivery logistics.'
  },
  social_video1_url: {
    type: String,
    trim: true,
    default: 'https://demo.awaikenthemes.com/assets/videos/lemora-latest-update-video-1.mp4'
  },
  social_video2_url: {
    type: String,
    trim: true,
    default: 'https://demo.awaikenthemes.com/assets/videos/lemora-latest-update-video-2.mp4'
  },
  social_video3_url: {
    type: String,
    trim: true,
    default: 'https://demo.awaikenthemes.com/assets/videos/lemora-latest-update-video-3.mp4'
  },
  social_video4_url: {
    type: String,
    trim: true,
    default: 'https://demo.awaikenthemes.com/assets/videos/lemora-latest-update-video-4.mp4'
  },
  testimonial1_author: {
    type: String,
    trim: true,
    default: 'Darlene Robertson'
  },
  testimonial1_review: {
    type: String,
    trim: true,
    default: '“Absolutely premium watches! The level of hand-finishing, custom obsidional dials, and weight on the wrist exceeded all my expectations. Exceptional service!”'
  },
  testimonial2_author: {
    type: String,
    trim: true,
    default: 'Dianne Russell'
  },
  testimonial2_review: {
    type: String,
    trim: true,
    default: '“I love how elegant and minimalist the collection is. Standard micro-rotor calibers are thin, clean, and fit under a cuff perfectly. Customer support was incredibly responsive.”'
  }
}, {
  timestamps: true
});

const StoreSettings = mongoose.model('StoreSettings', storeSettingsSchema);
export default StoreSettings;
