export default function PrivacyPolicy() {
  return (
    <main style={{ padding: "60px 24px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ color: "var(--text-primary)", marginBottom: "32px" }}>
        Privacy Policy
      </h1>

      <div style={{ color: "var(--text-secondary)", lineHeight: "1.8" }}>
        <p style={{ marginBottom: "24px" }}>
          <strong>Last updated:</strong> {new Date().toLocaleDateString()}
        </p>

        <h2 style={{ color: "var(--text-primary)", marginTop: "32px", marginBottom: "16px" }}>
          1. Information We Collect
        </h2>
        <p style={{ marginBottom: "16px" }}>
          We collect information you provide directly to us, such as your name, email address,
          job role, and years of experience when you use our AI skill gap analysis service.
        </p>

        <h2 style={{ color: "var(--text-primary)", marginTop: "32px", marginBottom: "16px" }}>
          2. How We Use Your Information
        </h2>
        <p style={{ marginBottom: "16px" }}>
          We use the information we collect to provide, maintain, and improve our services,
          including generating personalized AI skill assessments and upskilling recommendations.
        </p>

        <h2 style={{ color: "var(--text-primary)", marginTop: "32px", marginBottom: "16px" }}>
          3. Information Sharing
        </h2>
        <p style={{ marginBottom: "16px" }}>
          We do not sell, trade, or otherwise transfer your personal information to third parties
          without your consent, except as required by law or to protect our rights.
        </p>

        <h2 style={{ color: "var(--text-primary)", marginTop: "32px", marginBottom: "16px" }}>
          4. Data Security
        </h2>
        <p style={{ marginBottom: "16px" }}>
          We implement appropriate security measures to protect your personal information
          against unauthorized access, alteration, disclosure, or destruction.
        </p>

        <h2 style={{ color: "var(--text-primary)", marginTop: "32px", marginBottom: "16px" }}>
          5. Your Rights
        </h2>
        <p style={{ marginBottom: "16px" }}>
          You have the right to access, update, or delete your personal information at any time.
          Contact us if you wish to exercise these rights.
        </p>

        <h2 style={{ color: "var(--text-primary)", marginTop: "32px", marginBottom: "16px" }}>
          6. Contact Us
        </h2>
        <p style={{ marginBottom: "16px" }}>
          If you have any questions about this Privacy Policy, please contact us at
          privacy@aifluens.com.
        </p>
      </div>
    </main>
  );
}
