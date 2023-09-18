import React from "react"

import Page from "./Page"

export default function TermsPage() {
  return (
    <Page title="Terms and Conditions">
      <header className="p-4">
        <h1 className="">Terms and Conditions</h1>
      </header>
      <main className="p-4">
        <section className="mb-4">
          <h2 className="h2">1. Introduction</h2>
          <p className="mt-2">
            Welcome to Task Management System&rsquo;s <strong>Terms and Conditions</strong>. These terms and conditions (&quot;Agreement&quot;) are an agreement between Task Management System (&quot;Company&quot;) and you (&quot;User&quot;). This Agreement sets forth the general terms and conditions of your use of the Task Management System website and any of its products or services (collectively, &quot;Website&quot; or &quot;Services&quot;).
          </p>
        </section>
        <section className="mb-4">
          <h2 className="h2">2. User Registration</h2>
          <p className="mt-2">You must be at least 18 years of age to use this Website. By using this Website and by agreeing to this Agreement, you warrant and represent that you are at least 18 years of age.</p>
        </section>
        <section className="mb-4">
          <h3 className="h3">2.1 Account</h3>
          <p className="mt-2">When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
        </section>
        <section className="mb-4">
          <h4 className="h4">2.1.1 Account Security</h4>
          <p className="mt-2">You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.</p>
        </section>
      </main>
      <footer className="p-4 text-muted">
        <p className="lead text-center">By using this Website, you signify your acceptance of these terms and conditions. If you do not agree to these terms and conditions, please do not use our Website. Your continued use of the Website following the posting of changes to these terms will be deemed your acceptance of those changes.</p>
      </footer>
    </Page>
  )
}
