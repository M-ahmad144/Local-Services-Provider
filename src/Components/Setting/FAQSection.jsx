import React, { useState } from "react";

const FAQ = () => {
  // State to manage the expanded/collapsed state of each question
  const [activeIndex, setActiveIndex] = useState(null);

  // List of FAQ questions and answers for a freelance local skill hiring platform
  const faqs = [
    {
      question: "What is this platform about?",
      answer:
        "This platform connects local freelancers with individuals or businesses looking to hire for specific skills, such as writing, design, web development, and more.",
    },
    {
      question: "How can I hire a freelancer?",
      answer:
        "To hire a freelancer, simply sign up, browse through available freelancers in your desired skill category, and send them a project request. You can review their profiles, past work, and rates before making your decision.",
    },
    {
      question: "How do I become a freelancer?",
      answer:
        "To become a freelancer, create a profile showcasing your skills, experience, and portfolio. Once your profile is approved, you can start accepting job requests from users in need of your services.",
    },
    {
      question: "How do payments work?",
      answer:
        "Payments are made securely through our platform. Freelancers and clients agree on the project cost upfront, and payments are processed when milestones are completed or the project is finished. We ensure that both parties are protected through our secure payment gateway.",
    },
    {
      question: "Can I cancel a job once it's started?",
      answer:
        "Job cancellations can be discussed with the freelancer, but please note that our platform has a cancellation policy to protect both clients and freelancers. Cancellations after work has started may result in a partial refund or a fee depending on the terms agreed upon.",
    },
    {
      question: "How can I leave feedback for a freelancer?",
      answer:
        "After completing a project, you can leave a review and rate the freelancer on their work quality, communication, and professionalism. This helps other clients make informed decisions and helps freelancers improve their services.",
    },
    {
      question: "Are the freelancers verified?",
      answer:
        "We require freelancers to complete a verification process where they submit proof of their skills and past work. While we encourage transparency, it's always recommended to check reviews and ratings from previous clients.",
    },
    {
      question: "What happens if there’s a dispute with a freelancer?",
      answer:
        "In case of disputes, our platform provides a mediation service where both clients and freelancers can resolve issues. If needed, we may step in to help find a fair solution based on the terms outlined in the contract.",
    },
  ];

  // Function to toggle the active state of a question
  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="mx-auto p-6 max-w-4xl">
      <h2 className="mb-6 font-extrabold text-4xl text-center text-gray-900">
        Frequently Asked Questions
      </h2>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 shadow-lg p-6 rounded-xl transform transition-transform hover:scale-105"
          >
            <div
              className="flex justify-between items-center text-white cursor-pointer"
              onClick={() => toggleAnswer(index)}
            >
              <span className="font-semibold text-xl">{faq.question}</span>
              <span className="font-bold text-xl">
                {activeIndex === index ? "−" : "+"}
              </span>
            </div>
            {activeIndex === index && (
              <div className="opacity-80 mt-4 text-white transition-opacity duration-300 ease-in-out">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
