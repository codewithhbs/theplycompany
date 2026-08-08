require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const Admin = require("./models/Admin");
const Blog = require("./models/Blog");
const Gallery = require("./models/Gallery");
const Faq = require("./models/Faq");
const Meta = require("./models/Meta");

const blogs = [
  {
    title: "Choosing the Right Plywood for Your Home",
    slug: "choosing-the-right-plywood-for-your-home",
    category: "Buying Guide",
    excerpt:
      "MR, BWP, marine — the grading labels look similar but behave very differently once installed. Here's how to pick the correct one for each room without overspending on capacity you don't need.",
    content:
      "<p>MR, BWP, marine — the grading labels look similar but behave very differently once installed. Here's how to pick the correct one for each room without overspending on capacity you don't need.</p><p>For dry interior furniture like wardrobes and shelving, MR (moisture-resistant) grade plywood is usually sufficient. For kitchens, bathrooms and any area with regular water exposure, BWP (boil-water-proof) grade is the safer long-term choice.</p>",
    image: "/assets/img/Commercial-Plywood-2.jpg",
    readTime: "6 min read",
    featured: true,
    published: true,
    date: new Date("2026-06-18"),
  },
  {
    title: "Best Laminates for Modern Indian Homes",
    slug: "best-laminates-for-modern-indian-homes",
    category: "Interiors",
    excerpt: "Matte vs high-gloss vs textured — which finish suits your lighting and lifestyle.",
    content:
      "<p>Matte vs high-gloss vs textured — which finish suits your lighting and lifestyle.</p><p>High-gloss laminates work well in well-lit spaces and make small rooms feel bigger, but show fingerprints easily. Matte and textured finishes are more forgiving for daily-use furniture.</p>",
    image: "/assets/img/architects-designers.png",
    readTime: "4 min read",
    featured: false,
    published: true,
    date: new Date("2026-06-10"),
  },
  {
    title: "The Complete Waterproof Plywood Guide",
    slug: "the-complete-waterproof-plywood-guide",
    category: "Technical",
    excerpt: "What BWP actually certifies, and where MR grade is genuinely enough.",
    content:
      "<p>What BWP actually certifies, and where MR grade is genuinely enough.</p><p>BWP plywood is bonded with phenolic resin adhesive and tested for boiling water resistance, making it suitable for continuous moisture exposure — kitchens, bathrooms, and exteriors.</p>",
    image: "/assets/img/water-proof-ply.jpg",
    readTime: "5 min read",
    featured: false,
    published: true,
    date: new Date("2026-06-02"),
  },
  {
    title: "Modular Kitchen Materials Explained",
    slug: "modular-kitchen-materials-explained",
    category: "Kitchens",
    excerpt: "Carcass, shutter and countertop material choices that survive daily use.",
    content:
      "<p>Carcass, shutter and countertop material choices that survive daily use.</p><p>BWP plywood is the standard for kitchen carcasses due to constant moisture exposure. Shutters can use laminate, acrylic or membrane finishes depending on budget and desired look.</p>",
    image: "/assets/img/moduler-kitchen.jpg",
    readTime: "5 min read",
    featured: false,
    published: true,
    date: new Date("2026-05-27"),
  },
];

const gallery = [
  { title: "Storefront — Azadpur Yard", image: "/assets/img/Block-board.jpg", category: "store", order: 1 },
  { title: "BWP Plywood Stock", image: "/assets/img/BWP-Plywood-Stock.jpg", category: "products", order: 2 },
  { title: "Modular Kitchen Project", image: "/assets/img/architects-designers.png", category: "projects", order: 3 },
  { title: "Natural Veneer Grain", image: "/assets/img/BWP-grade-1.jpg", category: "materials", order: 4 },
  { title: "Client Wardrobe, Sikandra", image: "/assets/img/custom.jpg", category: "customer", order: 5 },
  { title: "Laminate Sample Wall", image: "/assets/img/Adhesives-Hardware.png", category: "store", order: 6 },
  { title: "MDF Ready for CNC", image: "/assets/img/MDF_Boards_blog.jpg", category: "products", order: 7 },
  { title: "Office Fit-Out", image: "/assets/img/water-proof-ply.jpg", category: "projects", order: 8 },
  { title: "Plywood Cross-Section", image: "/assets/img/MDF_Boards_blog.jpg", category: "materials", order: 9 },
  { title: "TV Unit, Dayal Bagh", image: "/assets/img/Commercial-Plywood-2.jpg", category: "customer", order: 10 },
  { title: "Flush Doors, Ready to Ship", image: "/assets/img/Block-board.jpg", category: "products", order: 11 },
  { title: "Loading Bay", image: "/assets/img/flush-door.png", category: "store", order: 12 },
];

const faqs = [
  {
    question: "What's the difference between MR and BWP plywood?",
    answer:
      "MR (moisture-resistant) plywood tolerates occasional dampness and suits general interior furniture. BWP (boil-water-proof) plywood is bonded with phenolic resin and rated for continuous water exposure — the right choice for kitchens, bathrooms and exteriors.",
    order: 1,
  },
  {
    question: "Do you deliver to construction sites?",
    answer:
      "Yes. We deliver across Delhi and the surrounding NCR region, and can schedule staggered deliveries to match your project phases.",
    order: 2,
  },
  {
    question: "Can I get custom sizes cut for my project?",
    answer:
      "Absolutely. Our in-house panel saw cuts plywood, MDF and laminates to your exact dimensions at no extra charge on bulk orders.",
    order: 3,
  },
  {
    question: "Do you offer bulk pricing for contractors?",
    answer:
      "Yes, we maintain tiered pricing for contractors, architects and dealers. Share your monthly volume with our sales team for a custom rate card.",
    order: 4,
  },
  {
    question: "How do I know which laminate finish suits my space?",
    answer:
      "Visit our showroom sample wall or request swatches through our contact form — our design consultants can also recommend finishes based on your lighting and usage.",
    order: 5,
  },
];

const metas = [
  { page: "home", title: "Pradeep Timber Enterprises | Plywood & Timber Suppliers, Delhi", description: "Plywood, laminate, MDF and timber supplier in Delhi. Bulk pricing for contractors and architects, fast delivery across NCR.", keywords: "plywood delhi, timber supplier, mdf, laminate, bwp plywood" },
  { page: "about", title: "About Us | Pradeep Timber Enterprises", description: "Learn about Pradeep Timber Enterprises, a trusted Delhi-based plywood and timber supplier.", keywords: "about pradeep timber, plywood company delhi" },
  { page: "blog", title: "Blog | Pradeep Timber Enterprises", description: "Buying guides, material comparisons and interior tips from Pradeep Timber Enterprises.", keywords: "plywood guide, laminate guide, timber blog" },
  { page: "gallery", title: "Gallery | Pradeep Timber Enterprises", description: "Browse our store, products, completed projects and materials gallery.", keywords: "plywood gallery, timber projects, interior gallery" },
  { page: "contact", title: "Contact Us | Pradeep Timber Enterprises", description: "Get in touch for plywood, laminate, MDF and timber quotes in Delhi.", keywords: "contact plywood supplier, timber quote delhi" },
];

async function seed() {
  await connectDB();

  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const existingAdmin = await Admin.findOne({ username: adminUsername });
  if (!existingAdmin) {
    const hash = await bcrypt.hash(adminPassword, 10);
    await Admin.create({ username: adminUsername, password: hash });
    console.log(`Admin created -> username: ${adminUsername} / password: ${adminPassword}`);
  } else {
    console.log("Admin already exists, skipping.");
  }

  const blogCount = await Blog.countDocuments();
  if (blogCount === 0) {
    await Blog.insertMany(blogs);
    console.log(`Seeded ${blogs.length} blogs`);
  } else {
    console.log("Blogs already exist, skipping.");
  }

  const galleryCount = await Gallery.countDocuments();
  if (galleryCount === 0) {
    await Gallery.insertMany(gallery);
    console.log(`Seeded ${gallery.length} gallery items`);
  } else {
    console.log("Gallery already exists, skipping.");
  }

  const faqCount = await Faq.countDocuments();
  if (faqCount === 0) {
    await Faq.insertMany(faqs);
    console.log(`Seeded ${faqs.length} FAQs`);
  } else {
    console.log("FAQs already exist, skipping.");
  }

  const metaCount = await Meta.countDocuments();
  if (metaCount === 0) {
    await Meta.insertMany(metas);
    console.log(`Seeded ${metas.length} page meta entries`);
  } else {
    console.log("Meta already exists, skipping.");
  }

  console.log("Seeding done.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
