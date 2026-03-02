export const mockArticles = [
  {
    id: 1,
    title: "Advanced Machine Learning Techniques for Climate Prediction",
    authors: ["Dr. John Smith", "Prof. Sarah Johnson", "Dr. Michael Chen"],
    abstract: "This study explores novel machine learning algorithms for predicting climate patterns with unprecedented accuracy. We present a hybrid model combining deep neural networks with traditional statistical methods, achieving 94% accuracy in temperature forecasting. Our approach leverages satellite data and historical records to provide insights into long-term climate trends.",
    keywords: ["Machine Learning", "Climate Science", "Neural Networks", "Weather Prediction"],
    volume: 15,
    issue: 2,
    pages: "45-67",
    year: 2024,
    month: "March",
    doi: "10.1234/jas.2024.15.2.001",
    pdfUrl: "#",
    publishedDate: "2024-03-15",
    category: "Computer Science"
  },
  {
    id: 2,
    title: "Sustainable Agriculture Practices in Sub-Saharan Africa",
    authors: ["Dr. Amina Okafor", "Prof. David Williams"],
    abstract: "An extensive study examining the implementation of sustainable farming methods across rural communities in sub-Saharan Africa. This research documents a 40% increase in crop yields through organic farming practices and improved water management systems. We provide a comprehensive framework for scaling these practices across the region.",
    keywords: ["Agriculture", "Sustainability", "Food Security", "Africa"],
    volume: 15,
    issue: 2,
    pages: "68-89",
    year: 2024,
    month: "March",
    doi: "10.1234/jas.2024.15.2.002",
    pdfUrl: "#",
    publishedDate: "2024-03-15",
    category: "Agriculture"
  },
  {
    id: 3,
    title: "Quantum Computing Applications in Cryptography",
    authors: ["Dr. Robert Zhang", "Dr. Emily Rodriguez", "Prof. James Anderson"],
    abstract: "This paper investigates the implications of quantum computing on modern cryptographic systems. We demonstrate practical attacks on current encryption standards and propose quantum-resistant algorithms. Our findings suggest that organizations should begin transitioning to post-quantum cryptography within the next decade.",
    keywords: ["Quantum Computing", "Cryptography", "Security", "Algorithms"],
    volume: 15,
    issue: 1,
    pages: "12-34",
    year: 2024,
    month: "January",
    doi: "10.1234/jas.2024.15.1.001",
    pdfUrl: "#",
    publishedDate: "2024-01-20",
    category: "Computer Science"
  },
  {
    id: 4,
    title: "Biodiversity Conservation in Urban Ecosystems",
    authors: ["Dr. Patricia Green", "Dr. Mohamed Hassan"],
    abstract: "An analysis of biodiversity patterns in major urban centers reveals surprising resilience of native species when proper conservation measures are implemented. This study examines five cities across three continents, identifying key factors that support urban wildlife populations including green corridors, native plant restoration, and pollution control.",
    keywords: ["Biodiversity", "Urban Ecology", "Conservation", "Environmental Science"],
    volume: 15,
    issue: 1,
    pages: "35-56",
    year: 2024,
    month: "January",
    doi: "10.1234/jas.2024.15.1.002",
    pdfUrl: "#",
    publishedDate: "2024-01-20",
    category: "Environmental Science"
  },
  {
    id: 5,
    title: "Novel Drug Delivery Systems for Cancer Treatment",
    authors: ["Dr. Lisa Thompson", "Prof. Ahmed Ibrahim", "Dr. Catherine Lee"],
    abstract: "We present a breakthrough in targeted drug delivery using nanoparticle technology. Our system achieves 85% specificity in delivering chemotherapy agents directly to tumor cells while minimizing damage to healthy tissue. Clinical trials show promising results with significantly reduced side effects compared to traditional chemotherapy.",
    keywords: ["Nanotechnology", "Oncology", "Drug Delivery", "Biotechnology"],
    volume: 14,
    issue: 4,
    pages: "123-145",
    year: 2023,
    month: "December",
    doi: "10.1234/jas.2023.14.4.003",
    pdfUrl: "#",
    publishedDate: "2023-12-10",
    category: "Medical Science"
  },
  {
    id: 6,
    title: "Renewable Energy Integration in Power Grids",
    authors: ["Dr. Carlos Martinez", "Dr. Yuki Tanaka"],
    abstract: "This research addresses the technical challenges of integrating high percentages of renewable energy sources into existing power grids. We propose an adaptive load balancing algorithm that optimizes energy distribution from solar and wind sources, reducing reliance on fossil fuels by up to 60% in tested scenarios.",
    keywords: ["Renewable Energy", "Power Systems", "Smart Grid", "Sustainability"],
    volume: 14,
    issue: 4,
    pages: "146-168",
    year: 2023,
    month: "December",
    doi: "10.1234/jas.2023.14.4.004",
    pdfUrl: "#",
    publishedDate: "2023-12-10",
    category: "Engineering"
  },
  {
    id: 7,
    title: "Neural Mechanisms of Memory Consolidation During Sleep",
    authors: ["Dr. Jennifer Park", "Prof. Alexander Petrov", "Dr. Maria Santos"],
    abstract: "Using advanced neuroimaging techniques, we reveal the precise mechanisms by which the brain consolidates memories during different sleep stages. Our findings show that targeted acoustic stimulation during slow-wave sleep can enhance memory retention by 30%, opening new possibilities for learning enhancement and therapy for memory disorders.",
    keywords: ["Neuroscience", "Memory", "Sleep", "Cognitive Science"],
    volume: 14,
    issue: 3,
    pages: "78-102",
    year: 2023,
    month: "September",
    doi: "10.1234/jas.2023.14.3.002",
    pdfUrl: "#",
    publishedDate: "2023-09-15",
    category: "Neuroscience"
  },
  {
    id: 8,
    title: "Microplastic Pollution in Marine Environments",
    authors: ["Dr. Rachel Cohen", "Dr. Thomas Wright"],
    abstract: "A comprehensive survey of microplastic contamination across major ocean basins reveals alarming concentrations affecting marine food chains. We document microplastic presence in 90% of sampled fish species and propose policy recommendations for reducing plastic waste. Our research emphasizes the urgent need for international cooperation in addressing ocean pollution.",
    keywords: ["Marine Biology", "Pollution", "Microplastics", "Environmental Science"],
    volume: 14,
    issue: 3,
    pages: "103-125",
    year: 2023,
    month: "September",
    doi: "10.1234/jas.2023.14.3.003",
    pdfUrl: "#",
    publishedDate: "2023-09-15",
    category: "Environmental Science"
  }
];

export const getArticleById = (id) => {
  return mockArticles.find(article => article.id === parseInt(id));
};

export const getLatestArticles = (count = 4) => {
  return mockArticles.slice(0, count);
};

export const getArticlesByCategory = (category) => {
  return mockArticles.filter(article => article.category === category);
};

export const categories = [
  "All Categories",
  "Computer Science",
  "Agriculture",
  "Environmental Science",
  "Medical Science",
  "Engineering",
  "Neuroscience"
];
