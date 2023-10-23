import React from "react"

import Page from "./Page"

export default function AboutPage() {
  return (
    <Page title="About Us">
      <header className="bg-blue-500 p-4">
        <h2 className="text-3xl font-bold">Task Management System</h2>
      </header>
      <main className="p-4">
        <section className="mb-4">
          <h3>Our Mission</h3>
          <p className="mt-2">
            At Task Management System, our mission is to help individuals, teams, and organizations achieve their goals by providing a <span className="font-semibold">powerful and intuitive task management platform</span>. We believe that effective task management is the cornerstone of success in both personal and professional endeavors.
          </p>
        </section>
        <section className="mb-4">
          <h3>What Sets Us Apart</h3>
          <ul className="mt-2">
            <li className="mb-2">
              <span className="font-semibold">Efficiency:</span> We are committed to streamlining your workflow and making task management as efficient as possible. Our Kanban board system allows you to easily visualize your tasks and move them through different stages, from &lsquo;Open&lsquo; to &lsquo;Done.&lsquo;
            </li>
            <li className="mb-2">
              <span className="font-semibold">Collaboration:</span> Collaboration is at the heart of what we do. Project leads, managers, and team members can work together seamlessly to achieve project success.
            </li>
            <li className="mb-2">
              <span className="font-semibold">User-Friendly:</span> We prioritize user experience, ensuring that our platform is easy to navigate and accessible to users of all levels of tech-savviness.
            </li>
          </ul>
        </section>
        <section className="mb-4">
          <h3>Why Choose Task Management System</h3>
          <ul className="mt-2">
            <li className="mb-2">
              <span className="font-semibold">Powerful Features:</span> Our system offers a wide range of features to meet the diverse needs of our users. From task assignment to progress tracking, we&lsquo;ve got you covered.
            </li>
            <li className="mb-2">
              <span className="font-semibold">Customization:</span> Tailor our platform to fit your unique workflow and preferences. You can create your own task categories, tags, and more.
            </li>
            <li className="mb-2">
              <span className="font-semibold">Support:</span> Our dedicated support team is here to assist you every step of the way. Have a question or need help? We&lsquo;re just a message away.
            </li>
          </ul>
        </section>
      </main>
      <footer className="p-4 text-muted">
        <p className="lead text-center">Thank you for choosing Task Management System as your trusted task management partner. We look forward to helping you achieve your goals and streamline your tasks.</p>
      </footer>
    </Page>
  )
}
