export default function TermsOfUse() {
  return (
    <main style={{ padding: "60px 24px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ color: "var(--text-primary)", marginBottom: "32px" }}>
        Terms of Use
      </h1>

      <div style={{ color: "var(--text-secondary)", lineHeight: "1.8" }}>
        <p style={{ marginBottom: "24px" }}>
          <strong>Last updated:</strong> {new Date().toLocaleDateString()}
        </p>

        <h2 style={{ color: "var(--text-primary)", marginTop: "32px", marginBottom: "16px" }}>
          1. Acceptance of Terms
        </h2>
        <p style={{ marginBottom: "16px" }}>
          By accessing and using AI Fluens, you agree to be bound by these Terms of Use.
          If you do not agree to these terms, please do not use our service.
        </p>

        <h2 style={{ color: "var(--text-primary)", marginTop: "32px", marginBottom: "16px" }}>
          2. Description of Service
        </h2>
        <p style={{ marginBottom: "16px" }}>
          AI Fluens provides AI skill gap analysis and personalized upskilling recommendations
          to help professionals identify and develop their AI competencies.
        </p>

        <h2 style={{ color: "var(--text-primary)", marginTop: "32px", marginBottom: "16px" }}>
          3. User Responsibilities
        </h2>
        <p style={{ marginBottom: "16px" }}>
          You are responsible for maintaining the confidentiality of your account information
          and for all activities that occur under your account. You agree to provide accurate
          and complete information when using our services.
        </p>

        <h2 style={{ color: "var(--text-primary)", marginTop: "32px", marginBottom: "16px" }}>
          4. Intellectual Property
        </h2>
        <p style={{ marginBottom: "16px" }}>
          All content, features, and functionality of AI Fluens are owned by us and are
          protected by international copyright, trademark, and other intellectual property laws.
        </p>

        <h2 style={{ color: "var(--text-primary)", marginTop: "32px", marginBottom: "16px" }}>
          5. Limitation of Liability
        </h2>
        <p style={{ marginBottom: "16px" }}>
          AI Fluens is provided "as is" without warranties of any kind. We shall not be liable
          for any indirect, incidental, special, or consequential damages arising from your use
          of the service.
        </p>

        <h2 style={{ color: "var(--text-primary)", marginTop: "32px", marginBottom: "16px" }}>
          6. Changes to Terms
        </h2>
        <p style={{ marginBottom: "16px" }}>
          We reserve the right to modify these terms at any time. Continued use of the service
          after changes constitutes acceptance of the new terms.
        </p>

        <h2 style={{ color: "var(--text-primary)", marginTop: "32px", marginBottom: "16px" }}>
          7. Contact Us
        </h2>
        <p style={{ marginBottom: "16px" }}>
          If you have any questions about these Terms of Use, please contact us at
          legal@aifluens.com.
        </p>
      </div>
    </main>
  );
}
