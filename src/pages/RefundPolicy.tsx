import SEOHead from '../components/SEOHead';

export default function RefundPolicy() {
  return (
    <div style={{ padding: "60px 24px", maxWidth: "800px", margin: "0 auto" }}>
      <SEOHead />
      <h1 style={{ color: "var(--text-primary)", marginBottom: "32px" }}>
        Refund Policy
      </h1>

      <div style={{ color: "var(--text-secondary)", lineHeight: "1.8" }}>
        <p style={{ marginBottom: "24px" }}>
          <strong>Last updated:</strong> {new Date().toLocaleDateString()}
        </p>

        <h2 style={{ color: "var(--text-primary)", marginTop: "32px", marginBottom: "16px" }}>
          1. Overview
        </h2>
        <p style={{ marginBottom: "16px" }}>
          At AI Fluens, we strive to deliver valuable career insights and personalized
          upskilling plans. If you are not satisfied with your purchase, you may request
          a refund in accordance with the terms outlined below.
        </p>

        <h2 style={{ color: "var(--text-primary)", marginTop: "32px", marginBottom: "16px" }}>
          2. Eligibility for Refunds
        </h2>
        <p style={{ marginBottom: "16px" }}>
          Refund requests may be initiated within <strong>7 days</strong> of your weekly
          plan creation date. To be eligible for a refund, the request must be submitted
          before the 7-day window expires.
        </p>

        <h2 style={{ color: "var(--text-primary)", marginTop: "32px", marginBottom: "16px" }}>
          3. Non-Refundable Items
        </h2>
        <p style={{ marginBottom: "16px" }}>
          The following are not eligible for a refund:
        </p>
        <ul style={{ marginBottom: "16px", paddingLeft: "24px" }}>
          <li style={{ marginBottom: "8px" }}>Requests submitted after the 7-day refund window has passed.</li>
          <li style={{ marginBottom: "8px" }}>Free assessments or services provided at no cost.</li>
          <li style={{ marginBottom: "8px" }}>Accounts that have violated our Terms of Use.</li>
        </ul>

        <h2 style={{ color: "var(--text-primary)", marginTop: "32px", marginBottom: "16px" }}>
          4. How to Request a Refund
        </h2>
        <p style={{ marginBottom: "16px" }}>
          To initiate a refund request, please contact our support team at{" "}
          <a
            href="mailto:support@aifluens.com"
            style={{ color: "var(--primary)", textDecoration: "none" }}
          >
            support@aifluens.com
          </a>{" "}
          with the following information:
        </p>
        <ul style={{ marginBottom: "16px", paddingLeft: "24px" }}>
          <li style={{ marginBottom: "8px" }}>Your full name and email address associated with your account.</li>
          <li style={{ marginBottom: "8px" }}>The date of your plan purchase.</li>
          <li style={{ marginBottom: "8px" }}>The reason for your refund request.</li>
        </ul>

        <h2 style={{ color: "var(--text-primary)", marginTop: "32px", marginBottom: "16px" }}>
          5. Refund Processing
        </h2>
        <p style={{ marginBottom: "16px" }}>
          Once we receive your refund request, we will review it and notify you of the
          approval or rejection within 5 business days. Approved refunds will be
          processed to the original payment method within 7-10 business days.
        </p>

        <h2 style={{ color: "var(--text-primary)", marginTop: "32px", marginBottom: "16px" }}>
          6. Changes to This Policy
        </h2>
        <p style={{ marginBottom: "16px" }}>
          We reserve the right to update or modify this Refund Policy at any time.
          Any changes will be posted on this page with a revised "Last updated" date.
          Continued use of our services after any changes constitutes acceptance of the
          updated policy.
        </p>

        <h2 style={{ color: "var(--text-primary)", marginTop: "32px", marginBottom: "16px" }}>
          7. Contact Us
        </h2>
        <p style={{ marginBottom: "16px" }}>
          If you have any questions about this Refund Policy, please contact us at{" "}
          <a
            href="mailto:support@aifluens.com"
            style={{ color: "var(--primary)", textDecoration: "none" }}
          >
            support@aifluens.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
