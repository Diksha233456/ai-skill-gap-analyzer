require("dotenv").config();
const mongoose = require("mongoose");
const Domain = require("./models/Domain");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected for Seeding");

    await Domain.deleteMany();

    await Domain.insertMany([
      {
        name: "Frontend Development",
        description: "Build user interfaces and interactive web apps.",
        skills: ["HTML", "CSS", "JavaScript", "React"],
        difficulty: "Medium",
        averageSalary: "₹6-12 LPA",
        demandLevel: 85,
        growthRate: "15% annually"
      },
      {
        name: "Backend Development",
        description: "Develop APIs, manage databases, and server-side logic.",
        skills: ["Node.js", "Express", "MongoDB"],
        difficulty: "Medium",
        averageSalary: "₹7-14 LPA",
        demandLevel: 88,
        growthRate: "18% annually"
      },
      {
        name: "AI / Machine Learning",
        description: "Build intelligent systems and predictive models.",
        skills: ["Python", "TensorFlow", "Deep Learning"],
        difficulty: "High",
        averageSalary: "₹10-25 LPA",
        demandLevel: 95,
        growthRate: "30% annually"
      },
      {
        name: "Cybersecurity",
        description: "Protect systems and networks from cyber attacks.",
        skills: ["Networking", "Ethical Hacking", "Cryptography"],
        difficulty: "High",
        averageSalary: "₹8-20 LPA",
        demandLevel: 90,
        growthRate: "25% annually"
      }
    ]);

    console.log("Domains Seeded Successfully 🚀");
    process.exit();
  })
  .catch(err => console.error(err));